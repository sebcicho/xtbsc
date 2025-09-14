package com.xtbsc.xtbsc;

import com.xtbsc.xtbsc.dto.TransactionWrapperDto;
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
        ResponseEntity responseEntity = getTransactionValidationError(transactionDto);
        if (responseEntity != null) {
            return responseEntity;
        }

        TransactionResult result = this.transactionsPersistance.storeDepositTransaction(jwt.getSubject(), transactionDto.getTransaction());
        return result.isSuccesfull() ?
                ResponseEntity.created(URI.create("/transaction/" + jwt.getSubject().replace('|', '/'))).build() :
                ResponseEntity.badRequest().body(Map.of(
                        "error", "Transaction failed",
                        "reason", result.getMessage()
                        ));
    }

    @PostMapping("transaction/trade")
    public ResponseEntity storeTradeTrasaction(@AuthenticationPrincipal Jwt jwt, @RequestBody TransactionWrapperDto transactionDto) {
        ResponseEntity responseEntity = getTransactionValidationError(transactionDto);
        if (responseEntity != null) {
            return responseEntity;
        }

        TransactionResult result = this.transactionsPersistance.storeTradeTransaction(jwt.getSubject(), transactionDto.getTransaction());
        return result.isSuccesfull() ?
                ResponseEntity.created(URI.create("/transaction/" + jwt.getSubject().replace('|', '/'))).build() :
                ResponseEntity.badRequest().body(Map.of(
                        "error", "Transaction failed",
                        "reason", result.getMessage()
                ));
    }

    private ResponseEntity getTransactionValidationError(TransactionWrapperDto transactionDto) {
        if (transactionDto == null || transactionDto.getTransaction() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Transaction failed",
                    "reason","Missing transaction"
            ));
        }

        if (transactionDto.getTransaction().getQuantity() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Transaction failed",
                    "reason","Missing quantity"
            ));
        }
        return null;
    }
}
