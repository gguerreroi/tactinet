import {Router} from "express";
import { isAuth } from "../middlewares/isAuth";
const router = Router();

router.get('/',isAuth, function (request, response) {
    response.render('index');
});

router.get('/auth', function (request, response) {
    response.render('auth');
});

export default router;