package TZ.soilmonitor.repository;

import TZ.soilmonitor.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
}
