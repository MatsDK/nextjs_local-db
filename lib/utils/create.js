const connectServer = require("./connect");
const handleErr = require("./handeErrors");

const createLocation = async (conf, locationName, cb) => {
  if (typeof locationName === "function" && !cb)
    return handleErr(locationName, 3);
  if (typeof locationName !== "string") return handleErr(cb, 3);

  const query = { createLocation: true, name: locationName };
  const res = await connectServer(conf.loc, query);

  if (res.err) handleErr(cb, 4, res.err);
  if (cb) cb(null);
  return res.err ? res.err : null;
};

const createCollection = async (conf, location, colName, cb) => {
  if (typeof colName === "function" && !cb) return handleErr(colName, 3);
  if (typeof colName !== "string") return handleErr(cb, 3);

  const query = { createCollection: true, loc: location, colName };
  const res = await connectServer(conf.loc, query);

  if (res.err) handleErr(cb, 4, res.err);
  if (cb) cb(null);
  return res.err ? res.err : null;
};

module.exports = { createLocation, createCollection };
