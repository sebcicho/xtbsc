package com.xtbsc.dataCollector.dto;

import java.util.Map;

public class StockMetadataDto {
    private Map<String, String> typesMap;

    public StockMetadataDto(Map<String, String> typesMap) {
        this.typesMap = typesMap;
    }

    public Map<String, String> getTypesMap() {
        return typesMap;
    }

    public void setTypesMap(Map<String, String> typesMap) {
        this.typesMap = typesMap;
    }
}
