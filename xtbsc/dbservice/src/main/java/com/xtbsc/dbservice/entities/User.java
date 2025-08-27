package com.xtbsc.dbservice.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String oktaUserId; // from JWT "sub" claim

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserAsset> assets = new ArrayList<>();

    public String getOktaUserId() {
        return oktaUserId;
    }

    public void setOktaUserId(String oktaUserId) {
        this.oktaUserId = oktaUserId;
    }

    public List<UserAsset> getAssets() {
        return assets;
    }

    public void setAssets(List<UserAsset> assets) {
        this.assets = assets;
    }
}
