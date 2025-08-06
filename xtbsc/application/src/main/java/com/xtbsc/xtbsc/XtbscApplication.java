package com.xtbsc.xtbsc;

import com.xtbsc.dbservice.CurrencyDataRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@ComponentScan(basePackages = {"com.xtbsc.*"})
@EntityScan({"com.xtbsc.dbservice"})
@EnableJpaRepositories(basePackages = "com.xtbsc.dbservice")
public class XtbscApplication {

	public static void main(String[] args) {
		SpringApplication.run(XtbscApplication.class, args);
	}

}
