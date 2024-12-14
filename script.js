document.getElementById('getWeather').addEventListener('click', () => {
    const cityName = document.getElementById('city').value;
    const apiKey = '5f510a658aa5c5264064b594ef31a7ec';
    const weatherInfo = document.getElementById('weatherInfo');
    const error = document.getElementById('error');
    const dailyForecast = document.getElementById('dailyForecast');
    const aqiInfo = document.getElementById('aqiInfo');

    if (!cityName) {
        error.textContent = 'Please enter a city name';
        error.classList.remove('hidden');
        weatherInfo.classList.add('hidden');
        aqiInfo.classList.add('hidden');
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const city = data.city.name;
            document.getElementById('cityName').textContent = `Weather Forecast for ${city}`;

            // Display 5-day forecast
            dailyForecast.innerHTML = '';
            data.list.filter((item, index) => index % 8 === 0).forEach(item => {
                const forecastDay = new Date(item.dt * 1000);
                const dayElement = document.createElement('div');
                dayElement.classList.add('day-forecast');

                dayElement.innerHTML = `
                    <div class="date">${forecastDay.toLocaleDateString()}</div>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    <p>${item.main.temp}°C</p>
                    <p>${item.weather[0].description}</p>
                `;

                dailyForecast.appendChild(dayElement);
            });

            weatherInfo.classList.remove('hidden');
            error.classList.add('hidden');

            // Fetch AQI Data
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.city.coord.lat}&lon=${data.city.coord.lon}&appid=${apiKey}`)
                .then(response => response.json())
                .then(aqiData => {
                    const aqi = aqiData.list[0].main.aqi;
                    document.getElementById('aqi').textContent = `AQI: ${aqi}`;

                    const aqiTips = {
                        1: 'Good air quality, enjoy the outdoors!',
                        2: 'Fair air quality, moderate outdoor activities.',
                        3: 'Unhealthy for sensitive groups, avoid prolonged exposure.',
                        4: 'Unhealthy air quality, stay indoors if possible.',
                        5: 'Very unhealthy, avoid all outdoor activities.'
                    };

                    document.getElementById('aqiTips').textContent = aqiTips[aqi] || 'No AQI data available.';
                    aqiInfo.classList.remove('hidden');
                })
                .catch(err => {
                    console.error(err);
                    aqiInfo.classList.add('hidden');
                });
        })
        .catch(err => {
            console.error(err);
            weatherInfo.classList.add('hidden');
            aqiInfo.classList.add('hidden');
            error.textContent = 'City not found or API issue. Please try again.';
            error.classList.remove('hidden');
        });
});

// Location Access Functionality
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('locationModal').style.display = 'flex';

    document.getElementById('allowBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey = '5f510a658aa5c5264064b594ef31a7ec';

                // Fetch current weather and 5-day forecast data for the location
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                    .then(response => response.json())
                    .then(data => {
                        const city = `Your Location`;
                        document.getElementById('cityName').textContent = `Weather at your location`;

                        // Display 5-day forecast
                        dailyForecast.innerHTML = '';
                        data.list.filter((item, index) => index % 8 === 0).forEach(item => {
                            const forecastDay = new Date(item.dt * 1000);
                            const dayElement = document.createElement('div');
                            dayElement.classList.add('day-forecast');

                            dayElement.innerHTML = `
                                <div class="date">${forecastDay.toLocaleDateString()}</div>
                                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                                <p>${item.main.temp}°C</p>
                                <p>${item.weather[0].description}</p>
                            `;

                            dailyForecast.appendChild(dayElement);
                        });

                        weatherInfo.classList.remove('hidden');
                        error.classList.add('hidden');
                    })
                    .catch(err => {
                        console.error(err);
                        weatherInfo.classList.add('hidden');
                        error.textContent = 'Could not retrieve weather data.';
                        error.classList.remove('hidden');
                    });

                // Fetch AQI data for the location
                fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(aqiData => {
                        const aqi = aqiData.list[0].main.aqi;
                        document.getElementById('aqi').textContent = `AQI: ${aqi}`;

                        const aqiTips = {
                            1: 'Good air quality, enjoy the outdoors!',
                            2: 'Fair air quality, moderate outdoor activities.',
                            3: 'Unhealthy for sensitive groups, avoid prolonged exposure.',
                            4: 'Unhealthy air quality, stay indoors if possible.',
                            5: 'Very unhealthy, avoid all outdoor activities.'
                        };

                        document.getElementById('aqiTips').textContent = aqiTips[aqi] || 'No AQI data available.';
                        aqiInfo.classList.remove('hidden');
                    })
                    .catch(err => {
                        console.error(err);
                        aqiInfo.classList.add('hidden');
                    });
            });
        }
        // Close the location modal after accessing location
        document.getElementById('locationModal').style.display = 'none';
    });

    document.getElementById('denyBtn').addEventListener('click', () => {
        document.getElementById('locationModal').style.display = 'none';
    });
});

// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
        }
    });
});
