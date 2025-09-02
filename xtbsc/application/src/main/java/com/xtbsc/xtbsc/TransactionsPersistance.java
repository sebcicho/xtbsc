package com.xtbsc.xtbsc;

import com.xtbsc.dbservice.CurrencyDataRepository;
import com.xtbsc.dbservice.FinancialDataRepository;
import com.xtbsc.dbservice.TransactionRepository;
import com.xtbsc.dbservice.UserAssetRepository;
import com.xtbsc.dbservice.entities.*;
import com.xtbsc.xtbsc.dto.TransactionDto;
import com.xtbsc.xtbsc.result.TransactionErrorCode;
import com.xtbsc.xtbsc.result.TransactionResult;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TransactionsPersistance {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionsPersistance.class);

    private final TransactionRepository transactionRepository;

    private final UserAssetRepository userAssetRepository;

    private final FinancialDataRepository financialDataRepository;

    private final CurrencyDataRepository currencyDataRepository;

    @Autowired
    public TransactionsPersistance(TransactionRepository transactionRepository, UserAssetRepository userAssetRepository, FinancialDataRepository financialDataRepository, CurrencyDataRepository currencyDataRepository) {
        this.transactionRepository = transactionRepository;
        this.userAssetRepository = userAssetRepository;
        this.financialDataRepository = financialDataRepository;
        this.currencyDataRepository = currencyDataRepository;
    }


    @Transactional
    public TransactionResult storeDepositTransaction(String oktaId, TransactionDto transactionDto) {

        User user = new User();
        user.setOktaUserId(oktaId);
        UserAsset latestAsset = this.userAssetRepository.findFirstByUserAndAssetSymbolOrderByTimestampTransaction(user, transactionDto.getAssetSymbol());
        Double latestQuantity = latestAsset != null ? latestAsset.getQuantity() : 0;
        CurrencyData toDollarFinancialData = currencyDataRepository.findFirstBySymbolToOrderByTimestamp(transactionDto.getCurrency());

        if (latestQuantity + transactionDto.getQuantity() < 0){
            return new TransactionResult(false, "Transaction would result in negative quantity", TransactionErrorCode.NOT_SUFFICIENT_QUANTITY);
        }

        UserAsset userAsset = new UserAsset();
        userAsset.setAssetSymbol(transactionDto.getAssetSymbol());
        userAsset.setAssetType(AssetType.CURRENCY);
        userAsset.setQuantity(latestQuantity);
        userAsset.setPrice(toDollarFinancialData.getValue());

        this.transactionRepository.save(createTransaction(transactionDto, user));
        this.userAssetRepository.save(createUserFundAsset(userAsset, user, transactionDto.getQuantity()));
//        LOGGER.info(String.format("creating transaction: %s", createTransaction(transactionDto, user)));
//        LOGGER.info(String.format("creating user fund asset: %s", createUserFundAsset(userAsset, user, transactionDto.getQuantity())));
        return TransactionResult.buildSuccessfulResult();
    }

    @Transactional
    public TransactionResult storeTradeTransaction(String oktaId, TransactionDto transactionDto) {

        User user = new User();
        user.setOktaUserId(oktaId);
        UserAsset latestAsset = this.userAssetRepository.findFirstByUserAndAssetSymbolOrderByTimestampTransaction(user, transactionDto.getAssetSymbol());
        UserAsset fundAsset = this.userAssetRepository.findFirstByUserAndAssetTypeAndAssetSymbolOrderByTimestampTransaction(user, AssetType.CURRENCY, transactionDto.getCurrency());
        FinancialData symbolFinancialData = financialDataRepository.findFirstBySymbolOrderByTimestamp(transactionDto.getAssetSymbol());
        CurrencyData toDollarFinancialData = currencyDataRepository.findFirstBySymbolToOrderByTimestamp(transactionDto.getCurrency()); // change here if we want to support assets in other currency
        Double latestQuantity = latestAsset != null ? latestAsset.getQuantity() : 0;


        TransactionResult result = this.validateTransactionPossibility(transactionDto, fundAsset, symbolFinancialData, latestQuantity, toDollarFinancialData);
        if (!result.isSuccesfull()) {
            return result;
        }

        Double priceInCurrency = symbolFinancialData.getValue() * (1 / toDollarFinancialData.getValue());
        Double fundsToBeDeducted = priceInCurrency * transactionDto.getQuantity();

        this.transactionRepository.save(createTransaction(transactionDto, user));
        this.userAssetRepository.save(createUserFundAsset(fundAsset, user, -fundsToBeDeducted));
        this.userAssetRepository.save(createUserAsset(transactionDto, user, latestQuantity, priceInCurrency));
        return TransactionResult.buildSuccessfulResult();
    }

    public TransactionResult validateTransactionPossibility(TransactionDto transactionDto, UserAsset fundAsset, FinancialData symbolFinancialData, Double latestQuantity, CurrencyData toDollarFinancialData) {
        if (symbolFinancialData == null) {
            LOGGER.warn(String.format("Not Known Asset for transaction %s", transactionDto));
            return new TransactionResult(false, "Not Known Asset", TransactionErrorCode.NOT_KNOWN_ASSET);
        }

        if (toDollarFinancialData == null) {
            LOGGER.warn(String.format("Not Known Currency for transaction %s", transactionDto));
            return new TransactionResult(false, "Not Known Currency", TransactionErrorCode.NOT_KNOWN_CURRENCY);
        }

        Double priceInCurrency = symbolFinancialData.getValue() * (1 / toDollarFinancialData.getValue());
            Double balance = fundAsset.getQuantity() - priceInCurrency * transactionDto.getQuantity();
        if (balance < 0) {
            LOGGER.warn(String.format("Transaction would result in negative quantity %s", transactionDto));
            return new TransactionResult(false, "Transaction would result in negative quantity", TransactionErrorCode.NOT_SUFFICIENT_FUNDS);
        }

        if (latestQuantity + transactionDto.getQuantity() < 0){
            LOGGER.warn(String.format("Not sufficient funds for transaction %s", transactionDto));
            return new TransactionResult(false, "Not sufficient funds", TransactionErrorCode.NOT_SUFFICIENT_QUANTITY);
        }

        return TransactionResult.buildSuccessfulResult();
    }

    private Transaction createTransaction(TransactionDto transactionDto, User user) {
        Transaction transaction = new Transaction();
        transaction.setTimestampTransaction(Instant.now().toEpochMilli());
        transaction.setAssetSymbol(transactionDto.getAssetSymbol());
        transaction.setAssetType(AssetType.valueOf(transactionDto.getAssetType()));
        transaction.setQuantity(transactionDto.getQuantity());
        transaction.setCurrency(transactionDto.getCurrency());
        transaction.setUser(user);
        LOGGER.info(String.format("creating transaction: %s", transactionDto));
        return transaction;
    }

    private UserAsset createUserFundAsset(UserAsset fundAsset, User user, Double fundsToBeAdded) {
        UserAsset userAsset = new UserAsset();
        userAsset.setTimestampTransaction(Instant.now().toEpochMilli());
        userAsset.setAssetSymbol(fundAsset.getAssetSymbol());
        userAsset.setAssetType(fundAsset.getAssetType());
        userAsset.setQuantity(fundAsset.getQuantity() + fundsToBeAdded);
        userAsset.setPrice(0.0);
        userAsset.setUser(user);
        LOGGER.info(String.format("updating fund asset: %s", userAsset));
        return userAsset;
    }

    private UserAsset createUserAsset(TransactionDto transactionDto, User user, Double latestQuantity, Double price) {
        UserAsset userAsset = new UserAsset();
        userAsset.setTimestampTransaction(Instant.now().toEpochMilli());
        userAsset.setAssetSymbol(transactionDto.getAssetSymbol());
        userAsset.setAssetType(AssetType.valueOf(transactionDto.getAssetType()));
        userAsset.setQuantity(latestQuantity + transactionDto.getQuantity() );
        userAsset.setPrice(price);
        userAsset.setUser(user);
        LOGGER.info(String.format("creating user asset: %s", userAsset));
        return userAsset;
    }
}
