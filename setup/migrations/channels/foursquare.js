var record = {
  "application" : {
    "base" : "https://api.foursquare.com/v2",
    "resources" : [
      {
        "path" : "/checkins/recent",
        "doc" : {
          "t" : "Returns a list of recent checkins from friends.",
          "url" : "http://developer.foursquare.com/docs/checkins/recent.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/checkins/recent",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Checkin",
        "displayName" : "Checkin_GET",
        "params": [
          {
            "name": "m",
            "required": true,
            "style": "query",
            "doc": {
              "t": "swarm or foursquare"
            }
          },
          {
            "name": "v",
            "required": true,
            "style": "query",
            "doc": {
              "t": "20140806"
            }
          },
        ],
        "httpMethod" : "GET"
      },
      {
        "path" : "/checkins/{CHECKIN_ID}",
        "doc" : {
          "t" : "Get details of a checkin.",
          "url" : "http://developer.foursquare.com/docs/checkins/checkins.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/checkins/{CHECKIN_ID}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Checkin",
        "displayName" : "Checkin_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/checkins/{CHECKIN_ID}/deletecomment",
        "doc" : {
          "t" : "Remove a comment from a checkin, if the acting user is the author or the owner of the checkin.",
          "url" : "http://developer.foursquare.com/docs/checkins/deletecomment.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/checkins/{CHECKIN_ID}/deletecomment?commentId={commentId}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Checkin",
        "displayName" : "Checkin_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/checkins/{CHECKIN_ID}/addcomment",
        "doc" : {
          "t" : "Comment on a checkin-in",
          "url" : "http://developer.foursquare.com/docs/checkins/addcomment.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/checkins/{CHECKIN_ID}/addcomment?text={text}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Checkin",
        "displayName" : "Checkin_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/checkins/add",
        "doc" : {
          "t" : "Allows you to check in to a place.",
          "url" : "http://developer.foursquare.com/docs/checkins/add.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/checkins/add?broadcast={broadcast}&venueId={venueId}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Checkin",
        "displayName" : "Checkin_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/multi",
        "doc" : {
          "t" : "Does multiple requests at once.",
          "url" : "http://developer.foursquare.com/docs/multi/multi.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/multi?requests={request1},{request2},...{requestN}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Multiple Request",
        "displayName" : "Multiple Request_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/photos/add",
        "doc" : {
          "t" : "Allows users to add a new photo to a checkin, tip, or a venue in general.",
          "url" : "http://developer.foursquare.com/docs/photos/add.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/photos/add",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Photo",
        "displayName" : "Photo_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/photos/{PHOTO_ID}",
        "doc" : {
          "t" : "Get details of a photo.",
          "url" : "http://developer.foursquare.com/docs/photos/photos.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/photos/{PHOTO_ID}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Photo",
        "displayName" : "Photo_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/settings/{SETTING_ID}",
        "doc" : {
          "t" : "Returns a setting for the acting user. SETTING_ID can be any of the three: receivePings, sendToTwitter, sendToFacebook",
          "url" : "http://developer.foursquare.com/docs/settings/settings.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/settings/{SETTING_ID}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Setting",
        "displayName" : "Setting_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/settings/all",
        "doc" : {
          "t" : "Returns the settings of the acting user.",
          "url" : "http://developer.foursquare.com/docs/settings/all.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/settings/all",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Setting",
        "displayName" : "Setting_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/settings/{SETTING_ID}/set",
        "doc" : {
          "t" : "Change a setting for the given user.",
          "url" : "http://developer.foursquare.com/docs/settings/set.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/settings/{SETTING_ID}/set?value={value}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Setting",
        "displayName" : "Setting_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/specials/search",
        "doc" : {
          "t" : "Returns a list of specials near the current location.",
          "url" : "http://developer.foursquare.com/docs/specials/specials.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/specials/search?ll={lat},{long}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Special",
        "displayName" : "Special_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/specials/{SPECIAL_ID}",
        "doc" : {
          "t" : "Gives details about a special, including text and unlock rules.",
          "url" : "http://developer.foursquare.com/docs/specials/specials.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/specials/{SPECIAL_ID}",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Special",
        "displayName" : "Special_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/tips/{TIP_ID}/unmark",
        "doc" : {
          "t" : "Allows you to remove a tip from your to-do list or done list.",
          "url" : "http://developer.foursquare.com/docs/tips/unmark.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/tips/{TIP_ID}/unmark",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Tip",
        "displayName" : "Tip_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/tips/{TIP_ID}/markdone",
        "doc" : {
          "t" : "Allows the acting user to mark a tip done.",
          "url" : "http://developer.foursquare.com/docs/tips/markdone.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/tips/{TIP_ID}/markdone",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Tip",
        "displayName" : "Tip_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/tips/{TIP_ID}/marktodo",
        "doc" : {
          "t" : "Allows you to mark a tip to-do.",
          "url" : "http://developer.foursquare.com/docs/tips/marktodo.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/tips/{TIP_ID}/marktodo",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Tip",
        "displayName" : "Tip_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/tips/search",
        "doc" : {
          "t" : "Returns a list of tips near the area secified.",
          "url" : "http://developer.foursquare.com/docs/tips/search.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/tips/search?ll={lat},{long}",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Tip",
        "displayName" : "Tip_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/tips/add",
        "doc" : {
          "t" : "Allows you to add a new tip at a venue.",
          "url" : "http://developer.foursquare.com/docs/tips/add.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/tips/add?venueId={venueId}&text={text}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Tip",
        "displayName" : "Tip_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/tips/{TIP_ID}",
        "doc" : {
          "t" : "Gives details about a tip, including which users (especially friends) have marked the tip to-do or done.",
          "url" : "http://developer.foursquare.com/docs/tips/tips.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/tips/{TIP_ID}",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Tip",
        "displayName" : "Tip_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/request",
        "doc" : {
          "t" : "Sends a friend request to another user.",
          "url" : "http://developer.foursquare.com/docs/users/request.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/request",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/search",
        "doc" : {
          "t" : "Returns an array of compact user objects with Twitter or Facebook information and friend status.",
          "url" : "http://developer.foursquare.com/docs/users/search.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/search?email={email_address}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/search",
        "doc" : {
          "t" : "Returns an array of compact user objects with Twitter or Facebook information and friend status.",
          "url" : "http://developer.foursquare.com/docs/users/search.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/users/search?email={email_address}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/requests",
        "doc" : {
          "t" : "Shows a user the list of users with whom they have a pending friend request (i.e., someone tried to add the acting user as a friend, but the acting user has not accepted).",
          "url" : "http://developer.foursquare.com/docs/users/requests.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/requests",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/badges",
        "doc" : {
          "t" : "Returns badges for a given user.",
          "url" : "http://developer.foursquare.com/docs/users/badges.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/badges",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/checkins",
        "doc" : {
          "t" : "Returns a history of checkins for the authenticated user.",
          "url" : "http://developer.foursquare.com/docs/users/checkins.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/checkins",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/friends",
        "doc" : {
          "t" : "Returns an array of a user's friends.",
          "url" : "http://developer.foursquare.com/docs/users/friends.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/friends",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/tips",
        "doc" : {
          "t" : "Returns tips from a user.",
          "url" : "http://developer.foursquare.com/docs/users/tips.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/tips",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/todos",
        "doc" : {
          "t" : "Returns todos from a user.",
          "url" : "http://developer.foursquare.com/docs/users/todos.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/todos?ll={lat},{long}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/venuehistory",
        "doc" : {
          "t" : "Returns a list of all venues visited by the specified user, along with how many visits and when they were last there.",
          "url" : "http://developer.foursquare.com/docs/users/venuehistory.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/venuehistory",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}",
        "doc" : {
          "t" : "Returns profile information for a given user, including selected badges and mayorships. If the user is a friend, contact information, Facebook ID, and Twitter handle and the user's last checkin may also be present.In addition, the pings field will indicate whether checkins from this user will trigger a ping (notifications to mobile devices). This setting can be changed via setpings. Note that this setting is overriden if pings is false in settings (no pings will be sent, even if this user is set to true).",
          "url" : "http://developer.foursquare.com/docs/users/users.html"
        },
        "curl" : "curl -X GET -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{USER_ID}/unfriend",
        "doc" : {
          "t" : "Cancels any relationship between the acting user and the specified user. Removes a friend, unfollows a celebrity, or cancels a pending friend request.",
          "url" : "http://developer.foursquare.com/docs/users/unfriend.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/unfriend",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{USER_ID}/approve",
        "doc" : {
          "t" : "Approves a pending friend request from another user.",
          "url" : "http://developer.foursquare.com/docs/users/approve.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/approve",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{USER_ID}/deny",
        "doc" : {
          "t" : "Denies a pending friend request from another user.",
          "url" : "http://developer.foursquare.com/docs/users/deny.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/deny",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{USER_ID}/setpings",
        "doc" : {
          "t" : "Changes whether the acting user will receive pings (phone notifications) when the specified user checks in.",
          "url" : "http://developer.foursquare.com/docs/users/setpings.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/users/{USER_ID}/setpings?value={value}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/venues/{VENUE_ID}/proposeedit",
        "doc" : {
          "t" : "Allows you to propose a change to a venue.If the user knows a correct address, use this method to save it. Otherwise, use flag to flag the venue instead (you need not specify a new address or geolat/geolong in that case).",
          "url" : "http://developer.foursquare.com/docs/venues/proposeedit.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/venues/{VENUE_ID}/proposeedit?name={name}&address={address}&city={city}&state={state}&ll={lat},{long}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Venue",
        "displayName" : "Venue_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/venues/{VENUE_ID}/flag",
        "doc" : {
          "t" : "Allows users to indicate a venue is incorrect in some way. Flags are pushed into a moderation queue. If a closed flag is approved, the venue will no longer show up in search results. Moderators will attempt to correct cases of mislocated or duplicate venues as appropriate. If the user has the correct address for a mislocated venue, use proposeedit instead.",
          "url" : "http://developer.foursquare.com/docs/venues/flag.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/venues/{VENUE_ID}/flag?problem={problem}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Venue",
        "displayName" : "Venue_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/venues/{VENUE_ID}/marktodo",
        "doc" : {
          "t" : "Allows you to mark a venue to-do, with optional text.",
          "url" : "http://developer.foursquare.com/docs/venues/marktodo.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/venues/{VENUE_ID}/marktodo",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Venue",
        "displayName" : "Venue_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/venues/{VENUE_ID}/photos",
        "doc" : {
          "t" : "Returns photos for a venue.",
          "url" : "http://developer.foursquare.com/docs/venues/photos.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/venues/{VENUE_ID}/photos?group={group}",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Venue",
        "displayName" : "Venue_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/venues/{VENUE_ID}/tips",
        "doc" : {
          "t" : "Returns tips for a venue.",
          "url" : "http://developer.foursquare.com/docs/venues/tips.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/venues/{VENUE_ID}/tips",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Venue",
        "displayName" : "Venue_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/venues/{VENUE_ID}/herenow",
        "doc" : {
          "t" : "Provides a count of how many people are at a given venue, plus the first page of the users there, friends-first, and if the current user is authenticated.",
          "url" : "http://developer.foursquare.com/docs/venues/herenow.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/venues/{VENUE_ID}/herenow",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Venue",
        "displayName" : "Venue_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/venues/search",
        "doc" : {
          "t" : "Returns a list of venues near the current location, optionally matching the search term. If lat and long is provided, each venue includes a distance. If authenticated, the method will return venue metadata related to you and your friends. If you do not authenticate, you will not get this data.",
          "url" : "http://developer.foursquare.com/docs/venues/search.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/venues/search?ll={lat},{long}",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Venue",
        "displayName" : "Venue_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/venues/categories",
        "doc" : {
          "t" : "Returns a hierarchical list of categories applied to venues. Note that top-level categories do not have IDs because they cannot be assigned to a venue.",
          "url" : "http://developer.foursquare.com/docs/venues/categories.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/venues/categories",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Venue",
        "displayName" : "Venue_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/venues/add",
        "doc" : {
          "t" : "Allows users to add a new venue. If this method returns an error, give the user the option to edit her inputs. In addition to this, give users the ability to say \"never mind, check-in here anyway\" and perform a manual (\"venueless\") checkin by specifying just the venue name. This is rare, but there's a chance you'll see this case if the user wants to force a duplicate venue. All fields are optional, but one of either a valid address or a geolat/geolong pair must be provided. We recommend that developers provide a geolat/geolong pair in every case. Caller may also, optionally, pass in a category (primarycategoryid) to which you want this venue assigned. You can browse a full list of categories using the /categories method. On adding venue, we recommend that applications show the user this hierarchy and allow them to choose something suitable.",
          "url" : "http://developer.foursquare.com/docs/venues/add.html"
        },
        "curl" : "curl -X POST -u 'username:password' https://api.foursquare.com/v2/venues/add?name={name}&ll={lat},{long}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Venue",
        "displayName" : "Venue_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/venues/{VENUE_ID}",
        "doc" : {
          "t" : "Gives details about a venue, including location, mayorship, tags, tips, specials, and category Authenticated users will also receive information about who is here now.If the venue ID given is one that has been merged into another \"master\" venue, the response will show data about the \"master\" instead of giving you an error.",
          "url" : "http://developer.foursquare.com/docs/venues/venues.html"
        },
        "curl" : "curl -X GET  https://api.foursquare.com/v2/venues/{VENUE_ID}",
        "authentication" : {
          "required" : "false"
        },
        "category" : "Venue",
        "displayName" : "Venue_GET",
        "httpMethod" : "GET"
      }
    ]
  },
  "auth_strategy" : "oauth",
  "enabled" : true,
  "logo" : "http://octoblu-api-logos.s3.amazonaws.com/color/foursquare.png",
  "logobw" : "http://octoblu-api-logos.s3.amazonaws.com/bw/foursquare.png",
  "name" : "FourSquare",
  "oauth" : {
    "accessTokenIncludeClientInfo" : true,
    "accessTokenURL" : "https://foursquare.com/oauth2/access_token",
    "apiKey" : "",
    "authTokenPath" : "/oauth2/authenticate",
    "authTokenURL" : "https://foursquare.com/oauth2/authenticate",
    "baseURL" : "https://www.smartsheet.com",
    "clientId" : "0FHIAV0KFBVSBNYAXBKYMZY4HE0CMBTXLIBG0TGZLQ0TRJYB",
    "grant_type" : "authorization_code",
    "host" : "foursquare.com",
    "isManual" : true,
    "protocol" : "https",
    "requestTokenURL" : "",
    "scope" : "",
    "secret" : "3XRB1YRDIP1WYTUXZWZPN5IE5OLXV0GIBQT1VYZYDFMKGWX4",
    "tokenMethod" : "access_token_query",
    "tokenQueryParam" : "oauth_token",
    "useOAuthLib" : true,
    "version" : "2.0"
  },
  "useCustom" : true
}

db = db.getSiblingDB('meshines');

record = db.apis.findAndModify({
  query: {name: record.name},
  update: {
    $set: record
  },
  new: true,
  upsert: true
});

db.nodetypes.findAndModify({
  query: {name: record.name},
  update: {
    $set: {
      name: record.name,
      logo: record.logo,
      description: record.description,
      skynet: {
        subtype: record.name,
        type: "channel"
      },
      category: "channel",
      enabled: true,
      display: true,
      channel: record
    }
  },
  new: true,
  upsert: true
});
