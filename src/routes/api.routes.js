import {Router} from "express";
import {json_out} from "../middlewares/json-out";
import {is_auth_api} from "../middlewares/is-auth";
import * as apic from "../controllers/api.controllers";
import * as onu from "../controllers/onu.controllers";
import * as catalogue from "../controllers/catalogue.controllers";


const passport = require('passport');
const r = Router();

r.get('/', function (request, response) {
    response.render('api/index');
})

r.post('/auth',
    (request, response, next) => {
        passport.authenticate('api-local', {
            successRedirect: '/api/success',
            failureRedirect: '/api/failure'
        })(request, response, next);
    }
)

r.get('/failure',
    function (request, response) {
        let mess = "Usuario o contraseña invalida"

        if (request.session.message !== undefined)
            mess = request.session.message.data.message;

        return response.status(401).send(json_out(401, mess))
    });

r.get('/success',
    function (request, response) {

        return response.status(200).send(json_out(200, 'Login Success', request.session.message))
    });

r.get('/logout',
    function (request, response) {
        request.logout(function (err) {
            console.log('logout err', err)
            return response.redirect('/auth');
        });
        // request.session.destroy(function (err) {
        //     console.log('session destroy', err)
        //
        // });
    })

r.get('/tasks/archive', is_auth_api, apic.get_task_archive);
r.get('/tasks/pending', is_auth_api, apic.get_task_pending)
r.get('/tasks/complete', is_auth_api, apic.get_task_complete)
r.get('/tasks/by-user', is_auth_api, apic.get_task_pending_by_user)
r.get('/tasks/details/:id', is_auth_api, apic.get_task_by_id)
r.put('/tasks/details/:id', is_auth_api, apic.update_task_by_id)
r.get('/tasks/details/:id/comments', is_auth_api, apic.get_comments_by_task)
r.post('/tasks/details/:id/comments', is_auth_api, apic.add_comment_to_task)
r.post('/tasks/pending/:id/images', is_auth_api, apic.add_image_to_task)

r.get('/onu/:id/unconfigured', is_auth_api, onu.get_onu_unconfigured)
r.get('/onu/:id/signal', is_auth_api, onu.get_onu_signal_by_id)
r.post("/onu/:id/enable", is_auth_api, onu.onu_enable_by_id)
r.post("/onu/:id/disabled", is_auth_api, onu.onu_disable_by_id);
r.post("/onu/:id/upload", is_auth_api, onu.onu_upload_label);
r.post("/onu/:id/authorize", is_auth_api, onu.onu_authorize);
r.post("/onu/:id/catv", is_auth_api, onu.catv_enable_onu_by_id);

r.get('/onu/:id/status', is_auth_api, onu.get_onu_status_by_id)
r.get("/onu/:id/status/administrative", is_auth_api, onu.get_onu_administrative_status_by_id)
r.get("/onu/:id/status/details", is_auth_api, onu.get_onu_details_status_by_id)
r.get("/onu/:id/status/catv", is_auth_api, onu.get_onu_catv_status_by_id)
r.get("/onu/:id/status/full", is_auth_api, onu.get_onu_full_status_by_id)
r.get("/onu/:id/speedprofile", is_auth_api, onu.get_onu_speed_profile_by_id);
r.post("/onu/bulk/disable", is_auth_api, onu.onu_bulk_disabled_by_id);

r.delete("/onu/:id", is_auth_api, onu.onu_delete_by_id);
r.patch("/onu/:id", is_auth_api, onu.onu_restore_factory_by_id);
r.post("/onu/:id", is_auth_api, onu.onu_reboot_by_id);

r.get('/cash/dairy/resume', is_auth_api, apic.get_cash_dairy_resume)
r.get('/cash/dairy/details', is_auth_api, apic.get_cash_dairy_details)

r.get('/documents/details/:id', is_auth_api, apic.get_document_by_id)
r.get('/documents/details/:id/details', is_auth_api, apic.get_document_details_by_id)

r.get("/dashboard/:view", is_auth_api, apic.get_customers_by_plan)

r.get('/dte/:id', is_auth_api, apic.get_dte_by_id)
r.post('/dte/:id', is_auth_api, apic.set_dte_info)

r.get('/customers', is_auth_api, apic.get_customers);
r.get('/customers/:id', is_auth_api, apic.get_customers_by_id);

r.get("/catalogue/:view/:cod/:str", is_auth_api, catalogue.get_catalogue);

export default r;