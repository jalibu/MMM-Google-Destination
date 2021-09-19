import { Config } from '../types/Config'
import { MapStyle } from './MapStyle'

// Global or injected variable declarations
declare const google: any
declare const moment: any

Module.register<Config>('MMM-Google-Destination', {
  defaults: {
    updateIntervalInSeconds: 60,
    apiKey: null,
    height: 400,
    width: 400,
    start: 'Heidelberg',
    destination: 'Mainz',
    timeFormat: config.timeFormat || 24
  },

  _state: {
    directionsService: null,
    directionsRenderer1: null,
    directionsRenderer2: null,
    lastUpdate: null
  },

  getStyles() {
    return ['MMM-Google-Destination.css']
  },

  getScripts() {
    return ['moment.js']
  },

  getTranslations() {
    return {
      en: 'translations/en.json',
      de: 'translations/de.json'
    }
  },

  getTemplateData() {
    return {
      config: this.config,
      identifier: this.identifier
    }
  },

  getTemplate() {
    return 'templates/MMM-Google-Destination.njk'
  },

  start() {
    const self = this
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}`
    script.async = true

    script.onload = () => {
      self.initGoogleDestinationMap()
    }

    this._state.hourSymbol = this.config.timeFormat === 24 ? 'HH' : 'h'

    document.head.appendChild(script)
  },

  initGoogleDestinationMap() {
    const map = new google.maps.Map(document.getElementById('destination-map-' + this.identifier), {
      styles: MapStyle,
      keyboardShortcuts: false,
      zoomControl: false,
      streetViewControl: false,
      scaleControl: false,
      rotateControl: false,
      panControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    })

    this._state.directionsService = new google.maps.DirectionsService()
    this._state.directionsRenderer1 = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#fff',
        strokeWeight: 7
      }
    })
    this._state.directionsRenderer1.setMap(map)

    this._state.directionsRenderer2 = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#aaa',
        strokeWeight: 5
      }
    })
    this._state.directionsRenderer2.setMap(map)

    this.scheduleUpdate()
  },

  async calculateAndDisplayRoute() {
    try {
      const response = await this._state.directionsService.route({
        origin: {
          query: this.config.start
        },
        destination: {
          query: this.config.destination
        },
        travelMode: google.maps.TravelMode.DRIVING
      })
  
      if (response.status === 'OK') {
        this._state.directionsRenderer1.setDirections(response)
        this._state.directionsRenderer1.setRouteIndex(1)
        this._state.directionsRenderer2.setDirections(response)

        // Hide error
        document.getElementById('destination-error-' + this.identifier).setAttribute('style', 'display: none;')

        let route = response.routes[0]
        document.getElementById(
          'destination-summary-' + this.identifier + '-1'
        ).innerHTML = `${route.legs[0].duration.text} via ${route.summary} (${route.legs[0].distance.text})`

        if (response.routes.length > 1) {
          let route = response.routes[1]
          document.getElementById(
            'destination-summary-' + this.identifier + '-2'
          ).innerHTML = `${route.legs[0].duration.text} via ${route.summary} (${route.legs[0].distance.text})`
          document.getElementById('destination-summary-' + this.identifier + '-2').setAttribute('style', '')
        } else {
          document
            .getElementById('destination-summary-' + this.identifier + '-2')
            .setAttribute('style', 'display: none;')
        }

        const lastUpdate = moment(Date.now())
        
        document.getElementById('destination-lastUpdate-' + this.identifier).innerHTML = `${this.translate(
          'LAST_UPDATE'
        )}${lastUpdate.format(this._state.hourSymbol + ':mm')}`
      } else {
        throw Error(status)
      }
    } catch (err) {
      const errorTime = moment(Date.now())
      const errorElement = document.getElementById('destination-error-' + this.identifier)
      errorElement.innerHTML = `Error: ${err.message} (${errorTime.format(this._state.hourSymbol + ':mm')})`
      errorElement.setAttribute('style', '')
    }
  },

  scheduleUpdate() {
    this.calculateAndDisplayRoute()
    setInterval(this.calculateAndDisplayRoute.bind(this), this.config.updateIntervalInSeconds * 1000)
  }
})
