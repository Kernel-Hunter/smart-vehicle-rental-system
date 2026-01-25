package com.svrms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class InstantRental {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User customer;

    @ManyToOne
    private Vehicle vehicle;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String pickupLocation;
    private String dropoffLocation;

    private double totalCost;
}
