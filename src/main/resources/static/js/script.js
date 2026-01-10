let soilChart;

async function fetchLatestData() {
    try {
        const response = await fetch('/api/sensor/latest');
        const data = await response.json();

        if (data) {
            document.getElementById('soil').textContent = data.soilMoisture.toFixed(1);
            document.getElementById('temp').textContent = data.temperature.toFixed(1);
            document.getElementById('humidity').textContent = data.humidity.toFixed(1);
            document.getElementById('time').textContent = new Date(data.timestamp).toLocaleTimeString();
        }
    } catch (err) {
        console.error("Error fetching latest data:", err);
    }
}

async function fetchHistoricalData() {
    try {
        const response = await fetch('/api/sensor/all');
        const allData = await response.json();

        // Take last 10 readings
        const last10 = allData.slice(0, 10).reverse();

        const labels = last10.map(d => new Date(d.timestamp).toLocaleTimeString());
        const soilValues = last10.map(d => d.soilMoisture);

        if (!soilChart) {
            const ctx = document.getElementById('soilChart').getContext('2d');
            soilChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Soil Moisture (%)',
                        data: soilValues,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true }
                    },
                    scales: {
                        y: { beginAtZero: true, max: 100 }
                    }
                }
            });
        } else {
            soilChart.data.labels = labels;
            soilChart.data.datasets[0].data = soilValues;
            soilChart.update();
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
