"use strict";
//node modules
import express, {urlencoded, json} from "express";
import morgan from "morgan";

//routes
import appRoutes from "./routes/app.routes";
import apiRoutes from "./routes/api.routes";

const session = require('express-session');
const {join} = require('path');
const app = express();


app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
app.use(urlencoded({extended: false}));
app.use(json());


app.use("/", appRoutes);
app.use("/api", apiRoutes);

app.use(express.static("public"));

export default app;