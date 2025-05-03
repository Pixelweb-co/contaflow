package com.app.starter1.controllers;

import com.app.starter1.dto.SolicitudDTO;
import com.app.starter1.dto.SolicitudResponseDTO;
import com.app.starter1.persistence.entity.Solicitud;
import com.app.starter1.persistence.services.SolicitudService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/solicitudes")
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;

    @Transactional
    @GetMapping
    public ResponseEntity<List<SolicitudResponseDTO>> getAllSolicitudes() {
        List<SolicitudResponseDTO> solicitudes = solicitudService.getSolicitudes();
        return ResponseEntity.ok(solicitudes);
    }

    @Transactional
    @PostMapping
    public ResponseEntity<List<Solicitud>> createSolicitud(@RequestBody SolicitudDTO solicitudDTO) {
        List<Solicitud> createdSolicitudes = solicitudService.createSolicitudes(solicitudDTO);
        return ResponseEntity.ok(createdSolicitudes);
    }

    @Transactional
    @GetMapping("/finalizadas/{productId}")
    public ResponseEntity<List<SolicitudResponseDTO>> getSolicitudesCerradasPorProducto(@PathVariable Long productId) {
        List<SolicitudResponseDTO> solicitudesCerradas = solicitudService.getSolicitudesCerradasPorProducto(productId);
        return ResponseEntity.ok(solicitudesCerradas);
    }


    @Transactional
    @GetMapping("/worklist/{id_usuario}")
    public ResponseEntity<List<SolicitudResponseDTO>> getSolicitudesAbiertas(@PathVariable Long id_usuario) {
        List<SolicitudResponseDTO> solicitudesAbiertas = solicitudService.getSolicitudesAbiertasPorUsuario(id_usuario);
        return ResponseEntity.ok(solicitudesAbiertas);
    }

    // Endpoint para obtener solicitudes abiertas para el usuario con fecha de hoy
    @GetMapping("/worklist/today/{userId}")
    public ResponseEntity<List<SolicitudResponseDTO>> getSolicitudesHoy(@PathVariable Long userId) {
        // Obtén la fecha de hoy en formato String (asegúrate de que coincida con el formato de tu base de datos)
        String fechaHoy = LocalDate.now().toString(); // "yyyy-MM-dd"

        // Llama al servicio para obtener las solicitudes filtradas
        List<SolicitudResponseDTO> solicitudes = solicitudService.getSolicitudesHoy(userId, fechaHoy);
        return ResponseEntity.ok(solicitudes);
    }

    @Transactional
    @GetMapping("/reporte/{idSolicitud}")
    public ResponseEntity<Solicitud> getSolicitudDetails(@PathVariable Long idSolicitud) {
        try {
            // Llamar al servicio para obtener los datos de la solicitud
            Solicitud solicitud = solicitudService.getSolicitudWithDetails(idSolicitud);
            return ResponseEntity.ok(solicitud);
        } catch (EntityNotFoundException e) {
            // Manejar el caso donde no se encuentre la solicitud
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null); // También puedes devolver un mensaje de error si lo prefieres
        } catch (Exception e) {
            // Manejar cualquier otro error inesperado
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // O un mensaje personalizado
        }
    }

    @Transactional
    @PutMapping("/{idSolicitud}")
    public ResponseEntity<Solicitud> updateSolicitud(@PathVariable Long idSolicitud, @RequestBody SolicitudDTO solicitudDTO) {
        try {
            // Llamar al servicio para actualizar la solicitud
            Solicitud updatedSolicitud = solicitudService.updateSolicitud(idSolicitud, solicitudDTO);
            return ResponseEntity.ok(updatedSolicitud);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @Transactional
    @DeleteMapping("/{idSolicitud}")
    public ResponseEntity<Void> deleteSolicitud(@PathVariable Long idSolicitud) {
        try {
            // Llamar al servicio para eliminar la solicitud
            solicitudService.deleteSolicitud(idSolicitud);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

}
