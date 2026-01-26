// Test if backend is reachable
async function testBackendConnection() {
    try {
        const response = await fetch('/api/sensor/latest');
        console.log('Backend response status:', response.status);
        console.log('Backend response ok:', response.ok);
        
        if (!response.ok) {
            console.error('Backend returned error:', response.status, response.statusText);
            return false;
        }
        
        const data = await response.json();
        console.log('Received sensor data:', data);
        return true;
    } catch (err) {
        console.error("Cannot connect to backend:", err);
        console.error("Make sure your Spring Boot app is running!");
        return false;
    }
}

// Weather icon mapping
function getWeatherIcon(conditionText) {
    const condition = conditionText.toLowerCase();
    if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
    if (condition.includes('partly cloudy')) return '⛅';
    if (condition.includes('cloudy') || condition.includes('overcast')) return '☁️';
    if (condition.includes('rain') || condition.includes('drizzle')) return '🌧️';
    if (condition.includes('storm') || condition.includes('thunder')) return '⛈️';
    if (condition.includes('snow') || condition.includes('sleet')) return '❄️';
    if (condition.includes('mist') || condition.includes('fog')) return '🌫️';
    return '🌤️';
}

// Fetch weather data
async function fetchWeatherData() {
    try {
        console.log('Fetching weather data...');
        const response = await fetch('/api/weather/forecast');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        
        updateCurrentWeather(data);
        updateForecast(data);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayWeatherError();
    }
}

// Update current weather display
function updateCurrentWeather(data) {
    try {
        const current = data.current;
        const location = data.location;
        
        console.log('Updating current weather with:', current);
        
        // Update weather icon
        const icon = getWeatherIcon(current.condition.text);
        document.getElementById('currentWeatherIcon').textContent = icon;
        
        // Update temperature
        document.getElementById('currentTemp').textContent = Math.round(current.temp_c);
        
        // Update description
        document.getElementById('currentDescription').textContent = current.condition.text;
        
        // Update details
        document.getElementById('currentHumidity').textContent = `${current.humidity}%`;
        document.getElementById('currentWind').textContent = `${(current.wind_kph / 3.6).toFixed(1)} m/s`;
        document.getElementById('currentRain').textContent = `${current.precip_mm} mm`;
        document.getElementById('currentUV').textContent = current.uv;
    } catch (error) {
        console.error('Error updating current weather:', error);
    }
}

