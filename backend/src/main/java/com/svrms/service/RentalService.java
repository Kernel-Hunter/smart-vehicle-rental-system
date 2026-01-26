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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public Rental startInstantRental(Long userId, Long vehicleId) {
        User user = getUser(userId);
        Vehicle vehicle = getVehicle(vehicleId);

        LocalDateTime now = LocalDateTime.now();
        ensureVehicleAvailability(vehicleId, now, now.plusMinutes(1));

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setVehicle(vehicle);
        rental.setRentalType(Rental.RentalType.INSTANT);
        rental.setStatus(Rental.RentalStatus.ACTIVE);
        rental.setStartTime(now);
        rental.setEndTime(null);
        rental.setTotalPrice(0.0);

        return rentalRepository.save(rental);
    }

    public Rental endInstantRental(Long rentalId) {
        Rental rental = getRental(rentalId);
        if (rental.getRentalType() != Rental.RentalType.INSTANT) {
            throw new RuntimeException("Rental is not an instant rental");
        }
        if (rental.getStatus() != Rental.RentalStatus.ACTIVE) {
            throw new RuntimeException("Only active rentals can be ended");
        }

        LocalDateTime endTime = LocalDateTime.now();
        rental.setEndTime(endTime);
        rental.setStatus(Rental.RentalStatus.COMPLETED);

        long minutes = Math.max(1, Duration.between(rental.getStartTime(), endTime).toMinutes());
        double rate = rental.getVehicle().getPricePerMinute() != null
                ? rental.getVehicle().getPricePerMinute()
                : 0.0;
        rental.setTotalPrice(rate * minutes);

        return rentalRepository.save(rental);
    }

    public Rental createContractRental(
            Long userId,
            Long vehicleId,
            LocalDate contractStartDate,
            LocalDate contractEndDate,
            String deliveryAddress,
            String returnAddress
    ) {
        User user = getUser(userId);
        Vehicle vehicle = getVehicle(vehicleId);

        LocalDateTime startTime = contractStartDate.atStartOfDay();
        LocalDateTime endTime = contractEndDate.plusDays(1).atStartOfDay();

        ensureVehicleAvailability(vehicleId, startTime, endTime);

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setVehicle(vehicle);
        rental.setRentalType(Rental.RentalType.CONTRACT);
        rental.setStatus(Rental.RentalStatus.PENDING);
        rental.setStartTime(startTime);
        rental.setEndTime(endTime);

        long days = Math.max(1, ChronoUnit.DAYS.between(contractStartDate, contractEndDate) + 1);
        double rate = vehicle.getPricePerDay() != null ? vehicle.getPricePerDay() : 0.0;
        rental.setTotalPrice(rate * days);

        Rental savedRental = rentalRepository.save(rental);

        Contract contract = new Contract();
        contract.setRental(savedRental);
        contract.setContractStartDate(contractStartDate);
        contract.setContractEndDate(contractEndDate);
        contract.setDeliveryAddress(deliveryAddress);
        contract.setReturnAddress(returnAddress);
        contract.setApproved(false);

        contractRepository.save(contract);

        return savedRental;
    }

    public Rental approveContractRental(Long rentalId) {
        Rental rental = getRental(rentalId);
        if (rental.getRentalType() != Rental.RentalType.CONTRACT) {
            throw new RuntimeException("Rental is not a contract rental");
        }
        if (rental.getStatus() != Rental.RentalStatus.PENDING) {
            throw new RuntimeException("Only pending contract rentals can be approved");
        }

        Contract contract = contractRepository.findByRentalId(rentalId)
                .orElseThrow(() -> new RuntimeException("Contract not found for rental"));

        contract.setApproved(true);
        rental.setStatus(Rental.RentalStatus.ACTIVE);
        rental.setStartTime(LocalDateTime.now());

        contractRepository.save(contract);
        return rentalRepository.save(rental);
    }

    public Rental cancelRental(Long rentalId) {
        Rental rental = getRental(rentalId);
        if (rental.getStatus() == Rental.RentalStatus.CANCELLED || rental.getStatus() == Rental.RentalStatus.COMPLETED) {
            throw new RuntimeException("Rental is already closed");
        }

        rental.setStatus(Rental.RentalStatus.CANCELLED);
        LocalDateTime now = LocalDateTime.now();
        if (rental.getEndTime() == null || rental.getEndTime().isAfter(now)) {
            rental.setEndTime(now);
        }

        Rental saved = rentalRepository.save(rental);

        if (rental.getRentalType() == Rental.RentalType.CONTRACT) {
            contractRepository.findByRentalId(rentalId).ifPresent(contract -> {
                contract.setApproved(false);
                contractRepository.save(contract);
            });
        }

        return saved;
    }

    public List<Rental> listRentalsByUser(Long userId) {
        return rentalRepository.findByUserId(userId);
    }

    public List<Rental> listRentalsForAdmin() {
        return rentalRepository.findAll();
    }

    private void ensureVehicleAvailability(Long vehicleId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Rental> overlapping = rentalRepository.findOverlappingActiveOrPendingRentals(vehicleId, startTime, endTime);
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Vehicle is not available for the selected time range");
        }
    }

    private Rental getRental(Long rentalId) {
        return rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Vehicle getVehicle(Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }
}
