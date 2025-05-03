package com.app.starter1.persistence.repository;

import com.app.starter1.dto.SolicitudDTO;
import com.app.starter1.persistence.entity.Solicitud;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    @Query(value = """
        SELECT * 
        FROM solicitudes s
        INNER JOIN users u ON u.id = s.id_usuario_asignado
        INNER JOIN tipo_servicio t ON t.id_tipo_servicio = s.id_tipo_servicio
        INNER JOIN estado_solicitud es ON es.id_estado_sol = s.status
        INNER JOIN products p ON p.id_producto = s.id_equipo
        INNER JOIN customers c ON c.id = s.id_entidad
        ORDER BY s.id_solicitud DESC
        LIMIT 0, 10
    """, nativeQuery = true)
    List<SolicitudDTO> findAllSolicitudes();

    // Encontrar solicitudes abiertas por el id del usuario asignado
    List<Solicitud> findByUsuarioAsignadoIdAndStatusDescripcion(Long idUsuario, String estado);

    // Método para obtener las solicitudes del usuario asignado con estado "ABIERTO" y fecha de hoy
    List<Solicitud> findByUsuarioAsignadoIdAndStatusDescripcionAndFecha(Long usuarioId, String estado, String fecha);

    @Query("SELECT s FROM Solicitud s WHERE s.equipo.id = :productId AND s.status.id = 3")
    List<Solicitud> findClosedRequestsByProductId(@Param("productId") Long productId);

    long countByEquipoId(Long equipoId);
}
