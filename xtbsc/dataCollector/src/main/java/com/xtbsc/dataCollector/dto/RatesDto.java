package com.xtbsc.dataCollector.dto;

import java.sql.Date;
import java.util.Map;

public class RatesDto {

    private Long timestamp;
    private String base;
    private Map<String, Double> rates;

    public RatesDto(long timestamp, String base, Date date, Map<String, Double> rates) {
        this.timestamp = timestamp;
        this.base = base;
        this.rates = rates;
    }

    public long getTimestamp() {
        return this.timestamp;
    }

    public Map<String, Double> getRates() {
        return this.rates;
    }

    public String getBase() {
        return this.base;
    }

    public void setBase(String base) {
        this.base = base;
    }

    public void setRates(Map<String, Double> rates) {
        this.rates = rates;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}