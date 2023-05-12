"use strict";
import express, {urlencoded, json} from "express";
import morgan from "morgan";
import appRoutes from "./routes/app.routes";
import apiRoutes from "./routes/api.routes";
import config from "./config/config";

const session = require('express-session');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const {join} = require('path');
const Sequelize = require("sequelize");
const passport = require('passport');

const app = express();

require('dotenv').config();

const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('./middlewares/local.passport');

let dbsession = new Sequelize({
    dialect: 'mssql',
    host: config.DB.HOST,
    username: config.DB.USER,
    password: config.DB.PASSWORD,
    database: config.DB.DATABASE
});



app.set('port', process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));
app.set('trust proxy', true);

//middlewares
app.use(morgan('combined'));
app.use(urlencoded({extended: true}));
app.use(json());
app.use(cookieParser('TACTINETAPP'))
app.use(fileupload())
app.use(session({
    secret: 'TACTINETAPP',
    resave: true,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: dbsession
    })
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/", appRoutes);
app.use("/api", apiRoutes);

app.use(express.static(join(__dirname, '../public')));

app.use(
    function( err, req, res, next) {
    res.status(500).render('./system/error-500', {
        me: req.path,
        err: err,
        UserInfo: 'Error general'
    });
});

app.use(
    function(req, res, next) {
    res.status(404).render('./system/error-404');
});

export default app;