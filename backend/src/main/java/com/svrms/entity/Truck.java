package com.svrms.entity;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Truck extends Vehicle {
    private double maxLoad;
}
