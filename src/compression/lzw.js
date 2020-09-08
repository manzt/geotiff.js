import WasmLZWDecoder from 'lzw-tiff-decoder';
import BaseDecoder from './basedecoder';

const decoder = new WasmLZWDecoder(); // won't initialize wasm until fist decode call.
export default class LZWDecoder extends BaseDecoder {
  constructor(fileDirectory) {
    super();
    const width = fileDirectory.TileWidth || fileDirectory.ImageWidth;
    const height = fileDirectory.TileLength || fileDirectory.ImageLength;
    const nbytes = fileDirectory.BitsPerSample[0] / 8;
    this.maxUncompressedSize = width * height * nbytes;
  }

  async decodeBlock(buffer) {
    const bytes = new Uint8Array(buffer);
    const decoded = await decoder.decompress(bytes, this.maxUncompressedSize);
    if (decoded.length === 0) {
      throw Error('Failed LZW decompression.');
    }
    return decoded.buffer;
  }
}
