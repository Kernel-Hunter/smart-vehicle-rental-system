package com.svrms.controller;

import com.svrms.entity.Rental;
import com.svrms.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping("/instant/start")
    public Rental startInstantRental(
            @RequestParam Long userId,
            @RequestParam Long vehicleId
    ) {
        return rentalService.startInstantRental(userId, vehicleId);
    }

    @PostMapping("/instant/end/{rentalId}")
    public Rental endInstantRental(@PathVariable Long rentalId) {
        return rentalService.endInstantRental(rentalId);
    }

    @PostMapping("/contract")
    public Rental createContractRental(
            @RequestParam Long userId,
            @RequestParam Long vehicleId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return rentalService.createContractRental(
                userId,
                vehicleId,
                startDate.atStartOfDay(),
                endDate.atStartOfDay()
        );
    }

    @PostMapping("/contract/approve/{rentalId}")
    public Rental approveContract(@PathVariable Long rentalId) {
        return rentalService.approveContractRental(rentalId);
    }

    @PostMapping("/cancel/{rentalId}")
    public Rental cancelRental(@PathVariable Long rentalId) {
        return rentalService.cancelRental(rentalId);
    }

    @GetMapping("/user/{userId}")
    public List<Rental> listUserRentals(@PathVariable Long userId) {
        return rentalService.listRentalsByUser(userId);
    }

    @GetMapping("/admin")
    public List<Rental> listRentalsForAdmin() {
        return rentalService.listRentalsForAdmin();
    }
}
