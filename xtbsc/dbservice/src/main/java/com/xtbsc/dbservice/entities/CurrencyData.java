package com.xtbsc.dbservice.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;

@Entity
@Table(name = "currency_data")
public class CurrencyData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use Instant for the timestamp, which is a good practice for time-series data
    @Column(nullable = false)
    private Long timestamp;

    @Column(nullable = false)
    private String symbolFrom;

    @Column(nullable = false)
    private String symbolTo;

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

    public String getSymbolFrom() {
        return symbolFrom;
    }

    public void setSymbolFrom(String symbol) {
        this.symbolFrom = symbol;
    }

    public String getSymbolTo() {
        return symbolTo;
    }

    public void setSymbolTo(String symbol) {
        this.symbolTo = symbol;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "CurrencyData {" +
                ", symbolFrom='" + symbolFrom + '\'' +
                ", symbolTo='" + symbolTo + '\'' +
                ", value=" + value +
                '}';
    }
}
