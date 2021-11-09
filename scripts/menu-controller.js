
var menusButtons = [];
var menusContents = []
var currentMenu;

document.addEventListener("DOMContentLoaded", initializeMenu);

function initializeMenu() {
    const MENUS = ["play", "instructions", "leaderboard"];

    for (let i = 0; i < MENUS.length; ++i) {
        menusButtons[i] = document.getElementById(MENUS[i] + "-button");
        menusContents[i] = document.getElementById(MENUS[i] + "-content");
    }
    currentMenu = 0;
    selectButton(menusButtons[currentMenu])

    for (let i = 1; i < menusButtons.length; ++i) {
        deselectButton(menusButtons[i]);
        changeVisibility(menusContents[i], false);
    }
}

function changeMenu(id) {
    deselectButton(menusButtons[currentMenu]);
    changeVisibility(menusContents[currentMenu], false);
    currentMenu = id;
    selectButton(menusButtons[currentMenu]);
    changeVisibility(menusContents[currentMenu], true);
}

function deselectButton(button) {
    button.classList.remove("selected-button");
    button.classList.add("deselected-button");
}

function selectButton(button) {
    button.classList.remove("deselected-button");
    button.classList.add("selected-button");
}

function changeVisibility(elem, visible) {
    elem.style.display = (visible ? "block" : "none");
}
