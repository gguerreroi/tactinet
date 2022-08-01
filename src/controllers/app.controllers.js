"use strict";

const API_URL = 'http://localhost:3000/api';
const axios = require('axios');

export async function get_one_task(id, UserInfo){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/tasks/details/${id}`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_comments_by_task(id, UserInfo){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/tasks/details/${id}/comments`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_one_document(UserInfo, id){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/documents/details/${id}`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function get_one_detail_document(UserInfo, id){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/documents/details/${id}/details`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function set_destroy_session(request, response){
    const a = axios.get(`${API_URL}/api/logout`);

    promise.all([a]).then(() => {
        request.session.destroy(function(err){
            request.logout();
            response.redirect('/auth');
        });
    });
}