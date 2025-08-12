package com.xtbsc.xtbsc.dto;

import java.util.Map;

public class PricesDto {

    public PricesDto(
            String symbol,
            Map<Long, Double> values
    ) {
        this.symbol = symbol;
        this.values = values;
    }

    private String symbol;
    private Map<Long, Double> values;

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Map<Long, Double> getValues() {
        return values;
    }

    public void setValues(Map<Long, Double> values) {
        this.values = values;
    }
}
