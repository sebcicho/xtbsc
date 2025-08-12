package com.xtbsc.xtbsc.mapper;

import com.xtbsc.dataCollector.dto.StockMetadataDto;
import com.xtbsc.dbservice.entities.StockMetadata;
import com.xtbsc.xtbsc.dto.PricesDto;

import java.util.*;

public class MetadataMapper {

    public static StockMetadataDto toDto(List<StockMetadata> data) {
        Map<String, String> metadataMap = new HashMap<>();
        data.forEach(metadata -> metadataMap.put(metadata.getSymbol(), metadata.getType()));
        return new StockMetadataDto(metadataMap);
    }
}
