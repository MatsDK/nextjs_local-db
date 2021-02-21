const handleErr = require("./utils/handeErrors");
const connectServer = require("./utils/connect");
const { find, insert, update, countDocs } = require("./utils/docs");
const { createLocation, createCollection } = require("./utils/create");
const { showLocations, showCollections } = require("./utils/getColLoc");
const {
  deleteLocation,
  deleteCollection,
  findAndDelete,
} = require("./utils/delete");

const connect = async (loc) => {
  const apiConfig = await connectServer(loc, { connect: true, loc });

  return {
    apiConfig,
    createLocation(props, cb) {
      return createLocation(apiConfig, props, cb);
    },
    showLocations(cb) {
      return showLocations(apiConfig, cb);
    },
    deleteLocation(props, cb) {
      return deleteLocation(apiConfig, props, cb);
    },
  };
};

const collection = (location, col, conf) => {
  if (!col) return;

  return {
    insertMany(item, cb) {
      return insert({ location, col, conf }, item, { limit: undefined }, cb);
    },
    insertOne(array, cb) {
      return insert({ location, col, conf }, array, { limit: 1 }, cb);
    },
    find(query, options, cb) {
      return find({
        data: { location, col, conf },
        query,
        options,
        cb,
        limit: undefined,
      });
    },
    findOne(query, options, cb) {
      return find({
        data: { location, col, conf },
        query,
        options,
        cb,
        limit: 1,
      });
    },
    delete(query, options, cb) {
      return findAndDelete({
        data: { location, col, conf },
        query,
        options,
        cb,
        limit: undefined,
      });
    },
    deleteOne(query, options, cb) {
      return findAndDelete({
        data: { location, col, conf },
        query,
        options,
        cb,
        limit: 1,
      });
    },
    updateOne(query, updated, options, cb) {
      return update({
        data: { location, col, conf },
        query,
        updated,
        options,
        cb,
        limit: 1,
      });
    },
    update(query, updated, options, cb) {
      return update({
        data: { location, col, conf },
        query,
        updated,
        options,
        cb,
        limit: undefined,
      });
    },
    countDocs(cb) {
      return countDocs(location, col, conf, cb);
    },
  };
};

const location = (location, conf, cb) => {
  if (typeof location !== "string") throw handleErr(cb, 6);
  return {
    collection(col) {
      return collection(location, col, conf);
    },
    showCollections(cb) {
      return showCollections(location, conf, cb);
    },
    createCollection(colName, cb) {
      return createCollection(conf, location, colName, cb);
    },
    deleteCollection(props, cb) {
      return deleteCollection(conf, location, { deleteAll: false }, props, cb);
    },
    deleteAllCollections(cb) {
      return deleteCollection(conf, location, { deleteAll: true }, cb);
    },
  };
};

exports.connect = connect;
exports.api = {
  connect,
  location,
};
