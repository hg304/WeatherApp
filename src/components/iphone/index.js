
// import preact
import { h, render, Component } from "preact";
// import stylesheets for ipad & button
import style from "./style";
import style_iphone from "../button/style_iphone";
//import react router
import { useHistory } from 'react-router-dom';
import axios from 'axios';

//home page that is shown when user starts up application
export default class Iphone extends Component {
	constructor() {
		super();
		this.state = {
			BGImage: ""
		};
	}

	getBackground = async() => {
		//get current location of user
		let position = await this.getLocation();
        //fetch the current city of where user is located
		let city = (
			await axios.get(
				`https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`
			)
		).data.city;

        //fetch the current weather data in the users location
		let weatherData = (
			await axios.get(
				`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=aa0506e20a52bbf8de5fefdda8b510b1`
			)
		).data;
		const sunrise = weatherData.sys.sunrise;
        const sunset = weatherData.sys.sunset;
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        let sunriseDate = new Date(sunrise * 1000);
        let sunsetDate = new Date(sunset * 1000);
        // Hours part from the timestamp
        let sunriseHour = sunriseDate.getHours();
        let sunsetHour = sunsetDate.getHours();

        let currentDate = new Date();
        let currentHour = currentDate.getHours();

        console.log(sunriseHour);
        console.log(sunsetHour);
        console.log(currentHour);

        let background = null;

        if (currentHour > sunriseHour && currentHour < sunsetHour ) {
            background = {
                backgroundImage: `url("../../assets/backgrounds/BackgroundDay.png")`
            };
        }
        else if (currentHour > sunriseHour && currentHour > sunsetHour) {
            background = {
                backgroundImage: `url("../../assets/backgrounds/BackgroundNight.png")`
            };
        }
        else {
            background = {
                backgroundImage: `url("../../assets/backgrounds/BackgroundNight.png")`
            };
        }

        this.setState({ BGImage: background });
        console.log(this.state.BGImage);
	}

	//get users current location
    getLocation() {
        if (navigator.geolocation) {
            return new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

	//render function to display the page
	render() {
		this.getBackground();
		const history = useHistory();
		//will display two buttons, which will route to the page that is chosen
		return (
			<div style={ this.state.BGImage } class={ style.container }>
				<div class={ style.details }></div>
				<div class= { style_iphone.container }>
					<button class={ style_iphone.button } onClick={ () => history.push("/weather") }>Display Weather</button>
					<button class={ style_iphone.button } onClick={ () => history.push("/schedule") }>View Schedule</button>
				</div>
			</div>
		);
	}
}