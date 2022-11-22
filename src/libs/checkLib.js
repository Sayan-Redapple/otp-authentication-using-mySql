'use srict'

let trim = (x) => {
  let value = String(x)
  return value.replace(/^\s+|\s+$/gm, '')
}
let isEmpty = (value) => {
  if (value === null || value === undefined || trim(value) === '' || value.length === 0) {
    return true
  } else {
    return false
  }
}

let removeEmpty = obj => {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
  return obj;
};

let removeEmptyArr = arr => {
  let newArr = arr.filter((ar)=>{
    return ar != null || undefined;
  });
  return newArr
}

let addslashes = (string) => {
  return string.replace(/\\/g, '\\\\').
      replace(/\u0008/g, '\\b').
      replace(/\t/g, '\\t').
      replace(/\n/g, '\\n').
      replace(/\f/g, '\\f').
      replace(/\r/g, '\\r').
      replace(/'/g, '\\\'').
      replace(/"/g, '\\"');
}

/**
 * exporting functions.
 */
module.exports = {
  isEmpty: isEmpty,
  removeEmpty:removeEmpty,
  removeEmptyArr : removeEmptyArr,
  addslashes : addslashes
}
