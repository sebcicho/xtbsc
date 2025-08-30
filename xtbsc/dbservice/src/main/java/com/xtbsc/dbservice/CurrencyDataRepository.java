package com.xtbsc.dbservice;

import com.xtbsc.dbservice.entities.CurrencyData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CurrencyDataRepository  extends JpaRepository<CurrencyData, Integer> {

    // Find data for a specific symbol within a time range
    List<CurrencyData> findBySymbolToOrderByTimestamp(String symbolTo);

    CurrencyData findFirstBySymbolToOrderByTimestamp(String symbolTo);
}
