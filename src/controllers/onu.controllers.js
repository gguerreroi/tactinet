"use strict";

import {json_out} from "../middlewares/json-out";


const API_URL = 'https://sonivision.telecomti.net/api';
const API_KEY = '773c3fa0df1c49f5aae7044cf064e843';

const axios = require('axios');
const FormData = require('form-data');

export async function get_onu_signal_by_id(req, res) {
    const {id} = req.params;
    const onu_signal = axios.get(`${API_URL}/onu/get_onu_signal/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    })

    Promise.all([onu_signal]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(error.status).send(json_out(400, error.message));
    });
}

export async function get_onu_status_by_id(req, res) {
    const {id} = req.params;
    const onu_status = axios.get(`${API_URL}/onu/get_onu_status/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    })

    Promise.all([onu_status]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(400).send(json_out(400, error.message));
    });
}

export async function get_onu_administrative_status_by_id(req, res) {
    const {id} = req.params;
    const onu_administrative_status = axios.get(`${API_URL}/onu/get_onu_administrative_status/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    })
    Promise.all([onu_administrative_status]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(400).send(json_out(400, error.message));
    });
}

export async function get_onu_unconfigured(req, res) {
    const onu_unconfigured = axios.get(`${API_URL}/onu/unconfigured_onus_for_olt/2`, {
        headers: {
            'X-Token': API_KEY
        }
    })

    Promise.all([onu_unconfigured]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(400).send(json_out(400, error.message));
    });
}


export async function get_onu_catv_status_by_id(req, res) {
    const {id} = req.params;
    const onu_catv_status = axios.get(`${API_URL}/onu/get_onu_catv_status/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    })
    Promise.all([onu_catv_status]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(400).send(json_out(400, error.message));
    });
}

export async function get_onu_full_status_by_id(req, res) {
    const {id} = req.params;
    const onu_full_status_info = axios.get(`${API_URL}/onu/get_onu_full_status_info/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    })
    Promise.all([onu_full_status_info]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(400).send(json_out(400, error.message));
    });
}

export async function get_onu_details_status_by_id(req, res) {
    const {id} = req.params;
    const onu_details_status = axios.get(`${API_URL}/onu/get_onu_details/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    })
    Promise.all([onu_details_status]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(400).send(json_out(400, error.message));
    });
}

export async function catv_enable_onu_by_id(req, res) {
    const {id} = req.params;
    const catv = axios.post(`${API_URL}/onu/enable_catv/${id}`, {},{
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([catv]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        console.log(error)
        res.status(400).send(json_out(400, error.message, error));
    });
}

export async function catv_enable_onu_bulk(req, res) {
    const {onus_external_ids} = req.body;
    const catv_bulk = axios.post(`${API_URL}/onu/bulk_enable_catv`, {
        headers: {
            'X-Token': API_KEY
        },
        data: onus_external_ids
    });
    Promise.all([catv_bulk]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(400).send(json_out(400, error.message));
    });
}

