import React, {useState} from 'react';

const api = {
  key: "1926eb0d297a53f9692631ce9c5436c8",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [coord, setCoord] = useState({});
  let lat;
  let lon;

  const search = evt => {
    if(evt.key ==="Enter"){
     
      // Get today's weather
      let todaysWeatherForecast = `${api.base}weather?q=${query}&units=metric&APPID=${api.key}`;
      
      const getForecast = async () => {
        const res = await fetch(todaysWeatherForecast);
        const data = await res.json();
        setWeather(data);
        setQuery('');
        console.log("Response", data);
        lat = data.coord.lat;
        lon = data.coord.lon;

        // Get 5 days' forecast
        fetch(`${api.base}forecast/?q=${query}&appid=${api.key}`)
          .then(res3 => res3.json())
          .then(data => {
            console.log("5 days forecast", data);
            let minTemp = [];
            let chunk;
            let averDayMinTemp;
            let averMinTemps = [];

            data.list.forEach((e) => {
              minTemp.push(Number(e.main.temp_min));
            });
            for (let i = 0; i < 40; i += 8) {
              chunk = minTemp.slice(i, i + 8);
              averDayMinTemp = chunk.reduce((a, b) => a + b, 0) / chunk.length;
              averDayMinTemp = Math.round(averDayMinTemp-273.15);
              averMinTemps.push(averDayMinTemp);
            }
            console.log('averMinTemps ',averMinTemps)
          });
        //Get air pollution
        fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&appid=${api.key}`)
          .then(res2 => res2.json())
          .then(result2 => {
            setCoord(result2);
            console.log("air pollution", result2);
          });
      };
      getForecast();   
    }
  }

  return (
    <div className="app">
      <div className="search_box">
        <input 
          type="text"
          placeholder="Enter zip or city"
          onChange={e => setQuery(e.target.value)}
          value={query}
          onKeyPress={search}
        />
      </div>
      
      <div className="wrapper">
        {(typeof weather.main !=="undefined") ? (
          <div>
            <div className="location">{weather.name}</div>       
            <div className="temperature">{Math.round(weather.main.temp)}&#176;C</div>
            <div className="current_weather">          
              <div className="description">
                <p className="param">Sky</p>
                {weather.weather[0].main}
              </div>
              <div className="humidity">
                <p className="param">Humidity</p>
                {Math.round(weather.main.humidity)}% 
              </div>
              <div className="wind">
                <p className="param">Wind</p>
                {weather.wind.speed} m/s
              </div>
            </div>
          </div>
        ) : ('')} 
        {(typeof coord.list !=="undefined") ? (
          <div className="pollution">Air quality: 
            {(coord.list[0].main.aqi===1) ? " Good" : 
              (coord.list[0].main.aqi===2) ? " Fair" : 
                (coord.list[0].main.aqi===3) ? " Moderate" : 
                  (coord.list[0].main.aqi===4) ? " Poor" :
                    (coord.list[0].main.aqi===5) ? " Very Poor" : ''
            }
          </div>
        ) : ('')} 
        {(typeof coord.list !=="undefined") ? (           
            <div className="forecast">
              This week's forecast: 
            </div>
        ) : ('')} 
      </div>
      
    </div>
  );
}

export default App;
