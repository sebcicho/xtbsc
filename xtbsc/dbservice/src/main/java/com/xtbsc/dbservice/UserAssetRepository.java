package com.xtbsc.dbservice;

import com.xtbsc.dbservice.entities.User;
import com.xtbsc.dbservice.entities.UserAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAssetRepository extends JpaRepository<UserAsset, Long> {
    List<UserAsset> findByUser(User user);

    List<UserAsset> findByUserAndAssetSymbol(User user, String assetSymbol);


}
