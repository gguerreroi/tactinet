import {Router} from "express";
import {is_auth, is_auth_login} from "../middlewares/is-auth";
import * as app from "../controllers/app.controllers"
import {json_out} from "../middlewares/json-out";

const passport = require('passport');
const router = Router();

router.get('/auth', is_auth_login, function (request, response) {
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

    response.status(401).send(json_out(401, mess))
});

router.get('/success', function (request, response) {
    response.status(200).send(json_out(200, 'Login Success', request.session.message))
});

router.get('/logout', function (request, response) {
    app.set_destroy_session(request, response)
});

router.get('/', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('index', info);
});

router.get('/customers/maintenance/customer', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('customers/maintenance/customer', info);
});

router.get('/customers/maintenance/customer/:id', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('customers/maintenance/by-id', info);
});

/**
    * @api {get} /services/tasks/pending Get pending tasks
 **/

router.get('/services/tasks/pending', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }

    response.render('services/tasks/pending', info);
});

router.get('/services/tasks/details/:id', is_auth, function (request, response) {
    let info = {
        UserInfo: request.session.message, me: '/services/tasks/pending', id: request.params.id, task: []
    }
    const one_task = app.get_one_task(request.params.id, request.session.message);
    const comment_tasks = app.get_comments_by_task(request.params.id, request.session.message);
    Promise.all([one_task, comment_tasks]).then(value => {
        value[0].data.data[0].comments = value[1].data.data
        info.task = value[0].data.data[0];
        response.render('services/tasks/by-id', info);
    }).catch(err => {
        response.render('system/error-500', {
            UserInfo: request.session.message, me: request.path, err: err
        });
    })
});
router.get('/services/tasks/by-user', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('services/tasks/by-user', info);
})

router.get('/services/tasks/complete', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    response.render('services/tasks/complete', info);
});

export default router;