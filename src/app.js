"use strict";
//node modules
import express, {urlencoded, json} from "express";
import morgan from "morgan";

const passport = require('passport');

//routes
import appRoutes from "./routes/app.routes";
import apiRoutes from "./routes/api.routes";
import config from "./config/config";

const session = require('express-session');
const mssqlstore = require('mssql-session-store')(session);
const mssql = require('mssql');

const {join} = require('path');

const app = express();
require('./middlewares/passport')

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
app.use(urlencoded({extended: false}));
app.use(json());

app.use(session({
    store: new mssqlstore({
        connection: mssql.connect({user: config.DB.USER,
            password: config.DB.PASSWORD,
            server: config.DB.HOST,
            database: config.DB.DATABASE,
            options: {
                encrypt: false,
                enableArithAbort: true
            }}),
        ttl: 3600,
        reapInterval: 3600,
        reapCallback: function () {
            console.log('expired sessions were removed');
        }
    }),
    secret: 'TACTINETAPP',
    resave: false,
    saveUninitialized: false
}))


app.use(passport.initialize())
app.use(passport.session())

app.use("/", appRoutes);
app.use("/api", apiRoutes);

app.use(express.static(join(__dirname, '/public')));

export default app;