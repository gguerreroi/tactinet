import {Router} from "express";

import passport from "passport";

const router = Router();

router.post('/auth',

    function (request, response, next) {

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureMessage: true
        })(request, response, next)
    }
)

export default router;