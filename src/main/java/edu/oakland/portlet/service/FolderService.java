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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.dao.DataAccessException;

import javax.sql.DataSource;
import javax.annotation.Resource;

import edu.oakland.portlet.service.Constants;

@Service
public class FolderService {
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

    public String alterFolder(String pidm, String folder, String oldFolder) {
	String oldLocation = "{" + oldFolder + "}";
	String newLocation = "{" + folder + "}";

	if (!folder.equals(oldFolder)) {
	    try {
		jdbcTemplate.update(Constants.CHANGE_FOLDER,
		    new Object[] {newLocation, oldLocation, pidm, oldLocation, pidm});
	    } catch (DataAccessException e) {
		logger.error(e);
	    }
	}

	return getData(pidm);
    }

    public String addToFolder(String pidm, String folder, String data) {
	folder = folder.replaceAll("\"", "");

	try {
	    Integer count = jdbcTemplate.queryForObject(
		Constants.BOOKMARKS_COUNT, new Object[] {folder, pidm}, Integer.class);
	    String location = "{" + folder + ", " + count + "}";
	    jdbcTemplate.update(Constants.CHANGE_FOLDERDATA, new Object[] {location, data, pidm});
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return getData(pidm);
    }

    public String removeFromFolder(
	String pidm, String folder, String folderLocation, String bookmark) {
	folder = folder.replaceAll("\"", "");

	try {
	    Integer count = jdbcTemplate.queryForObject(
		Constants.BOOKMARKS_COUNT, new Object[] {"root", pidm}, Integer.class);
	    String location = "{"
		+ "root"
		+ ", " + count + "}";
	    String folderLoc = "{" + folder + ", " + folderLocation + "}";

	    jdbcTemplate.update(
		Constants.CHANGE_FOLDERDATA, new Object[] {location, bookmark, pidm});
	    jdbcTemplate.update(Constants.REMOVE, new Object[] {folderLoc, pidm});
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return getData(pidm);
    }

    public String newFolder(String pidm, String folder) {
	folder = folder.replaceAll("\"", "");
	String folderLocation = "{" + folder + "}";

	try {
	    jdbcTemplate.update(Constants.ADD_FOLDER, new Object[] {folderLocation, pidm});
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return getData(pidm);
    }

    public String removeFolder(String pidm, String folder) {
	folder = folder.replaceAll("\"", "");
	String location = "{" + folder + "}";

	try {
	    jdbcTemplate.update(Constants.REMOVE, new Object[] {location, pidm});
	} catch (DataAccessException e) {
	    logger.error(e);
	}

	return getData(pidm);
    }
}
