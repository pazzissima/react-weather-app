import React, {useState} from 'react';

function App() {
  return (
    <div className="app">
      <div className="wrapper">
        <div className="location">
          <p>Chicago</p>
        </div>
        <div className="temperature">
          <p>80&#176;F</p>
        </div>
        <div className="current_weather">          
          <div className="description">
            <p>Sunny</p>
          </div>
          <div className="humidity">
            <p>50%</p>
          </div>
          <div className="wind">
            <p>5 MPH</p>
          </div>
        </div>
        <div className="pollution">Pollution: 19 AQI</div>
        <div className="forecast">
          This week's forecast:
        </div>
      </div>
    </div>
  );
}

export default App;
