import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";

function RacingSchedule() {
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(moment().month());

  useEffect(() => {
    const fetchEvents = async () => {
        const authUrl = "https://api.arenaracingcompany.co.uk/auth";
        const authHeaders = {
          "Authorization": "Bearer 264c77f740cc1f02cac8f0a7e30ccdcd2f20dcf5"
        };
        
        // Make the authentication request to obtain the JWT token
        fetch(authUrl, {
          method: "POST",
          headers: authHeaders
        })
        .then(response => response.text())
        .then(jwtToken => {
          const eventsUrl = `https://api.arenaracingcompany.co.uk/event/month/1318/${month+1}`;
          const eventsHeaders = {
            "Authorization": `Bearer ${jwtToken}`
          };
        
          // Use the JWT token to make the events request
          fetch(eventsUrl, {
            method: "GET",
            headers: eventsHeaders
          })
          .then(response => response.json())
          .then(eventsJson => {
            
              setEvents(eventsJson)
          
          });
        });
    };
    fetchEvents();
  }, [month]);

  const filteredEvents = events.filter(
    (event) => {console.log(event,"EVENT"); return moment(event.date).month() === month}
  );

  const monthNames = moment.months();
  const monthName = monthNames[month];

  const handleMonthChange = (event) => {
    setMonth(Number(event.target.value));
  };

  return (
    <div className="App">
      <div className="headingLogo">
     
      <h1>Arena Racing Company</h1>  <img src ="./horselogo.jpg" style={{ width:50, height:50}}/> <h1> ARC</h1>
      </div>
        <div className="month-navigation">
            <div>Select the month to see the events</div>
        <select className="month-select" value={month} onChange={handleMonthChange}>
          {monthNames.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {filteredEvents.length > 1 ?
      <h1>Upcoming Events in {monthName}</h1>
    : 
    <h1>No Upcoming Events in {monthName}</h1>
     }
      <div className="calendar">
        { filteredEvents.map((event) => (
          <div className="event" key={event.id}>
            <div className="event-date">
            {event.title}
                <img src = {event.images.desktop}/>
            </div>
          </div>
        ))}
        
      </div>
      
    </div>
  );
}

export default RacingSchedule;
