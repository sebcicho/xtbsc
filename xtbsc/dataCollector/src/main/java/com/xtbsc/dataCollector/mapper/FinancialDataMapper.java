package com.xtbsc.dataCollector.mapper;

import com.google.common.collect.ImmutableSet;
import com.xtbsc.dbservice.entities.FinancialData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class FinancialDataMapper {

    private static final Logger LOGGER = LoggerFactory.getLogger(FinancialDataMapper.class);

    public static Set<FinancialData> fromDto(Map<String, Double> values, String symbol) {
        if (values.isEmpty()) {
            return ImmutableSet.of();
        }
        return values.entrySet().stream()
                .map(entry -> {
                    FinancialData financialData = new FinancialData();
                    financialData.setSymbol(symbol);
                    financialData.setValue(entry.getValue());
                    financialData.setDate(entry.getKey());
                    financialData.setTimestamp(FinancialDataMapper.getTimestamp(entry.getKey()));
                    return financialData;
                }).collect(Collectors.toSet());
    }

    private static Long getTimestamp(String date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        try {
            Date parsedDate = sdf.parse(date);
            return  parsedDate.getTime();
        } catch (ParseException e) {
            LOGGER.error("Error parsing the date string: " + e.getMessage());
            return 0l;

        }
    }
}
