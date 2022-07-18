const authenticator = require('passport');
const strategy = require('passport-local').Strategy;

import axios from "axios";

import {get_connection} from "./database";


authenticator.use('api-local', new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async function (request, username, password, done) {
    const {database} = request.body;
    let Connection = null
    try {
        Connection = await get_connection(username, password, '45.5.118.219', `PLR00${database}`)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const query = await Connection.request()
        const query_permisos = await Connection.request();

        let permisos=[];

        await query_permisos.query("SELECT IDENOMBRE FROM seguridad.vwCheckAccess WHERE IDENOMBRE LIKE '%/%'", function (err, rows) {
            if (!err)
                permisos = rows.recordsets[0].map(function (item) {
                    return item.IDENOMBRE
                })

        })

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
                        Password: password,
                        Permisos: permisos
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

authenticator.serializeUser(function (user, done) {
    done(null, user)
});

authenticator.deserializeUser(function (user, done) {
    done(null, user)
})

authenticator.use('local', new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async function (request, username, password, done) {
    const {database} = request.body;
    let Connection = await get_connection(username, password, '45.5.118.219', `PLR00${database}`)
    const query = await Connection.request()
    const query_permisos = await Connection.request();
    let permisos = [];
    try {
        await query_permisos.query("SELECT IDENOMBRE FROM seguridad.vwCheckAccess WHERE IDENOMBRE LIKE '%/%'", function (err, rows) {
            if (!err)
                permisos = rows.recordsets[0].map(function (item) {
                    return item.IDENOMBRE
                })
        })

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
                            Password: password,
                            Permisos: permisos
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