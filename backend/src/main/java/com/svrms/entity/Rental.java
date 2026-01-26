package com.svrms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Rental {

    public enum RentalStatus {
        PENDING,
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Vehicle vehicle;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private RentalStatus status;
}
