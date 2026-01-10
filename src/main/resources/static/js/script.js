let soilChart;

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
        const last10 = allData.slice(0, 10).reverse();
        const labels = last10.map(d => new Date(d.timestamp).toLocaleTimeString());
        const soilValues = last10.map(d => d.soilMoisture);
        const tempValues = last10.map(d => d.temperature);
        const humidityValues = last10.map(d => d.humidity);
        
        if (!soilChart) {
            const ctx = document.getElementById('soilChart').getContext('2d');
            soilChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Soil Moisture (%)',
                            data: soilValues,
                            borderColor: '#8B4513',
                            backgroundColor: 'rgba(139, 69, 19, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#8B4513',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        },
                        {
                            label: 'Temperature (°C)',
                            data: tempValues,
                            borderColor: '#F56565',
                            backgroundColor: 'rgba(245, 101, 101, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#F56565',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        },
                        {
                            label: 'Humidity (%)',
                            data: humidityValues,
                            borderColor: '#4299E1',
                            backgroundColor: 'rgba(66, 153, 225, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: '#4299E1',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 13,
                                    weight: '600'
                                },
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 13
                            },
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    size: 12,
                                    weight: '500'
                                },
                                color: '#718096',
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    size: 11,
                                    weight: '500'
                                },
                                color: '#718096',
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    },
                    animation: {
                        duration: 750,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        } else {
            soilChart.data.labels = labels;
            soilChart.data.datasets[0].data = soilValues;
            soilChart.data.datasets[1].data = tempValues;
            soilChart.data.datasets[2].data = humidityValues;
            soilChart.update('active');
        }
    } catch (err) {
        console.error("Error fetching historical data:", err);
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