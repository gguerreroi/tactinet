"use strict";

import express from "express";
import appRoutes from "./routes/app.routes";
import apiRoutes from "./routes/api.routes";


const app = express();


app.set('port', process.env.PORT || 3000);

app.use("/", appRoutes);
app.use("/api", apiRoutes);

app.use(express.static("public"));

export default app;