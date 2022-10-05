"use strict";

const API_FEL_FIRMA = 'https://signer-emisores.feel.com.gt/sign_solicitud_firmas/firma_xml';
const API_FEL_ANULA = 'https://certificador.feel.com.gt/fel/anulacion/v2/dte/';
const API_FEL_CERTIFICA = 'https://certificador.feel.com.gt/fel/certificacion/v2/dte/';

const axios = require('axios');

export async function post_dte_signed(llave, codigo, alias, es_anulacion = "N", dte_base64) {

    return axios.post(API_FEL_FIRMA, {
        llave: llave,
        archivo: dte_base64,
        codigo: codigo,
        alias: alias,
        es_anulacion: es_anulacion
    });
}

export async function post_dte_cancels(
    nit_emisor,
    correo_copia,
    dte_base64,
    llave,
    serial,
    prefijo) {
    return axios.post(API_FEL_ANULA, {
        nit_emisor: nit_emisor,
        correo_copia: correo_copia,
        xml_dte: dte_base64
    }, {
        headers: {
            'Content-Type': 'application/json',
            'usuario': prefijo,
            'llave': llave,
            'identificador': serial
        }
    });
}

export async function post_dte_certify(
    nit_emisor,
    correo_copia,
    dte_base64,
    llave,
    serial) {
    return axios.post(API_FEL_CERTIFICA, {
        nit_emisor: nit_emisor,
        correo_copia: correo_copia,
        xml_dte: dte_base64
    }, {
        headers: {
            'Content-Type': 'application/json',
            'usuario': nit_emisor,
            'llave': llave,
            'identificador': serial
        }
    });
}

export async function registrar_anula_db(
    id,
    UserInfo,
    dbody
) {
    const {Username, Password, Database} = UserInfo.data;
    return axios.post(`http://10.60.110.4:3000/api/cash/operations/documents/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
                'Database': Database
            },
        data: dbody
        }
    );
}