import * as middleware from './middleware';

export default class Server {
  constructor() {
    this.defaultOptions = {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * @function request
   * @description A custom wrapper for the window.Fetch API used to send
   * all network requests to the Segment API. If an error occurs, the
   * promise will be rejected. If the reuqest is successfull, the
   * promise will be fulfilled.
   * @param {string} url The URL of the request
   * @param {object} options The options for the request
   * @returns {promise}
   */
  async request(url, options) {
    return await fetch(url, options)
      .then(middleware.statusMiddleware)
      .then(middleware.jsonMiddleware)
      .catch(middleware.errorMiddleware);
  }

  /*
   * @function get
   * @description Send a GET request to the server
   * @param {string} url The URL of the request
   * @fires context#request
   * @returns {promise}
   */
  get = url => {

    /**
     * Use Object.assign to merge the default options with whatever
     * options you need to set on the function-level.
     */
    const options = Object.assign(this.defaultOptions, {});

    // Make the request and return a promise.
    return this.request(url, options);
  }
}
