import { Router } from "express";

const router = Router();

router.get('/', function(request, response){
    response.render('index');    
});

export default router;