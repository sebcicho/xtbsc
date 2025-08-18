package com.xtbsc.xtbsc;

import com.xtbsc.dataCollector.dto.StockMetadataDto;
import com.xtbsc.dataCollector.mapper.FinancialDataMapper;
import com.xtbsc.dbservice.FinancialDataRepository;
import com.xtbsc.dbservice.StockMetadataRepository;
import com.xtbsc.dbservice.entities.CurrencyData;
import com.xtbsc.dbservice.entities.FinancialData;
import com.xtbsc.dbservice.entities.StockMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeMap;

@Service
public class StockPricesPersistance {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockPricesPersistance.class);

    private final FinancialDataRepository financialDataRepository;

    private final StockMetadataRepository stockMetadataRepository;


    @Autowired
    public StockPricesPersistance(FinancialDataRepository financialDataRepository, StockMetadataRepository stockMetadataRepositor) {
        this.financialDataRepository = financialDataRepository;
        this.stockMetadataRepository = stockMetadataRepositor;
    }

    public void saveFinancialData(TreeMap<String, Double> values, String symbol) {
        Set<FinancialData> data = FinancialDataMapper.fromDto(values, symbol);

        data.forEach(entry -> {
            if (financialDataRepository.existsByTimestampAndDateAndSymbol(entry.getTimestamp(), entry.getDate(), entry.getSymbol())) {
                LOGGER.info(String.format("can not store entry, already exists: %s, %s", entry.getDate(), entry.getSymbol()));
            } else {
                LOGGER.info(String.format("storing entry: %s, %s", entry.getDate(), entry.getSymbol()));
                financialDataRepository.save(entry);
            }
        });
    }

    public void saveStockMetadata(StockMetadataDto stockMetadataDto) {
        Set<StockMetadata> data = new HashSet<>();
        stockMetadataDto.getTypesMap().forEach((symbol, entry) -> {
            StockMetadata metaData = new StockMetadata();
            metaData.setType(entry.getType());
            metaData.setName(entry.getName());
            metaData.setSymbol(symbol);
            data.add(metaData);
        });

        this.stockMetadataRepository.saveAll(data);
    }

    public List<FinancialData> getDataBySymbol(String symbol) {
        return this.financialDataRepository.findBySymbolOrderByTimestamp(symbol);
    }

    public List<StockMetadata> getMetaData() {
        return this.stockMetadataRepository.findAll();
    }

    public List<StockMetadata> getMetaDataBySymbol(String symbol) {
        return this.stockMetadataRepository.findBySymbol(symbol);
    }
}
