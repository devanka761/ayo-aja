import fs from "fs";
const dirpath: string= "./server/db";

interface TemporaryAuth {
  email: string
  otp: {
    code: number
    expiry: Date | number
  }
  rate: number
}

interface User {
  uname: string
  email: string
  dname: string
  b?: number[]
  bio?: string
  img?: string
  req?: string[]
  zzz?: object[]
  peer?: string
  lu?: number
  ld?: number
  lb?: number
}

interface ChatObject {
  u: string
  ts: string
  w?: string[]
  txt?: string
  e?: string
  i?: string
  d?: string
  r?: string
  v?: string
  vc?: 1 | 0 | null
  rj?: 1 | 0 | null
  dur?: string
}

interface Chat {
  u: string[]
  f?: 1 | 0 | null
  c: { [ key: string ] : ChatObject }
}

interface Group extends Chat {
  o: string
  n: string
  i?: string
  t?: string
  b?: number[]
  l?: string
}

interface PostCommentObject {
  u: string
  txt: string
  ts: string
}

interface Post {
  u: string
  ts: string
  l?: string[]
  i: string
  txt?: string
  c?: { [ key: string ] : PostCommentObject }
}

interface Call {
  t: 1 | 0
  o: number
  st: 0
  u: Array<{
    id: string
    j: boolean
  }>
}

type Databases = {
  u: { [ key: string ] : User }
  t: { [ key: string ] : TemporaryAuth }
  c: { [ key: string ] : Chat }
  g: { [ key: string ] : Group }
  p: { [ key: string ] : Post }
  v: { [ key: string ] : Call }
}

class DevankaLocal {
  readonly ref: Databases
  constructor() {
    this.ref = { u:{}, t:{}, c:{}, g:{}, p:{}, v:{} };
  }
  load(): void {
    if(!fs.existsSync(dirpath)) fs.mkdirSync(dirpath);
    Object.keys(this.ref).filter(file => !["t","v"].includes(file)).forEach(file => {
      const fileKey = file as keyof Databases;
      if(!fs.existsSync(`${dirpath}/${fileKey}.json`)) {
        fs.writeFileSync(`${dirpath}/${fileKey}.json`, JSON.stringify(this.ref[fileKey]), 'utf-8');
      }
      const filebuffer = fs.readFileSync(`${dirpath}/${fileKey}.json`, 'utf-8');
      this.ref[fileKey] = JSON.parse(filebuffer);
      if(fileKey === "u") {
        Object.keys(this.ref[fileKey]).forEach(objkey => {
          const k = objkey as keyof User;
          if(this.ref[fileKey][k].peer) delete this.ref[fileKey][k].peer;
          if(this.ref[fileKey][k].zzz) delete this.ref[fileKey][k].zzz;
        });
      }
      console.info(`Data - ${fileKey} - Loaded!`);
    });
  }
  save(...args: string[]): void {
    console.log(args);
    if(args.length < 1) {
      args = Object.keys(this.ref).filter(file => !["t","v"].includes(file));
    }
    for(const arg of args) {
      const s = arg as keyof Databases;
      fs.writeFileSync(`${dirpath}/${s}.json`, JSON.stringify(this.ref[s]), "utf-8");
    }
  }
}

export default new DevankaLocal();