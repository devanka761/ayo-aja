process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import express, { Application, Request, Response } from "express";
import session from "express-session";
import SessionFileStore, { FileStore } from "session-file-store";
import { ExpressPeerServer } from "peer";
import { KiriminObject, peerKey } from "./ts/helper";
import db from "./ts/db";
import xcloud from "./ts/handler/xcloud";

declare module "peer" {
  interface IMessage {
    kirimin: KiriminObject
  }
}

if(!fs.existsSync("./server")) fs.mkdirSync("./server");
if(!fs.existsSync('./server/sessions')) {
  fs.mkdirSync('./server/sessions');
  console.log('Sessions Reloaded!');
}

db.load();

const app: Application = express();

const SessionFiles: FileStore = SessionFileStore(session);

app.use(session({
  secret: process.env.SESSION_SECRET || "SESSION_SECRET",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: (1000 * 60 * 60 * 24 * 30), sameSite: "strict" },
  store: new SessionFiles({ path: "./server/sessions", logFn() {} })
}))

app.use(express.static("client"));
app.set("view engine", "ejs");

const port: number = Number(process.env.APP_PORT || "7000");

app.get("/", (_, res: Response) => {
  res.render("app");
});

const appService = app.listen(port, () => {
  console.log(`ONLINE >> http://localhost:${process.env.APP_PORT}/app`);
  console.log(`PEERS >> http://localhost:${process.env.APP_PORT}/cloud/${peerKey}/peers`);
});

const server = ExpressPeerServer(appService, {
  key: peerKey,
  allow_discovery: false
});

server.on("message", (c, m) => {
  const udb = db.ref.u;
  const uid = Object.keys(udb).find(key => udb[key].peer === c.getId());
  if(!uid) return;
  if(m.kirimin) {
    if(m.kirimin.id === "hb") return c.send({s: xcloud.heartbeat(uid)});
    const socketHandler = xcloud.run(uid, m.kirimin);
    if(!socketHandler) return;
    return c.send({s: socketHandler});
  }
  if(m.type === "HEARTBEAT") {
    const heartBeat = xcloud.heartbeat(uid);
    if(heartBeat === 403423) return c.getSocket()?.close();
    return c.send({s: heartBeat});
  }
})

server.on("disconnect", c => {
  const offuser = Object.keys(db.ref.u).find(k => db.ref.u[k]?.peer === c.getId());
  if(offuser) {
    xcloud.run(offuser, { id: "hangupCall" });
    delete db.ref.u[offuser].peer;
  }
  db.save('u');
});

server.on("error", console.error);

app.use("/cloud", server);

app.use("/", (req: Request, res: Response) => {
  res.json({ok:false,code:404,status:"NOT FOUND"});
});