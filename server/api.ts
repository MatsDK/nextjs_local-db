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
  console.log(req.params.id);
  res.json(BSON.deserialize(fs.readFileSync("./data/dbData")));
});

export default router;
