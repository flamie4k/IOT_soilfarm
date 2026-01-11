# AgroSense 

This project implements a **smart plant irrigation system** using an ESP32, a soil moisture sensor, a DHT temperature and humidity sensor, and a relay-controlled water pump. The system reads environmental data, determines when the soil needs watering, and activates a pump automatically. Sensor data is sent to a server for monitoring.

---

## Features

- **Soil Moisture Monitoring**: Reads soil moisture via a capacitive soil sensor and converts to percentage.
- **Temperature & Humidity Monitoring**: Uses DHT11/DHT22 sensor to track ambient conditions.
- **Automated Watering**: Relay controls a 5V DC water pump when soil moisture falls below a threshold.
- **Wi-Fi Connectivity**: ESP32 connects to Wi-Fi and sends sensor data via HTTP POST to a local or remote server.
- **Configurable Parameters**: 
  - Moisture threshold
  - Pump duration
  - Sensor read interval
  - Pump cooldown time
