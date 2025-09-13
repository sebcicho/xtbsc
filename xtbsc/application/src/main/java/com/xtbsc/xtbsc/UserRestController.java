package com.xtbsc.xtbsc;

import com.xtbsc.dbservice.entities.User;
import com.xtbsc.xtbsc.dto.AssetDto;
import com.xtbsc.xtbsc.dto.UserDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.jwt.Jwt;

import java.net.URI;

@RestController
public class UserRestController {
    private final UsersPersistance usersPersistance;

    private static final Logger LOGGER = LoggerFactory.getLogger(UserRestController.class);

    @Autowired
    public UserRestController(UsersPersistance usersPersistance){
        this.usersPersistance = usersPersistance;
    }

    @GetMapping(value = "user", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> getUser(@AuthenticationPrincipal Jwt jwt) {
        User user = this.usersPersistance.getUser(jwt.getSubject());
        UserDto userDto = new UserDto(user.getOktaUserId(), user.getAssets().stream().map((userAsset ->
                new AssetDto(
                        userAsset.getAssetType().name(),
                        userAsset.getAssetSymbol(),
                        userAsset.getQuantity(),
                        userAsset.getTimestampTransaction(),
                        userAsset.getPrice()
                )
        )).toList());
        LOGGER.info(String.format("user %s",userDto));
        return ResponseEntity.ok(
            userDto
        );
    }

    @GetMapping(value = "user/asset", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> getUserAsset(@AuthenticationPrincipal Jwt jwt, @RequestParam String symbol) {
        User user = this.usersPersistance.getUser(jwt.getSubject());
        UserDto userDto = new UserDto(user.getOktaUserId(), user.getAssets().stream().filter(
                userAsset -> userAsset.getAssetSymbol().equals(symbol)
        ).map((userAsset ->
                new AssetDto(
                        userAsset.getAssetType().name(),
                        userAsset.getAssetSymbol(),
                        userAsset.getQuantity(),
                        userAsset.getTimestampTransaction(),
                        userAsset.getPrice()
                )
        )).toList());
        LOGGER.info(String.format("user/asset %s",userDto));
        return ResponseEntity.ok(
                userDto
        );
    }

    @PostMapping("user")
    public ResponseEntity initUser(@AuthenticationPrincipal Jwt jwt) {
        boolean created = this.usersPersistance.initUser(jwt.getSubject());

        return created ?
                ResponseEntity.created(URI.create("/users/" + jwt.getSubject().replace('|', '/'))).build() :
                ResponseEntity.ok().build();
    }
}
