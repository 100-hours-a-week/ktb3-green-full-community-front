import Router from "./setRouter.js";

let router = null;

export function initRouter(app) {
   if(router) return router;
   router = Router(app);
   return router;
}

export function getRouter(app) {
   if(!router) throw new Error('Router 설정이 되어있지 않습니다.');
   return router;
}
