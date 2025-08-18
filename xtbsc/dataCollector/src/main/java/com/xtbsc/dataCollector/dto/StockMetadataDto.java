package com.xtbsc.dataCollector.dto;

import java.util.Map;

public class StockMetadataDto {
    private Map<String, StockMetadataEntryDto> typesMap;

    public StockMetadataDto(Map<String, StockMetadataEntryDto> typesMap) {
        this.typesMap = typesMap;
    }

    public Map<String, StockMetadataEntryDto> getTypesMap() {
        return typesMap;
    }

    public void setTypesMap(Map<String, StockMetadataEntryDto> typesMap) {
        this.typesMap = typesMap;
    }
}
