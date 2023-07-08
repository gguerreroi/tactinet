"use strict";

import {get_connection, mssql} from "../middlewares/database";
import {json_out} from "../middlewares/json-out";
import {get_credentials} from "../middlewares/get-credentials";
import config from "../config/config";

export async function get_task_archive(req, res) {
    const {Username, Database, Password} = get_credentials(req);
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM servicios.vw_actividades_archivadas`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller getAll', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller getAll [', e));
    }
}

export async function get_task_pending(req, res) {

    const {Username, Database, Password} = get_credentials(req);
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM servicios.vw_actividades_pendientes`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller getAll', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller getAll [', e));
    }
}

export async function get_task_complete(req, res) {

    const {Username, Database, Password} = get_credentials(req);
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM servicios.vw_actividades_completadas
                    order by _FCHFINALIZADO desc`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller getAll', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller getAll [', e));
    }
}

export async function get_task_pending_by_user(req, res) {

    const {Username, Database, Password} = get_credentials(req);
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM servicios.vw_actividades_pendientes_by_user
                    order by CODCLASIFICACION`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller getAll', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller getAll [', e));
    }
}

export async function get_task_by_id(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM servicios.vw_actividades_by_id
                    WHERE codactividad = ${req.params.id}`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller getOne', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller getOne ', e));
    }
}

export async function get_comments_by_task(req, res) {

    const {Username, Password, Database} = get_credentials(req);
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM actividad.vw_comentarios
                    WHERE codactividad = ${req.params.id}`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller getOne', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller getAllComments ', e));
    }
}

export async function add_comment_to_task(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {id} = req.params;
    const {strcomment} = req.body;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);
        const sp = await Connection.request()
        sp.input('codactividad', mssql.Int, id)
        sp.input('strcomment', mssql.VarChar(400), strcomment)
        sp.output('codmsj', mssql.Int)
        sp.output('strmsj', mssql.VarChar(400))
        sp.execute('actividad.sp_add_comment', function (err, result) {
            if (err) {

                res.status(500).send(json_out('500', 'Error in controller addComment', err));
            } else {

                res.status(200).send(json_out('200', `${result.output.codmsj} - ${result.output.strmsj}`, result.recordset));
            }
        });
    } catch (e) {
        const {message} = e

        res.status(500).send(json_out('500', 'Error general in controller addComment [' + message + ']', e));
    }
}

export async function update_task_by_id(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {id} = req.params;
    const {codestado, fecha_reprogram} = req.body;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        const sp = await Connection.request()

        sp.input('codactividad', mssql.Int, id)
        sp.input('codestado', mssql.VarChar(2), codestado)

        if (fecha_reprogram !== undefined)
            sp.input('fchreprogram', mssql.VarChar(10), fecha_reprogram)

        sp.output('codmsj', mssql.Int)
        sp.output('strmsj', mssql.VarChar(400))
        sp.execute('servicios.sp_update_task', function (err, result) {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller updateTaskPending', err));
            } else {
                res.status(200).send(json_out('200', `${result.output.codmsj} - ${result.output.strmsj}`, result.recordset));
            }
        });
    } catch (e) {
        const {message} = e
        res.status(500).send(json_out('500', 'Error general in controller updateTaskPending [' + message + ']', e));
    }
}

export async function add_image_to_task(request, response) {
    const files = await request.files['file[]'];
    const {Username, Password, Database} = get_credentials(request);
    const {id} = request.params;



    try {

        response.status(200).send(json_out('200', 'Run Ok', null));
    } catch (e) {
        response.status(500).send(json_out('500', 'Error in controller addImage', e));
    }


    // let Connection = null
    // try {
    //
    //
    //     Connection = await getConnection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);
    //     const sp = await Connection.request()
    //     sp.input('codactividad', mssql.Int, id)
    //     sp.input('strcomment', mssql.VarChar(400), strcomment)
    //     sp.output('codmsj', mssql.Int)
    //     sp.output('strmsj', mssql.VarChar(400))
    //     sp.execute('actividad.sp_add_comment', function(err, result) {
    //         if (err) {

    //             res.status(500).send(JsonOut('500', 'Error in controller addComment', err));
    //         }else{

    //             res.status(200).send(JsonOut('200', `${result.output.codmsj} - ${result.output.strmsj}`, result.recordset));
    //         }
    //     });
    // }catch (e) {
    //     const {message} = e
    //
    //     res.status(500).send(JsonOut('500', 'Error general in controller addComment [' + message + ']', e));
    // }
}

