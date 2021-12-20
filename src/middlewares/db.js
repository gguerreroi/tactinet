import config from '../config/config'
export const mssql = require('mssql')

let pool;

export async function getConnection(){
  const ConnectionString = {
    user: config.DB.USER,
    password:config.DB.PASSWORD,
    server:config.DB.HOST,
    database:config.DB.DATABASE,
    options:{
      encrypt: false,
      enableArithAbort:true
    }
  }

  let connPool = new mssql.ConnectionPool(ConnectionString)

  try{
    pool = await connPool.connect()
    pool.on("error", async function(e){
      console.log("on pool error ", e)
      await closePool()
    })
    return pool;
  }catch(e){
    pool=null
    return {
      Code: e.code,
      Message: e.Message
    }
  }
}

async function closePool(){
  try{
    await pool.close()
    pool = null
  }catch(e){
    pool = null
    console.log(e)
  }
}