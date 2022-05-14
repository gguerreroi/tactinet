import {Router} from "express";
import {isAuth, isAuthLogin} from "../middlewares/isAuth";
import * as App from "../controllers/app.controllers"
import {JsonOut} from "../middlewares/JsonOut";

const passport = require('passport');
const router = Router();

router.get('/auth', isAuthLogin, function (request, response) {
    response.render('auth');
});

router.post('/auth', function (request, response, next) {
    request.session.message = {};
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    })(request, response, next);
});

router.get('/failure', function (request, response) {

    const mess = (request.session.message !== undefined) ? request.session.message.data.message : "Usuario o contraseña invalida"

    response.status(401).send(JsonOut(401, mess))
});

router.get('/success', function (request, response) {
    response.status(200).send(JsonOut(200, 'Login Success', request.session.message))
});

router.get('/logout', function (request, response) {
    App.setDestroySession(request, response)
});

router.get('/', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('index', info);
});

router.get('/services/tasks/pending', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }

    response.render('services/tasks/pending', info);
});

router.get('/services/tasks/details/:id', isAuth, function (request, response) {
    let info = {
        UserInfo: request.session.message, me: '/services/tasks/pending', id: request.params.id, task: []
    }
    const OneTask = App.getOneTask(request.params.id, request.session.message);
    const CommentTasks = App.getCommentsTask(request.params.id, request.session.message);
    Promise.all([OneTask, CommentTasks]).then(value => {
        value[0].data.data[0].COMMENTS = value[1].data.data
        info.task = value[0].data.data[0];
        response.render('services/tasks/by-id', info);
    }).catch(err => {
        response.render('system/err500', {
            UserInfo: request.session.message, me: request.path, err: err
        });
    })
});

router.get('/services/tasks/complete', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('services/tasks/complete', info);
});

export default router;