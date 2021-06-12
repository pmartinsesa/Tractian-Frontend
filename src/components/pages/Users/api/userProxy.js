import {usersUrl} from '../../../../consts/const'
import axios from 'axios';

export function getAllUser() {
    return axios.get(`${usersUrl}`);
};

export function getById(id) {
    return axios.get(`${usersUrl}/${id}`);
};

export function create(newUser) {
    return axios.post(`${usersUrl}`, newUser);
}

export function updateUser(updatedUser) {
    return axios.put(`${usersUrl}/${updatedUser.id}`, updatedUser);
}

export function deleteUser(user) {
    return axios.delete(`${usersUrl}`, {params: {id: user.id}} );
}