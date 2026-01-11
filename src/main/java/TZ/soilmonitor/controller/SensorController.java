package TZ.soilmonitor.controller;

import TZ.soilmonitor.model.SensorData;
import TZ.soilmonitor.repository.SensorDataRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sensor")
@CrossOrigin(origins = "*")
public class SensorController {

    private final SensorDataRepository repository;

    public SensorController(SensorDataRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/data")
    public String receiveData(@RequestBody SensorData data) {
        data.setTimestamp(LocalDateTime.now());
        repository.save(data);
        System.out.println("✓ Data saved: " + data);
        return "Data received";
    }

    @GetMapping("/latest")
    public SensorData getLatest() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"))
                .stream()
                .findFirst()
                .orElse(null);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SensorData>> getAll() {
        // Get all data ordered by timestamp DESC (newest first)
        List<SensorData> allData = repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
        return ResponseEntity.ok(allData);
    }
}