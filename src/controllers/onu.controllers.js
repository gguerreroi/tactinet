"use strict";

import {json_out} from "../middlewares/json-out";


const API_URL = 'https://sonivision.telecomti.net/api';
const API_KEY = '773c3fa0df1c49f5aae7044cf064e843';

const axios = require('axios');

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
        res.status(400).send(json_out(400, error.message));
    });
}

export async function get_onu_status_by_id(req, res){
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

export async function get_onu_administrative_status_by_id(req, res){
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

export async function get_onu_unconfigured(req, res){
    const onu_unconfigured = axios.get(`${API_URL}/onu/unconfigured_onus`, {
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



export async function get_onu_catv_status_by_id(req, res){
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

export async function get_onu_full_status_by_id(req, res){
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