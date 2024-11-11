import "./Weather.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationCrosshairs,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Codes } from "../codes";

function Weather() {
  const [city, setCity] = useState("Bengaluru");
  const [weather, setWeather] = useState(null);
  const [noresult, setNoresult] = useState(false);
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const currentdayIcon = Object.keys(Codes).find((icon) =>
        Codes[icon].includes(data.current.condition.code)
      );
      const nextdaysIcons = data.forecast.forecastday.map((day) =>
        Object.keys(Codes).find((icon) =>
          Codes[icon].includes(day.day.condition.code)
        )
      );
      setWeather({ ...data, currentdayIcon, nextdaysIcons });;
      setNoresult(false);
      if (data && data.location) {
        setCity(data.location.name);
      }
    } catch {
      setNoresult(true);
    }
  };

  useEffect(() => {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=8`;
    fetchData(apiUrl);
  }, []);

  const handleOnChange = (event) => {
    setCity(event.target.value);
  };

  const submitWeather = (event) => {
    event.preventDefault();
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=8`;
    fetchData(apiUrl);
  };

  const currentloc = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=8`;
        fetchData(apiUrl);
      },
      () => {
        alert(
          "Location permission was denied by you. Please enable location permissions to proceed."
        );
      }
    );
  };

  return (
    <div className="content">
      <div className="items1">
        <button id="currentloc" onClick={currentloc}>
          <FontAwesomeIcon icon={faLocationCrosshairs} />
        </button>
        <form onSubmit={submitWeather}>
          <input
            className="inputsearch"
            type="search"
            placeholder="Enter City Name"
            value={city}
            required
            onChange={handleOnChange}
          />
          <button type="submit" id="searchisco">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
        <button id="favourite">
          <FontAwesomeIcon icon={faStar} />
        </button>
      </div>
      {noresult ? (
        <div className="no-result">
          <div className="items3">
            <img id="no-img" src="/icons/no-result.svg" alt="No result" />
            <p>No results found. Please try a different city.</p>
          </div>
        </div>
      ) : (
        weather && (
          <div className="items">
            <div className="cit">
              <p id="city">{weather.location.name}</p>
            </div>

            <div className="items4">
              <div className="extraData">
                <div className="hw">
                  <div className="humidity">
                    <p id="hum">Humidity</p>
                    <p id="weath">{weather.current.humidity}%</p>
                  </div>
                  <div className="wind">
                    <p id="speed">Wind-Speed</p>
                    <p id="kph">{weather.current.wind_kph}Kph</p>
                  </div>
                </div>
              </div>

              <div className="weatheritems">
                <div className="time">
                  <div className="date">
                    <p>Date: {weather.location.localtime.slice(0, -5)}</p>
                    <p>Time:{weather.location.localtime.slice(10)}</p>
                  </div>
                </div>

                <div className="flex">
                  <img
                    id="image"
                    src={`/icons/${weather.currentdayIcon}.svg`}
                    alt="Weather icon"
                  />
                  <div className="temp">
                    <p id="celcius"> {weather.current.temp_c}&#176;c</p>
                    <br />
                    <p id="weather-name">{weather.current.condition.text}</p>
                  </div>
                </div>
              </div>
              <div className="extraData1">
                <div className="ext">
                  <div className="sunrise">
                    <p id="sun">Sunrise</p>
                    <p id="suntime">
                      {weather.forecast.forecastday[0].astro.sunrise}
                    </p>
                  </div>
                  <div className="sunset">
                    <p id="suns">Sunset</p>
                    <p id="sunstime">
                      {weather.forecast.forecastday[0].astro.sunset}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="days">
              <div className="day-container">
                {weather.forecast.forecastday.slice(1).map((day, index) => (
                  <div className="day" key={index}>
                    <p id="dayDate">{day.date}</p>
                    <div className="mediaflex">
                      <img
                        id="dayImage"
                        src={`/icons/${weather.nextdaysIcons[index + 1]}.svg`}
                        alt="Weather icon"
                      />
                      <div className="mediq1">
                        <p id="dayTemp">{day.day.maxtemp_c}&#176;c</p>
                        <p id="dayText">{day.day.condition.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Weather;
