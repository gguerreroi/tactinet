"use strict"

import {get_connection, mssql} from "../middlewares/database";

export async function set_db_dte(
    Username,
    Password,
    Database
){
    let Connection = null;
    try{
        Connection = await get_connection(Username, Password, '10.60.110.2', `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const stmt = await Connection.request()

    }catch (e) {
        return e;
    }
}

export async function save_xmls_tocancel(Username, Password, Database, xml64){

}