"use strict";

import {getConnection, mssql} from "../middlewares/database";
import {JsonOut} from "../middlewares/JsonOut";


export async function checkUserAndPassword(request, response) {
    const {username, password, database} = request.body

    let Connection = null

    try {

        Connection = await getConnection(username, password, '45.5.118.219',`PLR00${database}`)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const query = await Connection.request()

        query.execute('seguridad.sp_usuarios', function (err, rows) {
            if (!err){
                response.status(200).send(JsonOut('200', 'Login Succeded', rows.recordsets[0][0]))
            }else{
                response.status(500).send(JsonOut('500', 'Se produjo un error al ejecutar el procedimiento', err))
            }
        })
    } catch (e) {
        response.status(e.code).send(JsonOut(e.code, e.message))
    }
}