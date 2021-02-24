import BSON from "bson";
import express, { Request, Response } from "express";
import fs from "fs";

const router = express.Router();

router.post("/test", function (req: Request, res: Response) {
  console.log("hello");
  res.json({ msg: "hello world" });
});

router.get("/data", (req: Request, res: Response) => {
  res.json(BSON.deserialize(fs.readFileSync("./data/dbData")));
});

router.get("/data/:id", (req: Request, res: Response) => {
  // const items = BSON.deserialize(fs.readFileSync("./data/dbData"));
  // const thisLoc = items.dbs.find((x: any) => x.locId === req.params.id);
  // console.log(thisLoc);

  res.json(BSON.deserialize(fs.readFileSync("./data/dbData")));
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
