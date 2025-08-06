package com.xtbsc.dataCollector;

import com.xtbsc.dataCollector.dto.RatesDto;
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
@EnableConfigurationProperties(ApiRatesUrlProperty.class)
public class ExchangeRateApiClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExchangeRateApiClient.class);

    @Autowired
    private ApiRatesUrlProperty apiUrlProperty;

    private final RestTemplate restTemplate;

    @Autowired
    public ExchangeRateApiClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @Nullable
    public RatesDto queryRecentCurrencyRates() {
        try {
            return restTemplate.getForObject(String.format("%s/latest.json?app_id=%s", apiUrlProperty.getUrl(), apiUrlProperty.getToken()), RatesDto.class);
        } catch (RestClientException e) {
            LOGGER.error(String.format("Failed to fetch currency rates, error: %s", e.getMessage()));
            return null;
        }
    }

    @Nullable
    public RatesDto queryHistoricalCurrencyRates(String date) {
        try {
            return restTemplate.getForObject(String.format("%s/historical/%s.json?app_id=%s", apiUrlProperty.getUrl(), date, apiUrlProperty.getToken()), RatesDto.class);
        } catch (RestClientException e) {
            LOGGER.error(String.format("Failed to fetch currency rates, error: %s", e.getMessage()));
            return null;
        }
    }

}
