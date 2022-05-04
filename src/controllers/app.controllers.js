"use strict";

const API_URL = 'http://localhost:3000/api';
const axios = require('axios');

export async function getOneTask(id){
    return axios.get(`${API_URL}/tasks/pending/${id}`);
}
