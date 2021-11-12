var modesContent = [null];
var currentMode;

document.addEventListener("DOMContentLoaded", initializeAuthentication);

function initializeAuthentication() {
    const MODES = ["navigation-authentication", "navigation-logout"];

    for (let i = 0; i < MODES.length; ++i) {
        modesContent[i] = document.getElementById(MODES[i]);
    }

    logout();
}

function login() {
    // if valid
    changeVisibility(modesContent[0], "none");
    changeVisibility(modesContent[1], "block");
}

function register() {
    // if valid
        // create account
        // login
    login();
}

function logout() {
    changeVisibility(modesContent[1], "none");
    changeVisibility(modesContent[0], "block");
}

function changeVisibility(elem, visibility) {
    elem.style.display = visibility;
}