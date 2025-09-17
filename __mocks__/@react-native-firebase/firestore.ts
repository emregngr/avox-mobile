const mockedFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ exists: true, id: 'mocked-doc-id', data: () => ({}) })),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve({ id: 'new-doc-id' })),
    where: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ docs: [] })),
    })),
    orderBy: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ docs: [] })),
    })),
  })),
  doc: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ exists: true, id: 'mocked-doc-id', data: () => ({}) })),
    set: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  })),
  batch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  FieldValue: {
    serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
    delete: jest.fn(() => 'DELETE_FIELD'),
  },
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  getDoc: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  runTransaction: jest.fn(() => Promise.resolve()),
}

module.exports = {
  getFirestore: jest.fn(() => mockedFirestore),
  collection: mockedFirestore.collection,
  doc: mockedFirestore.doc,
  getDocs: mockedFirestore.getDocs,
  getDoc: mockedFirestore.getDoc,
  arrayUnion: mockedFirestore.arrayUnion,
  arrayRemove: mockedFirestore.arrayRemove,
  setDoc: mockedFirestore.setDoc,
  updateDoc: mockedFirestore.updateDoc,
  deleteDoc: mockedFirestore.deleteDoc,
  runTransaction: mockedFirestore.runTransaction,
}
