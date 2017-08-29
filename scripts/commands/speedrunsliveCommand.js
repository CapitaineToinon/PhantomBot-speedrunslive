(function() {
    /*
     * @function getHashCode - Returns a hash for a given string
     *
     * @param {string} str
     * @returns {string}
     */
    function getHashCode(str){
        var hash = 0;
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash;
        }
        return hash;
    }

    /*
     * CACHE Global variables - used by get_Custom_API_Value_From_Cache()
     */ 
    var _cache_life = 5*60;          // The cache lifespan - 5 minutes
    var _srl_cache = [];             // The actual cache variable
    var _cache_enabled = true;       // Can be used for debugging

    /*
     * @function get_Custom_API_Value_From_Cache
     *
     * @param {string} url
     * @returns {string}
     */
    function get_Custom_API_Value_From_Cache(url) {
        // Disable cache for debug
        if (!_cache_enabled) {
            return getCustomAPIValue(url);
        }

        // Hash the URL and use it as a key in the cache
        var hash = getHashCode(url);
        if (!(hash in _srl_cache)) {
            // Value not already in the cache
            var array = [];
            // Set the time to now
            array['time'] = new Date().getTime() / 1000;
            // Get the content from the URL using getCustomAPIValue()
            array['content'] = getCustomAPIValue(url);
            // Add the value to the cache
            _srl_cache[hash] = array;
            // Returning new value
            return _srl_cache[hash]['content'];
        } 
        else {
            // Value in the cache
            var now = new Date().getTime() / 1000;
            if(now - _srl_cache[hash]['time'] < _cache_life) {
                // Cache didn't expire yet, returning cached value 
                return _srl_cache[hash]['content'];
            } else {
                // Cache expired 
                var array = [];
                // Set the time to now
                array['time'] = new Date().getTime() / 1000;
                // Get the content from the URL using getCustomAPIValue()
                array['content'] = getCustomAPIValue(url);
                // Add the value to the cache
                _srl_cache[hash] = array;
                // Returning new value
                return _srl_cache[hash]['content'];
            }
        }
    }

    /*
     * @function getCustomAPIValue
     *
     * @param {string} url
     * @returns {string}
     */
    function getCustomAPIValue(url) {
        var HttpResponse = Packages.com.gmt2001.HttpResponse,
            HttpRequest = Packages.com.gmt2001.HttpRequest,
            HashMap = Packages.java.util.HashMap,
            responseData = HttpRequest.getData(HttpRequest.RequestType.GET, url, '', new HashMap());

        return responseData.content;
    }

    /*
     * @function findRace
     *
     * @param {string} runner
     * @returns {string}
     */
    function findRace(runner) {
        var url = $.lang.get('speedrunslive.api.url');
        var response = get_Custom_API_Value_From_Cache(url);

        if (response !== null) {
            // API responded correctly
            var srl_api = JSON.parse(response);
            for (var k in srl_api.races) {
                var race = srl_api.races[k];
                var runners = [];
                for (var e in race.entrants) {
                    var entrant = race.entrants[e];
                    if (entrant.twitch === runner || entrant.displayname === runner) {
                        /*
                         * $1 game
                         * $2 race goal
                         * $3 race state
                         * $4 race id
                         */ 
                        return $.lang.get(
                            'speedrunslive.race.found',
                            race.game.name,
                            race.goal,
                            race.statetext,
                            race.id
                        );
                    }
                }
            }

            // Race not found
            return $.lang.get('speedrunslive.race.notfound', runner);
        } else {
            // API ERROR
            return $.lang.get('speedrunslive.api.error');;
        }

    }

    $.bind('command', function(event) {               
        var command = event.getCommand();
			
        if (command.equalsIgnoreCase('race')) {
            var runner = $.lang.get('speedrunslive.account');
            if (runner === '') {
                runner = $.channelName;
            }
            $.say(findRace(runner));
        } 
    });

    $.bind('initReady', function() {
        $.registerChatCommand('./commands/speedrunsliveCommand.js', 'race', 7);
    });
})();
