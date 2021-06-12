import React from 'react';
import {Link} from 'react-router-dom';
import './routerLink.css'

// eslint-disable-next-line import/no-anonymous-default-export
export default props => 
    <Link to={`/${props.link}`}>
       { props.name }        
    </Link>