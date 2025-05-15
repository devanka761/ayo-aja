process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";
import fs from "fs";
import express, { Application, Request, Response } from "express";
import session from "express-session";
import SessionFileStore, { FileStore } from "session-file-store";
import { ExpressPeerServer } from "peer";
import authRouter from "./routes/auth.route";
import { peerKey } from "./main/helper";
import db from "./main/db";
import xcloud from "./main/handler/xcloud";
import { sessionUserBinder } from "./main/binder";
import { KiriminObject } from "./types/helper.type";
import cfg from "./main/cfg";

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
  secret: cfg.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: (1000 * 60 * 60 * 24 * 30), sameSite: "strict" },
  store: new SessionFiles({ path: "./server/sessions", logFn() {} })
}));

app.use(sessionUserBinder);

app.use(express.static("client"));
app.set("view engine", "ejs");

const PORT: number = cfg.APP_PORT as number;

app.use("/x/auth", authRouter);

app.get("/app", (req: Request, res: Response) => {
  res.render("app");
});
app.get("/", (_, res: Response) => {
  res.render("home");
});

const appService = app.listen(PORT, () => {
  console.log(`ONLINE >> http://localhost:${PORT}/app`);
  console.log(`PEERS >> http://localhost:${PORT}/cloud/${peerKey}/peers`);
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