"use strict";

import {getConnection} from "./database";
import config from "../config/config";

const a = await getConnection(
    config.DB.USER,
    config.DB.PASSWORD,
    config.DB.HOST,
    config.DB.DATABASE
)

export default a