package com.svrms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleRequest {

    private String type;
    private String brand;
    private String model;

    private double pricePerMinute;
    private double pricePerDay;
}
