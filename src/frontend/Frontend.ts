import { Config } from '../types/Config'
import { MapStyle } from './MapStyle'

// Global or injected variable declarations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  state: {
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
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}`
    script.async = true

    script.onload = () => {
      this.initGoogleDestinationMap()
    }

    this.state.hourSymbol = this.config.timeFormat === 24 ? 'HH' : 'h'

    document.head.appendChild(script)
  },

  initGoogleDestinationMap() {
    const map = new google.maps.Map(document.getElementById(`destination-map-${this.identifier}`), {
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

    this.state.directionsService = new google.maps.DirectionsService()
    this.state.directionsRenderer0 = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#fff',
        strokeOpacity: 0.7,
        strokeWeight: 7
      }
    })
    this.state.directionsRenderer0.setMap(map)

    this.state.directionsRenderer1 = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#aaa',
        strokeOpacity: 0.5,
        strokeWeight: 5
      }
    })
    this.state.directionsRenderer1.setMap(map)

    this.scheduleUpdate()
  },

  getStrokeColor(response: any, index: number) {
    if (this.config.expectedDurationInMinutes) {
      const value =
        (response.routes[index].legs[0].duration.value - this.config.expectedDurationInMinutes) /
        this.config.expectedDurationInMinutes
      const hue = ((1 - value) * 120).toString(10)

      return ['hsl(', hue, ',100%,50%)'].join('')
    }

    return this.config.routeColor
  },

  setRouteSummary(response: any, index: number) {
    const route = response.routes[index]

    document.getElementById(`destination-summary-${this.identifier}-${index}`).innerHTML = this.translate('SUMMARY', {
      duration: route.legs[0].duration.text,
      via: route.summary,
      distance: route.legs[0].distance.text
    })
  },

  async calculateAndDisplayRoute() {
    if (!this.state.lastUpdate || Date.now() - this.state.lastUpdate > this.config.updateIntervalInSeconds * 1000) {
      try {
        const response = await this.state.directionsService.route({
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
          document.getElementById(`destination-error-${this.identifier}`).setAttribute('style', 'display: none;')

          this.state.directionsRenderer0.setDirections(response)
          this.state.directionsRenderer0.polylineOptions.strokeColor = this.getStrokeColor(response, 0)
          this.state.directionsRenderer0.setRouteIndex(1)
          this.setRouteSummary(response, 0)

          this.state.directionsRenderer1.setDirections(response)
          this.state.directionsRenderer1.polylineOptions.strokeColor = this.getStrokeColor(response, 1)
          this.setRouteSummary(response, 1)

          this.state.lastUpdate = Date.now()
        } else {
          throw Error(response.status)
        }
      } catch (err) {
        const errorTime = moment(Date.now())
        const errorElement = document.getElementById(`destination-error-${this.identifier}`)
        errorElement.innerHTML = `Error: ${err.message} (${errorTime.format(`${this.state.hourSymbol}:mm`)})`
        errorElement.setAttribute('style', '')
      }
    }
    const lastUpdateElement = document.getElementById(`destination-lastUpdate-${this.identifier}`)
    if (lastUpdateElement && this.state.lastUpdate) {
      const age = moment(Date.now() - this.state.lastUpdate)
      lastUpdateElement.innerHTML = this.translate('LAST_UPDATE', { age: age.format('m') })
    }
  },

  scheduleUpdate() {
    this.calculateAndDisplayRoute()
    setInterval(this.calculateAndDisplayRoute.bind(this), 30 * 1000)
  }
})
