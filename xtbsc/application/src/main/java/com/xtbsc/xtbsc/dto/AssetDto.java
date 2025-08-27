package com.xtbsc.xtbsc.dto;

public class AssetDto {

    private String assetType;

    private String assetSymbol;

    private Double quantity;

    private Double purchasePrice;

    private Long timestampTransaction;

    public AssetDto(String assetType, String assetSymbol, Double quantity, Double purchasePrice, Long timestampTransaction) {
        this.assetType = assetType;
        this.assetSymbol = assetSymbol;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.timestampTransaction = timestampTransaction;
    }

    @Override
    public String toString() {
        return "AssetDto{" +
                "assetType='" + assetType + '\'' +
                ", assetSymbol='" + assetSymbol + '\'' +
                ", quantity=" + quantity +
                ", purchasePrice=" + purchasePrice +
                ", timestampTransaction=" + timestampTransaction +
                '}';
    }

    public Double getPurchasePrice() {
        return purchasePrice;
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
}
