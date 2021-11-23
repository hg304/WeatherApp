//import preact
import { h, Component } from "preact";
//import features to be used for calendar
import Header from "./header/Header";
import events from "./events";
//import stylesheet for page
import style from "./style";
//import stylesheet for calendar
import "react-big-calendar/lib/css/react-big-calendar.css";
//import react big calendar
import { Calendar, momentLocalizer } from "react-big-calendar";
//import moment for datetime localisation
import moment from "moment";
//import drag and drop feature for calendar
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
//import more styles sheets for calendar
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import stylebutton from '../iphone/style';
import ls from 'local-storage';
import { useHistory } from 'react-router-dom';
import styles from '../button/style_iphone';


//console.log(ls.get('event'))
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);


export default class MyCalendar extends Component {
  //create state that will hold current events stored
  constructor(props) {
    super(props);
    this.state = {
      events:[]
    };
  }

  //loads data from local storage and converts it into required objects to display events on calendar
  componentDidMount(){
    let tempArray = JSON.parse(localStorage.event)
    let tempArray2 = []
    for (let i = 0; i < tempArray.length; i++){
      let start = new Date(tempArray[i]["start"])
      let end = new Date(tempArray[i]["end"])
      let title = tempArray[i]["title"]
      tempArray2.push({start, end, title})
    }
    console.log(JSON.parse(localStorage.event))
    this.setState({events: tempArray2})
    console.log(tempArray2)
  }

  //function for if event is to be moved to another time and date
  // moveEvent({ event, start, end }) {
  //   const { events } = this.state;

  //   const idx = events.indexOf(event);
  //   const updatedEvent = { ...event, start, end };

  //   const nextEvents = [...events];
  //   nextEvents.splice(idx, 1, updatedEvent);
  // }
  
  //user creates new event with this function
  handleSelect = async({ start, end }) => {
  const title = window.prompt('New Event Name:')
    if (title){
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
    }
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(this.state.events)
	ls.set('event',this.state.events)
  }

  // loadEvents2 = () => {
  //   let array = []

  // }

  //render function that displays the calendar
  render() {
    return (
      <div class={style.container}>
        <DragAndDropCalendar
          selectable
          localizer={localizer}
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"  
          defaultDate={new Date()}
          onEventDrop={this.moveEvent}
          resizable
          onEventResize={console.log}
          defaultView="week"
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={this.handleSelect}
        />
      </div>
    );
  }
}

//function to be exported that will be used by other pages
function Cal() {
  //history constant used to route user to weather if button is clicked
  const history = useHistory();
  //returns the schedule page, contains the header and calendar
	return (
    <div>
      <div class={style.container}>
        <div class="calendar">
          <Header />
          <MyCalendar />
        </div>
      </div>
      <div>
        <button onClick={ () => history.push("/weather") }>Display Weather</button>
      </div>
    </div>
	  );
}