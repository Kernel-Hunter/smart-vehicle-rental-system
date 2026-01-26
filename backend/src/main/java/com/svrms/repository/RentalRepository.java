package com.svrms.repository;

import com.svrms.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    @Query("""
        SELECT r
        FROM Rental r
        WHERE r.vehicle.id = :vehicleId
          AND r.status IN (com.svrms.entity.Rental.RentalStatus.ACTIVE, com.svrms.entity.Rental.RentalStatus.PENDING)
          AND r.startTime < :endTime
          AND r.endTime > :startTime
        """)
    List<Rental> findOverlappingActiveOrPendingRentals(
            @Param("vehicleId") Long vehicleId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
