$(document).ready(function () {
    var device;

    function checkMobile(){
        var deviceType = navigator.userAgent.toLowerCase(); // userAgent

        if (deviceType.indexOf('android') > -1) {        // aos
            return "android";
        } else if (deviceType.indexOf("iphone") > -1 || deviceType.indexOf("ipad") > -1 || deviceType.indexOf("ipod") > -1 ) {     // ios
            return "ios";
        } else if (deviceType.indexOf("mac") > -1) {     // mac os
            return "mac"
        } else {                                         // other
            return "other";
        }
    }

    device = checkMobile();
    if(device === 'ios' || device === 'mac') {
        // console.log('mac or ios');
        document.querySelector('body').classList.add('ios-show');
    } else {
        document.querySelector('body').classList.add('aos-show');
    }
});