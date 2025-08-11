package com.xtbsc.xtbsc;

import com.xtbsc.dataCollector.mapper.FinancialDataMapper;
import com.xtbsc.dbservice.FinancialDataRepository;
import com.xtbsc.dbservice.entities.FinancialData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.TreeMap;

@Service
public class StockPricesPersistance {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockPricesPersistance.class);

    private final FinancialDataRepository financialDataRepository;


    @Autowired
    public StockPricesPersistance(FinancialDataRepository financialDataRepository) {
        this.financialDataRepository = financialDataRepository;
    }

    public void saveFinancialData(TreeMap<String, Double> values, String symbol) {
        Set<FinancialData> data = FinancialDataMapper.fromDto(values, symbol);

        data.forEach(entry -> {
            if (financialDataRepository.existsByTimestampAndDate(entry.getTimestamp(), entry.getDate())) {
                LOGGER.info(String.format("can not store entry, already exists: %s, %s", entry.getDate(), entry.getSymbol()));
            } else {
                LOGGER.info(String.format("storing entry: %s, %s", entry.getDate(), entry.getSymbol()));
                financialDataRepository.save(entry);
            }
        });
    }
}
