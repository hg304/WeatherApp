// import preact
import { h, render, Component } from "preact";
// import stylesheets for ipad & button
import style from "./style";
import style_iphone from "../button/style_iphone";
import axios from "axios";
// import the Button component
import { useHistory } from 'react-router-dom';
import moment from 'moment';


export default class Weather extends Component {
	//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props) {
		super(props);
		//creating the states with initial values
		this.state = {
			temp: "",
			temp_min: "",
			temp_max: "",
			WindSpeed: "",
			DateToShow: "",
			ForecastDays: [],
			ForecastHours: [],
			DaysTempInfo: [],
			HoursTempInfo: [],
			DaysWindInfo: [],
			HoursWindInfo: [],
			DaysWeatherIcon: [],
			HoursWeatherIcon: [],
            BGImage: ""
		};
    }
	// a call to fetch weather data using axios pulling both current weather and forecast data
	fetchWeatherData = async () => {
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
        //log the current weather data that has been fetched
		console.log(weatherData);
        
        //fetch the forecast data in the users location
		let forecastData = (
			await axios.get(
				`https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&exclude=current,minutely,alerts&units=metric&appid=aa0506e20a52bbf8de5fefdda8b510b1`
			)
		).data;
        //log the forecast data that has been fetched 
		console.log(forecastData);
		
        //assign arrays to be used for days and hours in forecast
        const Weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		const Hours = [
			"00",
			"01",
			"02",
			"03",
			"04",
			"05",
			"06",
			"07",
			"08",
			"09",
			"10",
			"11",
			"12",
			"13",
			"14",
			"15",
			"16",
			"17",
			"18",
			"19",
			"20",
			"21",
			"22",
			"23",
			"24",
		];
        
        //log arrays to console
		console.log(Weekdays);
		console.log(Hours);
        //assign arrays holding days and hours for forecast
		let dayArr = [];
		let hourArr = [];
		let CurrentDate = new Date();
		let CurrentDay = CurrentDate.getDay();
		let i;
        //for loop to add the next 7 days in array
		for (i = 0; i < 7; i++) {
			if (CurrentDay > 6) {
				CurrentDay = 0;
			}
			dayArr.push(Weekdays[CurrentDay]);
			CurrentDay = CurrentDay + 1;
		}
		let CurrentHour = CurrentDate.getHours();
		let j;
        //for loop to add the next 24 hours in array
		for (j = 0; j < 24; j++) {
			if (CurrentHour > 23) {
				CurrentHour = 0;
			}
			hourArr.push(Hours[CurrentHour]);
			CurrentHour += 1;
		}
        //log state to console
		console.log(hourArr);
		let DateForDisplay = moment(CurrentDate).format('dddd Do MMMM YYYY, HH:mm');
		//assign all data in respective states
		this.setState({
			locate: weatherData.name,
			DateToShow: DateForDisplay,
			temp: weatherData.main.temp, //current temp
			temp_min: weatherData.main.temp_min, //min temp
			temp_max: weatherData.main.temp_max, //max temp
			WindSpeed: weatherData.wind.speed, //wind speed
			cond: weatherData.weather[0].description, //weather conditions,
			ForecastDays: dayArr,
			ForecastHours: hourArr,
			display: false
		});

		let tempHourWindArr = [];
		let tempHourTempArr = [];
		let tempHourIconArr = [];
        //for loop to add weather information for next 9 hours
		for (i = 0; i < 9; i++) {
			tempHourWindArr.push(forecastData.hourly[i].wind_speed);
			tempHourTempArr.push(forecastData.hourly[i].temp);
			tempHourIconArr.push(forecastData.hourly[i].weather[0].icon);
		}
        //assign array information in states
		this.setState({
			HoursTempInfo: tempHourTempArr,
			HoursWindInfo: tempHourWindArr,
			HoursWeatherIcon: tempHourIconArr
		});
		
		let tempDayWindArr = [];
		let tempDayTempArr = [];
		let tempDayIconArr = [];
        //for loop to add weather information for all 7 days
		for (i = 1; i < 8; i++) {
			tempDayWindArr.push(forecastData.daily[i].wind_speed);
			tempDayTempArr.push(forecastData.daily[i].temp.day);
			tempDayIconArr.push(forecastData.daily[i].weather[0].icon);
		}
        //assign array information in states
		this.setState({
			DaysTempInfo: tempDayTempArr,
			DaysWindInfo: tempDayWindArr,
			DaysWeatherIcon: tempDayIconArr
		});

        //log states to console
		console.log(this.state.DaysTempInfo);
		console.log(this.state.DaysWindInfo);
		console.log(this.state.HoursTempInfo);
		console.log(this.state.HoursWindInfo);
		console.log(this.state.DaysWeatherIcon);
		console.log(this.state.HoursWeatherIcon);

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
        
	};

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

    //render function displaying the weather
    render() {
        //once weather starts rendering immediately get weather information
        this.fetchWeatherData();
        //history constant used to route user to schedule if they click the button to do so
        const history = useHistory();
        // check if temperature data is fetched, if so add the sign styling to the page
        const tempStyles = this.state.temp
        ? `${style.temperature} ${style.filled}`
        : style.temperature;
        // display all weather data
        console.log(this.state);

        //display weather information using the states we have
        return (
            <div style={ this.state.BGImage } class={style.container}>
                <div
                    class={style.header}
                    style={ "display:flex"}
                >
                    <div class={style.Todays_Weather}>
                        <span>Today's Weather</span>
                    </div>
                    <div class={style.Mile_End}>
                        <span>{this.state.locate}</span>
                    </div>
                    <div class={style.clear}>
                        <span>{this.state.cond}</span>
                    </div>
                    <div class={style.topdate}>
                        <span>{this.state.DateToShow}</span>
                    </div>
                    <div class={style.ID12C}>
                        <span>{Math.round(this.state.temp)}°C</span>
                    </div>
                    <div class={style.High_Low}>
                        <span>High: {Math.round(this.state.temp_max)}°C</span>
                        <br />
                        <span>Low: {Math.round(this.state.temp_min)}°C</span>
                    </div>
                    <svg class={style.Shape_3_copy_4}>
                        <rect
                            class={style.Shape_3_copy_4col}
                            rx="0"
                            ry="0"
                            x="0"
                            y="0"
                            width="341.5"
                            height="1.84"
                        ></rect>
                    </svg>
                    <svg class={style.Shape_3_copy_5}>
                        <rect
                            class={style.Shape_3_copy_5col}
                            rx="0"
                            ry="0"
                            x="0"
                            y="0"
                            width="341.5"
                            height="1.84"
                        ></rect>
                    </svg>
                    <div class={style.ID17}>
                        <span>{this.state.ForecastHours[0]}</span>
                    </div>
                    <div class={style.ID18}>
                        <span>{this.state.ForecastHours[1]}</span>
                    </div>
                    <div class={style.ID19}>
                        <span>{this.state.ForecastHours[2]}</span>
                    </div>
                    <div class={style.ID20}>
                        <span>{this.state.ForecastHours[3]}</span>
                    </div>
                    <div class={style.ID21}>
                        <span>{this.state.ForecastHours[4]}</span>
                    </div>
                    <div class={style.ID22}>
                        <span>{this.state.ForecastHours[5]}</span>
                    </div>
                    <div class={style.ID23}>
                        <span>{this.state.ForecastHours[6]}</span>
                    </div>
                    <div class={style.ID00}>
                        <span>{this.state.ForecastHours[7]}</span>
                    </div>
                    <div class={style.ID01}>
                        <span>{this.state.ForecastHours[8]}</span>
                    </div>
                    <img
                        class={style.Layer_1}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[0]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[1]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy_2}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[2]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy_3}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[3]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy_4}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[4]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy_5}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[5]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy_6}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[6]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy_7}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[7]}.png`}
                    ></img>
                    <img
                        class={style.Layer_1_copy_8}
                        src={`http://openweathermap.org/img/w/${this.state.HoursWeatherIcon[8]}.png`}
                    ></img>
                    <div class={style.ID12C_b}>
                        <span>{Math.round(this.state.HoursTempInfo[0])}°C</span>
                    </div>
                    <div class={style.ID14C}>
                        <span>{Math.round(this.state.HoursTempInfo[1])}°C</span>
                    </div>
                    <div class={style.ID13C}>
                        <span>{Math.round(this.state.HoursTempInfo[2])}°C</span>
                    </div>
                    <div class={style.ID13C_cc}>
                        <span>{Math.round(this.state.HoursTempInfo[3])}°C</span>
                    </div>
                    <div class={style.ID11C}>
                        <span>{Math.round(this.state.HoursTempInfo[4])}°C</span>
                    </div>
                    <div class={style.ID8C}>
                        <span>{Math.round(this.state.HoursTempInfo[5])}°C</span>
                    </div>
                    <div class={style.ID7C}>
                        <span>{Math.round(this.state.HoursTempInfo[6])}°C</span>
                    </div>
                    <div class={style.ID4C}>
                        <span>{Math.round(this.state.HoursTempInfo[7])}°C</span>
                    </div>
                    <div class={style.ID4C_ch}>
                        <span>{Math.round(this.state.HoursTempInfo[8])}°C</span>
                    </div>
                    <div class={style.ID15}>
                        <span>{Math.round(this.state.HoursWindInfo[0])}mph</span>
                    </div>
                    <div class={style.ID12}>
                        <span>{Math.round(this.state.HoursWindInfo[1])}mph</span>
                    </div>
                    <div class={style.ID13}>
                        <span>{Math.round(this.state.HoursWindInfo[2])}mph</span>
                    </div>
                    <div class={style.ID16}>
                        <span>{Math.round(this.state.HoursWindInfo[3])}mph</span>
                    </div>
                    <div class={style.ID10}>
                        <span>{Math.round(this.state.HoursWindInfo[4])}mph</span>
                    </div>
                    <div class={style.ID7}>
                        <span>{Math.round(this.state.HoursWindInfo[5])}mph</span>
                    </div>
                    <div class={style.ID5}>
                        <span>{Math.round(this.state.HoursWindInfo[6])}mph</span>
                    </div>
                    <div class={style.ID4}>
                        <span>{Math.round(this.state.HoursWindInfo[7])}mph</span>
                    </div>
                    <div class={style.ID5_bw}>
                        <span>{Math.round(this.state.HoursWindInfo[8])}mph</span>
                    </div>
                    <svg class={style.topweeklyborder}>
                        <rect
                            class={style.topweeklybordercol}
                            rx="0"
                            ry="0"
                            x="0"
                            y="0"
                            width="341.5"
                            height="1.84"
                        ></rect>
                    </svg>
                    <svg class={style.bottomweeklyborder}>
                        <rect
                            class={style.bottomweeklybordercol}
                            rx="0"
                            ry="0"
                            x="0"
                            y="0"
                            width="341.5"
                            height="1.84"
                        ></rect>
                    </svg>
                    <div class={style.week1}>
                        <span>{this.state.ForecastDays[0]}</span>
                    </div>
                    <div class={style.week2}>
                        <span>{this.state.ForecastDays[1]}</span>
                    </div>
                    <div class={style.week3}>
                        <span>{this.state.ForecastDays[2]}</span>
                    </div>
                    <div class={style.week4}>
                        <span>{this.state.ForecastDays[3]}</span>
                    </div>
                    <div class={style.week5}>
                        <span>{this.state.ForecastDays[4]}</span>
                    </div>
                    <div class={style.week6}>
                        <span>{this.state.ForecastDays[5]}</span>
                    </div>
                    <div class={style.week7}>
                        <span>{this.state.ForecastDays[6]}</span>
                    </div>
                    <div class={style.week1temp}>
                        <span>{Math.round(this.state.DaysTempInfo[0])}°C</span>
                    </div>
                    <div class={style.week2temp}>
                        <span>{Math.round(this.state.DaysTempInfo[1])}°C</span>
                    </div>
                    <div class={style.week3temp}>
                        <span>{Math.round(this.state.DaysTempInfo[2])}°C</span>
                    </div>
                    <div class={style.week4temp}>
                        <span>{Math.round(this.state.DaysTempInfo[3])}°C</span>
                    </div>
                    <div class={style.week5temp}>
                        <span>{Math.round(this.state.DaysTempInfo[4])}°C</span>
                    </div>
                    <div class={style.week6temp}>
                        <span>{Math.round(this.state.DaysTempInfo[5])}°C</span>
                    </div>
                    <div class={style.week7temp}>
                        <span>{Math.round(this.state.DaysTempInfo[6])}°C</span>
                    </div>
                    <img
                        class={style.week1icon}
                        src={`http://openweathermap.org/img/w/${this.state.DaysWeatherIcon[0]}.png`}
                    ></img>
                    <img
                        class={style.week2icon}
                        src={`http://openweathermap.org/img/w/${this.state.DaysWeatherIcon[1]}.png`}
                    ></img>
                    <img
                        class={style.week3icon}
                        src={`http://openweathermap.org/img/w/${this.state.DaysWeatherIcon[2]}.png`}
                    ></img>
                    <img
                        class={style.week4icon}
                        src={`http://openweathermap.org/img/w/${this.state.DaysWeatherIcon[3]}.png`}
                    ></img>
                    <img
                        class={style.week5icon}
                        src={`http://openweathermap.org/img/w/${this.state.DaysWeatherIcon[4]}.png`}
                    ></img>
                    <img
                        class={style.week6icon}
                        src={`http://openweathermap.org/img/w/${this.state.DaysWeatherIcon[5]}.png`}
                    ></img>
                    <img
                        class={style.week7icon}
                        src={`http://openweathermap.org/img/w/${this.state.DaysWeatherIcon[6]}.png`}
                    ></img>
                    <div class={style.week1wind}>
                        <span>{Math.round(this.state.DaysWindInfo[0])}mph</span>
                    </div>
                    <div class={style.week2wind}>
                        <span>{Math.round(this.state.DaysWindInfo[1])}mph</span>
                    </div>
                    <div class={style.week3wind}>
                        <span>{Math.round(this.state.DaysWindInfo[2])}mph</span>
                    </div>
                    <div class={style.week4wind}>
                        <span>{Math.round(this.state.DaysWindInfo[3])}mph</span>
                    </div>
                    <div class={style.week5wind}>
                        <span>{Math.round(this.state.DaysWindInfo[4])}mph</span>
                    </div>
                    <div class={style.week6wind}>
                        <span>{Math.round(this.state.DaysWindInfo[5])}mph</span>
                    </div>
                    <div class={style.week7wind}>
                        <span>{Math.round(this.state.DaysWindInfo[6])}mph</span>
                    </div>
                    <div class={style.wbutton}>
                        <span><button class={style_iphone.button} onClick={ () => history.push("/schedule") }>View Schedule</button></span>
                    </div>
                </div>    
            </div>
        );
    }

}


