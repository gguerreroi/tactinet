const authenticator = require('passport');
const strategy = require('passport-local').Strategy;
import config from "../config/config";
import axios from "axios";

import {get_connection} from "./database";


authenticator.use('api-local', new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async function (request, username, password, done) {
    const {database} = request.body;
    let Connection = null
    let permisos = [];
    try {
        Connection = await get_connection(username, password, `${config.DB.HOST}`, `PLR00${database}`)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const query = await Connection.request()

        await query.execute('seguridad.sp_usuarios', function (err, rows) {
            if (!err) {

                permisos = JSON.parse(rows.recordsets[0][0]['PermisosWeb']).map(function (item) {
                    return item.IDENOMBRE
                })

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
                console.log('api-local user', user)
                return done(null, user, user)
            }

            const a = {
                state: {
                    Code: 401,
                    Message: 'Failed with run stored procedure'
                },
                data: err
            }
            request.session.message = a;
            console.log('api-local a 1', a)
            return done(null, null, a)
        })
    } catch (e) {
        const a = {
            state: {
                Code: 401,
                Message: e.message
            },
            data: e
        }
        request.session.message = a;
        console.log('api-local a 2', a)
        return done(null, null, a)
    }
}));

authenticator.serializeUser(function (user, done) {
    return done(null, user)
});

authenticator.deserializeUser(function (user, done) {
    return done(null, user)
})

authenticator.use('local', new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async function (request, username, password, done) {
    const {database} = request.body;
    let permisos = [];
    try {
        let Connection = await get_connection(username, password, `${config.DB.HOST}`, `PLR00${database}`)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const query = await Connection.request()

        await axios.post('http://localhost:3000/api/auth', {
            username: username,
            password: password,
            database: database
        }).then(res => {
            // console.log(res.data) return data null
            query.execute('seguridad.sp_usuarios', function (err, rows) {
                if (!err) {
                    permisos = JSON.parse(rows.recordsets[0][0]['PermisosWeb']).map(function (item) {
                        return item.IDENOMBRE
                    });

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
                    console.log('local user', user)
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
                    console.log('local a 1', a)
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
            console.log('local a 2', a)
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
        console.log('local a 3', a)
        return done(null, null, a)
    }
}));