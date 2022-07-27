import React, {useState} from 'react';

const api = {
  key: "1926eb0d297a53f9692631ce9c5436c8",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [coord, setCoord] = useState({});
  const [weather5day, setweather5day] = useState({});
  let lat;
  let lon;
  let averageTempArray = [];
  let chunk;
  let averDayTemp;
  let datesArray = [];
  let date;
  const kelvins = 273.15; 
  const apiEntriesPerDay = 8;
  const totalAPIEntries = 40;

  const search = evt => {
    if(evt.key ==="Enter"){
     
      // Get today's weather
      let todaysWeatherForecastQuery = `${api.base}weather?q=${query}&units=metric&APPID=${api.key}`;
      
      const getForecast = async () => {
        const res = await fetch(todaysWeatherForecastQuery);
        const data = await res.json();
        if (data.cod !== '404'){   
          setWeather(data);
          setQuery('');
          console.log("Response", data);
            
          lat = data.coord.lat;
          lon = data.coord.lon;
          document.getElementsByClassName('wrapper')[0].style.visibility = "visible";

          // Get 5 days' forecast
          fetch(`${api.base}forecast/?q=${query}&appid=${api.key}`)
            .then(res3 => res3.json())
            .then(data => {
              console.log("5 days forecast", data);            
              
              data.list.forEach((e) => {
                averageTempArray.push(Number(e.main.temp));
                // Getting the date and time
                datesArray.push(e.dt_txt);
              });
              // Api returns data ...
              let forcastData = {text: []};

              for (let i = 0; i < totalAPIEntries; i += apiEntriesPerDay) {
                // Create a chunk array that has all the temperature for each day 
                chunk = averageTempArray.slice(i, i + 8);
                // Use reduce function to return an average temperature for a day
                averDayTemp = chunk.reduce((a, b) => a + b, 0) / chunk.length;
                // Api returns temperature in Kelvins,
                // subtract 273.15 to receive temperature in Celcius
                averDayTemp = Math.round(averDayTemp-kelvins);
                // Format date to print it without a year.
                date = new Date(datesArray[i]).toDateString().slice(0,-5);
                forcastData.text.push(`${date}: ${'\xa0'} ${averDayTemp}`);
              }  
              
              setweather5day(forcastData);
              console.log("My Saved data", forcastData);
          });

          //Get air pollution
          fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&appid=${api.key}`)
            .then(res2 => res2.json())
            .then(result2 => {
              setCoord(result2);
              console.log("air pollution", result2);
            });
          } else {
            //If the city is not recognised (response 404)
            alert('Please check the name of the city/zip');
          }
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
            <div className="location">{weather.name}, {weather.sys.country}</div>       
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
          <div className="pollution"><span className="bold">Air quality: </span>
            {(coord.list[0].main.aqi===1) ? " Good" : 
              (coord.list[0].main.aqi===2) ? " Fair" : 
                (coord.list[0].main.aqi===3) ? " Moderate" : 
                  (coord.list[0].main.aqi===4) ? " Poor" :
                    (coord.list[0].main.aqi===5) ? " Very Poor" : ''
            }
          </div>
        ) : ('')} 
        {(typeof weather5day.text !=="undefined") ? (           
            <div className="forecast">
              <span className="bold">This week's forecast: </span>
              <ul className="five_day_forecast">
                <li>{weather5day.text[0]}&#176;C</li>
                <li>{weather5day.text[1]}&#176;C</li>
                <li>{weather5day.text[2]}&#176;C</li>
                <li>{weather5day.text[3]}&#176;C</li>
                <li>{weather5day.text[4]}&#176;C</li>
              </ul>
            </div>
        ) : ('')} 
      </div>
      
    </div>
  );
}

export default App;
