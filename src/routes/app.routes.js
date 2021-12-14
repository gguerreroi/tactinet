import { Router } from "express";

const router = Router();

router.get('/', function(request, response){
    response.send('Hello World');
    response.send('Hoa');
    response.send('enter');
    

})

export default router;