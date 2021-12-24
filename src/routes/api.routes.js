import {Router} from "express";

const passport = require('passport');


import {JsonOut} from "../middlewares/JsonOut";

const r = Router();

r.post('/auth',

    (request, response, next) => {

        passport.authenticate('local', {
            successRedirect: '/api/success',
            failureRedirect: '/api/failure'
        })(request, response, next);
    }
)

r.get('/failure',
    function (request, response) {
        console.log("Session", request.session.message)
        console.log("request: ", request.session)
        response.status(401).send(JsonOut(401, 'Usuario o contraseña invalida'))

    });

r.get('/success', (request, response, next) => {
    console.log(request.session.message)
    response.status(200).send(JsonOut(200, 'All Ok, US Logged'))
});

export default r;