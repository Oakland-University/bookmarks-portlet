package edu.oakland.portlet.service;

public class Constants {
    public static final String CREATE_BOOKMARK_TABLE = "create table if not exists bookmarks ( "
	+ "id serial primary key,                 "
	+ "owner text not null,                   "
	+ "data jsonb not null)                   ";

    public static final String CREATE_PREF_TABLE = "create table if not exists bookmarks_pref ( "
	+ "id serial primary key,                      "
	+ "owner text not null,                        "
	+ "itemsperpage int)                           ";

    public static final String FINDUSER = "select count(*) from bookmarks where owner = ?";

    public static final String FINDPREF = "select count(*) from bookmarks_pref where owner = ?";

    public static String NEW_USER = "insert into bookmarks (owner,data) values (?, ?::jsonb)";

    public static String NEW_PREF =
	"insert into bookmarks_pref (owner, itemsPerPage) values (?, ?::int)";

    public static String BOOKMARKS = "select data from bookmarks where owner = ?";

    public static String PREF = "select itemsPerPage from bookmarks_pref where owner = ?";

    public static String UPDATE_PREF =
	"update bookmarks_pref set itemsPerPage = ?::int where owner = ?";

    public static String BOOKMARKS_COUNT =
	"select jsonb_array_length(data->?) from bookmarks where owner = ?";

    public static String CHANGE_BOOKMARK = "update bookmarks set data = jsonb_set(           "
	+ "data, ?::text[], ?::jsonb, true) where owner = ? ";

    public static String CHANGE_FOLDER = "update bookmarks set data = jsonb_set(         "
	+ "data, ?::text[], (select data #> ?::text[]     "
	+ "from bookmarks where owner = ? )::jsonb, true) "
	+ "#- ?::text[] where owner = ?                   ";

    public static String CHANGE_FOLDERDATA = "update bookmarks set data = jsonb_set(           "
	+ "data, ?::text[], ?::jsonb, true) where owner = ? ";

    public static String ADD_FOLDER = "update bookmarks set data = jsonb_set( "
	+ "data, ?::text[], '[]'::jsonb, true) where owner= ? ";

    public static String REMOVE = "update bookmarks set data = data #- ?::text[] where owner = ?";
}
