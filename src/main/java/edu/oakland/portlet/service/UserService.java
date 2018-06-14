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
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import javax.annotation.Resource;

import edu.oakland.portlet.service.Constants;

@Service
public class UserService {
    public JdbcTemplate jdbcTemplate;
    protected final Log logger = LogFactory.getLog(getClass());

    @Resource(name = "dataSource")
    public void setPostgresDataSource(DataSource dataSource) {
	this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public int createUser(String pidm, String data) {
	int result = 0;
	Integer count =
	    jdbcTemplate.queryForObject(Constants.FINDUSER, new Object[] {pidm}, Integer.class);

	if (count == 0) {
	    try {
		result = jdbcTemplate.update(Constants.NEW_USER, new Object[] {pidm, data});
	    } catch (DataAccessException e) {
		logger.error(e);
	    }
	}

	return result;
    }

    public void createPref(String pidm) {
	Integer count =
	    jdbcTemplate.queryForObject(Constants.FINDPREF, new Object[] {pidm}, Integer.class);

	if (count == 0) {
	    try {
		jdbcTemplate.update(Constants.NEW_PREF, new Object[] {pidm, 3});
	    } catch (DataAccessException e) {
		logger.error(e);
	    }
	}
    }
}