export async function get_cash_dairy_resume(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {dairy_date} = req.query;

    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        if (dairy_date === undefined)
            throw {code: 500, message: 'dairy_date is required'}


        const stmt = await Connection.request()
        stmt.query(`select tb.CODCARTERA 'codcartera', servicios.fn_strcartera(tb.CODCARTERA) 'strcartera', sum(tb.txsubtotal) 'dte_total', sum(tb.mntgravable) 'dte_mntgravable', sum(tb.mntimpuesto) 'dte_mntimpuesto', sum(tb.cdp_total) 'cdp_total', sum(tb.cdp_dte) 'cdp_dte'
                    from (select codcartera,
                                 IIF(coddocumento = 9, txsubtotal, 0) 'txsubtotal', IIF(coddocumento = 9, (mntgravable), 0) 'mntgravable', IIF(coddocumento = 9, (mntimpuesto), 0) 'mntimpuesto', IIF(coddocumento!=9, (txsubtotal), 0) 'cdp_total', txsubtotal 'cdp_dte'
                          from caja.vw_web_diario
                          where fchaplicacion = '${dairy_date}'
                            and codoperador = seguridad.fn_emplogin(ORIGINAL_LOGIN())) tb
                    group by tb.CODCARTERA`, (err, result) => {
            if (err) {
                res.status(500).send(json_out(500, 'Error in run query get_cash_dairy_resume', err));
            } else {
                res.status(200).send(json_out(200, 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out(e.code, e.message, null));
    }
}

export async function get_cash_dairy_details(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {dairy_date} = req.query;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        if (dairy_date === undefined)
            throw {code: 500, message: 'dairy_date is required'}

        const stmt = await Connection.request()
        stmt.query(`select *
                    from caja.vw_web_diario
                    where fchaplicacion like '${dairy_date}'
                      and codoperador = seguridad.fn_emplogin(ORIGINAL_LOGIN())`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', e));
    }
}

export async function get_document_by_id(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {id} = req.params;
    let Connection = null
    try {

        if (id === undefined)
            throw {code: 500, message: 'id is required'}

        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`select *
                    from servicios.vw_fel_encabezado
                    where codserial = ${id}`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', e));
    }
}

export async function get_document_details_by_id(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {id} = req.params;
    let Connection = null
    try {

        if (id === undefined)
            throw {code: 500, message: 'id is required'}

        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`select *
                    from servicios.vw_fel_detalle
                    where codserial = ${id}`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', e));
    }
}

export async function get_dte_by_id(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {id} = req.params;
    let Connection = null
    try {

        if (id === undefined)
            throw {code: 500, message: 'id is required'}

        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`select *
                    from financiero.dte
                    where emisornit = '${id}'`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', err));
            } else {

                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', e));
    }
}

export async function set_dte_info(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {id} = req.params;
    const {
        es_anulacion,
        response,
        numero,
        serie,
        uuid
    } = req.body;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);
        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request();
        stmt.input('codserial', mssql.VarChar(20), id);
        stmt.input('es_anulacion', mssql.Bit, es_anulacion);
        stmt.input('response', mssql.VarChar(max), response);
        stmt.input('numero', mssql.Int, numero);
        stmt.input('serie', mssql.VarChar(max), serie);
        stmt.input('uuid', mssql.VarChar(max), uuid);
        stmt.output('message', mssql.VarChar(max));
        stmt.execute('financiero.sp_dte', (err, result) => {
            if (err)
                throw err;

            return res.status(200).send(json_out('200', 'Run Ok', result.output.message));
        })
    } catch (e) {
        return res.status(500).send(json_out('500', 'Error in controller set_dte_info', e));
    }
}

export async function save_xml_cancel(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {
        codserial,
        xml_base_64
    } = req.body;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);
        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request();

        stmt.input('codserial', mssql.VarChar(20), codserial);
        stmt.input('xml_signed', mssql.VarChar(max), xml_base_64);
        stmt.output('codmsj', mssql.Int);
        stmt.output('strmsj', mssql.VarChar(max));
        stmt.execute('financiero.sp_xml_signed', (err, result) => {
            if (err)
                throw err;

            return res.status(200).send(json_out('200', 'Run Ok', result.output.message));
        });

    } catch (e) {
        return res.status(500).send(json_out('500', 'Error in controller save_xml_cancel', e));
    }
}

// export async function save_xml_cancel(req, res){
//     const {Username, Password, Database} = get_credentials(req);
//     const {
//         codserial,
//         xml_base_64
//     } = req.body;
//     let Connection = null
//     try{
//         Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);
//         if (Connection.code === 500)
//             throw {code: Connection.code, message: Connection.message}
//
//         const stmt = await Connection.request();
//
//         stmt.input('codserial', mssql.VarChar(20), codserial);
//         stmt.input('xml_signed', mssql.VarChar(max), xml_base_64);
//         stmt.output('codmsj', mssql.Int);
//         stmt.output('strmsj', mssql.VarChar(max));
//         stmt.execute('financiero.sp_xml_signed', (err, result)=>{
//             if (err)
//                 throw err;
//
//             return res.status(200).send(json_out('200', 'Run Ok', result.output.message));
//         });
//
//     }catch (e) {
//         return res.status(500).send(json_out('500', 'Error in controller save_xml_cancel', e));
//     }
// }


export async function get_customers_by_plan(req, res) {
    const {Username, Password, Database} = get_credentials(req);
    const {view} = req.params;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`select *
                    from dashboard.${view}`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller get_cash_dairy_resume', err));
            } else {
                res.status(200).send(result.recordset);
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller get_customers_by_plan', e));
    }
}

export async function get_customers(req, res) {

    const {Username, Database, Password} = get_credentials(req);
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`select cc.CODCLIENTE,
                           clientes.fn_strnombrecompleto(cc.P_NOMBRE, cc.S_NOMBRE, cc.T_NOMBRE, cc.P_APELLIDO,
                                                         cc.S_APELLIDO,
                                                         cc.T_APELLIDO) 'STRNOMBRECOMPLETO', 
                                                         cc.DIRECCION_RESIDENCIA,
                           cc.TELEFONO,
                           cc.MOVIL,
                           cc.NIT,
                           cc.CUI
                    from clientes.core cc`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in query getAll customer', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error general in controller getAll customer ', e));
    }
}

export async function get_customers_by_id(req, res) {
    const {Username, Database, Password} = get_credentials(req);
    const {id} = req.params;
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`select * from clientes.core cc where codcliente = ${id}`, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in query getAll customer', err));
            } else {
                res.status(200).send(json_out('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error general in controller getAll customer ', e));
    }
}