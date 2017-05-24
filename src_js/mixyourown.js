/* eslint no-unused-vars: ['error', { "vars": "all", "varsIgnorePattern": "[iI]gnored" }] */

function updateChart () {
    console.log('updateChart')
}

var dataChangeFun = function () {
    console.log('update', this.dataset.flavourid, this.value)
    localStorage.setItem(this.dataset.flavourid, '' + this.value)
    updateChart()
}

function initChart () {
    // Check if we are on the mix your own flavour page
    var selectflavour = document.getElementById('selectflavour')
    if (!selectflavour) return

    // Check if all assumed elements are on the page
    var btnAddflavour = document.getElementById('addflavour')
    var flavoursContainer = document.getElementById('addedflavours')
    var noflavourstext = document.getElementById('noflavours')
    if (!btnAddflavour || !flavoursContainer || !noflavourstext) return

    // Store the entered username in the localstorage of the browser
    var d = document.getElementById('name')
    if (d) {
        // Retrieve the value
        d.value = localStorage.getItem('flavour_username')
        // Store the value on change
        d.onchange = function () { localStorage.setItem('flavour_username', this.value) }
    }
    // Store the entered email address in the localstorage of the browser
    d = document.getElementById('_replyto')
    if (d) {
        // Retrieve the value
        d.value = localStorage.getItem('flavour_email')
        // Store the value on change
        d.onchange = function () { localStorage.setItem('flavour_email', this.value) }
    }

    btnAddflavour.onclick = function (e) {
        e.preventDefault() // Dont submit the form with this button
        // Get the selected option of the select flavour box
        var selectedOption = selectflavour.item(selectflavour.selectedIndex)
        var flavourname = selectedOption.dataset.flavourname
        // Check for duplicates
        if (flavoursContainer.querySelector('[name="' + flavourname + '"')) return

        // Create a new input element and add it to the flavoursContainer
        // We copy all the dataset values, set the name, min, max, value and some style
        var newEl = document.createElement('input')
        newEl.type = 'range'
        for (var v in selectedOption.dataset) newEl.dataset[v] = selectedOption.dataset[v]
        newEl.name = flavourname
        newEl.step = 1
        newEl.min = selectedOption.dataset.min
        newEl.max = selectedOption.dataset.max
        newEl.value = selectedOption.dataset.value
        newEl.style.border = '1px solid transparent'
        newEl.style.background = selectedOption.style.background
        // Call change function on change.
        newEl.onchange = dataChangeFun.bind(newEl)
        // Is there a stored value for this flavour? Set it instead of the default value
        var storedValue = localStorage.getItem(newEl.dataset.flavourid)
        if (storedValue) newEl.value = storedValue

        // Create a label with the text of the flavour name
        var newLabel = document.createElement('span')
        newLabel.textContent = flavourname

        var btnRemove = document.createElement('a')
        btnRemove.style.justifySelf = 'end'
        btnRemove.href = '#'
        var removeFuntion = function (fName, e) {
            e.stopPropagation()
            e.preventDefault()
            var elems = document.querySelectorAll('[data-flavourrow="' + fName + '"]')
            for (var elem of elems) { elem.parentNode.removeChild(elem) }
        }
        btnRemove.onclick = removeFuntion.bind(null, flavourname)
        btnRemove.textContent = 'X'

        // Add elements to the container
        newLabel.dataset.flavourrow = flavourname
        newEl.dataset.flavourrow = flavourname
        btnRemove.dataset.flavourrow = flavourname
        flavoursContainer.appendChild(newLabel)
        flavoursContainer.appendChild(newEl)
        flavoursContainer.appendChild(btnRemove)

        // Hide the "no flavours" text
        noflavourstext.style.display = 'none'

        // Update chart
        updateChart()
    }
}

export {initChart}
