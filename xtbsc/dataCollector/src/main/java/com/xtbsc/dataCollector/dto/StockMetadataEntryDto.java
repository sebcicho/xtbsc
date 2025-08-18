package com.xtbsc.dataCollector.dto;

public class StockMetadataEntryDto {
    private String type;
    private String name;

    public StockMetadataEntryDto(String type, String name) {
        this.type = type;
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setTypes(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
