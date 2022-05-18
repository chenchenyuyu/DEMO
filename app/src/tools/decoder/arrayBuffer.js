const LITTLE_ENDIAN = true;
const FILE_SIGNATURE = 0x54584E42;
const PROTOCOL_VERSION = 0x0;

const DATA_TYPE = {
  VTP: 0xF,
  STL: 0xE
};

const ENCRYPT_TYPE = {
  RC4: 0xFF,
  AES: 0xEE,
};

const getUint64 = (dataview, byteOffset, littleEndian) => {
  const left =  dataview.getUint32(byteOffset, littleEndian);
  const right = dataview.getUint32(byteOffset + 4, littleEndian);
  const combined = littleEndian? left + 2**32*right : 2**32*left + right;
  if (!Number.isSafeInteger(combined)) {
    console.warn(combined, 'exceeds MAX_SAFE_INTEGER. Precision may be lost');
  }
  return combined;
};

const findKey = (obj, value, compare = (a, b) => a === b) => {
  return Object.keys(obj).find(k => compare(obj[k], value));
};

const RC4 = (data) => {
  var s = [], j = 0, x, res = [];
  for (var i = 0; i < 256; i++) {
    s[i] = i;
  }
  for (i = 0; i < 256; i++) {
    j = (j + s[i] + 'dUMQmCFGv7oMCAu7'.charCodeAt(i % 16)) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }
  i = 0;
  j = 0;
  for (let y = 0; y < data.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    x = s[i];
    s[i] = s[j];
    s[j] = x;
    res.push(data[y] ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
};

const decryptData = (encodeType, data) => {
  if (encodeType === 'RC4') {
    return RC4(data);
    // RC4 解密
  } else if (encodeType === 'AES') {
    // AES 解密
  }
};

const binaryDecoder = (arraybuffer) => {
  // DCP Head
  let byteOffset = 0;
  const dataview = new DataView(arraybuffer);
  // read file signature
  const fileSignature = dataview.getUint32(byteOffset, LITTLE_ENDIAN);
  if (fileSignature !== FILE_SIGNATURE) {
    throw Error(`File signature ${fileSignature} mismatch`);
  }
  byteOffset += 4;

  // read protocol version and data type
  const data = dataview.getUint8(byteOffset);
  const dataType = data % 16;
  if (Object.values(DATA_TYPE).indexOf(dataType) === -1) {
    throw Error('File data type mismatch');
  }
  const protocolVersion = (data - dataType) / 16;
  if (protocolVersion !== PROTOCOL_VERSION) {
    throw Error(`File version ${protocolVersion} is not supported`);
  }
  byteOffset += 1;

  // read encrypt type
  const encrypteTypeValue = dataview.getUint8(byteOffset, LITTLE_ENDIAN);
  let encrypteType;
  if (Object.values(ENCRYPT_TYPE).indexOf(encrypteTypeValue) !== -1) {
    encrypteType = findKey(ENCRYPT_TYPE, encrypteTypeValue);
  } else {
    throw Error(`File encrypt type ${encrypteTypeValue} is not supported`);
  }
  byteOffset += 1;

  // read chunk buffer size
  const chunkBufferSize = dataview.getUint16(byteOffset, LITTLE_ENDIAN);
  const chunkCount = chunkBufferSize / (4 + 1);
  if (Math.floor(chunkCount) !== chunkCount) { // isInteger
    throw Error('File format is not correct');
  }
  byteOffset += 2;

  // read data size
  const dataSize = getUint64(dataview, byteOffset, LITTLE_ENDIAN);
  byteOffset += 8;

  // read chunk size list
  const encryptChunkSizeList = [];
  for (let i = 0; i < chunkCount; i++) {
    const encrypteChunkSize = dataview.getUint32(byteOffset, LITTLE_ENDIAN);
    encryptChunkSizeList.push(encrypteChunkSize);
    byteOffset += 4;
  }
  const chunkSizeList = decryptData(encrypteType, encryptChunkSizeList);

  // read chunk id list
  const encryptChunkIdList = [];
  for (let i = 0; i < chunkCount; i++) {
    const chunkId = dataview.getUint8(byteOffset, LITTLE_ENDIAN);
    encryptChunkIdList.push(chunkId);
    byteOffset += 1;
  }
  const chunkIdList = decryptData(encrypteType, encryptChunkIdList);

  // check data size
  const chunkSizeListCount = chunkSizeList.reduce((a, b) => a + b, 0);
  if ((dataview.byteLength - byteOffset) !== dataSize || chunkSizeListCount !== dataSize) {
    throw Error('File format is not correct');
  }

  // DCP Body
  // read chunk body
  const chunkOrderIdList = chunkIdList.map((id, index) => ({ id, index }));
  const chunkData = chunkOrderIdList.sort((a, b) => a['id'] - b['id']).map(({ id, index }) => {
    return {
      id,
      index,
      size: chunkSizeList[index],
    };
  });

  const chunkOrderSizeList = chunkData.map(({ id, index, size }, i) => {
    return {
      id,
      index,
      size,
      start: i !== 0 ? chunkData.slice(0, i).reduce((a, b) => a + b.size, 0) : 0,
    };
  });

  const newArrayBuffer = new Uint8Array(dataSize);
  console.time('拼接chunk时间->');
  chunkOrderSizeList.sort((a, b) => a['index'] - b['index']).forEach(({ size, start }) => {
    newArrayBuffer.set(new Uint8Array(arraybuffer, byteOffset, size), start);
    byteOffset += size;
  });
  console.timeEnd('拼接chunk时间->');
  return newArrayBuffer.buffer;
};

export {
  binaryDecoder
};
