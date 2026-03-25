/**
 * is used to change the highlighted element on the lower section of Pokemon Details Card. the function set style elemente depending on the order of the passed values
 * 
 * @param {String*} first - is the first part of the first id name
 * @param {string} second - is the first part of the second id name
 * @param {string} third - is the first part of the third id name
 */
async function showSelectedInformation(first, second, third) {
    document.getElementById(`${first}Button`).classList.add('btnCheckedDesign');
    document.getElementById(first).classList.remove('d-none');
    document.getElementById(`${second}Button`).classList.remove('btnCheckedDesign');
    document.getElementById(second).classList.add('d-none');
    document.getElementById(`${third}Button`).classList.remove('btnCheckedDesign');
    document.getElementById(third).classList.add('d-none');
}

/**
 * used to toggle the disable state from a button and the searchfild. Only active on load progress
 * 
 * @param {Boolean} toggle - true for disabled and false for enabled
 */
function disableButton(toggle) {
    document.getElementById('search').disabled = toggle;
    document.getElementById('morebtn').disabled = toggle;
    if (toggle == true) {
        document.getElementById('morebtn').style.cursor = "not-allowed";
    }
    if (toggle == false) {
        document.getElementById('morebtn').style.cursor = "pointer";
    }
}

/**
 * is used to generate the loading Progress as dynamic bar
 * 
 * @param {Number} i - is the id of the currently processed Pokemon
 */
function setProgressbarProgress(i) {
    document.getElementById('loadBar').style.width = `${100 / (loadRange / (i))}%`;
    document.getElementById('loadBar').innerHTML = `${i} von ${loadRange} ${currentSpecies['names'][5]['name']}`;
}

/**
 * is used to toogle show or hide the loadscreen 
 * 
 * @param {string} toogle - expected flex or none
 */
function toogleLoadScreen(toogle) {
    document.getElementById('loadContainer').style.display = toogle;
    document.body.classList.toggle('overFlow');
}

/**
 * change class for animation
 */
function toggleOpacity() {
    document.getElementById('pokemonPicture').classList.toggle('active');
    document.getElementById('pokemonName').classList.toggle('active');
    document.getElementById('basic').classList.toggle('active');
    document.getElementById('stats').classList.toggle('active');
    document.getElementById('evolution').classList.toggle('active');
}

/**
 * set current Pokemon picture after a little delay
 */
function setPictureAfterAnimation() {
    const cardImage = checkForPicturePath();
    setTimeout(() => {
        document.getElementById('pokemonPicture').src = cardImage;
    }, 400);
}

/**
 * Prevents the event from propagating (bubbling) to parent elements.
 * 
 * @param {Event} event 
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * is used to show or hide the dropdown List on search field
 * 
 */
function toggleDropDownListView() {
    document.getElementById('dropDownList').classList.toggle = 'd-flex';
}

/**
 * is used to close the Pokemon Detail Information Card and set default values for next using
 * 
 */
function closeWindow() {
    document.getElementById('position').style.display = 'none';
    document.getElementById('dialog').style.display = 'none';
    document.getElementById('pokemonPicture').src = "img/pokeball.png";
    document.getElementById('stats').innerHTML = "";
    document.getElementById('body').style.overflow = "auto";
    showSelectedInformation('basic', 'stats', 'evolution');
    toggleOpacity();
}

/**
 * Determines the background color based on the Pokémon's species color.
 * If the species color is found in the predefined set, it returns the corresponding CSS variable or color.
 * If the color is not found, it defaults to black.
 * 
 * @returns - the Variable of a color or black if its not found
 */
function setBackgroundColor() {
    const colors = {
        green: "var(--bs-green)",
        red: "var(--bs-red)",
        brown: "brown",
        purple: "var(--bs-purple)",
        blue: "var(--bs-cyan)",
        yellow: "var(--bs-yellow)",
        pink: "var(--bs-pink)",
        white: "var(--bs-white)",
        gray: "var(--bs-gray)"
    }
    let color = currentSpecies?.color?.name;
    return colors[color] || "black";
}
