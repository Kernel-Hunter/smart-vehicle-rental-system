package com.svrms.controller;

import com.svrms.entity.ContractRental;
import com.svrms.entity.InstantRental;
import com.svrms.repository.ContractRentalRepository;
import com.svrms.repository.InstantRentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final InstantRentalRepository instantRentalRepository;
    private final ContractRentalRepository contractRentalRepository;

    @GetMapping("/instant")
    public List<InstantRental> getInstantRentals() {
        return instantRentalRepository.findAll();
    }

    @GetMapping("/contract")
    public List<ContractRental> getContractRentals() {
        return contractRentalRepository.findAll();
    }
}
