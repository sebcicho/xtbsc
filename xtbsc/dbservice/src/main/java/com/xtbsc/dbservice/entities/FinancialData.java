package com.xtbsc.dbservice.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "financial_data", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"timestamp", "date", "symbol"})
})
public class FinancialData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use Instant for the timestamp, which is a good practice for time-series data
    @Column(nullable = false)
    private Long timestamp;

    // Use Instant for the timestamp, which is a good practice for time-series data
    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String symbol;

    // The price value
    @Column(nullable = false)
    private Double value;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
