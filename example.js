const { api, connect } = require("./lib/bundle");

const example = async () => {
  const conn = await connect({ port: 3000, host: "127.0.0.1" });
  const loc = api.location("loc", conn.apiConfig);

  // await loc
  //   .collection("col")
  //   .update({_id: "id"}, { newProp: "newProp" }, { _replace: true }, (err, updatedDocs) => {
  //     if (err) throw err;
  //     console.table(updatedDocs);
  //   });

  // await loc
  //   .collection("col")
  //   .updateOne(
  //     { userId: "userId" },
  //     { userId: "newUserId" },
  //     { _skip: skip, _limit: limit, _replace: false },
  //     (err, updatedDocs) => {
  //       if (err) throw err;
  //       console.log(updatedDocs);
  //     }
  //   );

  // await loc.collection("col").delete((err) => {
  //   if (err) throw err;
  // });

  // await loc
  //   .collection("col")
  //   .deleteOne({ userId: "userId" }, { _skip: skip }, (err) => {
  //     if (err) throw err;
  //   });

  // await conn.deleteLocation("loc", (err) => {
  //   if (err) throw err;
  // });

  // await loc.deleteCollection("col", (err) => {
  //   if (err) throw err;
  // });

  // await loc.deleteAllCollections((err) => {
  //   if (err) throw err;
  // });

  // await loc.collection("col").find({ _limit: limit, _skip: skip }, (err, docs) => {
  //   if (err) throw err;
  //   console.log(docs);
  // });

  // await loc
  //   .collection("col")
  //   .findOne({ userId: userId }, { _skip: skip }, (err, docs) => {
  //     if (err) throw err;
  //     console.log(docs);
  //   });

  // await loc.showCollections((err, cols) => {
  //   if (err) throw err;
  //   console.log(cols);
  // });

  // await conn.showLocations((err, locations) => {
  //   if (err) throw err;
  //   console.log(locations);
  // });

  // await loc.createCollection("col", (err) => {
  //   if (err) throw err;
  // });

  await conn.createLocation("loc1", (err) => {
    if (err) throw err;
  });

  // await loc
  //   .collection("col")
  //   .insertMany([{ newItem1 }, { newItem2 }, { newItem3 }], (err, newDocs) => {
  //     if (err) throw err;
  //     console.log(newDocs);
  //   });

  // await loc.collection("col").insertOne({ newItem }, (err, doc) => {
  //   if (err) throw err;
  //   console.log(doc);
  // });

  // await loc.collection("col").countDocs((err, count) => {
  //   if (err) throw err;
  //   console.log(count);
  // });
};

example();
