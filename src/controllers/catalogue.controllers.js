"use strict";

import {get_connection, mssql} from "../middlewares/database";
import {get_credentials} from "../middlewares/get-credentials";
import {json_out} from "../middlewares/json-out";
import config from "../config/config";


export async function get_catalogue(req, res) {
    const {Username, Database, Password} = get_credentials(req);
    const {view, cod, str} = req.params;
    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        let sql = `SELECT ${cod} as id, ${str} as text
                   FROM ${view}`;

        stmt.query(sql, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in controller getAll', err));
            } else {
                res.status(200).send({results: result.recordset});
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller getAll [', e));
    }
}