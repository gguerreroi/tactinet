const passport = require('passport');
const Strategy = require('passport-local').Strategy;

import {getConnection} from "./database";


passport.use('local', new Strategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function (request, username, password, done) {
        const {database} = request.body;
        let Connection = null
        try {

            Connection = await getConnection(username, password, '45.5.118.219', `PLR00${database}`)

            if (Connection.code === 500)
                throw {code: Connection.code, message: Connection.message}

            const query = await Connection.request()

            query.execute('seguridad.sp_usuarios', function (err, rows) {
                if (!err) {
                    console.log("todo funciono aqui")
                    return done(null, rows.recordsets[0][0])
                } else {
                    console.log("fallo de contraseña")
                    return done(null, false, err)
                }
            })
        } catch (e) {
            console.log("fallo  generala")
            return done(e)
        }
    }));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        console.log("serializeUser", user)
        cb(null, user)
    })
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user)
    })
})

