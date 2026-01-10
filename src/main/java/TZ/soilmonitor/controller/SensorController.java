package TZ.soilmonitor.controller;

import TZ.soilmonitor.model.SensorData;
import TZ.soilmonitor.repository.SensorDataRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/sensor")
public class SensorController {

    private final SensorDataRepository repository;

    public SensorController(SensorDataRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/data")
    public String receiveData(@RequestBody SensorData data) {
        data.setTimestamp(LocalDateTime.now());
        repository.save(data);
        return "Data received";
    }

    @GetMapping("/latest")
    public SensorData getLatest() {
        return repository.findAll()
                .stream()
                .reduce((first, second) -> second)
                .orElse(null);
    }
}
