import {Router} from "express";
import * as Security from "../controllers/seguridad.controller";
import {JsonOut} from "../middlewares/JsonOut";

const router = Router();

router.post('/auth', function (request, response) {
    const {username, password, database} = request.body

    const a = Security.checkUserAndPassword(username, password, `PLR00${database}`);

    Promise.all([a]).then(value => {
        console.log("a then", value)
        response.status(value[0].state.Code).send(value[0])
    }).catch(reason => {
        console.log("reason: ", reason)
        response.status(500).send(JsonOut('500', 'Se produjo un error en la ejecucion de promesa'))
    })
})

export default router;