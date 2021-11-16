export function changeVisibility(elem, visible) {
    if (!visible) elem.classList.add("hidden");
    else elem.classList.remove("hidden");
}

export function changeSelection(elem, selected) {
    elem.classList.remove(selected ? "deselected-button" : "selected-button");
    elem.classList.add(selected ? "selected-button" : "deselected-button");
}