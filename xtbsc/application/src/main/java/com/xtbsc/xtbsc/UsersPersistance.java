package com.xtbsc.xtbsc;

import com.xtbsc.dbservice.FinancialDataRepository;
import com.xtbsc.dbservice.StockMetadataRepository;
import com.xtbsc.dbservice.UserRepository;
import com.xtbsc.dbservice.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsersPersistance {

    private final UserRepository userRepository;

    @Autowired
    public UsersPersistance(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String oktaId) {
        Optional<User> userOptional = this.userRepository.findByOktaUserId(oktaId);
        return userOptional.orElse(null);
    }

    public void storeNewUser(User user) {
        this.userRepository.save(user);
    }
}
