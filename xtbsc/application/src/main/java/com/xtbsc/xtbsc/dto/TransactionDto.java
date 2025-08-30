package com.xtbsc.xtbsc.dto;

public class TransactionDto {

    private final String assetType;

    private final String assetSymbol;

    private final Double quantity;

    private final Double price;

    private final Long timestampTransaction;

    private final String currency;

    public TransactionDto(String assetType, String assetSymbol, Double quantity, Long timestampTransaction, Double price, String currency) {
        this.assetType = assetType;
        this.assetSymbol = assetSymbol;
        this.quantity = quantity;
        this.timestampTransaction = timestampTransaction;
        this.price = price;
        this.currency = currency;
    }

    @Override
    public String toString() {
        return "AssetDto{" +
                "assetType='" + assetType + '\'' +
                ", assetSymbol='" + assetSymbol + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", currency=" + currency +
                ", timestampTransaction=" + timestampTransaction +
                '}';
    }

    public Double getQuantity() {
        return quantity;
    }

    public Long getTimestampTransaction() {
        return timestampTransaction;
    }

    public String getAssetType() {
        return assetType;
    }

    public String getAssetSymbol() {
        return assetSymbol;
    }

    public Double getPrice() {
        return price;
    }

    public String getCurrency() {
        return currency;
    }
}
