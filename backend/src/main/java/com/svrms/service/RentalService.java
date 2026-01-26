package com.svrms.service;

import com.svrms.entity.Contract;
import com.svrms.entity.Rental;
import com.svrms.entity.User;
import com.svrms.entity.Vehicle;
import com.svrms.repository.ContractRepository;
import com.svrms.repository.RentalRepository;
import com.svrms.repository.UserRepository;
import com.svrms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final ContractRepository contractRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    /* =========================
       INSTANT RENTAL
       ========================= */

    public Rental startInstantRental(Long userId, Long vehicleId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!vehicle.isAvailable()) {
            throw new RuntimeException("Vehicle is not available");
        }

        if (vehicle.getPricePerMinute() <= 0) {
            throw new RuntimeException("Vehicle does not support instant rental");
        }

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setVehicle(vehicle);
        rental.setStartTime(LocalDateTime.now());
        rental.setStatus("ACTIVE");

        vehicle.setAvailable(false);

        vehicleRepository.save(vehicle);
        return rentalRepository.save(rental);
    }

    public Rental endInstantRental(Long rentalId) {

        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!"ACTIVE".equals(rental.getStatus())) {
            throw new RuntimeException("Rental is not active");
        }

        rental.setEndTime(LocalDateTime.now());

        long minutes = Duration.between(
                rental.getStartTime(),
                rental.getEndTime()
        ).toMinutes();

        double totalPrice = minutes * rental.getVehicle().getPricePerMinute();
        rental.setTotalPrice(totalPrice);
        rental.setStatus("COMPLETED");

        Vehicle vehicle = rental.getVehicle();
        vehicle.setAvailable(true);
        vehicleRepository.save(vehicle);

        return rentalRepository.save(rental);
    }

    /* =========================
       CONTRACT RENTAL
       ========================= */

    public Rental createContractRental(
            Long userId,
            Long vehicleId,
            LocalDateTime start,
            LocalDateTime end
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (vehicle.getPricePerDay() <= 0) {
            throw new RuntimeException("Vehicle does not support contract rental");
        }

        long days = Duration.between(start, end).toDays();
        if (days <= 0) days = 1;

        double totalPrice = days * vehicle.getPricePerDay();

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setVehicle(vehicle);
        rental.setStartTime(start);
        rental.setEndTime(end);
        rental.setTotalPrice(totalPrice);
        rental.setStatus("PENDING");

        Rental savedRental = rentalRepository.save(rental);

        Contract contract = new Contract();
        contract.setRental(savedRental);
        contract.setApproved(false);

        contractRepository.save(contract);

        return savedRental;
    }

    public Rental approveContractRental(Long rentalId) {

        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        Contract contract = contractRepository.findByRentalId(rentalId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        contract.setApproved(true);
        contractRepository.save(contract);

        rental.setStatus("ACTIVE");
        rental.getVehicle().setAvailable(false);
        vehicleRepository.save(rental.getVehicle());

        return rentalRepository.save(rental);
    }

    /* =========================
       COMMON
       ========================= */

    public void cancelRental(Long rentalId) {

        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        rental.setStatus("CANCELLED");

        Vehicle vehicle = rental.getVehicle();
        vehicle.setAvailable(true);
        vehicleRepository.save(vehicle);

        rentalRepository.save(rental);
    }

    public List<Rental> listRentalsByUser(Long userId) {
        return rentalRepository.findByUserId(userId);
    }

    public List<Rental> listAllRentals() {
        return rentalRepository.findAll();
    }
}
