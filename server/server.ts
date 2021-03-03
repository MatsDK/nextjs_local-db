import next from "next";
import express, { Application, Request, Response } from "express";
import api from "./routers/appRouter";
import bodyParser from "body-parser";
import cors from "cors";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server: Application = express();

    server.use(bodyParser());
    server.use(cors());
    server.use("/", api);

    server.get("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(2504, (err?: any): void => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${2504}`);
    });
  })
  .catch((ex: any) => {
    console.error(ex.stack);
    process.exit(1);
  });
