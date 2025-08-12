package com.xtbsc.xtbsc.mapper;

import com.xtbsc.dbservice.entities.CurrencyData;
import com.xtbsc.dbservice.entities.FinancialData;
import com.xtbsc.xtbsc.dto.PricesDto;

import javax.annotation.Nullable;
import java.util.*;

public class PricesMapper {

    @Nullable
    public static PricesDto toDtoFromCurrency(List<CurrencyData> data) {
        Map<Long, Double> valuesMap = new TreeMap<>(Collections.reverseOrder());
        data.forEach(currencyData -> valuesMap.put(currencyData.getTimestamp(), currencyData.getValue()));

        Optional<CurrencyData> optionalData = data.stream().findAny();
        if(optionalData.isPresent()) {
            return new PricesDto(data.stream().findAny().get().getSymbolTo(), valuesMap);
        }
        return null;
    }

    @Nullable
    public static PricesDto toDtoFromStock(List<FinancialData> data) {
        Map<Long, Double> valuesMap = new TreeMap<>(Collections.reverseOrder());
        data.forEach(financialData -> valuesMap.put(financialData.getTimestamp(), financialData.getValue()));

        Optional<FinancialData> optionalData = data.stream().findAny();
        if(optionalData.isPresent()) {
            return new PricesDto(data.stream().findAny().get().getSymbol(), valuesMap);
        }
        return null;
    }
}
