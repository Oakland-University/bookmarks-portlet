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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import javax.annotation.Resource;

import edu.oakland.portlet.service.Constants;

@Service
public class BookmarkService {
    public JdbcTemplate jdbcTemplate;

    protected final Log logger = LogFactory.getLog(getClass());

    @Resource(name = "dataSource")
    public void setPostgresDataSource(DataSource dataSource) {
	try {
	    this.jdbcTemplate = new JdbcTemplate(dataSource);
	} catch (DataAccessException e) {
	    logger.error(e);
	}
    }

    public String getData(String pidm) {
	String bookmarks = "";

	try {
	    bookmarks = (String) jdbcTemplate.queryForObject(
		Constants.BOOKMARKS, new Object[] {pidm}, String.class);
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return bookmarks;
    }

    public String changeBookmark(String pidm, String folder, String data, String index) {
	String folderLocation = "{" + folder + "," + index + "}";

	try {
	    jdbcTemplate.update(
		Constants.CHANGE_BOOKMARK, new Object[] {folderLocation, data, pidm});
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return getData(pidm);
    }

    public String getBookmarkData(String pidm) {
	Integer count =
	    jdbcTemplate.queryForObject(Constants.FINDUSER, new Object[] {pidm}, Integer.class);

	if (count == 1)
	    return getData(pidm);
	else
	    return "";
    }

    public String createBookmark(String pidm, String data) {
	Integer count = 0;

	try {
	    count = jdbcTemplate.queryForObject(
		Constants.BOOKMARKS_COUNT, new Object[] {"root", pidm}, Integer.class);
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return changeBookmark(pidm, "root", data, count.toString());
    }

    public String alterBookmarkData(String pidm, String folder, String location, String data) {
	return changeBookmark(pidm, folder, data, location);
    }

    public String removeBookmarkData(String pidm, String folder, String bookmarkLoc) {
	String location = "{" + folder + ", " + bookmarkLoc + "}";

	try {
	    jdbcTemplate.update(Constants.REMOVE, new Object[] {location, pidm});
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return getData(pidm);
    }
}
