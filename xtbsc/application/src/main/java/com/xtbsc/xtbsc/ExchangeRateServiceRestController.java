package com.xtbsc.xtbsc;

import com.xtbsc.dataCollector.ExchangeRateApiClient;
import com.xtbsc.dataCollector.dto.RatesDto;
import com.xtbsc.dbservice.entities.CurrencyData;
import com.xtbsc.xtbsc.dto.CurrencyDto;
import com.xtbsc.xtbsc.mapper.CurrencyMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class ExchangeRateServiceRestController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeRateServiceRestController.class);

    private final ExchangeRateApiClient exchangeRateApiClient;

    private final CurrencyDataPersistance currencyDataPersistance;

    @Autowired
    public ExchangeRateServiceRestController( ExchangeRateApiClient exchangeRateApiClient, CurrencyDataPersistance currencyDataPersistance) {
        this.exchangeRateApiClient = exchangeRateApiClient;
        this.currencyDataPersistance = currencyDataPersistance;
    }

    @GetMapping("currency/data")
    public @ResponseBody ResponseEntity<CurrencyDto> getCurrencyData(@RequestParam String symbol) {
        List<CurrencyData> currencyData = this.currencyDataPersistance.getDataBySymbol(symbol);

        return ResponseEntity.ok(CurrencyMapper.toDto(currencyData));
    }

    @PostMapping("/internal/task/fetchcurrency")
    public @ResponseBody ResponseEntity<RatesDto> fetchCurrencyData (@RequestParam(required = false) String date) {
        LOGGER.info("Fetch currency task initialized");
        RatesDto ratesDto;
        if (date == null) {
            LOGGER.info("querying recent rates");
            ratesDto = this.exchangeRateApiClient.queryRecentCurrencyRates();
        } else {
            LOGGER.info(String.format("querying %s rates", date));
            ratesDto = this.exchangeRateApiClient.queryHistoricalCurrencyRates(date);
        }
        if (ratesDto != null) {
            this.currencyDataPersistance.persistCurrency(ratesDto);
            return ResponseEntity.ok(ratesDto);
        } else {
            return ResponseEntity.internalServerError().build();
        }

    }

}
