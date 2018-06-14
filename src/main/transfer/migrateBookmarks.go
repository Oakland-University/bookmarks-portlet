package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/go-ldap/ldap"
	_ "github.com/lib/pq"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	selectBookmarkSet = "select entry_id, entry_type, owner from bookmark_store where entry_type = 'BOOKMARK_SET'"
	selectBookmark    = "select entry_id, entry_type, parent_folder_id, created, name, url, note from bookmark_store where entry_type = 'BOOKMARK'"
	selectFolder      = "select entry_id, entry_type, parent_folder_id, created, name from bookmark_store where entry_type = 'FOLDER'"
	insertBookmarks   = "insert into bookmarks (owner,data) values ($1, $2::jsonb)"
	insertBookmarkPrefs   = "insert into bookmarks_pref (owner, itemsperpage) values ($1, $2::int)"
)

var db *sql.DB
var l *ldap.Conn

type config struct {
	URL      string
	Username string
	Password string
	Dbname   string
}

type bookmarkStore struct {
	id           string
	parentFolder string
	entryType    string
	created      string
	name         string
	url          string
	owner        string
	note         string
}

type BkmarkJson struct {
	Url     string `json:"url"`
	Name    string `json:"name"`
	Created string `json:"created"`
	Note    string `json:"description"`
}

func getTime(timeStamp string) string {
	byteTime := []byte(timeStamp)
	tp := string(byteTime[:10])
	dp := string(byteTime[11:])
	date := strings.Split(tp, "-")
	timeParts := strings.Split(dp, ":")
	year, _ := strconv.Atoi(date[0])
	month, _ := strconv.Atoi(date[1])
	day, _ := strconv.Atoi(date[2])
	hour, _ := strconv.Atoi(timeParts[0])
	min, _ := strconv.Atoi(timeParts[1])
	t := time.Date(year, time.Month(month), day, hour, min, 0, 0, time.Local)

	return t.Format("20060102150405")
}

func getJson(id string, stores []bookmarkStore) string {
	var bookmarks []BkmarkJson
	folder := make(map[string][]BkmarkJson)
	for i := range stores {
		if stores[i].parentFolder == id && stores[i].entryType == "BOOKMARK" {
			bkTime := getTime(stores[i].created)
			bkmarks := BkmarkJson{stores[i].url, stores[i].name, bkTime, stores[i].note}
			bookmarks = append(bookmarks, bkmarks)
		} else if stores[i].parentFolder == id && stores[i].entryType == "FOLDER" {
			newFolder := make([]BkmarkJson, 0)
			for j := range stores {
				if stores[j].parentFolder == stores[i].id && stores[j].entryType == "BOOKMARK" {
					bkTime := getTime(stores[i].created)
					bkmarks := BkmarkJson{stores[j].url, stores[j].name, bkTime, stores[j].note}
					newFolder = append(newFolder, bkmarks)
				}
			}
			folder[stores[i].name] = newFolder
		}
	}
	folder["root"] = bookmarks
	b, err := json.Marshal(folder)
	checkErr(err)

	return string(b)
}

func insertRow(bookmarks string, owner string) {
	user := []string{"(&(uid=", owner, "))"}
	userName := strings.Join(user, "")
	request := ldap.NewSearchRequest("dc=oakland,dc=edu", ldap.ScopeWholeSubtree, ldap.NeverDerefAliases, 0, 0, false, userName, []string{"ouEduPersonUUID"}, nil)
	sr, err := l.Search(request)
	checkErr(err)
    if len(sr.Entries) > 0 && len(sr.Entries[0].Attributes) > 0 {
	  name := sr.Entries[0].Attributes[0].Values[0]
	  _,err := db.Exec(insertBookmarkPrefs, name, 3)
	  checkErr(err)
	  _, err = db.Exec(insertBookmarks, name, bookmarks)
	  checkErr(err)
    } else {
      fmt.Printf("%s could not be found in ldap", owner)
    }
}

func migrateData(stores []bookmarkStore, set bookmarkStore, finished chan bool) {
	json := getJson(set.id, stores)
	insertRow(json, set.owner)
	fmt.Printf("%s's bookmarks were migrated\n", set.owner)
	finished <- true
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func init() {
    var d config
    file, err := os.Open("ldap.json")
    decoder := json.NewDecoder(file)
    err = decoder.Decode(&d)
	l, err = ldap.Dial("tcp", fmt.Sprintf("%s:%d", "ldapdev.oakland.edu", 389))
	err = l.Bind(d.Username, d.Password)
	checkErr(err)

	var c config
	file, err = os.Open("database.json")
	decoder = json.NewDecoder(file)
	err = decoder.Decode(&c)
	dbURL := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", c.Username, c.Password, c.URL, c.Dbname)
	db, err = sql.Open("postgres", dbURL)
	db.SetMaxOpenConns(20)
	checkErr(err)
}

func main() {
	var stores []bookmarkStore
	finished := make([]chan bool, 0)
	newChan := make(chan bool)

	bkSet, _ := db.Query(selectBookmarkSet)
	bkmarks, _ := db.Query(selectBookmark)
	bkFolder, _ := db.Query(selectFolder)

	for bkSet.Next() {
		var s bookmarkStore
		_ = bkSet.Scan(&s.id, &s.entryType, &s.owner)
		stores = append(stores, s)
	}
	for bkmarks.Next() {
		var s bookmarkStore
		_ = bkmarks.Scan(&s.id, &s.entryType, &s.parentFolder, &s.created, &s.name, &s.url, &s.note)
		stores = append(stores, s)
	}
	for bkFolder.Next() {
		var s bookmarkStore
		_ = bkFolder.Scan(&s.id, &s.entryType, &s.parentFolder, &s.created, &s.name)
		stores = append(stores, s)
	}
	for i := range stores {
		if stores[i].entryType == "BOOKMARK_SET" {
			finished = append(finished, newChan)
			go migrateData(stores, stores[i], finished[i])
		}
	}
	for i := range finished {
		<-finished[i]
	}

	bkSet.Close()
	bkmarks.Close()
	bkFolder.Close()
}
