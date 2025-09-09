package com.xtbsc.xtbsc;

import com.xtbsc.dbservice.CurrencyDataRepository;
import com.xtbsc.dbservice.FinancialDataRepository;
import com.xtbsc.dbservice.TransactionRepository;
import com.xtbsc.dbservice.UserAssetRepository;
import com.xtbsc.dbservice.entities.*;
import com.xtbsc.xtbsc.dto.TransactionDto;
import com.xtbsc.xtbsc.result.TransactionErrorCode;
import com.xtbsc.xtbsc.result.TransactionResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TransactionsPersistanceTest {

    private TransactionRepository transactionRepository;
    private UserAssetRepository userAssetRepository;
    private FinancialDataRepository financialDataRepository;
    private CurrencyDataRepository currencyDataRepository;

    private TransactionsPersistance transactionsPersistance;

    @BeforeEach
    void setup() {
        transactionRepository = mock(TransactionRepository.class);
        userAssetRepository = mock(UserAssetRepository.class);
        financialDataRepository = mock(FinancialDataRepository.class);
        currencyDataRepository = mock(CurrencyDataRepository.class);

        transactionsPersistance = new TransactionsPersistance(
                transactionRepository,
                userAssetRepository,
                financialDataRepository,
                currencyDataRepository
        );
    }

    // ----------------------------
    // storeDepositTransaction tests
    // ----------------------------

    @Test
    void storeDepositTransaction_shouldSucceed_whenFundsArePositive() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", 100.0, 1L, 1.0, "USD");


        when(userAssetRepository.findFirstByUserAndAssetSymbolOrderByTimestampTransactionDesc(any(), eq("USD")))
                .thenReturn(null);
        CurrencyData currencyData = new CurrencyData();
        currencyData.setValue(1.0);
        when(currencyDataRepository.findFirstBySymbolToOrderByTimestamp("USD"))
                .thenReturn(currencyData);

        TransactionResult result = transactionsPersistance.storeDepositTransaction("okta123", dto);

        assertThat(result.isSuccesfull()).isTrue();
        verify(transactionRepository).save(any(Transaction.class));
        verify(userAssetRepository).save(any(UserAsset.class));
    }

    @Test
    void storeDepositTransaction_shouldFail_whenNegativeQuantity() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", -200.0, null, null, "USD");


        UserAsset existing = new UserAsset();
        existing.setQuantity(100.0);
        when(userAssetRepository.findFirstByUserAndAssetSymbolOrderByTimestampTransactionDesc(any(), eq("USD")))
                .thenReturn(existing);

        CurrencyData currencyData = new CurrencyData();
        currencyData.setValue(1.0);
        when(currencyDataRepository.findFirstBySymbolToOrderByTimestamp("USD"))
                .thenReturn(currencyData);

        TransactionResult result = transactionsPersistance.storeDepositTransaction("okta123", dto);

        assertThat(result.isSuccesfull()).isFalse();
        assertThat(result.getCode()).isEqualTo(TransactionErrorCode.NOT_SUFFICIENT_QUANTITY);
        verify(transactionRepository, never()).save(any());
        verify(userAssetRepository, never()).save(any());
    }

    // ----------------------------
    // storeTradeTransaction tests
    // ----------------------------

    @Test
    void storeTradeTransaction_shouldSucceed_whenFundsAndAssetAvailable() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", 2.0, 1L, 1.0, "USD");

        UserAsset fundAsset = new UserAsset();
        fundAsset.setAssetSymbol("USD");
        fundAsset.setAssetType(AssetType.CURRENCY);
        fundAsset.setQuantity(500.0);

        UserAsset latestAsset = new UserAsset();
        latestAsset.setQuantity(1.0);

        FinancialData financialData = new FinancialData();
        financialData.setValue(100.0);

        CurrencyData currencyData = new CurrencyData();
        currencyData.setValue(1.0);

        when(userAssetRepository.findFirstByUserAndAssetSymbolOrderByTimestampTransactionDesc(any(), eq("AAPL")))
                .thenReturn(latestAsset);
        when(userAssetRepository.findFirstByUserAndAssetTypeAndAssetSymbolOrderByTimestampTransactionDesc(any(), eq(AssetType.CURRENCY), eq("USD")))
                .thenReturn(fundAsset);
        when(financialDataRepository.findFirstBySymbolOrderByTimestamp("AAPL")).thenReturn(financialData);
        when(currencyDataRepository.findFirstBySymbolToOrderByTimestamp("USD")).thenReturn(currencyData);

        TransactionResult result = transactionsPersistance.storeTradeTransaction("okta123", dto);

        assertThat(result.isSuccesfull()).isTrue();
        verify(transactionRepository).save(any(Transaction.class));
        verify(userAssetRepository, atLeast(2)).save(any(UserAsset.class));
    }

    @Test
    void storeTradeTransaction_shouldFail_whenInsufficientFunds() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", 10.0, 1L, 1.0, "USD");

        UserAsset fundAsset = new UserAsset();
        fundAsset.setAssetSymbol("USD");
        fundAsset.setAssetType(AssetType.CURRENCY);
        fundAsset.setQuantity(100.0);

        FinancialData financialData = new FinancialData();
        financialData.setValue(50.0);

        CurrencyData currencyData = new CurrencyData();
        currencyData.setValue(1.0);

        when(userAssetRepository.findFirstByUserAndAssetSymbolOrderByTimestampTransactionDesc(any(), eq("AAPL")))
                .thenReturn(null);
        when(userAssetRepository.findFirstByUserAndAssetTypeAndAssetSymbolOrderByTimestampTransactionDesc(any(), eq(AssetType.CURRENCY), eq("USD")))
                .thenReturn(fundAsset);
        when(financialDataRepository.findFirstBySymbolOrderByTimestamp("AAPL")).thenReturn(financialData);
        when(currencyDataRepository.findFirstBySymbolToOrderByTimestamp("USD")).thenReturn(currencyData);

        TransactionResult result = transactionsPersistance.storeTradeTransaction("okta123", dto);

        assertThat(result.isSuccesfull()).isFalse();
        assertThat(result.getCode()).isEqualTo(TransactionErrorCode.NOT_SUFFICIENT_FUNDS);
        verify(transactionRepository, never()).save(any());
    }

    // ----------------------------
    // validateTransactionPossibility tests
    // ----------------------------

    @Test
    void validateTransactionPossibility_shouldFail_whenUnknownAsset() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", 1.0, 1L, 1.0, "USD");


        UserAsset fundAsset = new UserAsset();
        fundAsset.setQuantity(100.0);

        TransactionResult result = transactionsPersistance.validateTransactionPossibility(
                dto, fundAsset, null, 0.0, new CurrencyData()
        );

        assertThat(result.isSuccesfull()).isFalse();
        assertThat(result.getCode()).isEqualTo(TransactionErrorCode.NOT_KNOWN_ASSET);
    }

    @Test
    void validateTransactionPossibility_shouldFail_whenUnknownCurrency() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", 1.0, 1L, 1.0, "USD");


        UserAsset fundAsset = new UserAsset();
        fundAsset.setQuantity(100.0);

        FinancialData fd = new FinancialData();
        fd.setValue(50.0);

        TransactionResult result = transactionsPersistance.validateTransactionPossibility(
                dto, fundAsset, fd, 0.0, null
        );

        assertThat(result.isSuccesfull()).isFalse();
        assertThat(result.getCode()).isEqualTo(TransactionErrorCode.NOT_KNOWN_CURRENCY);
    }

    @Test
    void validateTransactionPossibility_shouldFail_whenNotEnoughFunds() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", 2.0, 1L, 1.0, "USD");

        UserAsset fundAsset = new UserAsset();
        fundAsset.setQuantity(100.0);

        FinancialData fd = new FinancialData();
        fd.setValue(120.0);

        CurrencyData cd = new CurrencyData();
        cd.setValue(1.0);

        TransactionResult result = transactionsPersistance.validateTransactionPossibility(
                dto, fundAsset, fd, 0.0, cd
        );

        assertThat(result.isSuccesfull()).isFalse();
        assertThat(result.getCode()).isEqualTo(TransactionErrorCode.NOT_SUFFICIENT_FUNDS);
    }

    @Test
    void validateTransactionPossibility_shouldSucceed_whenAllConditionsMet() {
        TransactionDto dto = new TransactionDto(AssetType.STOCK.name(), "AAPL", 2.0, 1L, 1.0, "USD");


        UserAsset fundAsset = new UserAsset();
        fundAsset.setQuantity(1000.0);

        FinancialData fd = new FinancialData();
        fd.setValue(10.0);

        CurrencyData cd = new CurrencyData();
        cd.setValue(1.0);

        TransactionResult result = transactionsPersistance.validateTransactionPossibility(
                dto, fundAsset, fd, 5.0, cd
        );

        assertThat(result.isSuccesfull()).isTrue();
    }
}
