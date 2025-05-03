package com.app.starter1.persistence.repository;

import com.app.starter1.persistence.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Método para encontrar todos los schedules por el dispositivo
    List<Schedule> findByDeviceId(Long deviceId);

    // Método para encontrar un schedule por su fecha
    List<Schedule> findByDate(String date);


    // Método para verificar si ya existe un Schedule con el mismo dispositivo y fecha
    boolean existsByDeviceIdAndDate(Long deviceId, String date);

    @Query("SELECT s FROM Schedule s JOIN FETCH s.device d")
    List<Schedule> findAllSchedulesWithDevice();
}
