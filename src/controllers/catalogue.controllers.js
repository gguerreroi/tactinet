"use strict";

import {get_connection, mssql} from "../middlewares/database";
import {get_credentials} from "../middlewares/get-credentials";
import {json_out} from "../middlewares/json-out";
import config from "../config/config";


export async function get_catalogue(req, res) {
    const {Username, Database, Password} = get_credentials(req);
    const {view, cod, str} = req.params;
    const {term, _type, q} = req.query;
    const {colname, colvalue} = req.body;
    let whr = '';

    if (term !== undefined && term !== '')
        whr = `(cast(${cod} as varchar) + ${str}) like '%${term}%'`

    if (colname !== undefined && colname !== '')
        if (colvalue !== undefined && colvalue !== '')
            whr += ` and ${colname} like '%${colvalue}%'`

    if (whr.length > 3)
        whr = 'WHERE ' + whr

    console.log('body: ', req.body, 'whr', whr, 'query: ', req.query, 'params: ', req.params);

    let Connection = null
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        let sql = `SELECT ${cod} as id, cast(${cod} as varchar) + ' ' + ${str} as text
                   FROM ${view} ${whr}`;

        stmt.query(sql, (err, result) => {
            if (err) {
                res.status(500).send(json_out('500', 'Error in query get_catalogue', err));
            } else {
                res.status(200).send({results: result.recordset});
            }
        });
    } catch (e) {
        res.status(500).send(json_out('500', 'Error in controller get_catalogue', e));
    }
}