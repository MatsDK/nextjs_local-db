import BSON from "bson";
import express, { Request, Response } from "express";
import fs from "fs";

const router = express.Router();

router.post("/test", function (req: Request, res: Response) {
  console.log("hello");
  res.json({ msg: "hello world" });
});

router.get("/data", (req: Request, res: Response) => {
  const data = BSON.deserialize(fs.readFileSync("./data/dbData"));

  data.dbs.forEach((element: any) => {
    let thisSize = 0;
    element.collections.forEach((col: any) => {
      thisSize += fs.statSync(`./data/collection-${col.colId}`).size;
    });
    element.size = thisSize;
  });

  res.json(data);
});

router.get("/data/:id", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((x: any) => x.locId === req.params.id);

  thisLoc.collections.forEach((element) => {
    const thisFile = `./data/collection-${element.colId}`;
    element.items = BSON.deserialize(fs.readFileSync(thisFile)).items.length;
    element.size = fs.statSync(thisFile).size;
  });

  res.json({ thisLoc, items });
});

router.get("/data/:id/col/:colId", (req: Request, res: Response) => {
  const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  const thisLoc = items.dbs.find((x: any) => x.locId === req.params.id);
  const thisCol = thisLoc.collections.find(
    (x: any) => x.colId === req.params.colId
  );

  const data = BSON.deserialize(
    fs.readFileSync(`./data/collection-${thisCol.colId}`)
  );

  res.json({ items, thisLoc, thisCol, data: data.items });
});

export default router;
