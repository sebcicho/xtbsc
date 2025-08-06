package com.xtbsc.dataCollector.mapper;

import com.google.common.collect.ImmutableSet;
import com.xtbsc.dataCollector.dto.RatesDto;
import com.xtbsc.dbservice.entities.CurrencyData;

import java.util.Set;
import java.util.stream.Collectors;

public class RatesMapper {

    public static Set<CurrencyData> fromDto(RatesDto rateDataDto, Set<String> currenciesToPersist) {
        if (rateDataDto.getRates() == null) {
            return ImmutableSet.of();
        }
        return rateDataDto.getRates().entrySet().stream()
                .filter(entry -> currenciesToPersist.contains(entry.getKey()))
                .map(entry -> {
            CurrencyData rate = new CurrencyData();
            rate.setSymbolFrom(rateDataDto.getBase());
            rate.setSymbolTo(entry.getKey());
            rate.setValue(entry.getValue());
            rate.setTimestamp(rateDataDto.getTimestamp());
            return rate;
        }).collect(Collectors.toSet());
    }

}
