import crypto, { Cipher, Decipher } from "crypto";

export interface KiriminObject {
  id: string
  data?: object | null | undefined
}

export const peerKey: string = crypto.randomBytes(16).toString("hex");

export function genPeer(): string {
  console.log(process.env.CHAT_KEY);
  return crypto.randomBytes(8).toString("hex") + Date.now().toString(36);
}

type RepBack = {
  ok: boolean
  code: number
  msg: string
  data?: object | null
}

export function rep(code:number = 400, msg:string|null, s:object|null): RepBack {
  if(typeof msg !== "string") {
    s = msg;
    msg = null;
  }

  const data: RepBack = {
    ok: code >= 400 ? false : true,
    code: code,
    msg: msg ? msg : (code >= 400 ? "ERROR" : "OK"),
    data: s || null
  };

  return data;
}

export function rString(n:number = 8): string {
  return crypto.randomBytes(n).toString('hex');
}

export function rNumber(n:number = 6): number {
  let a: string = "";
  for(let i:number = 1; i < n; i++) { a += "0" }
  return Math.floor(Math.random() * Number("9" + a)) + Number("1" + a);
}

export function encryptData(plaintext:string): string {
  const chatkey: Buffer = Buffer.from(process.env.CHAT_KEY || "CHAT_KEY", 'hex');
  const iv: Buffer = crypto.randomBytes(16);
  const cipher: Cipher = crypto.createCipheriv('aes-256-cbc', chatkey, iv);
  const encrypted: string = cipher.update(plaintext, 'utf-8', 'hex');
  const dataResult: string = encrypted + cipher.final('hex');
  return `${iv.toString('hex')}:${dataResult}`;
}

export function decryptData(ciphertext:string): string {
  const chatkey: Buffer = Buffer.from(process.env.CHAT_KEY || "CHAT_KEY", 'hex');
  const [ivHex, encrypted]: string[] = ciphertext.split(':');
  const iv: Buffer = Buffer.from(ivHex, 'hex');
  const decipher: Decipher = crypto.createDecipheriv('aes-256-cbc', chatkey, iv);
  const decrypted: string = decipher.update(encrypted, 'hex', 'utf-8');
  const dataResult: string = decrypted + decipher.final('utf-8');
  return dataResult;
}