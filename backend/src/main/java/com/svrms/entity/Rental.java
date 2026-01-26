package com.svrms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    private RentalType rentalType;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private RentalStatus status;

    private Double totalPrice;

    public enum RentalType {
        INSTANT, CONTRACT
    }

    public enum RentalStatus {
        PENDING, ACTIVE, COMPLETED, CANCELLED
    }
}
