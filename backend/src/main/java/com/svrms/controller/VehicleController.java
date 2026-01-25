package com.svrms.controller;

import com.svrms.dto.VehicleRequest;
import com.svrms.entity.Vehicle;
import com.svrms.repository.VehicleRepository;
import com.svrms.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleRepository vehicleRepository;
    private final VehicleService vehicleService;

    @GetMapping
    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    @PostMapping
    public Vehicle create(@RequestBody VehicleRequest request) {
        return vehicleService.createVehicle(request);
    }
}
