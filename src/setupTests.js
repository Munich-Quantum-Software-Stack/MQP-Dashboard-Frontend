require('@testing-library/jest-dom');

const { TextDecoder, TextEncoder } = require('util');
const { ReadableStream, TransformStream, WritableStream } = require('stream/web');

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

if (!global.TransformStream) {
  global.TransformStream = TransformStream;
}

if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream;
}

if (!global.WritableStream) {
  global.WritableStream = WritableStream;
}
const { server } = require('./test/server');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
