export default class PaliaMinerService {
  constructor() {
    this.urls = require('../assets/backend-hosts.json')
    this.url = ''
    this.getRandomURL()
  }

  getRandomURL() {
    var urls = this.getAllURLs()
    this.url = urls.palia
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

  getUrlMiner() {
    return this.getUrl() + '/api/v1/discover/mine'
  }

}