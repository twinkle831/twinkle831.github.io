document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "7e8315ac75abce5cf6f0483b177976d2";
    const searchButton = document.getElementById("submit");
    const locationInput = document.getElementById("location");
    const locationName = document.querySelector(".loc");
    const temperature = document.querySelector(".loc:nth-of-type(2)");
    const description = document.querySelector(".loc:nth-of-type(2) + br + br");
    const wPanel = document.getElementById("wPanel");
    const hourlyForecast = document.querySelector("#hourly-forecast .hourly-cards");
    fetchWeatherData("Delhi");
    fetchHourlyForecast("Delhi");
  
    searchButton.addEventListener("click", function (e) {
      e.preventDefault();
      const location = locationInput.value;
      if (location) {
        fetchWeatherData(location);
        fetchHourlyForecast(location);
      }
    });
  
    function fetchWeatherData(location) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === 200) {
            displayWeatherData(data);
            if (data.coord && data.coord.lat && data.coord.lon) {
              fetchSunriseSunsetTimes(data.coord.lat, data.coord.lon);
            } else {
              console.error("Latitude and longitude data not available.");
            }
          } else {
            locationName.textContent = "Location not found";
            temperature.textContent = "";
            wPanel.style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  
    function fetchHourlyForecast(location) {
      const hourlyApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
  
      fetch(hourlyApiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === "200") {
            displayHourlyForecast(data.list);
            displayDailyForecast(data.list);
  
          }
        })
        .catch((error) => {
          console.error("Error fetching hourly forecast:", error);
        });
    }
  
  function displayWeatherData(data) {
      locationName.textContent = `${data.name}, ${data.sys.country}`;
      temperature.textContent = `${data.main.temp}° C`;
  
      const curWElements = document.querySelectorAll(".curW");
      if (curWElements.length >= 6) {
        curWElements[3].textContent = `Pressure: ${getPressure(data)} hPa`;
        curWElements[1].textContent = `Humidity: ${data.main.humidity}%`;
        curWElements[2].textContent = `Visibility: ${data.visibility / 1000} km`;
        curWElements[0].textContent = `Wind Speed: ${data.wind.speed} m/s`;
        curWElements[4].textContent = `Longitude: ${data.coord.lon}°N`;
        curWElements[5].textContent = `Latitude: ${data.coord.lat}°E`;
      }
  
      wPanel.style.display = "block";
    }
  
    function getPressure(data) {
      if (data.main && data.main.pressure) {
        return data.main.pressure;
      } else {
        return "Pressure data not available";
      }
    }
  
    function updateClock() {
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      var timeString = hours + ':' + padZero(minutes) +' ' + ampm;
      document.getElementById('clock').textContent = timeString;
  
    }
  
    function padZero(num) {
      return (num < 10 ? '0' : '') + num;
    }
  
    setInterval(updateClock, 1000);
  
    function displayDayAndDate() {
      var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var now = new Date();
      var dayOfWeek = daysOfWeek[now.getDay()];
      var dayOfMonth = now.getDate();
      var month = now.getMonth() + 1; // add 1 since getMonth() returns 0-based values
      var year = now.getFullYear();
      var dateString = dayOfWeek + ', ' + dayOfMonth + '/' + month + '/' + year;
      document.getElementById('day-and-date').textContent = dateString;
    }
  
    window.onload = function() {
      displayDayAndDate();
    };
  
    function displayHourlyForecast(hourlyData) {
      const hourlyContainer = document.getElementById("hourly");
      hourlyContainer.innerHTML = "";
  
      for (let i = 0; i < hourlyData.length; i++) {
        const forecast = hourlyData[i];
  
        const time = new Date(forecast.dt * 1000);
        const hours = time.getHours();
        const formattedTime = hours >= 10 ? `${hours}:00hrs` : `0${hours}:00hrs`;
        const isDay = hours >= 6 && hours < 18;
  
        const card = document.createElement("div");
        card.className = "hCards";
        card.innerHTML = `<div class="hCardTime">${formattedTime}</div>`;
        card.innerHTML += `<img src="resc/${getWeatherIcon(forecast.weather[0].icon, isDay)}.png" alt="" class="icoimg">`;
        card.innerHTML += `<div class="hCardTemp">${forecast.main.temp}° C</div>`;
  
        hourlyContainer.appendChild(card);
      }
    }
  
    function getWeatherIcon(iconCode, isDay) {
      if (isDay) {
        if (iconCode === "01d" || iconCode === "02d") {
          return "sunny";
        } else {
          return "sunny";
        }
      } else {
        if (iconCode === "01n" || iconCode === "02n") {
          return "night";
        } else {
          return "clouds-and-sun";
        }
      }
    }
  
    function fetchSunriseSunsetTimes(latitude, longitude) {
      const sunriseSunsetApiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`;
    
      fetch(sunriseSunsetApiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "OK") {
            const sunriseTime = data.results.sunrise;
            const sunsetTime = data.results.sunset;
            const solar_noon = data.results.solar_noon;
            const dayLength = data.results.day_length;
            const twilightBegin = data.results.civil_twilight_begin;
            document.getElementById("sunrise-time").textContent = sunriseTime;
            document.getElementById("sunset-time").textContent = sunsetTime;
            document.getElementById("solar-noon-time").textContent = solar_noon;
            document.getElementById("day-length-time").textContent = dayLength;
            document.getElementById("twilight-begin-time").textContent = twilightBegin;
          }
        })
        .catch((error) => {
          console.error("Error fetching sunrise and sunset times:", error);
        });
    }  
  })
  function displayDailyForecast(hourlyData) {
    const dailyForecast = [];
    let currentDate = null;
  
    for (const forecast of hourlyData) {
      const forecastDate = new Date(forecast.dt * 1000);
      //console.log("forecastDate:", forecastDate);
  
      if (currentDate === null || forecastDate.getDate() !== currentDate.getDate()) {
        const newDayData = {
          date: forecastDate,
          minTemp: Number.MAX_VALUE,
          maxTemp: Number.MIN_VALUE,
        };
        dailyForecast.push(newDayData);
        currentDate = forecastDate;
       // console.log("dailyForecast updated:", dailyForecast);
      }
  
      const dayData = dailyForecast[dailyForecast.length - 1];
      const temperature = forecast.main.temp;
      //console.log("dayData:", dayData);
      dayData.minTemp = Math.min(dayData.minTemp, temperature);
      dayData.maxTemp = Math.max(dayData.maxTemp, temperature);
    }
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date().getDay();
    const dailyContainer = document.getElementById("week");
    dailyForecast.forEach((dayData, index) => {
      const dayElement = dailyContainer.children[index];
      const dayIndex = (today + index) % 7;
      //console.log("dayElement:", dayElement); // Add this line
      dayElement.querySelector(".cday").textContent = dayNames[dayIndex];
      dayElement.querySelector(".cdate").textContent = formatDate(dayData.date);
      dayElement.querySelector(".caption-min-temp").textContent = `Min Temp: ${dayData.minTemp}° C`;
      dayElement.querySelector(".caption-max-temp").textContent = `Max Temp: ${dayData.maxTemp}° C`;
    });
    
    
  }
  
  
  
  function getDayOfWeek(day) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[day];
  }
  
  function formatDate(date) {
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }
  