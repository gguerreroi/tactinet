"use strict"

import {get_connection, mssql} from "../middlewares/database";
import config from "../config/config";

export async function save_xml_dte(
    Username,
    Password,
    Database,
    codserial, numero, serie, uuid, xml64, fecha
) {
    let Connection = null;
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`);

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const sp = await Connection.request()
        sp.input('codserial', mssql.Int, codserial)
        sp.input('numero', mssql.VarChar(50), numero)
        sp.input('serie', mssql.VarChar(400), serie)
        sp.input('uuid', mssql.VarChar(400), uuid)
        sp.input('cnl_xml', mssql.VarChar(mssql.MAX), xml64)
        sp.input('fecha', mssql.VarChar(400), fecha)
        sp.output('codmsj', mssql.Int)
        sp.output('strmsj', mssql.VarChar(400))
        sp.execute('financiero.sp_anular_dte', function(err, result){
            if (err)
                return console.log(' error al ejecutar sp_anular_dte ', err, result)

            return console.log(' sp ejecutado con exito', result.output.strmsj)
        })
    } catch (e) {
        return console.log(e);
    }
}

export async function save_xmls_tocancel(Username, Password, Database, codserial, xml64) {
    let Connection = null;
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`)
        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const sp = await Connection.request();

        sp.input('codserial', mssql.Int, codserial);
        sp.input('xml_signed', mssql.VarChar(mssql.MAX), xml64);
        sp.output('codmsj', mssql.Int);
        sp.output('strmsj', mssql.VarChar(400));

        sp.execute('financiero.sp_xml_signed', function(err, result){
            if (err)
                return console.log(' error al ejecutar procedimiento xml_signed', err)

            return console.log(' ejecucion de procedimiento completado. ', result)
        })

    } catch (e) {
        return console.log(' Error en save_xmls_tocancel ', e)
    }
}

export async function sp_reversa(Username, Password, Database, codserial, strcomentario=''){
    let Connection = null;
    try {
        Connection = await get_connection(Username, Password, `${config.DB.HOST}`, `PLR00${Database}`)

        if (Connection.code === 500)
            throw {code: Connection.code, message: Connection.message}

        const sp = await Connection.request();
        sp.input('codserial', mssql.Int, codserial);
        sp.input('strmotivo', mssql.VarChar(400), strcomentario);
        sp.execute('caja.sp_reversa', function(err, result){
            if (err)
                return console.log(' error al ejecutar procedimiento sp_reversa', err)

            return console.log(' sp_reversa ejecutado con exito. ')
        })
    } catch (e) {
        return console.log(' Error en sp_reversa ', e)
    }
}