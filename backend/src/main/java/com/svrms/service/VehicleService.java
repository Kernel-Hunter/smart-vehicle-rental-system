package com.svrms.service;

import com.svrms.dto.VehicleRequest;
import com.svrms.entity.*;
import com.svrms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle createVehicle(VehicleRequest request) {
        Vehicle vehicle;

        switch (request.type.toUpperCase()) {
            case "CAR" -> {
                Car car = new Car();
                car.setSeats(request.seats);
                car.setAutomatic(request.automatic);
                vehicle = car;
            }
            case "BIKE" -> {
                Bike bike = new Bike();
                bike.setElectric(request.electric);
                vehicle = bike;
            }
            case "TRUCK" -> {
                Truck truck = new Truck();
                truck.setMaxLoad(request.maxLoad);
                vehicle = truck;
            }
            default -> throw new RuntimeException("Invalid vehicle type");
        }

        vehicle.setMake(request.make);
        vehicle.setModel(request.model);
        vehicle.setYear(request.year);
        vehicle.setDailyRate(request.dailyRate);
        vehicle.setAvailable(request.available);

        return vehicleRepository.save(vehicle);
    }
}
