import {companiesUrl} from '../../../../consts/const'
import axios from 'axios';

    export function getAll() {
        return axios.get(`${companiesUrl}`);
    };

    export function getById(id) {
        return axios.get(`${companiesUrl}/${id}`);
    };

    export function create(newCompany) {
        return axios.post(`${companiesUrl}`, newCompany);
    }
    
    export function update(updatedCompany) {
        return axios.put(`${companiesUrl}/${updatedCompany.id}`, updatedCompany);
    }
    
    export function deleteCompany(company) {
        return axios.delete(`${companiesUrl}`, {params: {id: company.id}} );
    }