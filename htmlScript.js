
/**
 * is used to generate a HTML code that includes the basic characteristics of a Pokemon
 * 
 * @returns - HTML Code
 */
function generateHTMLBasicsList() {
    return `
        <div class="basicOrder">
            <div class="basicNames">Höhe: ${currentPokemon['height']} m</div>
            <div class="basicNames">Gewicht: ${currentPokemon['weight']} Kg</div>
            <div class="basicNames">Erfahrungswert: ${currentPokemon['base_experience']}</div>
            <div class="basicNames">Typen: ${types}</div>
            <div class="basicNames">Art: ${checkForGenera()}</div>
            <div class="basicNames">${changeFlavorText()}</div>
        </div>`;
}

/**
 * 
 * @returns - a HTML Code which create a div container that contains a close Cross
 */
function generateCloseCross() {
    return `
        <div class="closeCross" onclick="closeWindow()">
        </div>
    `;
}

/**
 * is used to generate a HTML Code with id, name and German Name of a Pokemon
 * 
 * @param {String} clickedLocation - the value is used to make the id field a unique field.
 * @returns 
 */
function generateNameLineHTML(clickedLocation) {
    return `
        <div class="nameLinePosition">
            <div class="d-flex">
                <div id="currentViewId${clickedLocation}">${currentPokemon['id']}</div>
                <div>&nbsp;${writeTheFirstBig(currentPokemon['name'])}</div>
            </div>
            <div class="smalerSize">&nbsp;(${writeTheFirstBig(currentSpecies['names'][5]['name'])})</div>
            ${generateCloseCross()}
        </div>
    `;
}

/**
 * is used to generate HTML Code  to show a Pokemon image with name and number for a small view of the Pokemon evolution chain
 * if Variables are null it gives a fall Back option
 * 
 * @param {*} id - the Number of current Pokemon
 */
async function generateEvolutionTemplate(id) {
    if (id !== undefined) {
        await fetchAndSetPokeData(id);
        if (variablesAreNull()) {
            document.getElementById('evolution').innerHTML += `
            <div class="centerxy d-column gap-8 cursor">
                <div>nothing found</div>
                <img class="center" src="${checkForPicturePath()}" alt="">
            </div>`;
        }
        else {
            document.getElementById('evolution').innerHTML += `
            <div class="centerxy d-column gap-8 cursor" onclick="renderCard(${currentPokemon?.id})">
                <div>${currentPokemon?.id} - ${writeTheFirstBig(currentPokemon?.name)}</div>
                <img class="center" src="${checkForPicturePath()}" alt="">
            </div>`;
        }
    }
}


/**
 * is used to generate a HTML Code with the stats of the current Pokemon
 * 
 */
function getStats() {
    let stats = currentPokemon['stats']
    document.getElementById('stats').innerHTML = "";
    for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];
        document.getElementById('stats').innerHTML += `
        <div class="statsOrder">
            <div class="statsNames">${stat['stat']['name']}</div>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${stat['base_stat']}%" aria-valuenow="${stat['base_stat']}">
                    ${stat['base_stat']}%
                </div>
            </div>
        </div>`;
    }
}