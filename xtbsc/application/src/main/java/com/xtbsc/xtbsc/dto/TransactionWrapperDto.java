package com.xtbsc.xtbsc.dto;

public class TransactionWrapperDto {

    private final TransactionDto transaction;

    public TransactionWrapperDto(TransactionDto transaction) {
        this.transaction = transaction;
    }

    public TransactionDto getTransaction() {
        return transaction;
    }
}
