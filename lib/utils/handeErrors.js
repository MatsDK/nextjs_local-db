module.exports = handleErr = (cb, errCode, err) => {
  switch (errCode) {
    case 0:
      if (cb) return cb("insert function requires new doc in props", null);
      throw "insert function requires new doc in props";
    case 1:
      if (cb) return cb("don't put the property '_id' in your query", null);
      throw "don't put the property '_id' in your query";
    case 2:
      if (err) {
        if (cb) return cb(err, null);
        return err;
      }
      break;
    case 3:
      if (cb) return cb("first prop should be of type string");
      throw "first prop should be of type string";
    case 4:
      if (err) {
        if (cb) return cb(err);
        throw err;
      }
      break;
    case 5:
      if (cb)
        return cb(
          "first property of find function should be an object or a callback function",
          null
        );
      throw "first property of find function should be an object or a callback function";
    case 6:
      if (cb)
        return cb(
          "first property of the location function should be of type string"
        );
      throw "first property of the location function should be of type string";
    case 7:
      if (cb)
        return cb(
          "first propery of function deleteOne should by of type object"
        );
      throw "first propery of function deleteOne should by of type object";
    case 8:
      if (cb)
        return cb(
          "properties of update function should be (searchObject, updateObject, options(optional), callback(optional))"
        );
      throw "properties of update function should be (searchObject, updateObject, options(optional), callback(optional))";
    case 9:
      if (cb) return cb("updateObject can't contain the property '_id'");
      throw "updateObject can't contain the property '_id'";
  }
};
