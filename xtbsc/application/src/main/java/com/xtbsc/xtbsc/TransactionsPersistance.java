package com.xtbsc.xtbsc;

import com.xtbsc.dbservice.TransactionRepository;
import com.xtbsc.dbservice.UserAssetRepository;
import com.xtbsc.dbservice.entities.AssetType;
import com.xtbsc.dbservice.entities.Transaction;
import com.xtbsc.dbservice.entities.User;
import com.xtbsc.dbservice.entities.UserAsset;
import com.xtbsc.xtbsc.dto.TransactionDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionsPersistance {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionsPersistance.class);

    private final TransactionRepository transactionRepository;

    private final UserAssetRepository userAssetRepository;

    @Autowired
    public TransactionsPersistance(TransactionRepository transactionRepository, UserAssetRepository userAssetRepository) {
        this.transactionRepository = transactionRepository;
        this.userAssetRepository = userAssetRepository;
    }

    public boolean storeTransaction(String oktaId, TransactionDto transactionDto) {

        User user = new User();
        user.setOktaUserId(oktaId);
        UserAsset latestAsset = userAssetRepository.findFirstByUserAndAssetSymbolOrderByTimestampTransaction(user, transactionDto.getAssetSymbol());
        Double latestQuantity = latestAsset != null ? latestAsset.getQuantity() : 0;

        if (latestQuantity + transactionDto.getQuantity() < 0){
            return false;
        }

        Transaction transaction = new Transaction();
        transaction.setTimestampTransaction(transactionDto.getTimestampTransaction());
        transaction.setAssetSymbol(transactionDto.getAssetSymbol());
        transaction.setAssetType(AssetType.valueOf(transactionDto.getAssetType()));
        transaction.setQuantity(transactionDto.getQuantity());
        transaction.setUser(user);

        UserAsset userAsset = new UserAsset();
        userAsset.setTimestampTransaction(transactionDto.getTimestampTransaction());
        userAsset.setAssetSymbol(transactionDto.getAssetSymbol());
        userAsset.setAssetType(AssetType.valueOf(transactionDto.getAssetType()));
        userAsset.setQuantity(latestQuantity + transactionDto.getQuantity() );
        transaction.setQuantity(transactionDto.getQuantity());
        userAsset.setUser(user);

        this.transactionRepository.save(transaction);
        return true;
    }
}
