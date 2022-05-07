"use strict";

const API_URL = 'http://localhost:3000/api';
const axios = require('axios');

export async function getOneTask(id, UserInfo){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/tasks/pending/${id}`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}

export async function getCommentsTask(id, UserInfo){
    const {Username, Password, Database} = UserInfo.data;
    return axios.get(`${API_URL}/tasks/pending/${id}/comments`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${Username}:${Password}`).toString('base64')}`,
            'Database': Database
        }
    });
}


export async function setDestroySession(request, response){
    const a = axios.get(`${API_URL}/api/logout`);

    promise.all([a]).then(() => {
        request.session.destroy(function(err){
            request.logout();
            response.redirect('/auth');
        });
    });
}