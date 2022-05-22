"use strict";

import {getConnection, mssql} from "../middlewares/database";
import {JsonOut} from "../middlewares/JsonOut";
import {getCredentials} from "../middlewares/getCredentials";

export async function getAllTasksPending(req, res) {

    const {Username, Database, Password} = getCredentials(req);
    let Connection = null

    try {
        Connection = await getConnection(Username, Password, '45.5.118.219', `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query("SELECT * FROM servicios.vw_actividades_pendientes", (err, result) => {
            if (err) {
                res.status(500).send(JsonOut('500', 'Error in controller getAll', err));
            } else {
                res.status(200).send(JsonOut('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(JsonOut('500', 'Error in controller getAll [', e));
    }
}

export async function getOneTask(req, res) {

    const {Username, Password, Database} = getCredentials(req);
    let Connection = null

    try {
        Connection = await getConnection(Username, Password, '45.5.118.219', `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM servicios.vw_actividades_by_id
                    WHERE codactividad = ${req.params.id}`, (err, result) => {
            if (err) {
                res.status(500).send(JsonOut('500', 'Error in controller getOne', err));
            } else {
                res.status(200).send(JsonOut('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(JsonOut('500', 'Error in controller getOne ', e));
    }
}

export async function getAllComments(req, res) {

    const {Username, Password, Database} = getCredentials(req);
    let Connection = null
    try {
        Connection = await getConnection(Username, Password, '45.5.118.219', `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM actividad.vw_comentarios
                    WHERE codactividad = ${req.params.id}`, (err, result) => {
            if (err) {
                res.status(500).send(JsonOut('500', 'Error in controller getOne', err));
            } else {
                res.status(200).send(JsonOut('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        res.status(500).send(JsonOut('500', 'Error in controller getAllComments ', e));
    }
}

export async function addComment(req, res) {
    const {Username, Password, Database} = getCredentials(req);
    const {id} = req.params;
    const {strcomment} = req.body;
    let Connection = null
    try {
        Connection = await getConnection(Username, Password, '45.5.118.219', `PLR00${Database}`);
        const sp = await Connection.request()
        sp.input('codactividad', mssql.Int, id)
        sp.input('strcomment', mssql.VarChar(400), strcomment)
        sp.output('codmsj', mssql.Int)
        sp.output('strmsj', mssql.VarChar(400))
        sp.execute('actividad.sp_add_comment', function (err, result) {
            if (err) {
                console.log("in in err")
                res.status(500).send(JsonOut('500', 'Error in controller addComment', err));
            } else {
                console.log("else in err")
                res.status(200).send(JsonOut('200', `${result.output.codmsj} - ${result.output.strmsj}`, result.recordset));
            }
        });
    } catch (e) {
        const {message} = e

        res.status(500).send(JsonOut('500', 'Error general in controller addComment [' + message + ']', e));
    }
}

export async function updateTaskPending(req, res){
    const {Username, Password, Database} = getCredentials(req);
    const {id} = req.params;
    const {codestado} = req.body;
    let Connection = null
    try {
        Connection = await getConnection(Username, Password, '45.5.118.219', `PLR00${Database}`);

        const sp = await Connection.request()
        console.log('codestado: ' + codestado)
        sp.input('codactividad', mssql.Int, id)
        sp.input('codestado', mssql.VarChar(2), codestado)
        sp.output('codmsj', mssql.Int)
        sp.output('strmsj', mssql.VarChar(400))
        sp.execute('actividad.sp_update_task_pending', function (err, result) {
            if (err) {
                console.log("in in err")
                res.status(500).send(JsonOut('500', 'Error in controller updateTaskPending', err));
            } else {
                console.log("else in err")
                res.status(200).send(JsonOut('200', `${result.output.codmsj} - ${result.output.strmsj}`, result.recordset));
            }
        });
    } catch (e) {
        const {message} = e
        res.status(500).send(JsonOut('500', 'Error general in controller updateTaskPending [' + message + ']', e));
    }
}

export async function addImage(request, response) {
    const files = await request.files['file[]'];
    const {Username, Password, Database} = getCredentials(request);
    const {id} = request.params;

    console.log("request.files ", request.files)

    try{
        console.log("files: ", files)
        response.status(200).send(JsonOut('200', 'Run Ok', null));
    }catch (e) {
        response.status(500).send(JsonOut('500', 'Error in controller addImage', e));
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