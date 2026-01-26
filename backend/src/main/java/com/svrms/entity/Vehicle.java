package com.svrms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CAR, BIKE, SCOOTER, MOTORCYCLE, etc.
    private String type;

    private String brand;
    private String model;

    // For instant rentals
    private double pricePerMinute;

    // For contract rentals
    private double pricePerDay;

    private boolean available;
}
