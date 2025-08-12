package com.xtbsc.xtbsc.mapper;

import com.xtbsc.dbservice.entities.CurrencyData;
import com.xtbsc.xtbsc.dto.CurrencyDto;

import javax.annotation.Nullable;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;

public class CurrencyMapper {

    @Nullable
    public static CurrencyDto toDto(List<CurrencyData> data) {
        Map<Long, Double> valuesMap = new TreeMap<>();
        data.forEach(currencyData -> valuesMap.put(currencyData.getTimestamp(), currencyData.getValue()));

        Optional<CurrencyData> optionalData = data.stream().findAny();
        if(optionalData.isPresent()) {
            return new CurrencyDto(data.stream().findAny().get().getSymbolTo(), valuesMap);
        }
        return null;
    }
}
