// import preact
import { h, render, Component } from 'preact';
	
export default class ScheduleButton extends Component {

	// rendering a function when the button is clicked
	render() {
		let cFunction = this.props.clickFunction;
		if (typeof cFunction !== 'function'){
			cFunction = () => {
				console.log("passed something as 'clickFunction' that wasn't a function !");
			}
		}
		return (
			<div>
				<button onClick={cFunction}>
					View Schedule
				</button>
			</div>
		);
	}
}
