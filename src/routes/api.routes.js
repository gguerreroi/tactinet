import {Router} from "express";

const passport = require('passport');

import {json_out} from "../middlewares/json-out";
import {is_auth_api} from "../middlewares/is-auth";
import * as apic from "../controllers/api.controllers";

const r = Router();

r.get('/', function (request, response) {
    response.render('api/index');
})

r.post('/auth',
    function (request, response, next) {
        request.session.message = {};
        passport.authenticate('api-local', {
            successRedirect: '/api/success',
            failureRedirect: '/api/failure'
        })(request, response, next);
    }
)

r.get('/failure',
    function (request, response) {
        let mess = "Usuario o contraseña invalida"

        if (request.session.message !== undefined)
            mess = request.session.message.data.message;

        response.status(401).send(json_out(401, mess))
    });

r.get('/success',
    function (request, response) {
        response.status(200).send(json_out(200, 'Login Success', request.session.message))
    });

r.get('/logout',
    function (request, response) {
        request.session.destroy(function (err) {
            request.logout();
            response.redirect('/auth');
        });
    })

r.get('/tasks/pending', is_auth_api, apic.get_task_pending)

r.get('/tasks/details/:id', is_auth_api, apic.get_task_by_id)

r.put('/tasks/details/:id', is_auth_api, apic.update_task_by_id)

r.get('/tasks/details/:id/comments', is_auth_api, apic.get_comments_by_task)

r.post('/tasks/details/:id/comments', is_auth_api, apic.add_comment_to_task)

r.post('/tasks/pending/:id/images', is_auth_api, apic.add_image_to_task)

export default r;