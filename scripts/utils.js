export function changeVisibility(elem, visible) {
    elem.style.display = (visible ? "block" : "none");
}

export function deselectButton(button) {
    button.classList.remove("selected-button");
    button.classList.add("deselected-button");
}

export function selectButton(button) {
    button.classList.remove("deselected-button");
    button.classList.add("selected-button");
}