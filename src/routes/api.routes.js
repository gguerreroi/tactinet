import { Router } from "express";

const router = Router();

router.get('/', function(request, response) {
    response.json({Hello: 'World'});
});
    

export default router;