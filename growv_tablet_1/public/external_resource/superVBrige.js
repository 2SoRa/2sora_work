/* eslint-disable */
var nativeApp;

function getDeviceNo() {
    const userAgent = navigator.userAgent;
    if (userAgent === 'SuperV-Launcher') {
        return GrowvLauncherBridge.getDeviceId();
    }
}

function goGrowvAppPage(page) {
    const userAgent = navigator.userAgent;
    if (userAgent === 'SuperV-Launcher') {
        GrowvLauncherBridge.startScreen(page);
        GrowvLauncherBridge.close();
    }
}

function setGrowvAppUser(token, stuId) {
    const userAgent = navigator.userAgent;
    if (userAgent === 'SuperV-Launcher') {
        GrowvLauncherBridge.setAuthToken(token, stuId);
    }
}

function exitGrowvApp() {
    const userAgent = navigator.userAgent;
    if (userAgent === 'SuperV-Launcher') {
        GrowvLauncherBridge.exitApp();
    }
}

function clearGrowvApp() {
    const userAgent = navigator.userAgent;
    if (userAgent === 'SuperV-Launcher') {
        GrowvLauncherBridge.clearToken();
    }
}

function closeGrowvApp() {
    const userAgent = navigator.userAgent;
    if (userAgent === 'SuperV-Launcher') {
        GrowvLauncherBridge.close();
    }
}