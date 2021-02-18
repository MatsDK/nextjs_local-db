const { nanoid } = require("nanoid");
const connectServer = require("./connect");
const handleErr = require("./handeErrors");
const { parseParams, parseUpdateParams } = require("./parseParams");

const find = async (params) => {
  const {
    data: { location, col, conf },
    ...rest
  } = params;

  const { cb, ...queryData } = parseParams(rest);

  const query = {
    findItem: true,
    location,
    col,
    ...queryData,
  };

  const res = await connectServer(conf.loc, query);
  if (res.err) return handleErr(cb, 2, res.err);

  if (cb) cb(null, params.limit ? res.items[0] : res.items);
  return params.limit ? res.items[0] : res.items;
};

const insert = async ({ location, col, conf }, obj, cb) => {
  if (typeof obj === "function" && !cb) return handleErr(obj, 0);
  if (obj && obj._id) return handleErr(cb, 1);

  const apiItem = { _id: nanoid(), ...obj };
  const query = {
    insertItem: true,
    location,
    col,
    apiItem,
  };

  const returnObj = await connectServer(conf.loc, query);
  if (returnObj.err) handleErr(cb, 2, returnObj.err);

  if (cb) cb(null, returnObj.apiItem);
  return returnObj.apiItem;
};

const update = async (params) => {
  const {
    data: { location, col, conf },
    ...rest
  } = params;

  const { cb, ...queryData } = parseUpdateParams(rest);

  const query = {
    update: true,
    location,
    col,
    ...queryData,
  };

  const res = await connectServer(conf.loc, query);
  if (res.err) handleErr(cb, 4, res.err);

  if (cb) cb(null, res.returnArr);
  return res.returnArr;
};

module.exports = { find, insert, update };
