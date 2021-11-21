export function changeVisibility(elem, visible) {
    if (!visible) elem.classList.add("hidden");
    else elem.classList.remove("hidden");
}

export function changeSelection(elem, selected) {
    elem.classList.remove(selected ? "deselected-button" : "selected-button");
    elem.classList.add(selected ? "selected-button" : "deselected-button");
}

export function instantiateElem(elem, parent, className) {
    var element = document.createElement(elem);
    element.classList.add(className);
    parent.appendChild(element);
    return element;
}

export function instantiateDiv(parent, className) {
    return instantiateElem("div", parent, className);
}