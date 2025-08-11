package com.xtbsc.xtbsc.mapper;

import com.xtbsc.dbservice.entities.CurrencyData;
import com.xtbsc.xtbsc.dto.CurrencyDto;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class CurrencyMapper {

    public static CurrencyDto toDto(List<CurrencyData> data) {
        Map<Long, Double> valuesMap = new TreeMap<>();
        data.forEach(currencyData -> valuesMap.put(currencyData.getTimestamp(), currencyData.getValue()));
        return new CurrencyDto(data.stream().findAny().get().getSymbolTo(), valuesMap);
    }
}
