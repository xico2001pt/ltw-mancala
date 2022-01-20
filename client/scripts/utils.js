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

export function randomFloat(minInclusive, maxExclusive) {
    return Math.random() * (maxExclusive - minInclusive) + minInclusive;
}

export function randomInt(minInclusive, maxExclusive) {
    minInclusive = Math.ceil(minInclusive);
    maxExclusive = Math.floor(maxExclusive);
    return Math.floor(randomFloat(minInclusive, maxExclusive));
}

export function shuffle(array) {
    for (let i = 0; i < array.length; ++i) {
        const j = Math.floor(Math.random() * array.length);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}