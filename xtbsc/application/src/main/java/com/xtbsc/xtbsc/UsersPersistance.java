package com.xtbsc.xtbsc;

import com.xtbsc.dbservice.UserRepository;
import com.xtbsc.dbservice.entities.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UsersPersistance {

    private static final Logger LOGGER = LoggerFactory.getLogger(UsersPersistance.class);

    private final UserRepository userRepository;

    @Autowired
    public UsersPersistance(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String oktaId) {
        Optional<User> userOptional = this.userRepository.findByOktaUserId(oktaId);
        return userOptional.orElse(null);
    }

    public boolean initUser(String oktaId) {
        if(this.userRepository.existsByOktaUserId(oktaId)) {
            LOGGER.info("Logged in user exists");
            return false;
        }
        User user = new User();
        user.setOktaUserId(oktaId);
        user.setAssets(new ArrayList<>());
        this.userRepository.save(user);
        return true;
    }
}
