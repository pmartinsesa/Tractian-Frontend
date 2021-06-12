import React from 'react';
import {Switch, Route, Redirect} from 'react-router';

import Home from '../components/pages/Home/home';
import Actives from '../components/pages/Actives/actives';
import Companies from '../components/pages/Companies/companies';
import Units from '../components/pages/Units/units';
import Users from '../components/pages/Users/users';

// eslint-disable-next-line import/no-anonymous-default-export
export default props => 
    <Switch>
        <Route path='/home' component={Home} />
        <Route path='/actives' component={Actives} />
        <Route path='/companies' component={Companies} />
        <Route path='/units' component={Units} />
        <Route path='/users' component={Users} />
        <Redirect from="*" to='/home' />
    </Switch>