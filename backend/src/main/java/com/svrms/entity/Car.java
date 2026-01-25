package com.svrms.entity;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Car extends Vehicle {
    private int seats;
    private boolean automatic;
}
