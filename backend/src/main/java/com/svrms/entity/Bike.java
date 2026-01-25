package com.svrms.entity;

import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class Bike extends Vehicle {
    private boolean electric;
}
