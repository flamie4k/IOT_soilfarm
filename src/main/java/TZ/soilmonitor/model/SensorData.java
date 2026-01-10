package TZ.soilmonitor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double soilMoisture;
    private double temperature;
    private double humidity;

    private LocalDateTime timestamp;

    // ✅ Add getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getSoilMoisture() { return soilMoisture; }
    public void setSoilMoisture(double soilMoisture) { this.soilMoisture = soilMoisture; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public double getHumidity() { return humidity; }
    public void setHumidity(double humidity) { this.humidity = humidity; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
