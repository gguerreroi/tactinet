import { Router } from "express";

const router = Router();

router.get('/', function(request, response){
    response.render('index');    
});

router.get('/Auth', function(request, response){
    response.render('auth');
});


export default router;