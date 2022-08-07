const clone = obj => JSON.parse(JSON.stringify(obj));

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

function hasValue(el) {
  for (const [, value] of Object.entries(el)) {
    return !!value;
  }
}

export {
  hasValue,
  clone,
  isObject,
};
