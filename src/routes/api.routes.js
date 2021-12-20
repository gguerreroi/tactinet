import { Router } from "express";

const router = Router();

router.get('/auth', function(request, response) {
    response.json({Hello: 'World'});
});
    

export default router;