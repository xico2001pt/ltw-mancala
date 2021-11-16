export function changeVisibility(elem, visible) {
    elem.style.visibility = (visible ? "visible" : "collapse");
}

export function deselectButton(button) {
    button.classList.remove("selected-button");
    button.classList.add("deselected-button");
}

export function selectButton(button) {
    button.classList.remove("deselected-button");
    button.classList.add("selected-button");
}