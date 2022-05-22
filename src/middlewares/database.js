export const mssql = require('mssql')

let pool;

export async function get_connection(user, password, server, database) {
    let connPool;

    try {
        if (user === undefined)
            throw {code: 500, message: "User is required"};

        if (password === undefined)
            throw {code: 500, message: "Password is required"};

        const ConnectionString = {
            user: user,
            password: password,
            server: server,
            database: database,
            options: {
                encrypt: false,
                enableArithAbort: true
            }
        }

        connPool = new mssql.ConnectionPool(ConnectionString)
        pool = await connPool.connect()
        pool.on("error", async function (e) {
            console.log("on pool error ", e)
            await close_pool()
        })
        return pool;
    } catch (e) {
        pool = null
        return {
            code: 500,
            message: `${e.code} ${e.originalError}`
        }
    }
}

async function close_pool() {
    try {
        await pool.close()
        pool = null
    } catch (e) {
        pool = null
        console.log(e)
    }
}