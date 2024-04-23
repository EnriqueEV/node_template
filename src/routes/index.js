import Router from 'koa-router'
import getHealth from './health/health'
import promotions from './promo/promo'
const router = new Router()

router.get('/health', getHealth)

router.post("/api/get-promotions",promotions.getAllProducts)

export default router
