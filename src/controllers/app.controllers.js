"use strict";

const API_URL = 'http://127.0.0.1:3000/api';
const axios = require('axios');

export async function get_one_task(id, UserInfo) {
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/tasks/details/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_comments_by_task(id, UserInfo) {
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/tasks/details/${id}/comments`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_onu_speed_profile(id, UserInfo){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/onu/${id}/speedprofile`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_one_document(UserInfo, id) {
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/documents/details/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_one_detail_document(UserInfo, id) {
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/documents/details/${id}/details`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_auth_dte(UserInfo, nit_emisor){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/dte/${nit_emisor}`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}


export async function set_destroy_session(request, response) {
    const a = axios.get(`${API_URL}/api/logout`);

    promise.all([a]).then(() => {
        request.session.destroy(function (err) {
            request.logout();
            response.redirect('/auth');
        });
    });
}

export function get_xml_anula(uuid,
                              nit_emisor,
                              nit_receptor,
                              fecha_hora_emision,
                              fecha_anulacion,
                              motivo) {

    if (uuid === undefined || nit_emisor === undefined || nit_receptor === undefined || fecha_hora_emision === undefined || fecha_anulacion === undefined || motivo === undefined)
        throw {code: 500, message: 'Faltan datos'}

    return `<?xml version="1.0" encoding="UTF-8"?>
	<dte:GTAnulacionDocumento xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:dte="http://www.sat.gob.gt/dte/fel/0.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="0.1" xsi:schemaLocation="http://www.sat.gob.gt/dte/fel/0.1.0">
	<dte:SAT>
	<dte:AnulacionDTE ID="DatosCertificados">
	<dte:DatosGenerales ID="DatosAnulacion" NumeroDocumentoAAnular="${uuid}" NITEmisor="${nit_emisor}" IDReceptor="${nit_receptor}" FechaEmisionDocumentoAnular="${fecha_hora_emision}.000-06:00" FechaHoraAnulacion="${fecha_anulacion}T00:00:00.000-06:00" MotivoAnulacion="${motivo}"></dte:DatosGenerales>
	</dte:AnulacionDTE>
	</dte:SAT>
	</dte:GTAnulacionDocumento>`;
}

export function set_dte_anulacion(
    request,
    response
){

}

export async function get_one_customers(id, UserInfo) {
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/customers/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}