import {Router} from "express";

const passport = require('passport');

import {JsonOut} from "../middlewares/JsonOut";
import {isAuthApi} from "../middlewares/isAuth";
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

        response.status(401).send(JsonOut(401, mess))
    });

r.get('/success',
    function (request, response) {
        response.status(200).send(JsonOut(200, 'Login Success', request.session.message))
    });

r.get('/logout',
    function (request, response) {
        request.session.destroy(function (err) {
            request.logout();
            response.redirect('/auth');
        });
    })

r.get('/tasks/pending',
    isAuthApi,
    apic.getAllTasksPending
)

r.get('/tasks/details/:id',
    isAuthApi,
    apic.getOneTask
)

r.put('/tasks/details/:id',
    isAuthApi,
    apic.updateTaskPending)

r.get('/tasks/details/:id/comments',
    isAuthApi,
    apic.getAllComments
)

r.post('/tasks/details/:id/comments',
    isAuthApi,
    apic.addComment
)

r.post('/tasks/pending/:id/images',
    isAuthApi,
    apic.addImage
)

export default r;