package com.xtbsc.dbservice.entities;


import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private AssetType assetType;

    @Column(nullable = false)
    private String assetSymbol;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private Long timestampTransaction;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public AssetType getAssetType() {
        return assetType;
    }

    public String getAssetSymbol() {
        return assetSymbol;
    }

    public Double getQuantity() {
        return quantity;
    }

    public Long getTimestampTransaction() {
        return timestampTransaction;
    }

    public void setTimestampTransaction(Long timestampTransaction) {
        this.timestampTransaction = timestampTransaction;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public void setAssetType(AssetType assetType) {
        this.assetType = assetType;
    }

    public void setAssetSymbol(String assetSymbol) {
        this.assetSymbol = assetSymbol;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
