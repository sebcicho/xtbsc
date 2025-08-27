package com.xtbsc.xtbsc.dto;

import java.util.List;

public class UserDto {
    private String userId;
    private List<AssetDto> assets;

    public UserDto(String userId, List<AssetDto> assets) {
        this.userId = userId;
        this.assets = assets;
    }

    @Override
    public String toString() {
        return "UserDto{" +
                "userId='" + userId + '\'' +
                ", assets=" + assets +
                '}';
    }

    public String getUserId() {
        return userId;
    }

    public List<AssetDto> getAssets() {
        return assets;
    }
}
