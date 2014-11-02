var CurrentTime = (function(){

    var App = function(SERVER_TIME, IS_DST) {

        // browser start time
        this.LOC_START_TIME = new Date();

        // save server time
        this.SERVER_TIME = SERVER_TIME;

        // use Americas DST
        this.IS_DST = IS_DST || false;

    };

    var Proto = App.prototype;

    // Get Current Time
    Proto.getCurrent = function() {
        var self = this,
            current = new Date(), // current browser time
            diff = current.getTime() - self.LOC_START_TIME.getTime(), // difference between browser times
            currServer = new Date(self.SERVER_TIME.getTime() + diff); // server time with difference

        // 1 hour back if not DST
        if (self.IS_DST && !USDST(currServer).val) {
            currServer.setHours(currServer.getHours() - 1);
        }

        return currServer;

    };

    // is DST
    Protot.isDST = function() {
        var dst = (this.IS_DST) ? USDST(this.SERVER_TIME) : false;
        return (dst) ? dst.val : false;
    };

    // DST info for the current year
    Proto.DST = function() {
        return (this.IS_DST) ? USDST(this.SERVER_TIME) : false;
    };

    /**
     * Check if DST (US)
     * STARTS - 2nd Sunday of March @ 2AM
     * ENDS - 1st Sunday of November @ 2AM
     *
     */
    var USDST = function(d) {

        var yr = d.getFullYear();

        // dst starts
        var currYrStart = (function(){
            var dt = new Date("3/01/"+yr+" 00:00:00"),
                found = 0;

            while (found < 2) {
                if (dt.getDay() === 0) { found++; }

                if (found < 2) { dt.setDate(dt.getDate() + 1); }

                // avoid an endless loop
                if (dt.getMonth >= 2) {
                    found = 2;
                    dt.setHours(2); // 2am
                }
            }

            return dt;
        }());

        // dst ends
        var currYrEnd = (function(){
            var dt = new Date("11/01/"+yr+" 00:00:00"),
                found = false;

            while (!found) {
                if (dt.getDay() === 0) {
                    found = true;
                } else {
                    dt.setDate(dt.getDate() + 1);
                }

                // avoid an endless loop
                if (dt.getMonth()>10) { found = true; }
                if (found) { dt.setHours(2); } // 2am
            }

            return dt;
        }());

        var isDST = (d.getTime() >= currYrStart.getTime() && d.getTime() < currYrEnd.getTime()) ? true : false;

        return { val:isDST, currYrStart:currYrStart, currYrEnd:currYrEnd, currYr:yr };
    };

    return App;

}());