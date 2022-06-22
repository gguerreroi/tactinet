"use strict";

import {get_connection, mssql} from "../middlewares/database";
import {json_out} from "../middlewares/json-out";
import {get_credentials} from "../middlewares/get-credentials";

export async function get_task_pending(req, res) {

    const {Username, Database, Password} = get_credentials(req);
    let Connection = null

    try {
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);

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
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT * 
                    FROM servicios.vw_actividades_completadas order by _FCHFINALIZADO desc`, (err, result) => {
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
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);

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
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);

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
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);

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
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);
        const sp = await Connection.request()
        sp.input('codactividad', mssql.Int, id)
        sp.input('strcomment', mssql.VarChar(400), strcomment)
        sp.output('codmsj', mssql.Int)
        sp.output('strmsj', mssql.VarChar(400))
        sp.execute('actividad.sp_add_comment', function (err, result) {
            if (err) {
                console.log("in in err")
                res.status(500).send(json_out('500', 'Error in controller addComment', err));
            } else {
                console.log("else in err")
                res.status(200).send(json_out('200', `${result.output.codmsj} - ${result.output.strmsj}`, result.recordset));
            }
        });
    } catch (e) {
        const {message} = e

        res.status(500).send(json_out('500', 'Error general in controller addComment [' + message + ']', e));
    }
}

export async function update_task_by_id(req, res){
    const {Username, Password, Database} = get_credentials(req);
    const {id} = req.params;
    const {codestado, fecha_reprogram} = req.body;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);

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

    console.log("request.files ", request.files)

    try{
        console.log("files: ", files)
        response.status(200).send(json_out('200', 'Run Ok', null));
    }catch (e) {
        response.status(500).send(json_out('500', 'Error in controller addImage', e));
    }


    // let Connection = null
    // try {
    //
    //
    //     Connection = await getConnection(Username, Password, '45.5.118.219', `PLR00${Database}`);
    //     const sp = await Connection.request()
    //     sp.input('codactividad', mssql.Int, id)
    //     sp.input('strcomment', mssql.VarChar(400), strcomment)
    //     sp.output('codmsj', mssql.Int)
    //     sp.output('strmsj', mssql.VarChar(400))
    //     sp.execute('actividad.sp_add_comment', function(err, result) {
    //         if (err) {
    //             console.log("in in err")
    //             res.status(500).send(JsonOut('500', 'Error in controller addComment', err));
    //         }else{
    //             console.log("else in err")
    //             res.status(200).send(JsonOut('200', `${result.output.codmsj} - ${result.output.strmsj}`, result.recordset));
    //         }
    //     });
    // }catch (e) {
    //     const {message} = e
    //
    //     res.status(500).send(JsonOut('500', 'Error general in controller addComment [' + message + ']', e));
    // }
}

