const { nanoid } = require("nanoid");
const BSON = require("bson");
const fs = require("fs");

const createLocation = (conn, req) => {
  const err = createLoc(req);
  conn.write(JSON.stringify({ err }));
};

const createLoc = ({ name }) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const exists = dbs.dbs.find((x) => x.name === name);

  if (exists) return "location already exists";

  dbs.dbs.push({
    locId: nanoid(),
    name: name,
    collections: new Array(),
  });
  fs.writeFileSync(`./data/dbData`, BSON.serialize(dbs));
  return false;
};

const createCollection = (conn, req) => {
  const err = createCol({ locName: req.loc, colName: req.colName });
  conn.write(JSON.stringify({ err: err.err }));
};

const createCol = ({ locName, colName }) => {
  const dbs = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const loc = dbs.dbs.find((x) => x.name === locName);
  if (!loc) return { err: "location not found" };

  if (loc.collections.find((x) => x.name === colName))
    return { err: "collection already exists" };

  const colId = nanoid();
  loc.collections.push({ name: colName, colId });

  fs.writeFileSync(`./data/dbData`, BSON.serialize(dbs));
  fs.writeFileSync(`./data/collection-${colId}`, BSON.serialize({ items: [] }));

  return { err: false, colId };
};

module.exports = { createLocation, createCollection, createCol, createLoc };
