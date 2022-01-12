import {Router} from "express";

const passport = require('passport');

import {JsonOut} from "../middlewares/JsonOut";
import * as apic   from "../controllers/api.controllers";
const r = Router();

r.post('/auth',

    (request, response, next) => {

        request.session.message = {};

        passport.authenticate('local', {
            successRedirect: '/api/success',
            failureRedirect: '/api/failure'
        })(request, response, next);
    }
)

r.get('/failure',
    function (request, response) {
        let mess = "Usuario o contraseña invalida"

       if (request.session.message !== undefined )
           mess = request.session.message.data.message;

        response.status(401).send(JsonOut(401, mess))
    });

r.get('/success', (request, response) => {
    
    response.status(200).send(JsonOut(200, 'Login Success', request.session.message))
});

r.get('/logout', 
function(request, response) {
    request.session.destroy();
    request.logOut();
    response.redirect('/auth');
})

r.get('/tasks/pending', (request, response) => {
    apic.getAllTasksPending(request, response);
})

export default r;