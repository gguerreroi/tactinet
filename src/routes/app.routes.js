import {Router} from "express";
import { isAuth } from "../middlewares/isAuth";
const router = Router();

router.get('/auth', function (request, response) {
    response.render('auth');
});

router.get('/',isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message,
        me: request.path
    }
    response.render('index', info);
});

router.get('/services/tasks/pending', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message,
        me: request.path
    }
    response.render('services/tasks/pending', info);
});

router.get('/services/tasks/complete', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message,
        me: request.path
    }
    response.render('services/tasks/complete', info);
});
export default router;