import React, {useState} from 'react';

const api = {
  key: "1926eb0d297a53f9692631ce9c5436c8",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});

  const search = evt => {
    if(evt.key ==="Enter"){
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
        console.log(result);
      });
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
            <div className="pollution">Pollution: 19 AQI</div>
            <div className="forecast">
              This week's forecast:
            </div>
          </div>
        ) : ('')} 
      </div>
      
    </div>
  );
}

export default App;
