export function changeVisibility(elem, visible) {
    if (!visible) elem.classList.add("hidden");
    else elem.classList.remove("hidden");
}

export function deselectButton(button) {
    button.classList.remove("selected-button");
    button.classList.add("deselected-button");
}

export function selectButton(button) {
    button.classList.remove("deselected-button");
    button.classList.add("selected-button");
}