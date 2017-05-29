/* eslint no-unused-vars: ['error', { "vars": "all", "varsIgnorePattern": "[iI]gnored" }] */

var flavoursContainer = null
var flavourcanvas = null

var applyTransform = function (value) {
    this.style.transform = 'translateY(' + value + 'px)'
}

function updateChart () {
    if (!flavoursContainer || !flavourcanvas) return
    // Get all current flavour inputs
    var all = Array.from(flavoursContainer.querySelectorAll('input'))
    // Get the total value
    var total = all.reduce((t, current) => {
        return t + parseInt(current.value)
    }, 0)

    // Determine percentage for each element
    var accPercentage = 0
    var zIndex = 1000 // decreasing
    for (var elem of all) {
        var flavourname = elem.dataset.flavourrow
        var percentage = elem.value * 100 / total
        var roundedPercentage = Math.round(percentage)
        var p = flavoursContainer.querySelector('span[data-flavourrow="' + flavourname + '"] > span.percentage')
        if (roundedPercentage < 10) p.textContent = '0' + roundedPercentage
        else p.textContent = roundedPercentage

        var flVis = flavourcanvas.querySelector('[data-flavourrow="' + flavourname + '"]')

        flVis.style.zIndex = zIndex
        zIndex -= 1

        accPercentage += percentage
        var trValue = accPercentage * -380 / 100
        setTimeout(applyTransform.bind(flVis, trValue), 50)
    }
}

var dataChangeFun = function () {
    localStorage.setItem(this.dataset.flavourid, '' + this.value)
    updateChart()
}

function validateForm (e) {
    var r = flavoursContainer.querySelectorAll('input').length
    if (!r) {
        e.stopPropagation()
        e.preventDefault()
        var warning = document.getElementById('no-flavour-selected-warning')
        warning.style.display = 'block'
        setTimeout(() => {
            document.getElementById('no-flavour-selected-warning').style.display = 'none'
        }, 5000)
    }
    return r
}

function addFlavour (e) {
    e.preventDefault() // Dont submit the form with this button

    var selectflavour = document.getElementById('selectflavour')
    var noflavourstext = document.getElementById('noflavours')

    // Get the selected option of the select flavour box
    var selectedOption = selectflavour.item(selectflavour.selectedIndex)
    var flavourname = selectedOption.dataset.flavourname
    // Check for duplicates
    if (flavoursContainer.querySelector('[name="' + flavourname + '"]')) return

    var t = document.querySelector('#flavourrow')
    if (!t) return
    var row = document.importNode(t.content, true)

    // Change row id for all elements, so that "remove" can find them later for removal
    var elemsWithRowID = row.querySelectorAll('[data-flavourrow]')
    for (var elem of elemsWithRowID) elem.dataset.flavourrow = flavourname

    row.querySelector('span.name').textContent = flavourname

    // Set style.background, name and all data-attributes, and min, max, value, step if available
    var inputEl = row.querySelector('input')
    inputEl.style.background = selectedOption.style.background
    inputEl.name = flavourname
    inputEl.onchange = dataChangeFun.bind(inputEl)
    for (var v in selectedOption.dataset) { inputEl.dataset[v] = selectedOption.dataset[v] }
    for (var w of ['min', 'max', 'value', 'step']) { if (selectedOption.dataset[w]) inputEl[w] = selectedOption.dataset[w] }

    // Is there a stored value for this flavour? Set it instead of the default value
    var storedValue = localStorage.getItem(inputEl.dataset.flavourid)
    if (storedValue) inputEl.value = storedValue

    var btnRemove = row.querySelector('a')
    var removeFuntion = function (fName, e) {
        e.stopPropagation()
        e.preventDefault()
        var elems = document.querySelectorAll('[data-flavourrow="' + fName + '"]')
        for (var elem of elems) { elem.parentNode.removeChild(elem) }
        updateChart()
    }
    btnRemove.onclick = removeFuntion.bind(null, flavourname)

    // Create visual item
    var visualItem = document.getElementById('waveshape')
    // visualItem.dataset.tooltip = flavourname
    visualItem.dataset.flavourrow = flavourname
    for (var child of visualItem.children) {
        child.style.fill = selectedOption.style.background
    }
    // visualItem.style.background = selectedOption.style.background
    var cloneVisual = visualItem.cloneNode(true)
    delete cloneVisual.id
    cloneVisual.style.display = ''

    // Add elements to the container
    flavourcanvas.appendChild(cloneVisual)
    flavoursContainer.appendChild(row)

    // Hide the "no flavours" text
    noflavourstext.style.display = 'none'

    // Update chart
    updateChart()
}

function initMixYourOwn () {
    // Check if we are on the mix your own flavour page
    var selectflavour = document.querySelector('#newpage #selectflavour')
    if (!selectflavour) return

    // Check if all assumed elements are on the page
    var btnAddflavour = document.getElementById('addflavour')
    flavoursContainer = document.getElementById('addedflavours')
    flavourcanvas = document.getElementById('flavourcanvas')
    if (!btnAddflavour || !flavoursContainer) return

    var pgvgslider = document.getElementById('pgvgslider')
    pgvgslider.oninput = function () {
        const vgmin = this.dataset.vgMinRecommended
        const pgmin = this.dataset.pgMinRecommended
        const v = this.value
        document.querySelectorAll('.toolesspg').forEach(item => {
            if (v < pgmin) {
                item.classList.add('highlight')
            } else {
                item.classList.remove('highlight')
            }
        })
        document.querySelectorAll('.toolessvg').forEach(item => {
            if (v > 100 - vgmin) {
                item.classList.add('highlight')
            } else {
                item.classList.remove('highlight')
            }
        })
    }

    // form validation
    document.getElementById('own-flavour-form').onsubmit = validateForm

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

    btnAddflavour.onclick = addFlavour
}

export {initMixYourOwn}