export async function onu_enable_by_id(req, res) {
    const {id} = req.params;
    const enable_onu = axios.post(`${API_URL}/onu/enable/${id}`,{}, {
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([enable_onu]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(error.status).send(json_out(error.status, error.message, error.data));

    });
}

export async function onu_disable_by_id(req, res) {
    const {id} = req.params;
    const disable_onu = axios.post(`${API_URL}/onu/disable/${id}`, {},{
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([disable_onu]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        res.status(error.status).send(json_out(error.status, error.message, error.data));
    });
}

export async function onu_delete_by_id(req, res){
    const {id} = req.params;
    const delete_onu = axios.post(`${API_URL}/onu/delete/${id}`, {},{
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([delete_onu]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        let status = error.status === undefined ? error.response.status : error.status;
        let data = error.data === undefined ? error.response.error : error.data;
        data = data === undefined ? error.response.data.error : data;
        res.status(status).send(json_out(status, data, data));
    })
}

export async function get_onu_speed_profile_by_id(req, res){
    const {id} = req.params;
    const spo = axios.get(`${API_URL}/onu/get_onu_speed_profiles/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([spo]).then(values => {
        res.status(200).send(json_out(200, 'Ok', values[0].data))
    }).catch(error => {
        console.log('otro error', error)
        let status = error.status === undefined ? error.response.status : error.status;
        let data = error.data === undefined ? error.response.error : error.data;
        data = data === undefined ? error.response.data.error : data;
        res.status(status).send(json_out(status, data, data));
    })
}

export async function get_onu_all_unconfigured(req, res){
    const {id} = req.params;
    const spo = axios.get(`${API_URL}/onu/get_onu_speed_profiles/${id}`, {
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([spo]).then(values => {
        res.status(200).send(json_out(200, 'Ok', values[0].data))
    }).catch(error => {
        console.log('otro error', error)
        let status = error.status === undefined ? error.response.status : error.status;
        let data = error.data === undefined ? error.response.error : error.data;
        data = data === undefined ? error.response.data.error : data;
        res.status(status).send(json_out(status, data, data));
    })
}

export async function onu_restore_factory_by_id(req, res){
    const {id} = req.params;
    const default_onu = axios.post(`${API_URL}/onu/restore_factory_defaults/${id}`, {},{
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([default_onu]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        let status = error.status === undefined ? error.response.status : error.status;
        let data = error.data === undefined ? error.response.error : error.data;
        data = data === undefined ? error.response.data.error : data;
        res.status(status).send(json_out(status, data, data));
    })
}

export async function onu_reboot_by_id(req, res){
    const {id} = req.params;
    const default_onu = axios.post(`${API_URL}/onu/reboot/${id}`, {},{
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([default_onu]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        let status = error.status === undefined ? error.response.status : error.status;
        let data = error.data === undefined ? error.response.error : error.data;
        data = data === undefined ? error.response.data.error : data;
        res.status(status).send(json_out(status, data, data));
    })
}



export async function onu_bulk_disabled_by_id(req, res){
    const {onu_ids} = req.body;
    if (onu_ids === undefined)
        throw new Error('onu_ids is undefined');

    const bulk_onu = axios.post(`${API_URL}/onu/bulk_disable`, {onus_external_ids: onu_ids},{
        headers: {
            'X-Token': API_KEY
        }
    });
    Promise.all([bulk_onu]).then(values => {
        res.status(200).send(json_out(200, 'OK', values[0].data));
    }).catch(error => {
        let status = error.status === undefined ? error.response.status : error.status;
        let data = error.data === undefined ? error.response.error : error.data;
        data = data === undefined ? error.response.data.error : data;
        res.status(status).send(json_out(status, data, data));
    })
}

export async function onu_upload_label(req, res){
    const {id} = req.params;
    const {file} = req.files;
    const path_img =__dirname + '/../../public/assets/media/labels/'
    try{

        if (file === undefined) throw new Error("file undefined");
        if (!file.mimetype.includes('image')) throw new Error ("file is not image");

        file.mv(path_img + id +"." + file.name.split('.')[1]);

        res.status(200).send(json_out("200", "Imagen cargada con exito", null))
    }catch(e){
        res.status(400).send(json_out("400", e.message, e))
    }
}

export async function onu_authorize(req, res){
    const {id} = req.params;
    const {body} = req;
    let data = new FormData();

    data.append('olt_id', body.olt_id)
    data.append('pon_type', body.pon_type)
    data.append('board', body.board)
    data.append('port', body.port)
    data.append('sn', body.sn)
    data.append('vlan', body.vlan)
    data.append('onu_type', body.onu_type)
    data.append('onu_mode', body.onu_mode)
    data.append('zone', body.zone)
    data.append('odb', body.odb)
    data.append('name', body.name)
    data.append('address_or_comment', body.address_or_comment)
    data.append('upload_speed_profile_name', body.upload_speed_profile_name)
    data.append('download_speed_profile_name', body.download_speed_profile_name)
    data.append('onu_external_id', body.onu_external_id)

    try{
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/onu/authorize_onu`,
            headers: {
                'X-Token': API_KEY,
                    ...data.getHeaders()
            },
            data: data
        }
        axios(config).then(function(res_auth){
            console.log('res_auth', res_auth)
            res.status(200).send(json_out(200, 'OK', res_auth.data));
        }).catch(function (error){
            let status = error.status === undefined ? error.response.status : error.status;
            let data = error.data === undefined ? error.response.error : error.data;
            data = data === undefined ? error.response.data.error : data;
            res.status(status).send(json_out(status, data, data));
        })

    }catch(e){
        res.status(400).send(json_out("400", e.message, e))
    }
}