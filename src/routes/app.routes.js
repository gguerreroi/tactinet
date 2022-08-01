import {Router} from "express";
import {is_auth, is_auth_login} from "../middlewares/is-auth";
import * as app from "../controllers/app.controllers"
import {json_out} from "../middlewares/json-out";

const passport = require('passport');
const router = Router();

router.get('/auth', is_auth_login, function (request, response) {
    response.render('auth');
});

router.post('/auth', (request, response, next) => {
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    })(request, response, next);
});

router.get('/failure', function (request, response) {

    const mess = (request.session.message !== undefined) ? request.session.message.data.message : "Usuario o contraseña invalida"

    response.status(401).json(json_out(401, mess))
});

router.get('/success', function (request, response) {
    response.status(200).json(json_out(200, 'Login Success', request.session.message))
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
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)){
        return response.render('customers/maintenance/customer', info);
    }else{
        return response.render('system/error-403')
    }
});

router.get('/customers/maintenance/customer/:id', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)){
        return response.render('customers/maintenance/by-id', info);
    }else{
        return response.render('system/error-403')
    }
});

/**
 * @api {get} /services/tasks/pending Get pending tasks
 **/

router.get('/services/tasks/pending', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)){
        return response.render('services/tasks/pending', info);
    }else{
        return response.render('system/error-403')
    }
});

router.get('/services/tasks/details/:id', is_auth, function (request, response) {
    let info = {
        UserInfo: request.session.message, me: '/services/tasks/pending', id: request.params.id, task: []
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        const one_task = app.get_one_task(request.params.id, request.session.message);
        const comment_tasks = app.get_comments_by_task(request.params.id, request.session.message);
        Promise.all([one_task, comment_tasks]).then(value => {
            value[0].data.data[0].comments = value[1].data.data
            info.task = value[0].data.data[0];
            return response.render('services/tasks/by-id', info);
        }).catch(err => {
            return response.render('system/error-500', {
                UserInfo: request.session.message, me: request.path, err: err
            });
        })
    }else{
        return response.render('system/error-403')
    }
    
});

router.get('/services/tasks/by-user', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('services/tasks/by-user', info);
    }else{
        return response.render('system/error-403')
    }
})

router.get('/services/tasks/complete', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('services/tasks/complete', info);
    }else{
        return response.render('system/error-403')
    }

});

router.get('/services/tasks/archive', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('services/tasks/archive', info);
    }else{
        return response.render('system/error-403')
    }
});

router.get('/cash/operations/day', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;

    if (Permisos.includes(info.me)) {
        return response.render('cash/operations/day', info);
    }else{
        return response.render('system/error-403')
    }
});

router.get('/cash/operations/documents/:id', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.message, me: '/cash/operations/day', Serial: request.params.id
    }
    const {Permisos} = request.session.passport.user.data;
    const doc_head = app.get_one_document(info.UserInfo, info.Serial);
    const doc_detail = app.get_one_detail_document(info.UserInfo, info.Serial);
    if (Permisos.includes(info.me)) {
        Promise.all([doc_head, doc_detail]).then(value => {
            info.document = value[0].data.data[0];
            info.document.detail = value[1].data.data;
           
           
            return response.render('cash/operations/document', info);
        }
        ).catch(err => {
            return response.render('system/error-500', {
                UserInfo: request.session.message, me: request.path, err: err
            });
        })
    } else {
        return response.render('system/error-403')
    }

});


export default router;