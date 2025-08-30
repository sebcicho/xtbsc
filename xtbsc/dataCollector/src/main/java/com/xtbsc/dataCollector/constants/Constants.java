package com.xtbsc.dataCollector.constants;

import com.google.common.collect.ImmutableSet;
import com.xtbsc.dbservice.entities.Currencies;

import java.util.Set;

public class Constants {

    public static final Set<String> SUPPORTED_CURRENCIES = ImmutableSet.of(Currencies.PLN.name(), Currencies.EUR.name(), Currencies.BTC.name(), Currencies.GBP.name(), Currencies.NOK.name(), Currencies.CHF.name(), Currencies.USD.name());

}
