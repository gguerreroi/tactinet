"use strict";

import {getConnection, mssql} from "../middlewares/database";
import {JsonOut} from "../middlewares/JsonOut";

export async function getAllTasksPending(req, res) {

    const {Username, Database, Password} = req.session.message.data
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
        console.log(e)
    }
}

export async function getOneTaskPending(req, res) {
    console.log("getOneTaskPending var", req.session)
    const {Username, Database, Password} = req.session.message.data
    let Connection = null

    try {
        Connection = await getConnection(Username, Password, '45.5.118.219', `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()
        stmt.query(`SELECT *
                    FROM servicios.vw_actividades_pendientes
                    WHERE codactividad = ${req.params.id}`, (err, result) => {
            if (err) {
                res.status(500).send(JsonOut('500', 'Error in controller getOne', err));
            } else {
                res.status(200).send(JsonOut('200', 'Run Ok', result.recordset));
            }
        });
    } catch (e) {
        console.log(e)
    }
}