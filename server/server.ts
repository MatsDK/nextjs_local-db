import next from "next";
import express, { Application, Request, Response } from "express";
import api from "./api";
import bodyParser from "body-parser";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server: Application = express();

    server.use(bodyParser());
    server.use("/api", api);

    server.get("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(process.env.PORT || 3001, (err?: any): void => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${process.env.PORT || 3001}`);
    });
  })
  .catch((ex: any) => {
    console.error(ex.stack);
    process.exit(1);
  });
