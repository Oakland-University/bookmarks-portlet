<%--

    Licensed to Jasig under one or more contributor license
    agreements. See the NOTICE file distributed with this work
    for additional information regarding copyright ownership.
    Jasig licenses this file to you under the Apache License,
    Version 2.0 (the "License"); you may not use this file
    except in compliance with the License. You may obtain a
    copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on
    an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied. See the License for the
    specific language governing permissions and limitations
    under the License.

--%>

<jsp:directive.include file="/WEB-INF/jsp/include.jsp"/>

<portlet:resourceURL var="getBookmarks" id="getBookmarks"/>
<portlet:resourceURL var="addBookmark" id="addBookmark"/>
<portlet:resourceURL var="addFolder" id="addFolder"/>
<portlet:resourceURL var="changeBookmark" id="changeBookmark"/>
<portlet:resourceURL var="changeFolder" id="changeFolder"/>
<portlet:resourceURL var="removeBookmark" id="removeBookmark"/>
<portlet:resourceURL var="removeFolder" id="removeFolder"/>
<portlet:resourceURL var="addToFolder" id="addToFolder"/>
<portlet:resourceURL var="removeFromFolder" id="removeFromFolder"/>
<portlet:resourceURL var="createUser" id="createUser"/>
<portlet:resourceURL var="createPref" id="createPref"/>
<portlet:resourceURL var="getPreferences" id="getPreferences"/>
<portlet:resourceURL var="savePreferences" id="savePreferences"/>

<script>
	var BookmarksURL = '${getBookmarks}'
	var AddBookmarkURL = '${addBookmark}'
	var AddFolderURL = '${addFolder}'
	var ChangeBookmarkURL = '${changeBookmark}'
	var ChangeFolderURL = '${changeFolder}'
	var RemoveBookmarkURL = '${removeBookmark}'
	var RemoveFolderURL = '${removeFolder}'
    var CreateUserURL = '${createUser}'
    var CreatePrefURL = '${createPref}'
    var AddToFolderURL = '${addToFolder}'
    var RemoveFromFolderURL = '${removeFromFolder}'
    var GetPreferencesURL = '${getPreferences}'
    var SavePreferencesURL = '${savePreferences}'
</script>

<div class="up-portlet-content-wrapper-inner">   
	<div id="bookmarks"></div>
	<script src="${pageContext.request.contextPath}/js/main.js" type="text/javascript"></script>
</div>
