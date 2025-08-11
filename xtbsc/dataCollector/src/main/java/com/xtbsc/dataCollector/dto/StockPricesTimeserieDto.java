package com.xtbsc.dataCollector.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StockPricesTimeserieDto {
    @JsonProperty("4. close")
    private Double value;

    public StockPricesTimeserieDto(Double value) {
        this.value = value;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }
}
