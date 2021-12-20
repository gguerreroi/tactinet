"use strict";
//node modules
import express, {urlencoded, json} from "express";
import morgan from "morgan";

//db
import { getConnection } from "./middlewares/db";

//routes
import appRoutes from "./routes/app.routes";
import apiRoutes from "./routes/api.routes";

const session = require('express-session');
const mssqlstore = require('mssql-session-store')(session);

const {join} = require('path');
const app = express();


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
app.use(urlencoded({extended: false}));
app.use(json());
app.use(session({
  secret:'TACTINETAPP',
  resave:false,
  saveUninitialized:false,
  store: new mssqlstore({
	ttl: 3600,
	reapInterval: 3600,
	reapCallback: function() { console.log('expired sessions were removed'); }
  })  
}));

app.use("/", appRoutes);
app.use("/api", apiRoutes);

app.use(express.static(join(__dirname, '/public')));

export default app;