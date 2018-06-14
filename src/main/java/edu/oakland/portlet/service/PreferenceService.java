/**
 * Licensed to Jasig under one or more contributor license
 * agreements. See the NOTICE file distributed with this work
 * for additional information regarding copyright ownership.
 * Jasig licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a
 * copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package edu.oakland.portlet.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import javax.annotation.Resource;
import javax.portlet.PortletRequest;
import javax.portlet.PortletPreferences;
import javax.sql.DataSource;
import javax.annotation.Resource;
import java.util.Objects;

import edu.oakland.portlet.service.Constants;

@Service
public class PreferenceService {
    public JdbcTemplate jdbcTemplate;
    protected final Log logger = LogFactory.getLog(getClass());

    @Resource(name = "dataSource")
    public void setPostgresDataSource(DataSource dataSource) {
	this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public String getItemsPerPage(String pidm) {
	String bookmarks = "";
	try {
	    bookmarks = (String) jdbcTemplate.queryForObject(
		Constants.PREF, new Object[] {pidm}, String.class);
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	if (bookmarks.equals(null)) {
	    bookmarks = "";
	}

	return bookmarks;
    }

    public void setItemsPerPage(String pidm, String items) {
	try {
	    jdbcTemplate.update(Constants.UPDATE_PREF, new Object[] {items, pidm});
	} catch (DataAccessException e) {
	    logger.error(e);
	}
    }
}
