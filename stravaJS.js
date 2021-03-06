/**
 * An unofficial JS lib for Strava
*/
(function(w) {
  'use strict';
  /**
  * define Class StravaJS
  */
  w.StravaJS = function(access_token) {

    if (!access_token) {
      throw "Missing access_token!";
      return;
    }

    var stravaClass = this;
    this.strava = {
        apiUrl: "https://www.strava.com/api/v3/",
        access_token: access_token,
        user: {}
      };

    /** Makes the athlete information available in the strava Object */
    stravaClass._updateInfo = function(data, type) {
      switch (type) {
        case "athlete":
          stravaClass.strava.user = data;
          break;
        case "activities":
          stravaClass.strava.activities = data;
          break;
      }
    };

    /** Make the JSONP callback available at the window level for now */
    w.getAthlete_callback = function(response) {
      stravaClass._updateInfo(response, "athlete");
    };

    w.getActivities_callback = function(response) {
      stravaClass._updateInfo(response, "activities");
    }

    /** Some Utility functions */
    var _util = {
      /** get JSONP data and callback */
      getData: function(args) {
        var url = stravaClass.strava.apiUrl + args.path + "?access_token=" + stravaClass.strava.access_token + "&callback=" + args.callback,
          injecterScript = document.createElement('script');

        injecterScript.src = url;
        injecterScript.onload = function() {
          document.body.removeChild(injecterScript);
        };
        injecterScript.onerror = function() {
          //Something went wrong!
        };
        document.body.appendChild(injecterScript);
      }
    };

    /** The entry point. This is called first thing to get basic Athlete info*/
    var getAthlete = function(token) {
      stravaClass.strava.user = _util.getData({
        method : "GET",
        path : "athlete",
        callback: "getAthlete_callback"
      }, function(data) {
        getAthlete_callback(data);
      });
    };

    /** Get Athlete Activities */
    var getActivities = function() {
      stravaClass.strava.activities = _util.getData({
        method : "GET",
        path : "activities",
        callback: "getActivities_callback"
      }, function(data) {
        getActivities_callback(data);
      });
    };

    /** Initialize by fetching basic athlete data */
    getAthlete();
    getActivities();

    return stravaClass;
  }
})(window);
