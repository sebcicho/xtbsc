package com.xtbsc.xtbsc;

import com.google.common.collect.ImmutableSet;
import com.xtbsc.dataCollector.dto.RatesDto;
import com.xtbsc.dataCollector.mapper.RatesMapper;
import com.xtbsc.dbservice.CurrencyDataRepository;
import com.xtbsc.dbservice.entities.CurrencyData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class CurrencyDataPersistance {

    private static final Logger LOGGER = LoggerFactory.getLogger(CurrencyDataPersistance.class);

    private final CurrencyDataRepository currencyDataRepository;

    @Autowired
    public CurrencyDataPersistance(CurrencyDataRepository currencyDataRepository) {
        this.currencyDataRepository = currencyDataRepository;

    }

    public void persistCurrency(RatesDto ratesDto) {
        Set<CurrencyData> currencies = RatesMapper.fromDto(ratesDto, ImmutableSet.of("PLN", "EUR", "BTC", "GPB", "NOK", "CHF"));
        LOGGER.info(String.format("Currencies being persisted: %s", currencies));
        this.currencyDataRepository.saveAll(currencies);
    }

    public List<CurrencyData> getDataBySymbol(String symbol) {
        return this.currencyDataRepository.findBySymbolTo(symbol);
    }
}
