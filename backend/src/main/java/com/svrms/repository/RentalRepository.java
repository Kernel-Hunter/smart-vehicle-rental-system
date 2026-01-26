package com.svrms.repository;

import com.svrms.entity.Rental;
import com.svrms.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByVehicleAndStatus(Vehicle vehicle, Rental.RentalStatus status);
}
