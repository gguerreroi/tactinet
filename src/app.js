"use strict";
import express, {urlencoded, json} from "express";
import morgan from "morgan";
import appRoutes from "./routes/app.routes";
import apiRoutes from "./routes/api.routes";
import config from "./config/config";

const session = require('express-session');

const cookieParser = require('cookie-parser');
const {join} = require('path');
const Sequelize = require("sequelize");
const passport = require('passport');

const app = express();

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

//middlewares
app.use(morgan('dev'));
app.use(urlencoded({extended: true}));
app.use(json());
app.use(cookieParser('TACTINETAPP'))
app.use(session({
    secret: 'TACTINETAPP',
    resave: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: dbsession
    })
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/", appRoutes);
app.use("/api", apiRoutes);

app.use(express.static(join(__dirname, '/public')));

export default app;