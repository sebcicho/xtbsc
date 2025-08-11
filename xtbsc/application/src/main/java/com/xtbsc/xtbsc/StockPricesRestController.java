package com.xtbsc.xtbsc;


import com.google.common.collect.ImmutableSet;
import com.xtbsc.dataCollector.StockPricesApiClient;
import com.xtbsc.dataCollector.dto.StockPricesTimeserieDto;
import com.xtbsc.dataCollector.dto.StockPricesTimeseriesDto;
import com.xtbsc.dbservice.FinancialDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

@RestController
public class StockPricesRestController {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockPricesRestController.class);

    private final FinancialDataRepository financialDataRepository;

    private final StockPricesApiClient stockPricesApiClient;

    private final Set<String> SUPPORTED_CURRENCIES = ImmutableSet.of("PLN", "EUR", "BTC", "GPB", "NOK", "CHF");

    @Autowired
    public StockPricesRestController(FinancialDataRepository financialDataRepository,
                                     StockPricesApiClient stockPricesApiClient) {
        this.stockPricesApiClient = stockPricesApiClient;
        this.financialDataRepository = financialDataRepository;

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
                .limit(10).collect(Collectors.toMap(
                        (entry -> entry.getKey()),
                        (entry -> entry.getValue().getValue()),
                        (oldValue, newValue) -> oldValue,
                        TreeMap::new
                ));

        return ResponseEntity.ok(newValues);

    }
}
