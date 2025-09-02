package com.xtbsc.xtbsc;


import com.xtbsc.xtbsc.dto.TransactionDto;
import com.xtbsc.xtbsc.dto.TransactionWrapperDto;
import com.xtbsc.xtbsc.result.TransactionErrorCode;
import com.xtbsc.xtbsc.result.TransactionResult;
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
import java.util.Map;

@RestController
public class TransactionsRestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionsRestController.class);

    private final TransactionsPersistance transactionsPersistance;

    @Autowired
    public TransactionsRestController(TransactionsPersistance transactionsPersistance){
        this.transactionsPersistance = transactionsPersistance;
    }

    @PostMapping("transaction/account")
    public ResponseEntity storeAccountTransaction(@AuthenticationPrincipal Jwt jwt, @RequestBody TransactionWrapperDto transactionDto) {
        if (transactionDto == null || transactionDto.getTransaction() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Transaction failed",
                    "reason","Missing transaction"
            ));
        }

        TransactionResult result = this.transactionsPersistance.storeDepositTransaction(jwt.getSubject(), transactionDto.getTransaction());
//        TransactionResult result = new TransactionResult(false, "Message", TransactionErrorCode.NOT_SUFFICIENT_QUANTITY);
        return result.isSuccesfull() ?
                ResponseEntity.created(URI.create("/transaction/" + jwt.getSubject().replace('|', '/'))).build() :
                ResponseEntity.badRequest().body(Map.of(
                        "error", "Transaction failed",
                        "reason", result.getMessage()
                        ));
    }

    @PostMapping("transaction/trade")
    public ResponseEntity storeTradeTrasaction(@AuthenticationPrincipal Jwt jwt, @RequestBody TransactionWrapperDto transactionDto) {
        if (transactionDto == null || transactionDto.getTransaction() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Transaction failed",
                    "reason","Missing transaction"
            ));
        }

        TransactionResult result = this.transactionsPersistance.storeTradeTransaction(jwt.getSubject(), transactionDto.getTransaction());
        return result.isSuccesfull() ?
                ResponseEntity.created(URI.create("/transaction/" + jwt.getSubject().replace('|', '/'))).build() :
                ResponseEntity.badRequest().body(Map.of(
                        "error", "Transaction failed",
                        "reason", result.getMessage()
                ));
    }
}
