package com.xtbsc.xtbsc.result;

public class TransactionResult {
    private boolean succesfull;

    private String message;

    private TransactionErrorCode code;

    public static TransactionResult buildSuccessfulResult() {
        return new TransactionResult(true, null, null);
    }

    public TransactionResult(boolean succesfull, String message, TransactionErrorCode code) {
        this.succesfull = succesfull;
        this.message = message;
        this.code = code;
    }

    public boolean isSuccesfull() {
        return succesfull;
    }

    public String getMessage() {
        return message;
    }

    public TransactionErrorCode getCode() {
        return code;
    }
}
