package com.xtbsc.dbservice;

import com.xtbsc.dbservice.entities.StockMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMetadataRepository extends JpaRepository<StockMetadata, Integer> {
    List<StockMetadata> findBySymbol(String symbol);
}
