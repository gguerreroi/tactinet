"use strict";


import config from "../config/config";
const mssql = require('mssql')

export function getConnection(){
    let connection;

    try{
        const ConnectionString = {
            user: config.DB.USER,
            password: config.DB.PASSWORD,
            server: config.DB.HOST,
            database: config.DB.DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        }

        mssql.connect(ConnectionString, function(err){
            return mssql.connect();
        })


    }catch (e){
        console.log(e)
    }
}