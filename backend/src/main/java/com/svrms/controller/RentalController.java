package com.svrms.controller;

import com.svrms.entity.Rental;
import com.svrms.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping("/instant/start")
    public Rental startInstant(
            @RequestParam Long userId,
            @RequestParam Long vehicleId
    ) {
        return rentalService.startInstantRental(userId, vehicleId);
    }

    @PostMapping("/instant/end/{rentalId}")
    public Rental endInstant(@PathVariable Long rentalId) {
        return rentalService.endInstantRental(rentalId);
    }

    @PostMapping("/contract")
    public Rental createContract(
            @RequestParam Long userId,
            @RequestParam Long vehicleId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
    ) {
        return rentalService.createContractRental(
                userId, vehicleId, start, end
        );
    }

    @PostMapping("/contract/approve/{rentalId}")
    public Rental approve(@PathVariable Long rentalId) {
        return rentalService.approveContractRental(rentalId);
    }

    @PostMapping("/cancel/{rentalId}")
    public Rental cancel(@PathVariable Long rentalId) {
        return rentalService.cancelRental(rentalId);
    }

    @GetMapping("/user/{userId}")
    public List<Rental> byUser(@PathVariable Long userId) {
        return rentalService.listRentalsByUser(userId);
    }

    @GetMapping("/admin")
    public List<Rental> adminAll() {
        return rentalService.listRentalsForAdmin();
    }
}
