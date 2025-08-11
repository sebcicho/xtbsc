package com.xtbsc.dataCollector.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class StockPricesTimeseriesDto {

    @JsonProperty("Time Series (Daily)")
    private Map<String, StockPricesTimeserieDto> timeseries;

    public StockPricesTimeseriesDto(Map<String, StockPricesTimeserieDto> timeseries) {
        this.timeseries = timeseries;
    }

    public Map<String, StockPricesTimeserieDto> getTimeseries() {
        return timeseries;
    }

    public void setTimeseries(Map<String, StockPricesTimeserieDto> timeseries) {
        this.timeseries = timeseries;
    }
}
