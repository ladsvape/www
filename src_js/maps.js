import {gmapsKey, mapPoint} from './authkeys'

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */

function initMap (domEl) {
    if (document.getElementById('mapscript')) return loadMap(domEl)
    var s = document.createElement('script')
    s.crossorigin = 'anonymous'
    s.id = 'mapscript'
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + gmapsKey
    s.onload = () => loadMap(domEl)
    document.body.appendChild(s)
}

function loadMap (domEl) {
    var google = window.google

    var myOptions = {
        scrollwheel: true,
        draggable: false,
        panControl: false,
        disableDefaultUI: true,
        styles: [
            {
                'featureType': 'administrative',
                'elementType': 'all',
                'stylers': [{
                    'visibility': 'simplified'
                }]
            },
            {
                'featureType': 'landscape',
                'elementType': 'geometry',
                'stylers': [{
                    'visibility': 'simplified'
                }, {
                    'color': '#fcfcfc'
                }]
            },
            {
                'featureType': 'poi',
                'elementType': 'geometry',
                'stylers': [{
                    'visibility': 'simplified'
                }, {
                    'color': '#fcfcfc'
                }]
            }, {
                'featureType': 'road.highway',
                'elementType': 'geometry',
                'stylers': [{
                    'visibility': 'simplified'
                }, {
                    'color': '#dddddd'
                }]
            }, {
                'featureType': 'road.arterial',
                'elementType': 'geometry',
                'stylers': [{
                    'visibility': 'simplified'
                }, {
                    'color': '#dddddd'
                }]
            }, {
                'featureType': 'road.local',
                'elementType': 'geometry',
                'stylers': [{
                    'visibility': 'simplified'
                }, {
                    'color': '#eeeeee'
                }]
            }, {
                'featureType': 'water',
                'elementType': 'geometry',
                'stylers': [{
                    'visibility': 'simplified'
                }, {
                    'color': '#dddddd'
                }]
            }
        ],
        zoom: mapPoint.zoom,
        maxZoom: mapPoint.zoom + 1,
        minZoom: mapPoint.zoom - 1,
        center: new google.maps.LatLng(mapPoint.latitude, mapPoint.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var gmap = new google.maps.Map(domEl, myOptions)
    var markerIgnored = new google.maps.Marker({
        map: gmap,
        position: new google.maps.LatLng(mapPoint.latitude, mapPoint.longitude)
    })

    google.maps.event.addDomListener(window, 'resize', () => gmap.setCenter(myOptions.center))
}

export {initMap}
