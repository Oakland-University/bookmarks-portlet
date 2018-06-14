package edu.oakland.portlet.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import edu.oakland.portlet.service.Constants;
import javax.sql.DataSource;

@Component
public class DatabaseInit {
    protected final Log logger = LogFactory.getLog(getClass());
    private JdbcTemplate jdbcTemplate;

    @Autowired(required = true)
    public void setDataSource(DataSource dataSource) {
	this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public void init() {
	try {
	    jdbcTemplate.execute(Constants.CREATE_BOOKMARK_TABLE);
	    jdbcTemplate.execute(Constants.CREATE_PREF_TABLE);
	} catch (Exception e) {
	    // Force failure on startup of portlet if cannot create anything
	    logger.error("Error creating bookmark's tables.");
	    throw new IllegalArgumentException(e);
	}
    }
}
