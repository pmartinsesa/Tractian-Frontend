import {activesUrl} from '../../../../consts/const'
import axios from 'axios';

export function getAllActive() {
    return axios.get(`${activesUrl}`);
};

export function getById(id) {
    return axios.get(`${activesUrl}/${id}`);
};

export function create(newActive) {
    return axios.post(`${activesUrl}`, newActive);
}

export function updateActive(updatedActive) {
    return axios.put(`${activesUrl}/${updatedActive.id}`, updatedActive);
}

export function deleteActive(active) {
    return axios.delete(`${activesUrl}`, {params: {id: active.id}} );
}