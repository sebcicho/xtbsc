package com.xtbsc.dataCollector;

import com.xtbsc.dataCollector.dto.RatesDto;
import com.xtbsc.dataCollector.dto.StockPricesTimeseriesDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Nullable;

@Service
@EnableConfigurationProperties(ApiStockPricesUrlProperty.class)
public class StockPricesApiClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockPricesApiClient.class);


    @Autowired
    private ApiStockPricesUrlProperty apiUrlProperty;

    private final RestTemplate restTemplate;

    @Autowired
    public StockPricesApiClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @Nullable
    public StockPricesTimeseriesDto queryRecentStockPrices(String symbol) {
        try {
            return restTemplate.getForObject(String.format("%ssymbol=%s&outputsize=compact&apikey=%s", apiUrlProperty.getUrl(), symbol, apiUrlProperty.getToken()), StockPricesTimeseriesDto.class);
        } catch (RestClientException e) {
            LOGGER.error(String.format("Failed to fetch stock price data for %s, error: %s", symbol, e.getMessage()));
            return null;
        }
    }

}
