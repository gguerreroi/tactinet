const LocalPassport = require('passport');
const passportLocal = require('passport-local').Strategy;


import {getConnection} from "./database";


LocalPassport.use('local', new passportLocal({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async function (request, username, password, done) {
    const {database} = request.body;
    let Connection = null
    try {
        Connection = await getConnection(username, password, '45.5.118.219', `PLR00${database}`)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const query = await Connection.request()

        query.execute('seguridad.sp_usuarios', function (err, rows) {
            if (!err) {
                const user = {
                    state: {
                        Code: 200,
                        Message: 'Login Success'
                    },
                    data: rows.recordsets[0][0]
                }
                request.session.message = user;
                return done(null, user, request.flash('message', user))
            } else {
                const a = {
                    state: {
                        Code: 401,
                        Message: 'Login Failed'
                    },
                    data: err
                }
                request.session.message = a;
                return done(null, null, request.flash('message', a))
            }
        })
    } catch (e) {
        const a = {
            state: {
                Code: 401,
                Message: 'Login Failed'
            },
            data: e
        }
        request.session.message = a;
        return done(null, null, request.flash('message', a))
    }
}));

LocalPassport.serializeUser(function (user, cb) {
    // process.nextTick(function () {
    console.log("serializeUser", user)
    cb(null, user)
    //})
});

LocalPassport.deserializeUser(function (user, cb) {
    //process.nextTick(function () {
    cb(null, user)
    //})
})

