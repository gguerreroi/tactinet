import {Router} from "express";
import {isAuth, isAuthLogin} from "../middlewares/isAuth";
import * as App from "../controllers/app.controllers"
import {JsonOut} from "../middlewares/JsonOut";

const passport = require('passport');
const router = Router();

router.get('/auth', isAuthLogin, function (request, response) {
    response.render('auth');
});

router.post('/auth', function (request, response) {
    request.session.message = {};
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    })(request, response, next);
})
router.get('/failure', function (request, response) {

    const mess = (request.session.message !== undefined) ? request.session.message.data.message : "Usuario o contraseña invalida"

    response.status(401).send(JsonOut(401, mess))
});

router.get('/success', function (request, response) {
    response.status(200).send(JsonOut(200, 'Login Success', request.session.message))
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

router.get('/services/tasks/pending/:id', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: '/services/tasks/pending', id: request.params.id, task: []
    }
    const OneTask = App.getOneTask(request.params.id);

    Promise.all([OneTask]).then(value => {
        info.task = value[0];
        response.render('services/tasks/by-id', info);
    })

});

router.get('/services/tasks/complete', isAuth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('services/tasks/complete', info);
});

export default router;