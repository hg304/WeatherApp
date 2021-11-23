//import preact
import { h, render, Component } from 'preact';
//import react router
import { BrowserRouter, Route, Switch } from 'react-router-dom';
//import the 3 pages to be used
import Iphone from './iphone/index.js';
import Weather from './weather/index.js';
import Cal from './Calendar/Calendar.js';

//a class that is used essentially as a router
export default class Routes extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/">
                        <Iphone />
                    </Route>
                    <Route exact path="/weather">
                        <Weather />
                    </Route>
                    <Route exact path="/schedule">
                        <Cal />
                    </Route>
                </Switch>
            </div>
        );
    }
}