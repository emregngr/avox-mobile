const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

const serviceAccount = require('./firebase-adminsdk.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const COLLECTIONS = {
  EN_AIRLINES: 'enAirlines',
  TR_AIRLINES: 'trAirlines',
  EN_AIRPORTS: 'enAirports',
  TR_AIRPORTS: 'trAirports',
  EN_HOME: 'enHome',
  TR_HOME: 'trHome',
}

async function uploadCollection(filePath, collectionName) {
  try {
    console.log(`Reading ${filePath} for [${collectionName}]...`)
    const fileContent = fs.readFileSync(path.join(__dirname, filePath), 'utf8')
    const dataArray = JSON.parse(fileContent)

    if (!Array.isArray(dataArray)) {
      console.error(
        `Error: ${filePath} does not contain an array. Use uploadSingleDocument instead.`,
      )
      return false
    }

    console.log(`Uploading ${dataArray.length} documents to [${collectionName}]...`)

    const batchArray = []
    let currentBatch = db.batch()
    let operationCount = 0

    for (let i = 0; i < dataArray.length; i++) {
      const item = dataArray[i]
      if (!item.id) {
        console.warn(`Skipped item without ID in [${collectionName}]:`, item)
        continue
      }
      const docRef = db.collection(collectionName).doc(item.id.toString())
      currentBatch.set(docRef, item)
      operationCount++

      if (operationCount === 499) {
        batchArray.push(currentBatch)
        currentBatch = db.batch()
        operationCount = 0
      }
    }

    if (operationCount > 0) {
      batchArray.push(currentBatch)
    }

    for (let i = 0; i < batchArray.length; i++) {
      await batchArray[i].commit()
      console.log(`Batch ${i + 1}/${batchArray.length} uploaded for [${collectionName}].`)
    }

    console.log(`✅ Upload to [${collectionName}] completed successfully!`)
    return true
  } catch (error) {
    console.error(`❌ Upload failed for [${collectionName}]:`, error)
    return false
  }
}

async function uploadSingleDocument(filePath, collectionName, documentId) {
  try {
    console.log(`Reading ${filePath} for [${collectionName}]...`)
    const fileContent = fs.readFileSync(path.join(__dirname, filePath), 'utf8')
    const dataObject = JSON.parse(fileContent)

    if (Array.isArray(dataObject)) {
      console.error(`Error: ${filePath} contains an array. Use uploadCollection instead.`)
      return false
    }

    console.log(`Uploading document '${documentId}' to [${collectionName}]...`)
    const docRef = db.collection(collectionName).doc(documentId)
    await docRef.set(dataObject)

    console.log(`✅ Document '${documentId}' uploaded successfully to [${collectionName}]!`)
    return true
  } catch (error) {
    console.error(`❌ Upload failed for [${collectionName} -> ${documentId}]:`, error)
    return false
  }
}

async function uploadAllCollections() {
  try {
    console.log('Starting bulk upload of all data...')

    await uploadCollection('./data/enAirlines.json', COLLECTIONS.EN_AIRLINES)
    await uploadCollection('./data/trAirlines.json', COLLECTIONS.TR_AIRLINES)
    await uploadCollection('./data/enAirports.json', COLLECTIONS.EN_AIRPORTS)
    await uploadCollection('./data/trAirports.json', COLLECTIONS.TR_AIRPORTS)

    await uploadSingleDocument('./data/enHome.json', COLLECTIONS.EN_HOME, 'homeData')
    await uploadSingleDocument('./data/trHome.json', COLLECTIONS.TR_HOME, 'homeData')

    console.log('\n🚀 All data uploaded successfully!')
  } catch (error) {
    console.error('❌ General error occurred during bulk upload:', error)
  }
}

uploadAllCollections()