// Update forecast display
function updateForecast(data) {
    try {
        const forecastGrid = document.getElementById('forecastGrid');
        const forecastDays = data.forecast.forecastday;
        
        console.log('Updating forecast with', forecastDays.length, 'days');
        
        let forecastHTML = '';
        
        forecastDays.forEach((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const icon = getWeatherIcon(day.day.condition.text);
            
            forecastHTML += `
                <div class="forecast-card">
                    <div class="forecast-day">${index === 0 ? 'Today' : dayName}</div>
                    <div class="forecast-date">${dateStr}</div>
                    <div class="forecast-icon">${icon}</div>
                    <div class="forecast-temp">
                        <span class="temp-max">${Math.round(day.day.maxtemp_c)}°</span>
                        <span class="temp-min">${Math.round(day.day.mintemp_c)}°</span>
                    </div>
                    <div class="forecast-desc">${day.day.condition.text}</div>
                    <div class="forecast-details">
                        <div class="forecast-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                            </svg>
                            <span class="forecast-detail-value">${day.day.avghumidity}%</span>
                        </div>
                        <div class="forecast-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2"/>
                            </svg>
                            <span class="forecast-detail-value">${Math.round(day.day.maxwind_kph / 3.6)}m/s</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        forecastGrid.innerHTML = forecastHTML;
    } catch (error) {
        console.error('Error updating forecast:', error);
    }
}

// Display error message
function displayWeatherError() {
    document.getElementById('currentTemp').textContent = '--';
    document.getElementById('currentDescription').textContent = 'Unable to load weather data';
    document.getElementById('forecastGrid').innerHTML = 
        '<div class="forecast-loading">Failed to load weather forecast. Check console for errors.</div>';
}

// Fetch latest sensor data
async function fetchLatestData() {
    try {
        console.log('Fetching latest sensor data...');
        const response = await fetch('/api/sensor/latest');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Latest sensor data:', data);
        
        if (data) {
            // Update values
            document.getElementById('soil').textContent = data.soilMoisture.toFixed(1);
            document.getElementById('temp').textContent = data.temperature.toFixed(1);
            document.getElementById('humidity').textContent = data.humidity.toFixed(1);
            document.getElementById('time').textContent = new Date(data.timestamp).toLocaleTimeString();
            
            // Update progress bars
            updateProgressBar('soil-progress', data.soilMoisture);
            updateProgressBar('temp-progress', (data.temperature / 50) * 100);
            updateProgressBar('humidity-progress', data.humidity);
            
            // Update status badges
            updateStatusBadge('soil-status', data.soilMoisture, 'soil');
            updateStatusBadge('temp-status', data.temperature, 'temp');
            updateStatusBadge('humidity-status', data.humidity, 'humidity');
        }
    } catch (err) {
        console.error("Error fetching latest data:", err);
        console.error("Make sure your Spring Boot backend is running on the correct port!");
    }
}

function updateProgressBar(elementId, value) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = Math.min(value, 100) + '%';
    }
}

function updateStatusBadge(elementId, value, type) {
    const badge = document.getElementById(elementId);
    if (!badge) return;
    
    let status = '';
    let bgColor = '';
    let textColor = '';
    
    if (type === 'soil') {
        if (value < 20) {
            status = '🔴 Too Dry';
            bgColor = '#FED7D7';
            textColor = '#742A2A';
        } else if (value < 40) {
            status = '🟡 Low Moisture';
            bgColor = '#FEEBC8';
            textColor = '#7C2D12';
        } else if (value < 70) {
            status = '🟢 Optimal';
            bgColor = '#C6F6D5';
            textColor = '#22543D';
        } else {
            status = '🔵 High Moisture';
            bgColor = '#BEE3F8';
            textColor = '#2C5282';
        }
    } else if (type === 'temp') {
        if (value < 10) {
            status = '🥶 Too Cold';
            bgColor = '#BEE3F8';
            textColor = '#2C5282';
        } else if (value < 35) {
            status = '🟢 Optimal';
            bgColor = '#C6F6D5';
            textColor = '#22543D';
        } else {
            status = '🔥 Too Hot';
            bgColor = '#FED7D7';
            textColor = '#742A2A';
        }
    } else if (type === 'humidity') {
        if (value < 30) {
            status = '💨 Too Dry';
            bgColor = '#FEEBC8';
            textColor = '#7C2D12';
        } else if (value < 70) {
            status = '🟢 Optimal';
            bgColor = '#C6F6D5';
            textColor = '#22543D';
        } else {
            status = '💧 Too Humid';
            bgColor = '#BEE3F8';
            textColor = '#2C5282';
        }
    }
    
    badge.textContent = status;
    badge.style.backgroundColor = bgColor;
    badge.style.color = textColor;
}

async function fetchHistoricalData() {
    try {
        console.log('Fetching historical sensor data...');
        const response = await fetch('/api/sensor/all');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allData = await response.json();
        console.log('Historical data received:', allData.length, 'readings');
        
        // Take last 10 readings
        const last10 = allData.slice(0, 10);
        
        const listContainer = document.getElementById('readingsList');
        
        if (last10.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No readings available yet</p>';
            return;
        }
        
        // Build the list HTML
        let listHTML = '';
        last10.forEach((reading, index) => {
            const timestamp = new Date(reading.timestamp);
            listHTML += `
                <div class="reading-item" style="animation-delay: ${index * 0.05}s">
                    <div class="reading-field">
                        <span class="reading-label">Soil Moisture</span>
                        <span class="reading-value">${reading.soilMoisture.toFixed(1)}%</span>
                    </div>
                    <div class="reading-field">
                        <span class="reading-label">Temperature</span>
                        <span class="reading-value">${reading.temperature.toFixed(1)}°C</span>
                    </div>
                    <div class="reading-field">
                        <span class="reading-label">Humidity</span>
                        <span class="reading-value">${reading.humidity.toFixed(1)}%</span>
                    </div>
                    <div class="reading-field">
                        <span class="reading-label">Pump Status</span>
                        <span class="reading-value">${reading.pumpStatus || 'N/A'}</span>
                    </div>
                    <div class="reading-time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}
                    </div>
                </div>
            `;
        });
        
        listContainer.innerHTML = listHTML;
        
    } catch (err) {
        console.error("Error fetching historical data:", err);
        document.getElementById('readingsList').innerHTML = 
            '<p style="text-align: center; color: #e53e3e; padding: 40px;">Error loading readings. Check console for details.</p>';
    }
}

// INITIALIZATION
console.log('Initializing AgroSense Dashboard...');

// Test backend connection first
testBackendConnection().then(connected => {
    if (connected) {
        console.log('✓ Backend connection successful');
        
        // Initial load
        fetchLatestData();
        fetchHistoricalData();
        fetchWeatherData();
        
        // Set up refresh intervals
        setInterval(() => {
            fetchLatestData();
            fetchHistoricalData();
        }, 5000);
        
        setInterval(() => {
            fetchWeatherData();
        }, 1800000);
        
    } else {
        console.error('✗ Cannot connect to backend. Please check:');
        console.error('1. Is your Spring Boot application running?');
        console.error('2. Is it running on http://localhost:8080?');
        console.error('3. Are the API endpoints correct?');
    }
});