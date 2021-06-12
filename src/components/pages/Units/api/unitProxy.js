import {unitsUrl} from '../../../../consts/const'
import axios from 'axios';

export function getAllUnit() {
    return axios.get(`${unitsUrl}`);
};

export function getById(id) {
    return axios.get(`${unitsUrl}/${id}`);
};

export function create(newUnit) {
    return axios.post(`${unitsUrl}`, newUnit);
}

export function updateUnit(updatedUnit) {
    return axios.put(`${unitsUrl}/${updatedUnit.id}`, updatedUnit);
}

export function deleteUnit(unit) {
    return axios.delete(`${unitsUrl}`, {params: {id: unit.id}} );
}