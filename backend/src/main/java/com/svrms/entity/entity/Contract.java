package com.svrms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Rental rental;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private String deliveryAddress;
    private String returnAddress;
    private Boolean approved;
}
