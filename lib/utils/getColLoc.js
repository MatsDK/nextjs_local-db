const connectServer = require("./connect");
const handleErr = require("./handeErrors");

const showLocations = async (conf, cb) => {
  if (typeof cb !== "function")
    return "showLocations property should be a callback function";

  const query = { getLocations: true };
  const res = await connectServer(conf.loc, query);

  if (res.err) return handleErr(cb, 2, res.err);

  if (cb) cb(null, res.locs);
  return res.locs;
};

const showCollections = async (location, conf, cb) => {
  if (typeof cb !== "function")
    return "showCollections property should be a callback function";

  const query = { getCollections: true, location };
  const res = await connectServer(conf.loc, query);

  if (res.err) return handleErr(cb, 2, res.err);

  if (cb) cb(null, res.collections);
  return res.collections;
};

module.exports = { showLocations, showCollections };
