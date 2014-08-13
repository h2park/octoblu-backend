var record = {
  "application" : {
    "base" : "https://openapi.etsy.com/v2",
    "resources" : [
      {
        "path" : "/",
        "doc" : {
          "t" : "Get a list of all methods available.",
          "url" : "http://developer.etsy.com/docs/resource_apimethod#getmethodtable"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ApiMethod",
        "displayName" : "ApiMethod_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/avatar",
        "params" : [
          {
            "name" : "src",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "image",
            "type" : "image",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Upload a new user avatar image",
          "url" : "http://developer.etsy.com/docs/resource_avatar#uploadavatar"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'src=&image=' http://openapi.etsy.com/v2/private/users/__SELF__/avatar",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Avatar",
        "displayName" : "Avatar_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{user_id}/avatar/src",
        "doc" : {
          "t" : "Get avatar image source",
          "url" : "http://developer.etsy.com/docs/resource_array#getavatarimgsrc"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/avatar/src",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Avatar",
        "displayName" : "Avatar_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/charges",
        "doc" : {
          "t" : "Retrieves a set of BillCharge objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_billcharge#findallusercharges"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/charges?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "BillCharge",
        "displayName" : "BillCharge_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/payments",
        "doc" : {
          "t" : "Retrieves a set of BillPayment objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_billpayment#findalluserpayments"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/payments?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "BillPayment",
        "displayName" : "BillPayment_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/taxonomy/categories",
        "doc" : {
          "t" : "Retrieves all top-level Categories.",
          "url" : "http://developer.etsy.com/docs/resource_category#findalltopcategory"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/taxonomy/categories",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Category",
        "displayName" : "Category_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/categories/{tag}/{subtag}/{subsubtag}",
        "doc" : {
          "t" : "Retrieves a third-level Category by tag, subtag and subsubtag.",
          "url" : "http://developer.etsy.com/docs/resource_category#getsubsubcategory"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/categories/{tag}/{subtag}/{subsubtag}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Category",
        "displayName" : "Category_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/categories/{tag}/{subtag}",
        "doc" : {
          "t" : "Retrieves a second-level Category by tag and subtag.",
          "url" : "http://developer.etsy.com/docs/resource_category#getsubcategory"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/categories/{tag}/{subtag}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Category",
        "displayName" : "Category_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/taxonomy/categories/{tag}",
        "doc" : {
          "t" : "Retrieves children of a top-level Category by tag.",
          "url" : "http://developer.etsy.com/docs/resource_category#findalltopcategorychildren"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/taxonomy/categories/{tag}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Category",
        "displayName" : "Category_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/categories/{tag}",
        "doc" : {
          "t" : "Retrieves a top-level Category by tag.",
          "url" : "http://developer.etsy.com/docs/resource_category#getcategory"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/categories/{tag}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Category",
        "displayName" : "Category_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/taxonomy/categories/{tag}/{subtag}",
        "doc" : {
          "t" : "Retrieves children of a second-level Category by tag and subtag.",
          "url" : "http://developer.etsy.com/docs/resource_category#findallsubcategorychildren"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/taxonomy/categories/{tag}/{subtag}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Category",
        "displayName" : "Category_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/countries/{country_id}",
        "doc" : {
          "t" : "Retrieves a Country by id.",
          "url" : "http://developer.etsy.com/docs/resource_country#getcountry"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/countries/{country_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Country",
        "displayName" : "Country_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/countries",
        "doc" : {
          "t" : "Finds all Country.",
          "url" : "http://developer.etsy.com/docs/resource_country#findallcountry"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/countries",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Country",
        "displayName" : "Country_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/favorites/listings/{listing_id}",
        "doc" : {
          "t" : "Delete a favorite listing for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoritelisting#deleteuserfavoritelistings"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/listings/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteListing",
        "displayName" : "FavoriteListing_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/users/{user_id}/favorites/listings",
        "doc" : {
          "t" : "Finds all favorite listings for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoritelisting#findalluserfavoritelistings"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/listings?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteListing",
        "displayName" : "FavoriteListing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/favorites/listings/{listing_id}",
        "doc" : {
          "t" : "Finds a favorite listing for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoritelisting#finduserfavoritelistings"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/listings/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteListing",
        "displayName" : "FavoriteListing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/{listing_id}/favored-by",
        "doc" : {
          "t" : "Retrieves a set of FavoriteListing objects associated to a Listing.",
          "url" : "http://developer.etsy.com/docs/resource_favoritelisting#findalllistingfavoredby"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}/favored-by?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteListing",
        "displayName" : "FavoriteListing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/favorites/listings/{listing_id}",
        "doc" : {
          "t" : "Creates a new favorite listing for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoritelisting#createuserfavoritelistings"
        },
        "curl" : "curl -X POST -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/listings/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteListing",
        "displayName" : "FavoriteListing_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{user_id}/favorites/users/{target_user_id}",
        "doc" : {
          "t" : "Finds a favorite user for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoriteuser#finduserfavoriteusers"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/users/{target_user_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteUser",
        "displayName" : "FavoriteUser_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/favorites/users/{target_user_id}",
        "doc" : {
          "t" : "Delete a favorite listing for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoriteuser#deleteuserfavoriteusers"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/users/{target_user_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteUser",
        "displayName" : "FavoriteUser_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/users/{user_id}/favored-by",
        "doc" : {
          "t" : "Retrieves a set of FavoriteUser objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_favoriteuser#findalluserfavoredby"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favored-by?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteUser",
        "displayName" : "FavoriteUser_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/favorites/users",
        "doc" : {
          "t" : "Finds all favorite users for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoriteuser#findalluserfavoriteusers"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/users?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteUser",
        "displayName" : "FavoriteUser_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/favorites/users/{target_user_id}",
        "params" : [
          {
            "name" : "user_id",
            "type" : "user_id_or_name",
            "style" : "query",
            "default" : "__SELF__",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "target_user_id",
            "type" : "user_id_or_name",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new favorite listing for a user",
          "url" : "http://developer.etsy.com/docs/resource_favoriteuser#createuserfavoriteusers"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'user_id=__SELF__&target_user_id=' http://openapi.etsy.com/v2/private/users/__SELF__/favorites/users/{target_user_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FavoriteUser",
        "displayName" : "FavoriteUser_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/homepages/listings/",
        "doc" : {
          "t" : "Finds all FeaturedListings regardless of Listing state",
          "url" : "http://developer.etsy.com/docs/resource_featuredlisting#findallfeaturedlisting"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/listings/?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedListing",
        "displayName" : "FeaturedListing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/pickers/{featured_listing_picker_id}/featured",
        "doc" : {
          "t" : "Retrieves a set of FeaturedListing objects associated to a FeaturedListingPicker.",
          "url" : "http://developer.etsy.com/docs/resource_featuredlisting#findallfeaturedlistingpickerfeatured"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/pickers/{featured_listing_picker_id}/featured?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedListing",
        "displayName" : "FeaturedListing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/listings/active",
        "doc" : {
          "t" : "Finds all FeaturedListings that point to active Listings",
          "url" : "http://developer.etsy.com/docs/resource_featuredlisting#findallfeaturedlistingactive"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/listings/active?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedListing",
        "displayName" : "FeaturedListing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/listings/{featured_listing_id}",
        "doc" : {
          "t" : "Retrieves a FeaturedListing by id.",
          "url" : "http://developer.etsy.com/docs/resource_featuredlisting#getfeaturedlisting"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/listings/{featured_listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedListing",
        "displayName" : "FeaturedListing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/listings/{featured_listing_id}/picker",
        "doc" : {
          "t" : "Retrieves a set of FeaturedListingPicker objects associated to a FeaturedListing.",
          "url" : "http://developer.etsy.com/docs/resource_featuredlistingpicker#getfeaturedlistingassociatedpicker"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/listings/{featured_listing_id}/picker",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedListingPicker",
        "displayName" : "FeaturedListingPicker_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/pickers/{featured_listing_picker_id}",
        "doc" : {
          "t" : "Retrieves a FeaturedListingPicker by id.",
          "url" : "http://developer.etsy.com/docs/resource_featuredlistingpicker#getfeaturedlistingpicker"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/pickers/{featured_listing_picker_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedListingPicker",
        "displayName" : "FeaturedListingPicker_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/pickers/",
        "doc" : {
          "t" : "Finds all FeaturedListingPicker in scope active.",
          "url" : "http://developer.etsy.com/docs/resource_featuredlistingpicker#findallfeaturedlistingpickeractive"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/pickers/?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedListingPicker",
        "displayName" : "FeaturedListingPicker_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/featured/users",
        "doc" : {
          "t" : "Finds all FeaturedUser.",
          "url" : "http://developer.etsy.com/docs/resource_featureduser#findallfeaturedusers"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/featured/users?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedUser",
        "displayName" : "FeaturedUser_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/featured/users/{featured_user_id}",
        "doc" : {
          "t" : "Retrieves a FeaturedUser by id.",
          "url" : "http://developer.etsy.com/docs/resource_featureduser#getfeatureduser"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/featured/users/{featured_user_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "FeaturedUser",
        "displayName" : "FeaturedUser_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/feedback/as-subject",
        "doc" : {
          "t" : "Retrieves a set of Feedback objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_feedback#findalluserfeedbackassubject"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/feedback/as-subject?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Feedback",
        "displayName" : "Feedback_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/feedback/as-author",
        "doc" : {
          "t" : "Retrieves a set of Feedback objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_feedback#findalluserfeedbackasauthor"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/feedback/as-author?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Feedback",
        "displayName" : "Feedback_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/feedback/as-buyer",
        "doc" : {
          "t" : "Retrieves a set of Feedback objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_feedback#findalluserfeedbackasbuyer"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/feedback/as-buyer?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Feedback",
        "displayName" : "Feedback_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/feedback/as-seller",
        "doc" : {
          "t" : "Retrieves a set of Feedback objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_feedback#findalluserfeedbackasseller"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/feedback/as-seller?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Feedback",
        "displayName" : "Feedback_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/server/epoch",
        "doc" : {
          "t" : "Get server time, in epoch seconds notation.",
          "url" : "http://developer.etsy.com/docs/resource_int#getserverepoch"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/server/epoch",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Int",
        "displayName" : "Int_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/pickers/{featured_listing_picker_id}/listings",
        "doc" : {
          "t" : "Retrieves a set of Listing objects associated to a FeaturedListingPicker.",
          "url" : "http://developer.etsy.com/docs/resource_listing#findallfeaturedlistingpickerlistings"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/pickers/{featured_listing_picker_id}/listings?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/pickers/{featured_listing_picker_id}/listings/active",
        "doc" : {
          "t" : "Retrieves a set of Listing objects associated to a FeaturedListingPicker in scope active.",
          "url" : "http://developer.etsy.com/docs/resource_listing#findallfeaturedlistingpickerlistingsactive"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/pickers/{featured_listing_picker_id}/listings/active?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/homepages/listings/{featured_listing_id}/listing",
        "doc" : {
          "t" : "Retrieves a set of Listing objects associated to a FeaturedListing.",
          "url" : "http://developer.etsy.com/docs/resource_listing#getfeaturedlistinglisting"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/homepages/listings/{featured_listing_id}/listing",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/recommended_listings",
        "doc" : {
          "t" : "Get recommended listings for an authenticated member. The number of listings returned may not match the specified limit if there is no activity from recommended shops.",
          "url" : "http://developer.etsy.com/docs/resource_listing#getrecommendedlistings"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/recommended_listings?limit=25&excluded_listing_ids={excluded_listing_ids}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/recommended_listings/rejects/{listing_ids}",
        "doc" : {
          "t" : "Registers rejections of recommended listings. Affects future recommended listings.",
          "url" : "http://developer.etsy.com/docs/resource_listing#registerrecommendedlistingrejects"
        },
        "curl" : "curl -X POST -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/recommended_listings/rejects/{listing_ids}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{user_id}/recommended_listings/views/{listing_ids}",
        "doc" : {
          "t" : "Register viewings of recommended listings. Affects future recommended listings.",
          "url" : "http://developer.etsy.com/docs/resource_listing#registerrecommendedlistingviews"
        },
        "curl" : "curl -X POST -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/recommended_listings/views/{listing_ids}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/listings",
        "params" : [
          {
            "name" : "quantity",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "title",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "description",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "price",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "materials",
            "type" : "array",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "tags",
            "type" : "array",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "shipping_template_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "shop_section_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new Listing",
          "url" : "http://developer.etsy.com/docs/resource_listing#createlisting"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'quantity=&title=&description=&price=&materials=&tags=&shipping_template_id=&shop_section_id=' http://openapi.etsy.com/v2/private/listings",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/shops/{shop_id}/listings/inactive/{listing_id}",
        "doc" : {
          "t" : "Retrieves a Listing associated to a Shop that is inactive",
          "url" : "http://developer.etsy.com/docs/resource_listing#getshoplistinginactive"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/listings/inactive/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}/listings/expired",
        "doc" : {
          "t" : "Retrieves Listings associated to a Shop that are expired",
          "url" : "http://developer.etsy.com/docs/resource_listing#findallshoplistingsexpired"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/listings/expired?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}/listings/inactive",
        "doc" : {
          "t" : "Retrieves Listings associated to a Shop that are inactive",
          "url" : "http://developer.etsy.com/docs/resource_listing#findallshoplistingsinactive"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/listings/inactive?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/{listing_id}",
        "doc" : {
          "t" : "Deletes a Listing",
          "url" : "http://developer.etsy.com/docs/resource_listing#deletelisting"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/shops/{shop_id}/listings/featured",
        "doc" : {
          "t" : "Retrieves Listings associated to a Shop that are featured",
          "url" : "http://developer.etsy.com/docs/resource_listing#findallshoplistingsfeatured"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/listings/featured?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/{listing_id}",
        "params" : [
          {
            "name" : "quantity",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "title",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "description",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "price",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "materials",
            "type" : "array",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "renew",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "tags",
            "type" : "array",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "shipping_template_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "shop_section_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "state",
            "type" : "enum",
            "style" : "query",
            "default" : "active",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a Listing",
          "url" : "http://developer.etsy.com/docs/resource_listing#updatelisting"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'quantity=&title=&description=&price=&materials=&renew=&tags=&shipping_template_id=&shop_section_id=&state=active' http://openapi.etsy.com/v2/private/listings/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/listings/{listing_id}",
        "doc" : {
          "t" : "Retrieves a Listing by id.",
          "url" : "http://developer.etsy.com/docs/resource_listing#getlisting"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/active",
        "doc" : {
          "t" : "Finds all active Listing",
          "url" : "http://developer.etsy.com/docs/resource_listing#findalllistingactive"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/listings/active?limit=25&offset=0&keywords={keywords}&sort_on=created&sort_order=down&min_price={min_price}&max_price={max_price}&color={color}&color_accuracy=0&tags={tags}&materials={materials}&category={category}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}/listings/active",
        "doc" : {
          "t" : "Finds all active Listings associated with a Shop",
          "url" : "http://developer.etsy.com/docs/resource_listing#findallshoplistingsactive"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/listings/active?limit=25&offset=0&keywords={keywords}&sort_on=created&sort_order=down&min_price={min_price}&max_price={max_price}&color={color}&color_accuracy=0&tags={tags}&materials={materials}&category={category}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}/listings/expired/{listing_id}",
        "doc" : {
          "t" : "Retrieves a Listing associated to a Shop that is inactive",
          "url" : "http://developer.etsy.com/docs/resource_listing#getshoplistingexpired"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/listings/expired/{listing_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Listing",
        "displayName" : "Listing_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/{listing_id}/images/{listing_image_id}",
        "doc" : {
          "t" : "Retrieves a ListingImage by id.",
          "url" : "http://developer.etsy.com/docs/resource_listingimage#getlistingimage"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}/images/{listing_image_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ListingImage",
        "displayName" : "ListingImage_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/{listing_id}/images",
        "params" : [
          {
            "name" : "image",
            "type" : "image",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Upload a new listing image",
          "url" : "http://developer.etsy.com/docs/resource_listingimage#uploadlistingimage"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'image=' http://openapi.etsy.com/v2/private/listings/{listing_id}/images",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ListingImage",
        "displayName" : "ListingImage_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/listings/{listing_id}/images/{listing_image_id}",
        "doc" : {
          "t" : "Deletes a listing image",
          "url" : "http://developer.etsy.com/docs/resource_listingimage#deletelistingimage"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}/images/{listing_image_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ListingImage",
        "displayName" : "ListingImage_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/listings/{listing_id}/images",
        "doc" : {
          "t" : "Retrieves a set of ListingImage objects associated to a Listing.",
          "url" : "http://developer.etsy.com/docs/resource_listingimage#findalllistingimages"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}/images",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ListingImage",
        "displayName" : "ListingImage_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/{listing_id}/payments",
        "doc" : {
          "t" : "Retrieves a set of ListingPayment objects associated to a Listing.",
          "url" : "http://developer.etsy.com/docs/resource_listingpayment#getlistingpaymentinfo"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}/payments",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ListingPayment",
        "displayName" : "ListingPayment_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/payments/{listing_payment_id}",
        "doc" : {
          "t" : "Retrieves a ListingPayment by id.",
          "url" : "http://developer.etsy.com/docs/resource_listingpayment#getlistingpayment"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/payments/{listing_payment_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ListingPayment",
        "displayName" : "ListingPayment_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/orders/{order_id}",
        "doc" : {
          "t" : "Retrieves a Order by id.",
          "url" : "http://developer.etsy.com/docs/resource_order#getorder"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/orders/{order_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Order",
        "displayName" : "Order_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/orders",
        "doc" : {
          "t" : "Retrieves a set of Order objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_order#findalluserorders"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/orders?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Order",
        "displayName" : "Order_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/payments/templates",
        "params" : [
          {
            "name" : "allow_check",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "allow_mo",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "allow_other",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "allow_paypal",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "paypal_email",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "name",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "first_line",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "second_line",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "city",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "state",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "zip",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new PaymentTemplate",
          "url" : "http://developer.etsy.com/docs/resource_paymenttemplate#createpaymenttemplate"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'allow_check=&allow_mo=&allow_other=&allow_paypal=&paypal_email=&name=&first_line=&second_line=&city=&state=&zip=&country_id=' http://openapi.etsy.com/v2/private/payments/templates",
        "authentication" : {
          "required" : "true"
        },
        "category" : "PaymentTemplate",
        "displayName" : "PaymentTemplate_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{user_id}/payments/templates",
        "doc" : {
          "t" : "Retrieves a set of PaymentTemplate objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_paymenttemplate#findalluserpaymenttemplates"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/payments/templates",
        "authentication" : {
          "required" : "true"
        },
        "category" : "PaymentTemplate",
        "displayName" : "PaymentTemplate_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/payments/templates/{payment_template_id}",
        "doc" : {
          "t" : "Retrieves a PaymentTemplate by id.",
          "url" : "http://developer.etsy.com/docs/resource_paymenttemplate#getpaymenttemplate"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/payments/templates/{payment_template_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "PaymentTemplate",
        "displayName" : "PaymentTemplate_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/payments/templates/{payment_template_id}",
        "params" : [
          {
            "name" : "allow_check",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "allow_mo",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "allow_other",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "allow_paypal",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "paypal_email",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "name",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "first_line",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "second_line",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "city",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "state",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "zip",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a PaymentTemplate",
          "url" : "http://developer.etsy.com/docs/resource_paymenttemplate#updatepaymenttemplate"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'allow_check=&allow_mo=&allow_other=&allow_paypal=&paypal_email=&name=&first_line=&second_line=&city=&state=&zip=&country_id=' http://openapi.etsy.com/v2/private/payments/templates/{payment_template_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "PaymentTemplate",
        "displayName" : "PaymentTemplate_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/receipts/{receipt_id}",
        "doc" : {
          "t" : "Retrieves a Receipt by id.",
          "url" : "http://developer.etsy.com/docs/resource_receipt#getreceipt"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/receipts/{receipt_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Receipt",
        "displayName" : "Receipt_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/receipts/{receipt_id}",
        "params" : [
          {
            "name" : "receipt_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "was_paid",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "was_shipped",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "message_from_seller",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "message_from_buyer",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a Receipt",
          "url" : "http://developer.etsy.com/docs/resource_receipt#updatereceipt"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'receipt_id=&was_paid=&was_shipped=&message_from_seller=&message_from_buyer=' http://openapi.etsy.com/v2/private/receipts/{receipt_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Receipt",
        "displayName" : "Receipt_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/users/{user_id}/receipts",
        "doc" : {
          "t" : "Retrieves a set of Receipt objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_receipt#findalluserbuyerreceipts"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/receipts?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Receipt",
        "displayName" : "Receipt_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}/receipts",
        "doc" : {
          "t" : "Retrieves a set of Receipt objects associated to a Shop.",
          "url" : "http://developer.etsy.com/docs/resource_receipt#findallshopreceipts"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/receipts?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Receipt",
        "displayName" : "Receipt_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/orders/{order_id}/receipts",
        "doc" : {
          "t" : "Retrieves a set of Receipt objects associated to a Order.",
          "url" : "http://developer.etsy.com/docs/resource_receipt#findallorderreceipts"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/orders/{order_id}/receipts?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Receipt",
        "displayName" : "Receipt_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/regions/{region_id}",
        "doc" : {
          "t" : "Retrieves a Region by id.",
          "url" : "http://developer.etsy.com/docs/resource_region#getregion"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/regions/{region_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Region",
        "displayName" : "Region_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/regions",
        "doc" : {
          "t" : "Finds all Region.",
          "url" : "http://developer.etsy.com/docs/resource_region#findallregion"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/regions",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Region",
        "displayName" : "Region_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shipping/info/{shipping_info_id}",
        "doc" : {
          "t" : "Retrieves a ShippingInfo by id.",
          "url" : "http://developer.etsy.com/docs/resource_shippinginfo#getshippinginfo"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shipping/info/{shipping_info_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingInfo",
        "displayName" : "ShippingInfo_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/listings/{listing_id}/shipping/info",
        "doc" : {
          "t" : "Retrieves a set of ShippingInfo objects associated to a Listing.",
          "url" : "http://developer.etsy.com/docs/resource_shippinginfo#findalllistingshippinginfo"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/listings/{listing_id}/shipping/info?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingInfo",
        "displayName" : "ShippingInfo_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shipping/info/{shipping_info_id}",
        "params" : [
          {
            "name" : "origin_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "destination_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "primary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "secondary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "listing_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "region_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a ShippingInfo with the given id.",
          "url" : "http://developer.etsy.com/docs/resource_shippinginfo#updateshippinginfo"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'origin_country_id=&destination_country_id=&primary_cost=&secondary_cost=&listing_id=&region_id=' http://openapi.etsy.com/v2/private/shipping/info/{shipping_info_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingInfo",
        "displayName" : "ShippingInfo_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/listings/{listing_id}/shipping/info",
        "params" : [
          {
            "name" : "origin_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "destination_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "primary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "secondary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "region_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new ShippingInfo.",
          "url" : "http://developer.etsy.com/docs/resource_shippinginfo#createshippinginfo"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'origin_country_id=&destination_country_id=&primary_cost=&secondary_cost=&region_id=' http://openapi.etsy.com/v2/private/listings/{listing_id}/shipping/info",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingInfo",
        "displayName" : "ShippingInfo_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/shipping/info/{shipping_info_id}",
        "doc" : {
          "t" : "Deletes the ShippingInfo with the given id.",
          "url" : "http://developer.etsy.com/docs/resource_shippinginfo#deleteshippinginfo"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/shipping/info/{shipping_info_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingInfo",
        "displayName" : "ShippingInfo_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/users/{user_id}/shipping/templates",
        "doc" : {
          "t" : "Retrieves a set of ShippingTemplate objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplate#findallusershippingtemplates"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/shipping/templates?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplate",
        "displayName" : "ShippingTemplate_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shipping/templates/{shipping_template_id}",
        "doc" : {
          "t" : "Deletes the ShippingTemplate with the given id.",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplate#deleteshippingtemplate"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/shipping/templates/{shipping_template_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplate",
        "displayName" : "ShippingTemplate_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/shipping/templates/{shipping_template_id}",
        "doc" : {
          "t" : "Retrieves a ShippingTemplate by id.",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplate#getshippingtemplate"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shipping/templates/{shipping_template_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplate",
        "displayName" : "ShippingTemplate_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shipping/templates",
        "params" : [
          {
            "name" : "title",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "origin_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "destination_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "primary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "secondary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "destination_region_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new ShippingTemplate",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplate#createshippingtemplate"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'title=&origin_country_id=&destination_country_id=&primary_cost=&secondary_cost=&destination_region_id=' http://openapi.etsy.com/v2/private/shipping/templates",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplate",
        "displayName" : "ShippingTemplate_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/shipping/templates/{shipping_template_id}",
        "params" : [
          {
            "name" : "title",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "origin_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a ShippingTemplate",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplate#updateshippingtemplate"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'title=&origin_country_id=' http://openapi.etsy.com/v2/private/shipping/templates/{shipping_template_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplate",
        "displayName" : "ShippingTemplate_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/shipping/templates/{shipping_template_id}/entries",
        "doc" : {
          "t" : "Retrieves a set of ShippingTemplateEntry objects associated to a ShippingTemplate.",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplateentry#findallshippingtemplateentries"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shipping/templates/{shipping_template_id}/entries?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplateEntry",
        "displayName" : "ShippingTemplateEntry_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shipping/templates/entries/{shipping_template_entry_id}",
        "params" : [
          {
            "name" : "destination_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "primary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "secondary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a ShippingTemplateEntry",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplateentry#updateshippingtemplateentry"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'destination_country_id=&primary_cost=&secondary_cost=' http://openapi.etsy.com/v2/private/shipping/templates/entries/{shipping_template_entry_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplateEntry",
        "displayName" : "ShippingTemplateEntry_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/shipping/templates/entries/{shipping_template_entry_id}",
        "doc" : {
          "t" : "Deletes a ShippingTemplateEntry",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplateentry#deleteshippingtemplateentry"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/shipping/templates/entries/{shipping_template_entry_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplateEntry",
        "displayName" : "ShippingTemplateEntry_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/shipping/templates/entries",
        "params" : [
          {
            "name" : "shipping_template_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "destination_country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "primary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "secondary_cost",
            "type" : "float",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "destination_region_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new ShippingTemplateEntry",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplateentry#createshippingtemplateentry"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'shipping_template_id=&destination_country_id=&primary_cost=&secondary_cost=&destination_region_id=' http://openapi.etsy.com/v2/private/shipping/templates/entries",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplateEntry",
        "displayName" : "ShippingTemplateEntry_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/shipping/templates/entries/{shipping_template_entry_id}",
        "doc" : {
          "t" : "Retrieves a ShippingTemplateEntry by id.",
          "url" : "http://developer.etsy.com/docs/resource_shippingtemplateentry#getshippingtemplateentry"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shipping/templates/entries/{shipping_template_entry_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShippingTemplateEntry",
        "displayName" : "ShippingTemplateEntry_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/shops",
        "doc" : {
          "t" : "Retrieves a set of Shop objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_shop#findallusershops"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/shops?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Shop",
        "displayName" : "Shop_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops",
        "doc" : {
          "t" : "Finds all Shops. If there is a keywords parameter, finds shops with shop_name starting with keywords.",
          "url" : "http://developer.etsy.com/docs/resource_shop#findallshops"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops?shop_name={shop_name}&limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Shop",
        "displayName" : "Shop_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}",
        "doc" : {
          "t" : "Retrieves a Shop by id.",
          "url" : "http://developer.etsy.com/docs/resource_shop#getshop"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Shop",
        "displayName" : "Shop_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}",
        "params" : [
          {
            "name" : "title",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "announcement",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "is_refusing_alchemy",
            "type" : "boolean",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "alchemy_message",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "sale_message",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "policy_welcome",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "policy_payment",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "policy_shipping",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "policy_refunds",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "policy_additional",
            "type" : "string",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a Shop",
          "url" : "http://developer.etsy.com/docs/resource_shop#updateshop"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'title=&announcement=&is_refusing_alchemy=&alchemy_message=&sale_message=&policy_welcome=&policy_payment=&policy_shipping=&policy_refunds=&policy_additional=' http://openapi.etsy.com/v2/private/shops/{shop_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Shop",
        "displayName" : "Shop_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/shops/{shop_id}/appearance/banner/{shop_banner_id}",
        "doc" : {
          "t" : "Deletes a shop banner image",
          "url" : "http://developer.etsy.com/docs/resource_shopbanner#deleteshopbanner"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/appearance/banner/{shop_banner_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShopBanner",
        "displayName" : "ShopBanner_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/shops/{shop_id}/appearance/banner",
        "params" : [
          {
            "name" : "image",
            "type" : "image",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Upload a new shop banner image",
          "url" : "http://developer.etsy.com/docs/resource_shopbanner#uploadshopbanner"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'image=' http://openapi.etsy.com/v2/private/shops/{shop_id}/appearance/banner",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShopBanner",
        "displayName" : "ShopBanner_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/sections/{shop_section_id}",
        "params" : [
          {
            "name" : "title",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "rank",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "user_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a ShopSection with the given id.",
          "url" : "http://developer.etsy.com/docs/resource_shopsection#updateshopsection"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'title=&rank=&user_id=' http://openapi.etsy.com/v2/private/sections/{shop_section_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShopSection",
        "displayName" : "ShopSection_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/sections/{shop_section_id}",
        "doc" : {
          "t" : "Deletes the ShopSection with the given id.",
          "url" : "http://developer.etsy.com/docs/resource_shopsection#deleteshopsection"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/sections/{shop_section_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShopSection",
        "displayName" : "ShopSection_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/sections/{shop_section_id}",
        "doc" : {
          "t" : "Retrieves a ShopSection by id.",
          "url" : "http://developer.etsy.com/docs/resource_shopsection#getshopsection"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/sections/{shop_section_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShopSection",
        "displayName" : "ShopSection_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/sections",
        "params" : [
          {
            "name" : "title",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "user_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new ShopSection.",
          "url" : "http://developer.etsy.com/docs/resource_shopsection#createshopsection"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'title=&user_id=' http://openapi.etsy.com/v2/private/sections",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShopSection",
        "displayName" : "ShopSection_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/shops/{shop_id}/sections",
        "doc" : {
          "t" : "Retrieves a set of ShopSection objects associated to a Shop.",
          "url" : "http://developer.etsy.com/docs/resource_shopsection#findallshopsections"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/sections",
        "authentication" : {
          "required" : "true"
        },
        "category" : "ShopSection",
        "displayName" : "ShopSection_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/server/ping",
        "doc" : {
          "t" : "Check that the server is alive.",
          "url" : "http://developer.etsy.com/docs/resource_string#ping"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/server/ping",
        "authentication" : {
          "required" : "true"
        },
        "category" : "String",
        "displayName" : "String_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/taxonomy/tags",
        "doc" : {
          "t" : "Retrieves all related tags for the given tag set.",
          "url" : "http://developer.etsy.com/docs/resource_tag#findpopulartags"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/taxonomy/tags?limit=25",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Tag",
        "displayName" : "Tag_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/taxonomy/tags/{tags}",
        "doc" : {
          "t" : "Retrieves all related tags for the given tag set.",
          "url" : "http://developer.etsy.com/docs/resource_tag#findallrelatedtags"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/taxonomy/tags/{tag}?limit=25",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Tag",
        "displayName" : "Tag_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/receipts/{receipt_id}/transactions",
        "doc" : {
          "t" : "Retrieves a set of Transaction objects associated to a Receipt.",
          "url" : "http://developer.etsy.com/docs/resource_transaction#findallreceipttransactions"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/receipts/{receipt_id}/transactions?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Transaction",
        "displayName" : "Transaction_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/shops/{shop_id}/transactions",
        "doc" : {
          "t" : "Retrieves a set of Transaction objects associated to a Shop.",
          "url" : "http://developer.etsy.com/docs/resource_transaction#findallshoptransactions"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/shops/{shop_id}/transactions?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Transaction",
        "displayName" : "Transaction_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/transactions",
        "doc" : {
          "t" : "Retrieves a set of Transaction objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_transaction#findalluserbuyertransactions"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/transactions?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Transaction",
        "displayName" : "Transaction_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/transactions/{transaction_id}",
        "doc" : {
          "t" : "Retrieves a Transaction by id.",
          "url" : "http://developer.etsy.com/docs/resource_transaction#gettransaction"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/transactions/{transaction_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Transaction",
        "displayName" : "Transaction_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/treasuries",
        "doc" : {
          "t" : "Get a user's Treasuries",
          "url" : "http://developer.etsy.com/docs/resource_treasury#findallusertreasuries"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/treasuries?sort_on=hotness&sort_order=down&maturity=safe_only&detail_level=low&limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Treasury",
        "displayName" : "Treasury_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/treasuries/{treasury_id}",
        "doc" : {
          "t" : "Get a Treasury",
          "url" : "http://developer.etsy.com/docs/resource_treasury#gettreasury"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/treasuries/{treasury_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Treasury",
        "displayName" : "Treasury_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/treasuries",
        "doc" : {
          "t" : "Search Treasuries or else List all Treasuries",
          "url" : "http://developer.etsy.com/docs/resource_treasury#findalltreasuries"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/treasuries?keywords={keywords}&sort_on=hotness&sort_order=down&maturity=safe_only&detail_level=low&limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "Treasury",
        "displayName" : "Treasury_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}",
        "doc" : {
          "t" : "Retrieves a User by id.",
          "url" : "http://developer.etsy.com/docs/resource_user#getuser"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__",
        "authentication" : {
          "required" : "true"
        },
        "category" : "User",
        "displayName" : "User_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/addresses/{user_address_id}",
        "doc" : {
          "t" : "Deletes the UserAddress with the given id.",
          "url" : "http://developer.etsy.com/docs/resource_useraddress#deleteuseraddress"
        },
        "curl" : "curl -X DELETE -u 'username:password' http://openapi.etsy.com/v2/private/users/{user_id}/addresses/{user_address_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "UserAddress",
        "displayName" : "UserAddress_DELETE",
        "httpMethod" : "DELETE"
      },
      {
        "path" : "/users/{user_id}/addresses/{user_address_id}",
        "params" : [
          {
            "name" : "name",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "first_line",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "second_line",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "city",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "state",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "zip",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Updates a UserAddress with the given id.",
          "url" : "http://developer.etsy.com/docs/resource_useraddress#updateuseraddress"
        },
        "curl" : "curl -X PUT -u 'username:password' -d 'name=&first_line=&second_line=&city=&state=&zip=&country_id=' http://openapi.etsy.com/v2/private/users/{user_id}/addresses/{user_address_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "UserAddress",
        "displayName" : "UserAddress_PUT",
        "httpMethod" : "PUT"
      },
      {
        "path" : "/users/{user_id}/addresses",
        "params" : [
          {
            "name" : "name",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "first_line",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "second_line",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "city",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "state",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "zip",
            "type" : "text",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          },
          {
            "name" : "country_id",
            "type" : "int",
            "style" : "query",
            "required" : "true",
            "doc" : {

            }
          }
        ],
        "doc" : {
          "t" : "Creates a new UserAddress.",
          "url" : "http://developer.etsy.com/docs/resource_useraddress#createuseraddress"
        },
        "curl" : "curl -X POST -u 'username:password' -d 'name=&first_line=&second_line=&city=&state=&zip=&country_id=' http://openapi.etsy.com/v2/private/users/__SELF__/addresses",
        "authentication" : {
          "required" : "true"
        },
        "category" : "UserAddress",
        "displayName" : "UserAddress_POST",
        "httpMethod" : "POST"
      },
      {
        "path" : "/users/{user_id}/addresses/{user_address_id}",
        "doc" : {
          "t" : "Retrieves a UserAddress by id.",
          "url" : "http://developer.etsy.com/docs/resource_useraddress#getuseraddress"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/{user_id}/addresses/{user_address_id}",
        "authentication" : {
          "required" : "true"
        },
        "category" : "UserAddress",
        "displayName" : "UserAddress_GET",
        "httpMethod" : "GET"
      },
      {
        "path" : "/users/{user_id}/addresses",
        "doc" : {
          "t" : "Retrieves a set of UserAddress objects associated to a User.",
          "url" : "http://developer.etsy.com/docs/resource_useraddress#findalluseraddresses"
        },
        "curl" : "curl -X GET -u 'username:password' http://openapi.etsy.com/v2/private/users/__SELF__/addresses?limit=25&offset=0",
        "authentication" : {
          "required" : "true"
        },
        "category" : "UserAddress",
        "displayName" : "UserAddress_GET",
        "httpMethod" : "GET"
      }
    ]
  },
  "auth_strategy" : "oauth",
  "logo" : "http://octoblu-api-logos.s3.amazonaws.com/color/etsy.png",
  "logobw" : "http://octoblu-api-logos.s3.amazonaws.com/bw/etsy.png",
  "name" : "Etsy",
  "enabled" : true,
  "oauth" : {
    "version" : "1.0",
    "key" : "1qmmuzv023ohmkkdvi7swdoz",
    "secret" : "gbmn8uxof9",
    "accessTokenURL" : "https://openapi.etsy.com/v2/oauth/access_token",
    "requestTokenURL" : "https://openapi.etsy.com/v2/oauth/request_token",
    "authTokenURL" : "https://www.etsy.com/oauth/signin",
    "tokenMethod" : "",
    "scope" : ""
  },
  "useCustom" : true
};


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

