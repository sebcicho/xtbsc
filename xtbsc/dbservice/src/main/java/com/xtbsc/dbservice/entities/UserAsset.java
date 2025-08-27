package com.xtbsc.dbservice.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "user_assets")
public class UserAsset {
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
    private Double purchasePrice;

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

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public Long getTimestampTransaction() {
        return timestampTransaction;
    }
}
