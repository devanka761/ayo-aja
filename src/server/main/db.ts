import fs from "fs";
import { Databases, User } from "../types/db.type";
const dirpath: string= "./server/db";

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