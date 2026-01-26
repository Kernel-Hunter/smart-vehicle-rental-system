package com.svrms.controller;

import com.svrms.entity.Rental;
import com.svrms.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping("/instant/start")
    public Rental startInstantRental(@RequestBody InstantRentalRequest request) {
        return rentalService.startInstantRental(request.userId(), request.vehicleId());
    }

    @PostMapping("/instant/{rentalId}/end")
    public Rental endInstantRental(@PathVariable Long rentalId) {
        return rentalService.endInstantRental(rentalId);
    }

    @PostMapping("/contract")
    public Rental createContractRental(@RequestBody ContractRentalRequest request) {
        return rentalService.createContractRental(
                request.userId(),
                request.vehicleId(),
                request.contractStartDate(),
                request.contractEndDate(),
                request.deliveryAddress(),
                request.returnAddress()
        );
    }

    @PostMapping("/contract/{rentalId}/approve")
    public Rental approveContractRental(@PathVariable Long rentalId) {
        return rentalService.approveContractRental(rentalId);
    }

    @PostMapping("/{rentalId}/cancel")
    public Rental cancelRental(@PathVariable Long rentalId) {
        return rentalService.cancelRental(rentalId);
    }

    @GetMapping("/user/{userId}")
    public List<Rental> listRentalsByUser(@PathVariable Long userId) {
        return rentalService.listRentalsByUser(userId);
    }

    @GetMapping("/admin")
    public List<Rental> listRentalsForAdmin() {
        return rentalService.listRentalsForAdmin();
    }

    public record InstantRentalRequest(Long userId, Long vehicleId) {
    }

    public record ContractRentalRequest(
            Long userId,
            Long vehicleId,
            LocalDate contractStartDate,
            LocalDate contractEndDate,
            String deliveryAddress,
            String returnAddress
    ) {
    }
}
