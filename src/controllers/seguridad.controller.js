"use strict";

import {get_connection, mssql} from "../middlewares/database";
import {json_out} from "../middlewares/json-out";


export async function check_user_password(request, response) {
    const {username, password, database} = request.body

    let Connection = null

    try {

        Connection = await get_connection(username, password, '45.5.118.219',`PLR00${database}`)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const query = await Connection.request()

        query.execute('seguridad.sp_usuarios', function (err, rows) {
            if (!err){
                response.status(200).send(json_out('200', 'Login Succeded', rows.recordsets[0][0]))
            }else{
                response.status(500).send(json_out('500', 'Se produjo un error al ejecutar el procedimiento', err))
            }
        })
    } catch (e) {
        response.status(e.code).send(json_out(e.code, e.message))
    }
}

export async function check_permission(request, response){
    const {Username, Database, Password} = get_credentials(request);
    let Connection = null
    try{
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`)
        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

        stmt.query(`SELECT * 
                    FROM seguridad.vwCheckAccess
                    WHERE IDENOMBRE like ''`, function (err, rows) {
            if (!err){
                response.status(200).send(json_out('200', 'Permisos', rows.recordset))
            }else{
                response.status(500).send(json_out('500', 'Se produjo un error al ejecutar el procedimiento', err))
            }
        })   
    }catch(e){
        response.status(e.code).send(json_out(e.code, e.message))
    }
}