async function fetchLatestData() {
    try {
        const response = await fetch('/api/sensor/latest');
        const data = await response.json();
        if (data) {
            // Update values
            document.getElementById('soil').textContent = data.soilMoisture.toFixed(1);
            document.getElementById('temp').textContent = data.temperature.toFixed(1);
            document.getElementById('humidity').textContent = data.humidity.toFixed(1);
            document.getElementById('time').textContent = new Date(data.timestamp).toLocaleTimeString();
            
            // Update progress bars
            updateProgressBar('soil-progress', data.soilMoisture);
            updateProgressBar('temp-progress', (data.temperature / 50) * 100); // Assuming max 50°C
            updateProgressBar('humidity-progress', data.humidity);
            
            // Update status badges
            updateStatusBadge('soil-status', data.soilMoisture, 'soil');
            updateStatusBadge('temp-status', data.temperature, 'temp');
            updateStatusBadge('humidity-status', data.humidity, 'humidity');
        }
    } catch (err) {
        console.error("Error fetching latest data:", err);
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
        const response = await fetch('/api/sensor/all');
        const allData = await response.json();
        
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
                        <span class="reading-label">💧 Soil Moisture</span>
                        <span class="reading-value">${reading.soilMoisture.toFixed(1)}%</span>
                    </div>
                    <div class="reading-field">
                        <span class="reading-label">🌡️ Temperature</span>
                        <span class="reading-value">${reading.temperature.toFixed(1)}°C</span>
                    </div>
                    <div class="reading-field">
                        <span class="reading-label">💨 Humidity</span>
                        <span class="reading-value">${reading.humidity.toFixed(1)}%</span>
                    </div>
                    <div class="reading-field">
                        <span class="reading-label">⚙️ Pump Status</span>
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
            '<p style="text-align: center; color: #e53e3e; padding: 40px;">Error loading readings</p>';
    }
}

// Refresh data every 5 seconds
setInterval(() => {
    fetchLatestData();
    fetchHistoricalData();
}, 5000);

// Initial load
fetchLatestData();
fetchHistoricalData();