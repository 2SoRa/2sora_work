var setExpire = (function() {
    function _getCookie(name) {
        console.log('getCookie, name : ', name);
        var nameOfCookie = name + "=";
        var x = 0;
        while (x <= document.cookie.length) {
            var y = (x + nameOfCookie.length);
            if (document.cookie.substring(x, y) == nameOfCookie) {
                if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                    endOfCookie = document.cookie.length;
                return unescape(document.cookie.substring(y, endOfCookie));
            }
            x = document.cookie.indexOf(" ", x) + 1;
            if (x == 0) break;
        }
        return "";
    }

// 쿠키 셋팅 : day (day * 24)
    function _setCookieDays(name, value, expiredays) {
        console.log('setCookieDays, name : ', name);
        var todayDate = new Date();
        todayDate.setDate(todayDate.getDate() + expiredays);
        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
    }

// 쿠키 셋팅 : 00시 갱신
    function _setCookie00(name, value, expiredays) {
        console.log('setCookie00, name : ', name);

        var todayDate = new Date();
        todayDate = new Date(parseInt(todayDate.getTime() / 86400000) * 86400000 + 54000000);

        if (todayDate > new Date()) {
            expiredays = expiredays - 1;
        }

        console.log('expiredays : ' + expiredays);

        todayDate.setDate(todayDate.getDate() + expiredays);
        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
        console.log(name + ' 쿠키 설정 ===> ', todayDate, expiredays);
    }

    return {
        getCookie : _getCookie,
        setCookieDays : _setCookieDays,
        setCookie00 : _setCookie00,
    }
})();