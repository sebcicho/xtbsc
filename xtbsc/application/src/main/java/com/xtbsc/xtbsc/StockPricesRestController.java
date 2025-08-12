package com.xtbsc.xtbsc;


import com.xtbsc.dataCollector.StockPricesApiClient;
import com.xtbsc.dataCollector.dto.StockPricesTimeserieDto;
import com.xtbsc.dataCollector.dto.StockPricesTimeseriesDto;
import com.xtbsc.dbservice.entities.FinancialData;
import com.xtbsc.xtbsc.dto.PricesDto;
import com.xtbsc.xtbsc.mapper.PricesMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class StockPricesRestController {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockPricesRestController.class);

    private final StockPricesPersistance stockPricesPersistance;

    private final StockPricesApiClient stockPricesApiClient;

    @Autowired
    public StockPricesRestController(StockPricesPersistance stockPricesPersistance,
                                     StockPricesApiClient stockPricesApiClient) {
        this.stockPricesApiClient = stockPricesApiClient;
        this.stockPricesPersistance = stockPricesPersistance;

    }

    @GetMapping("stock/data")
    public @ResponseBody ResponseEntity<PricesDto> getStockPricesData(@RequestParam String symbol) {
        List<FinancialData> financialData = this.stockPricesPersistance.getDataBySymbol(symbol);
        if (!financialData.isEmpty()) {
            return ResponseEntity.ok(PricesMapper.toDtoFromStock(financialData));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/internal/task/fetchstock")
    public @ResponseBody ResponseEntity<TreeMap<String, Double>> fetchStockPrices (@RequestParam String symbol) {
        LOGGER.info(String.format("Fetch stock task initialized for symbol %s", symbol));
        StockPricesTimeseriesDto dto = this.stockPricesApiClient.queryRecentStockPrices(symbol);
        TreeMap<String, StockPricesTimeserieDto> values = new TreeMap<>(Collections.reverseOrder());

        if (dto.getTimeseries() != null) {
            values.putAll(dto.getTimeseries());
        }

        TreeMap<String, Double> newValues = values.entrySet().stream()
                .limit(50).collect(Collectors.toMap(
                        (entry -> entry.getKey()),
                        (entry -> entry.getValue().getValue()),
                        (oldValue, newValue) -> oldValue,
                        TreeMap::new
                ));
        this.stockPricesPersistance.saveFinancialData(newValues, symbol);
        return ResponseEntity.ok(newValues);

    }
}
