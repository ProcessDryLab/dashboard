export default class DCRServices {
  constructor() {
    this.urls = require('../assets/backend-hosts.json')
    this.url = ''
    this.getRandomURL()
  }

  getRandomURL() {
    var urls = this.getAllURLs()
    this.url = urls.engine
  }

  getAllURLs() {
    return this.urls
  }

  getHostname() {
    return this.url.hostname
  }

  getProtocol() {
    return this.url.protocol
  }

  getUrl() {
    return this.getProtocol() + '://' + this.getHostname()
  }

  getUrlPing() {
    return this.getUrl() + '/api/v1/system/ping'
  }

  getUrlDcr2Dot() {
    return this.getUrl() + '/api/v1/dcr/dcr2graphviz'
  }

  getUrlImportFromDcrJson() {
    return this.getUrl() + '/api/v1/dcr/importFromDcrJson'
  }

  getUrlExportToDcrJson() {
    return this.getUrl() + '/api/v1/dcr/exportToDcrJson'
  }

  getUrlInitializeSimulation() {
    return this.getUrl() + '/api/v1/dcr/simulation/initialize'
  }

  getUrlSimulationStatus(id) {
    return this.getUrl() + '/api/v1/dcr/simulation/' + id + '/status'
  }

  getUrlSimulate(id, activityName) {
    return this.getUrl() + '/api/v1/dcr/simulation/' + id + '/execute/' + activityName
  }

  getUrlSimulationReset(id) {
    return this.getUrl() + '/api/v1/dcr/simulation/' + id + '/reset'
  }

  getUrlEditModel(source, relation, target) {
    return this.getUrl() + '/api/v1/dcr/edit/add/' + source + '/' + relation + "/" + target
  }
}
