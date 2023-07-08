import {Router} from "express";
import {is_auth, is_auth_login} from "../middlewares/is-auth";
import * as app from "../controllers/app.controllers"
import * as fel from "../controllers/fel.controller"
import * as feldb from "../controllers/fel-db.controller";

import {json_out} from "../middlewares/json-out";

const passport = require('passport');
const router = Router();

router.get('/auth', is_auth_login, function (request, response) {
    response.render('auth');
});

router.post('/auth', (request, response, next) => {
    passport.authenticate('local', {
        successRedirect: '/success', failureRedirect: '/failure'
    })(request, response, next);
});

router.get('/failure', function (request, response) {

    const mess = (request.session.passport.user !== undefined) ? request.session.passport.user.data.message : "Usuario o contraseña invalida"

    response.status(401).json(json_out(401, mess))
});

router.get('/success', function (request, response) {
    response.status(200).json(json_out(200, 'Login Success', request.session.passport.user))
});

router.get('/logout', function (request, response) {
    app.set_destroy_session(request, response)
});

router.get('/', is_auth, function (request, response) {
    var ip = request.header('x-forwarded-for') || request.connection.remoteAddress;

    const info = {
        UserInfo: request.session.passport.user, me: request.path, ip: ip
    }

    response.render('index', info);
});

router.get('/customers/maintenance/customer', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('customers/maintenance/customer', info);
    } else {
        return response.render('system/error-403')
    }
});

router.get('/customers/maintenance/customer/details/:id', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user,
        me: '/customers/maintenance/customer',
        id: request.params.id, customer: []
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        const customer = app.get_one_customers(request.params.id, info.UserInfo)
        Promise.all([customer]).then(val => {
            info.customer = val[0].data.data[0];
            return response.render('customers/maintenance/by-id', info);
        }).catch(err => {
            return response.render('system/error-500', {
                UserInfo: request.session.passport.user, me: request.path, err: err
            });
        })

    } else {
        return response.render('system/error-403')
    }
});

/**
 * @api {get} /services/tasks/pending Get pending tasks
 **/

router.get('/services/tasks/pending', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('services/tasks/pending', info);
    } else {
        return response.render('system/error-403')
    }
});

router.get('/services/tasks/details/:id', is_auth, function (request, response) {
    let info = {
        UserInfo: request.session.passport.user,
        me: '/services/tasks/pending',
        id: request.params.id, task: []
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        const one_task = app.get_one_task(request.params.id, info.UserInfo);
        const comment_tasks = app.get_comments_by_task(request.params.id, info.UserInfo);

        Promise.all([one_task, comment_tasks]).then(value => {

            value[0].data.data[0].comments = value[1].data.data
            info.task = value[0].data.data[0];
            return response.render('services/tasks/by-id', info);
        }).catch(err => {
            return response.render('system/error-500', {
                UserInfo: request.session.passport.user, me: request.path, err: err
            });
        })
    } else {
        return response.render('system/error-403')
    }

});

router.get('/services/tasks/by-user', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('services/tasks/by-user', info);
    } else {
        return response.render('system/error-403')
    }
})

router.get('/services/tasks/complete', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('services/tasks/complete', info);
    } else {
        return response.render('system/error-403')
    }

});

router.get('/services/tasks/archive', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;
    if (Permisos.includes(info.me)) {
        return response.render('services/tasks/archive', info);
    } else {
        return response.render('system/error-403')
    }
});

router.get('/cash/operations/day', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user, me: request.path
    }
    const {Permisos} = request.session.passport.user.data;

    if (Permisos.includes(info.me)) {
        return response.render('cash/operations/day', info);
    } else {
        return response.render('system/error-403')
    }
});

router.get('/cash/operations/documents/:id', is_auth, function (request, response) {
    const info = {
        UserInfo: request.session.passport.user, me: '/cash/operations/day', Serial: request.params.id
    }
    const {Permisos} = request.session.passport.user.data;
    const doc_head = app.get_one_document(info.UserInfo, info.Serial);
    const doc_detail = app.get_one_detail_document(info.UserInfo, info.Serial);

    if (!Permisos.includes(info.me)) return response.render('system/error-403')

    Promise.all([doc_head, doc_detail]).then(value => {
        info.document = value[0].data.data[0];
        info.document.detail = value[1].data.data;
        return response.render('cash/operations/document', info);
    }).catch(err => {
        return response.render('system/error-500', {
            UserInfo: request.session.passport.user, me: request.path, err: err
        });
    })

});

router.delete('/cash/operations/documents', is_auth, function (request, response) {
    const {
        strmotivoanulacion,
        EMISORNOMBRECOMERCIAL,
        EMISORNOMBRE,
        EMISORNIT,
        EMISORDIRECCION,
        coddocumento,
        CODCLIENTE,
        CODSERVICIO,
        EMAIL,
        STRNIT,
        STRNOMBRESER,
        STRDIRSERVICIO,
        CODPOSTAL,
        FechaHoraEmision,
        STRMUN,
        STRDEP,
        codserial,
        _estado,
        _uuid,
        _serie,
        _numero,
        codoperador,
        stragencia,
        TOTCANTIDAD,
        TOTGRAVABLE,
        TOTIMPUESTO
    } = request.body;

    const info = {
        UserInfo: request.session.passport.user, me: '/cash/operations/day'
    }

    const date = new Date();

    const dte_auth = app.get_auth_dte(info.UserInfo, EMISORNIT)
    const {Username, Password, Database} = info.UserInfo.data

    if (coddocumento == '9') {


        const fecha_anulacion = date.toISOString().split('T')[0];
        const xml_anula = app.get_xml_anula(_uuid, EMISORNIT, STRNIT, FechaHoraEmision, fecha_anulacion, strmotivoanulacion);

        dte_auth.then(dte_auth_val => {
            const {PREFIJO, LLAVEWS, TOKENSIGNER, EMISORNIT, EMISORCORREO} = dte_auth_val.data.data[0];
            fel.post_dte_signed(TOKENSIGNER, codserial, PREFIJO, "S", btoa(xml_anula)).then(dte_sig => {
                const {resultado, descripcion, archivo} = dte_sig.data;


                if (resultado) {
                    feldb.save_xmls_tocancel(Username, Password, Database, codserial, archivo);
                    fel.post_dte_cancels(EMISORNIT, EMISORCORREO, archivo, LLAVEWS, codserial, PREFIJO).then(post_dte => {
                        const {
                            resultado, descripcion, xml_certificado, uuid, serie, numero, fecha
                        } = post_dte.data;

                        if (resultado) {
                            feldb.save_xml_dte(Username, Password, Database, codserial, numero, serie, uuid, xml_certificado, fecha)
                            feldb.sp_reversa(Username, Password, Database, codserial, strmotivoanulacion)
                            return response.json(post_dte.data)
                        }

                        return response.status(200).json({resultado: false, descripcion: descripcion})
                    }).catch(err => {

                        return response.status(200).json(err)
                    })
                }else {
                    return response.status(200).json({resultado: resultado, descripcion: descripcion});
                }


            }).catch(err => {

                return response.status(200).json({err})
            })
        }).catch(err => {

            return response.status(200).json({err});
        })

    }else{
        feldb.sp_reversa(Username, Password, Database, codserial, strmotivoanulacion)
        return response.status(200).json({resultado: true, descripcion: 'Documento anulado con éxito'})
    }
})

export default router;