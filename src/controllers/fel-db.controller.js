"use strict"

import {get_connection, mssql} from "../middlewares/database";

export async function set_db_dte(
    Username,
    Password,
    Database
){
    let Connection = null;
    try{
        Connection = await get_connection(Username, Password, '45.5.118.219', `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

    }catch (e) {
        return e;
    }
}