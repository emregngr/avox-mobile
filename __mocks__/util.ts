class MockedTextEncoder {
  encode(str: string) {
    return new Uint8Array(str.split('').map(char => char.charCodeAt(0)))
  }
}

class MockedTextDecoder {
  decode(uint8Array: Uint8Array) {
    return String.fromCharCode(...uint8Array)
  }
}

module.exports = {
  TextEncoder: MockedTextEncoder,
  TextDecoder: MockedTextDecoder,
}
