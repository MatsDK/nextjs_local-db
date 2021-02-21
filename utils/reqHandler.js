const fs = require("fs");
const BSON = require("bson");
const updateItems = require("./updateItems");
const filterItems = require("./findItems");
const { createLocation, createCollection } = require("./create");
const { deleteCollection, deleteLocation, findAndDelete } = require("./delete");
const { nanoid } = require("nanoid");
const { createCol, createLoc } = require("./create");

module.exports = reqHandler = async (conn, req) => {
  try {
    switch (true) {
      case req.getCollections:
        getCollections(conn, req);
        break;
      case req.getLocations:
        getLocations(conn);
        break;
      case req.insertItem:
        insertItem(conn, req);
        break;
      case req.findItem:
        findItem(conn, req);
        break;
      case req.createLocation:
        createLocation(conn, req);
        break;
      case req.createCollection:
        createCollection(conn, req);
        break;
      case req.deleteLocation:
        deleteLocation(conn, req);
        break;
      case req.deleteCollection:
        deleteCollection(conn, req);
        break;
      case req.findAndDelete:
        findAndDelete(conn, req);
        break;
      case req.update:
        update(conn, req);
        break;

      default:
        return;
    }
  } catch (err) {
    conn.write(JSON.stringify({ err }));
  }
};

const update = (conn, req) => {
  if (req.limit === null) req.limit = Infinity;
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const loc = locs.dbs.find((x) => x.name === req.location);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  const col = loc.collections.find((x) => x.name === req.col);
  if (!col) return conn.write(JSON.stringify({ err: "collection not found" }));

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${col.colId}`)
  );

  const { returnArr, items } = updateItems(data.items, req);
  fs.writeFileSync(`./data/collection-${col.colId}`, BSON.serialize({ items }));
  conn.write(JSON.stringify({ returnArr }));
};

const findItem = (conn, req) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const loc = locs.dbs.find((x) => x.name === req.location);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  const col = loc.collections.find((x) => x.name === req.col);
  if (!col) return conn.write(JSON.stringify({ err: "collection not found" }));

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${col.colId}`)
  );
  const items = filterItems(data.items, req);

  conn.write(JSON.stringify({ items }));
};

const insertItem = async (conn, req) => {
  const locs = BSON.deserialize(fs.readFileSync("./data/dbData")).dbs;
  let loc = locs.find((x) => x.name === req.location);
  if (!loc) {
    const err = createLoc({ name: req.location });
    if (err) return conn.write(JSON.stringify({ err }));
    loc = { name: req.location, collections: [] };
  }

  let col = loc.collections.find((x) => x.name === req.col);
  if (!col) {
    const res = createCol({ locName: req.location, colName: req.col });
    if (res.err) return conn.write(JSON.stringify({ err: res.err }));
    col = res;
  }

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${col.colId}`)
  );

  let newItems;
  if (!req.isArray) newItems = [{ _id: nanoid(), ...req.obj }];
  else newItems = req.obj.map((x) => (x = { _id: nanoid(), ...x }));

  data.items = [...newItems, ...data.items];
  fs.writeFileSync(`./data/collection-${col.colId}`, BSON.serialize(data));

  conn.write(JSON.stringify({ items: newItems }));
};

const getLocations = (conn) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));

  if (dbs) return conn.write(JSON.stringify({ locs: dbs.dbs }));
  conn.write(JSON.stringify({ err: "locations not found" }));
};

const getCollections = (conn, req) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  if (!dbs) return conn.write(JSON.stringify({ err: "locations not found" }));

  const loc = dbs.dbs.find((x) => x.name === req.location);
  if (!loc) return conn.write(JSON.stringify({ err: "location not found" }));

  conn.write(JSON.stringify({ err: false, collections: loc.collections }));
};
