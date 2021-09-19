import { Config } from '../types/Config'
import { MapStyle } from './MapStyle'

// Global or injected variable declarations
declare const google: any
declare const moment: any

Module.register<Config>('MMM-Google-Destination', {
  defaults: {
    updateIntervalInSeconds: 300,
    apiKey: null,
    height: 400,
    width: 400,
    expectedDurationInMinutes: null,
    start: 'Heidelberg',
    destination: 'Mainz',
    routeColor: '#fff',
    timeFormat: config.timeFormat || 24
  },

  _state: {
    directionsService: null,
    directionsRenderer0: null,
    directionsRenderer1: null,
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
    this._state.directionsRenderer0 = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#fff',
        strokeOpacity: 0.7,
        strokeWeight: 7
      }
    })
    this._state.directionsRenderer0.setMap(map)

    this._state.directionsRenderer1 = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#aaa',
        strokeOpacity: 0.5,
        strokeWeight: 5
      }
    })
    this._state.directionsRenderer1.setMap(map)

    this.scheduleUpdate()
  },

  getStrokeColor(response: any, index: number) {
    if(this.config.expectedDurationInMinutes){
      const value =
      (response.routes[index].legs[0].duration.value - this.config.expectedDurationInMinutes) / this.config.expectedDurationInMinutes
    var hue = ((1 - value) * 120).toString(10)

    return ['hsl(', hue, ',100%,50%)'].join('')
    } else {
      return this.config.routeColor
    }

  },

  setRouteSummary(response: any, index: number) {
    let route = response.routes[index]

    document.getElementById(`destination-summary-${this.identifier}-${index}`).innerHTML = this.translate('SUMMARY', {
      duration: route.legs[0].duration.text,
      via: route.summary,
      distance: route.legs[0].distance.text
    })
  },

  async calculateAndDisplayRoute() {
    if (!this._state.lastUpdate || Date.now() - this._state.lastUpdate > this.config.updateIntervalInSeconds * 1000) {
      try {
        const response = await this._state.directionsService.route({
          provideRouteAlternatives: true,
          origin: {
            query: this.config.start
          },
          destination: {
            query: this.config.destination
          },
          travelMode: google.maps.TravelMode.DRIVING
        })

        if (response.status === 'OK') {
          // Hide error
          document.getElementById('destination-error-' + this.identifier).setAttribute('style', 'display: none;')

          this._state.directionsRenderer0.setDirections(response)
          this._state.directionsRenderer0.polylineOptions.strokeColor = this.getStrokeColor(response, 0)
          this._state.directionsRenderer0.setRouteIndex(1)
          this.setRouteSummary(response, 0)

          this._state.directionsRenderer1.setDirections(response)
          this._state.directionsRenderer1.polylineOptions.strokeColor = this.getStrokeColor(response, 1)
          this.setRouteSummary(response, 1)

          this._state.lastUpdate = Date.now()
        } else {
          throw Error(status)
        }
      } catch (err) {
        const errorTime = moment(Date.now())
        const errorElement = document.getElementById('destination-error-' + this.identifier)
        errorElement.innerHTML = `Error: ${err.message} (${errorTime.format(this._state.hourSymbol + ':mm')})`
        errorElement.setAttribute('style', '')
      }
    }
    const lastUpdateElement = document.getElementById('destination-lastUpdate-' + this.identifier)
    if (lastUpdateElement && this._state.lastUpdate) {
      const age = moment(Date.now() - this._state.lastUpdate)
      lastUpdateElement.innerHTML = this.translate('LAST_UPDATE', { age: age.format('m') })
    }
  },

  scheduleUpdate() {
    this.calculateAndDisplayRoute()
    setInterval(this.calculateAndDisplayRoute.bind(this), 30 * 1000)
  }
})
