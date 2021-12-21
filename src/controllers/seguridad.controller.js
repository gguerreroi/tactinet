"use strict";

import {getConnection, mssql} from "../middlewares/database";
import {JsonOut} from "../middlewares/JsonOut";


export async function checkUserAndPassword(user, password, db) {
    let Connection = null
    try {
        Connection = await getConnection(user, password, '45.5.118.219', db)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const query = await Connection.request()

        query.execute('seguridad.sp_usuarios', function (err, rows) {
            if (!err)
                return JsonOut('200', 'Login Succeded', rows.recordsets[0][0])

            return JsonOut('500', 'Se produjo un error al ejecutar el procedimiento', err)
        })
    } catch (e) {
        return JsonOut(e.code, e.message)
    }
}