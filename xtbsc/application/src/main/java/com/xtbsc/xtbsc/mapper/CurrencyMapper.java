package com.xtbsc.xtbsc.mapper;

import com.xtbsc.dbservice.entities.CurrencyData;
import com.xtbsc.xtbsc.dto.CurrencyDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CurrencyMapper {

    public static CurrencyDto toDto(List<CurrencyData> data) {
        Map<Long, Double> valuesMap = new HashMap<>();
        data.forEach(currencyData -> valuesMap.put(currencyData.getTimestamp(), currencyData.getValue()));
        return new CurrencyDto(data.stream().findAny().get().getSymbolTo(), valuesMap);
    }
}
