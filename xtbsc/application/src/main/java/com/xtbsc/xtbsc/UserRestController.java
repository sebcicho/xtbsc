package com.xtbsc.xtbsc;

import com.xtbsc.xtbsc.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
public class UserRestController {
    private final UsersPersistance usersPersistance;

    @Autowired
    public UserRestController(UsersPersistance usersPersistance){
        this.usersPersistance = usersPersistance;
    }


    @GetMapping("user")
    public ResponseEntity<UserDto> getUser(@AuthenticationPrincipal Jwt jwt) {
        System.out.println(jwt.getClaims()); // access token claims
        return ResponseEntity.ok(new UserDto(jwt.getSubject()));
    }
}
