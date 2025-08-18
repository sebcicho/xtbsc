package com.xtbsc.xtbsc.mapper;

import com.xtbsc.dataCollector.dto.StockMetadataDto;
import com.xtbsc.dataCollector.dto.StockMetadataEntryDto;
import com.xtbsc.dbservice.entities.StockMetadata;

import java.util.*;

public class MetadataMapper {

    public static StockMetadataDto toDto(List<StockMetadata> data) {
        Map<String, StockMetadataEntryDto> metadataMap = new HashMap<>();
        data.forEach(metadata -> metadataMap.put(metadata.getSymbol(), new StockMetadataEntryDto(metadata.getType(), metadata.getName())));
        return new StockMetadataDto(metadataMap);
    }
}
