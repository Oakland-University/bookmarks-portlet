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

package edu.oakland.portlet.mvc.portlet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.portlet.bind.annotation.RenderMapping;
import org.springframework.web.portlet.bind.annotation.ResourceMapping;
import org.springframework.dao.DataAccessException;
import org.springframework.web.portlet.ModelAndView;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;
import javax.sql.DataSource;
import javax.annotation.Resource;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.ResourceResponse;
import javax.portlet.ResourceRequest;
import javax.portlet.PortletRequest;

import edu.oakland.portlet.service.BookmarkService;
import edu.oakland.portlet.service.FolderService;
import edu.oakland.portlet.service.UserService;
import edu.oakland.portlet.service.PreferenceService;

/**
 * Main portlet view.
 */
@Controller
@ComponentScan("edu.oakland.portlet.mvc")
@RequestMapping("VIEW")
public class MainController {
    protected final Log logger = LogFactory.getLog(getClass());

    @Autowired BookmarkService bookmarkService;
    @Autowired FolderService folderService;
    @Autowired UserService userService;
    @Autowired PreferenceService preference;

    public String getPidm(ResourceRequest request) {
	Map<String, String> userInfo =
	    (Map<String, String>) request.getAttribute(PortletRequest.USER_INFO);

	return userInfo.get("pidm");
    }

    // resets the response headers and buffer then disables response caching
    public void setNoCache(ResourceResponse response) {
	response.reset();
	response.getCacheControl().setExpirationTime(0);
    }

    @RenderMapping
    public ModelAndView showMainView(final RenderRequest request, final RenderResponse response) {
	return new ModelAndView("main");
    }

    @ResourceMapping(value = "createUser")
    public ModelAndView createUser(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String data = request.getParameter("data");

	if (!pidm.equals(null) && pidm != "" && data != "" && !data.equals(null)) {
	    int num = userService.createUser(pidm, data);
	    model.addObject("bookmarks", data);
	}

	return model;
    }

    @ResourceMapping(value = "createPref")
    public ModelAndView createPref(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);

	if (!pidm.equals(null) && pidm != "") {
	    userService.createPref(pidm);
	}

	return model;
    }

    @ResourceMapping(value = "getBookmarks")
    public ModelAndView getBookmarks(ResourceRequest request, ResourceResponse response) {
	setNoCache(response);

	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = bookmarkService.getBookmarkData(pidm);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "addBookmark")
    public ModelAndView newBookmark(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String data = request.getParameter("data");

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = bookmarkService.createBookmark(pidm, data);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "changeBookmark")
    public ModelAndView alterBookmark(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String location = request.getParameter("location");
	String folder = request.getParameter("folder");
	String data = request.getParameter("data");

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = bookmarkService.alterBookmarkData(pidm, folder, location, data);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }
    @ResourceMapping(value = "changeFolder")
    public ModelAndView alterFolder(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String folder = request.getParameter("folder");
	String oldFolder = request.getParameter("oldfolder");
	setNoCache(response);

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = folderService.alterFolder(pidm, folder, oldFolder);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "addToFolder")
    public ModelAndView addToFolder(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String folder = request.getParameter("folder");
	String data = request.getParameter("data");
	setNoCache(response);

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = folderService.addToFolder(pidm, folder, data);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "removeFromFolder")
    public ModelAndView removeFromFolder(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String folder = request.getParameter("folder");
	String bookmark = request.getParameter("bookmark");
	String location = request.getParameter("location");
	setNoCache(response);

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = folderService.removeFromFolder(pidm, folder, location, bookmark);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "addFolder")
    public ModelAndView newFolder(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String folder = request.getParameter("folder");
	setNoCache(response);

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = folderService.newFolder(pidm, folder);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "removeFolder")
    public ModelAndView removeFolder(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String folder = request.getParameter("folder");
	setNoCache(response);

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = folderService.removeFolder(pidm, folder);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "removeBookmark")
    public ModelAndView removeBookmark(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String folder = request.getParameter("folder");
	String bookmarkLoc = request.getParameter("bookmarkLocation");
	setNoCache(response);

	if (!pidm.equals(null) && pidm != "") {
	    String bookmarks = bookmarkService.removeBookmarkData(pidm, folder, bookmarkLoc);
	    model.addObject("bookmarks", bookmarks);
	}

	return model;
    }

    @ResourceMapping(value = "getPreferences")
    public ModelAndView getPreferences(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	setNoCache(response);

	if (!pidm.equals(null) && pidm != "") {
	    String itemsPerPage = preference.getItemsPerPage(pidm);
	    if (!itemsPerPage.equals(null) && itemsPerPage != "") {
		model.addObject("itemsPerPage", itemsPerPage);
	    }
	}

	return model;
    }

    @ResourceMapping(value = "savePreferences")
    public ModelAndView savePreferences(ResourceRequest request, ResourceResponse response) {
	ModelAndView model = new ModelAndView("json");
	String pidm = getPidm(request);
	String itemsPref = request.getParameter("itemsPref");

	logger.error(itemsPref);
	itemsPref = itemsPref.replace("\"", "");
	itemsPref = itemsPref.replace(" ", "");

	if (!pidm.equals(null) && pidm != "") {
	    preference.setItemsPerPage(pidm, itemsPref);
	}

	model.addObject("bookmarks", "3");

	return model;
    }
}
