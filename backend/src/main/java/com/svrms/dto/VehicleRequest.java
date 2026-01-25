package com.svrms.dto;

import lombok.Data;

@Data
public class VehicleRequest {
    public String type; // CAR, BIKE, TRUCK
    public String make;
    public String model;
    public int year;
    public double dailyRate;
    public boolean available;

    public Integer seats;
    public Boolean automatic;
    public Boolean electric;
    public Double maxLoad;
}
