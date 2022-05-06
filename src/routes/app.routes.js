import {Router} from "express";
import { isAuth } from "../middlewares/isAuth";
import * as App from "../controllers/app.controllers";

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

router.get('/services/tasks/pending/:id', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message,
        me: '/services/tasks/pending',
        id: request.params.id,
        task: []
    }

    const OneTask = App.getOneTask(request.params.id);

    Promise.all([OneTask]).then(value => {

        info.task = value[0];
        response.render('services/tasks/by-id', info);
    }).catch(err => {
        console.log(err);
    });

});

router.get('/services/tasks/complete', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message,
        me: request.path
    }
    response.render('services/tasks/complete', info);
});

export default router;