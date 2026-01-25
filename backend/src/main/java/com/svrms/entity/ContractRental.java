package com.svrms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class ContractRental {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User customer;

    @ManyToOne
    private Vehicle vehicle;

    private LocalDate contractStart;
    private LocalDate contractEnd;

    private String contractDetails;
    private double totalCost;
}
