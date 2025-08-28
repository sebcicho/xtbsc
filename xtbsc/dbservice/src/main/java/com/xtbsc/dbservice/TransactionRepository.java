package com.xtbsc.dbservice;


import com.xtbsc.dbservice.entities.Transaction;
import com.xtbsc.dbservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndAssetSymbol(User user, String assetSymbol);

}
