// import preact
import { h, render, Component } from 'preact';
	
export default class Button extends Component {

	// rendering a function when the button is clicked
	render() {
		return (
			<div>
				<button>
					Display Weather
				</button>
			</div>
		);
	}
}
