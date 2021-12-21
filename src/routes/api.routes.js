import {Router} from "express";
import * as Security from "../controllers/seguridad.controller";
import {JsonOut} from "../middlewares/JsonOut";

const router = Router();

router.post('/auth', Security.checkUserAndPassword)

export default router;