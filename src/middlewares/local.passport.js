const LocalPassport = require('passport');
const passportLocal = require('passport-local').Strategy;

import axios from "axios";

import {getConnection} from "./database";


LocalPassport.use('api-local', new passportLocal({
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
                    data: {
                        CodEmpleado: rows.recordsets[0][0].CODEMPLEADO,
                        Avatar: rows.recordsets[0][0].avatar,
                        NombreCompleto: rows.recordsets[0][0].NombreCompleto,
                        Username: rows.recordsets[0][0].username,
                        CodEstado: rows.recordsets[0][0].CODESTADO,
                        Database: rows.recordsets[0][0].Database,
                        Password: password
                    }
                }
                request.session.message = user;

                return done(null, user, user)
            } else {
                const a = {
                    state: {
                        Code: 401,
                        Message: 'Login Failed'
                    },
                    data: err
                }
                request.session.message = a;
                return done(null, null, a)
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
        return done(null, null, a)
    }
}));

LocalPassport.serializeUser(function (user, done) {
    done(null, user)
});

LocalPassport.deserializeUser(function (user, done) {
    done(null, user)
})

LocalPassport.use('local', new passportLocal({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async function (request, username, password, done) {
    const {database} = request.body;
    let Connection = await getConnection(username, password, '45.5.118.219', `PLR00${database}`)
    const query = await Connection.request()

    try {
        axios.post('http://localhost:3000/api/auth', {
            username: username,
            password: password,
            database: database
        }).then(res => {
            query.execute('seguridad.sp_usuarios', function (err, rows) {
                if (!err) {
                    const user = {
                        state: {
                            Code: 200,
                            Message: 'Login Success'
                        },
                        data: {
                            CodEmpleado: rows.recordsets[0][0].CODEMPLEADO,
                            Avatar: rows.recordsets[0][0].avatar,
                            NombreCompleto: rows.recordsets[0][0].NombreCompleto,
                            Username: rows.recordsets[0][0].username,
                            CodEstado: rows.recordsets[0][0].CODESTADO,
                            Database: rows.recordsets[0][0].Database,
                            Password: password
                        }
                    }
                    request.session.message = user;

                    return done(null, user, user)
                } else {
                    const a = {
                        state: {
                            Code: 401,
                            Message: 'Login Failed'
                        },
                        data: err
                    }
                    request.session.message = a;
                    return done(null, null, a)
                }
            })

        }).catch(err => {
            console.log("passport catch", err)
            const a = {
                state: {
                    Code: 401,
                    Message: 'Login Failed'
                },
                data: err
            }
            request.session.message = a;
            return done(null, null, a)
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
        return done(null, null, a)
    }
}));