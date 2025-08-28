package com.xtbsc.xtbsc;


import com.xtbsc.xtbsc.dto.TransactionDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class TransactionsRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionsRestController.class);

    private final TransactionsPersistance transactionsPersistance;

    @Autowired
    public TransactionsRestController(TransactionsPersistance transactionsPersistance){
        this.transactionsPersistance = transactionsPersistance;
    }

    @PostMapping("transaction")
    public ResponseEntity storeTrasaction(@AuthenticationPrincipal Jwt jwt, @RequestBody TransactionDto transactionDto) {

        boolean created = this.transactionsPersistance.storeTransaction(jwt.getSubject(), transactionDto);
        return created ?
                ResponseEntity.created(URI.create("/transaction/" + jwt.getSubject().replace('|', '/'))).build() :
                ResponseEntity.badRequest().build();
    }
}
