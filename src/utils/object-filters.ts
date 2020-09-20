export function whiteListObjectProperty(obj, whiteList, removeNull = false) {
  const trimmed = {};
  whiteList.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      if (!removeNull || obj[key] !== null) {
        trimmed[key] = obj[key];
      }
    }
  });
  if (Object.keys(trimmed).length === 0 && trimmed.constructor === Object) {
    return undefined;
  }
  return trimmed;
}

export function blackListObjectProperty(obj, blackList, removeNull = false) {
  const ret = Object.assign({}, obj);
  blackList.forEach((key) => {
    delete ret[key];
  });
  if (Object.keys(ret).length === 0 && ret.constructor === Object) {
    return undefined;
  }

  if (removeNull) {
    Object.getOwnPropertyNames(ret).forEach((propName) => {
      if (ret[propName] === null) {
        delete ret[propName];
      }
    });
  }

  return ret;
}