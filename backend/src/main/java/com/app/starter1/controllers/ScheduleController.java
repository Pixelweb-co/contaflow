package com.app.starter1.controllers;


import com.app.starter1.dto.ScheduleRequest;
import com.app.starter1.persistence.entity.Schedule;
import com.app.starter1.persistence.repository.ScheduleRepository;

import com.app.starter1.persistence.services.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleController  {

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Endpoint para obtener los schedules de un dispositivo específico
    @GetMapping("/device/{deviceId}")
    public List<Schedule> getSchedulesByDevice(@PathVariable Long deviceId) {
        return scheduleRepository.findByDeviceId(deviceId);
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> findAll(){

        List<Schedule> schedules = scheduleService.getAllSchedules();

        return ResponseEntity.ok(schedules);
    }

    // Endpoint para programar un mantenimiento (crear un schedule)
    @PostMapping("/create")
    public ResponseEntity<?> createSchedules(@RequestBody ScheduleRequest scheduleRequest) {
        try {
            scheduleService.createSchedules(scheduleRequest);
            return ResponseEntity.ok("Mantenimientos programados correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al programar mantenimientos");
        }
    }
}
