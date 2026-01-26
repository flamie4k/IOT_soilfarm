package TZ.soilmonitor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {
    private static final String WEATHER_API_KEY = "ed6fcb9c86a5413d95842222262501";
    private static final String WEATHER_API_URL = "https://api.weatherapi.com/v1/forecast.json";
    private static final double LATITUDE = 27.7167;
    private static final double LONGITUDE = 85.3167;
    
    @GetMapping("/forecast")
    public ResponseEntity<String> getWeatherForecast() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            
            String url = String.format(
                "%s?key=%s&q=%f,%f&days=5&aqi=no",
                WEATHER_API_URL,
                WEATHER_API_KEY,
                LATITUDE,
                LONGITUDE
            );
            
            System.out.println("Fetching weather from: " + url);
            String weatherData = restTemplate.getForObject(url, String.class);
            
            System.out.println("✓ Weather data fetched successfully");
            
            return ResponseEntity.ok(weatherData);
            
        } catch (Exception e) {
            System.err.println("✗ Error fetching weather: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body("{\"error\": \"Failed to fetch weather data\"}");
        }
    }
}