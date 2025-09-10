package com.xtbsc.dbservice;

import com.xtbsc.dbservice.entities.FinancialData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface FinancialDataRepository extends JpaRepository<FinancialData, Integer> {

	// Find data for a specific symbol within a time range
	List<FinancialData> findBySymbolOrderByTimestamp(String symbol);

	boolean existsByTimestampAndDateAndSymbol(Long Timestamp, String date, String symbol);

	FinancialData findFirstBySymbolOrderByTimestampDesc(String symbol);
}
