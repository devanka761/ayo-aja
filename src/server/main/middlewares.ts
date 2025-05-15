import { Request, Response, NextFunction } from "express";
import db from "./db";

const userCDs = new Map();

export function cdUser(req: Request, res: Response, next: NextFunction) {
  const uid = req.user?.id || "unknown";

  if(userCDs.has(uid)) {
    if(Date.now() <= userCDs.get(uid)) res.json({ok:false,code:429,msg:'TO_MANY_REQUEST'});
  }

  userCDs.set(uid, Date.now() + 1000);
  setTimeout(() => userCDs.delete(uid), 1000);
  next();
}
export function isUser(req: Request, res: Response, next: NextFunction) {
  if(req.user?.id) {
    if(db.ref.u[req.user.id]?.data) return next();
    return res.json({code:401,msg:'UNAUTHORIZED'});
  }
  return res.json({code:401,msg:'UNAUTHORIZED'});
}