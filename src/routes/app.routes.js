import {Router} from "express";
import { isAuth } from "../middlewares/isAuth";
const router = Router();

router.get('/',isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message,

    }
    response.render('index', info);
});

router.get('/auth', function (request, response) {
    response.render('auth');
});

export default router;