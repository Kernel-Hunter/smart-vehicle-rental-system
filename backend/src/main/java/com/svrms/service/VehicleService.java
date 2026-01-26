package com.svrms.service;

import com.svrms.entity.Vehicle;
import com.svrms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle createVehicle(Vehicle vehicle) {
        vehicle.setAvailable(true);
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
