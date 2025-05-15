import express, { Request, Response, Router } from "express";
import * as hauth from "../controller/auth.controller";
import { rep } from "../main/helper";
import { cdUser } from "../main/middlewares";
import hoauth from "../controller/oauth.controller";
import { PayloadData } from "../types/validate.type";
import { TempUserData } from "../types/binder.type";
import { RepBack } from "../types/helper.type";

const router: Router = express.Router();

router.use(express.json({limit:"100KB"}));

router.get("/isUser", (req:Request, res:Response) => {
  res.json(rep(hauth.isLogged(req.user?.id)));
});

router.post("/sign-in", (req:Request, res:Response) => {
  const signIn = rep(hauth.login(req.body) as RepBack);
  res.json(signIn);
});

router.post("/verify", (req:Request, res:Response) => {
  const verifyUser = rep(hauth.verify(req.body) as RepBack) as PayloadData;
  if(!verifyUser.ok) res.json(verifyUser);
  const payloadInfo = verifyUser.data as PayloadData;
  const userInfo = payloadInfo.user ? payloadInfo.user as PayloadData : null;
  const userData = userInfo ? userInfo.data as TempUserData : null;
  if(verifyUser.code === 200 && userInfo && userData) {
    req.user = {
      id: userInfo.id as string,
      data: {
        id: userData.id as string,
        email: userData.email,
        provider: userData.provider
      }
    }
  }
  res.json(verifyUser);
})

router.get("/logout", (req:Request, res:Response) => {
  req.session.destroy(() => {
    res.redirect("/app");
  });
});

router.get("/:provider/callback", async(req:Request, res:Response) => {
  const { provider } = req.params;
  if(!hoauth.isProviderValid(provider)) res.json({ok:false,code:400});
  if(req.query?.error) res.json({ok:false,code:400});
  if(!req.query?.code) res.json({ok:false,code:400});
  const user = await hoauth.user({ provider, code: req.query.code as string });
  if(!user || user.error) res.json({ok:false,code:400});
  const verifyUser = hauth.processThirdParty({
    user: user.data as PayloadData,
    provider: user.provider as string
  });
  if(!verifyUser.ok || verifyUser.code !== 200) res.json(verifyUser);
  const payloadInfo = verifyUser.data as PayloadData;
  const userInfo = payloadInfo.user as PayloadData;
  const userData = userInfo.data as TempUserData;
  req.user = {
    id: userInfo.id as string,
    data: {
      id: userData.id as string,
      email: userData.email,
      provider: userData.provider
    },
  }
  res.redirect("/app");
});

router.get("/:provider", cdUser, (req:Request, res:Response) => {
  const { provider } = req.params;
  if(!hoauth.isProviderValid(provider)) res.json({ok:false,code:400});
  res.redirect(hoauth.auth(provider as "github"|"google"|"discord"));
});

export default router;