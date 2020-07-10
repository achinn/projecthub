/* eslint-disable no-alert */

import axios from 'axios'
import { oneLine } from 'common-tags'

import Storage from 'src/lib/Storage'


class GitHubAPI {
  static url = 'https://api.github.com'
  static timeoutPeriod = 200

  static logError(error) {
    console.error(error)
    console.error(error.response)
  }

  constructor() {
    this.isTimedOut = false
  }

  async queryUrl(url, includeResponseHeaders = false) {
    if (this.isTimedOut) throw new Error('API calls are timed out because we encountered an error')

    const requestOptions = {
      headers: {
        Accept: 'application/vnd.github.mockingbird-preview',
      },
    }
    let response

    const authToken = await Storage.get('githubToken')
    if (authToken) {
      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `token ${authToken}`,
      }
    }

    try {
      response = await axios.get(url, requestOptions)
    } catch (error) {
      this.handleError(error)
      throw error
    }

    return includeResponseHeaders ?
      { headers: response.headers, data: response.data } : response.data
  }

  async query(endpoint, includeResponseHeaders = false) {
    return this.queryUrl(`${GitHubAPI.url}/${endpoint}`, includeResponseHeaders)
  }

  getUser = user => this.query(`users/${user}`)

  async getTimeline(repo, issueId) {
    const response = await this.query(`repos/${repo}/issues/${issueId}/timeline`, true)

    const getNextPage = async (headers, data) => {
      if (headers && headers.link) {
        let link = headers.link.split(', ').map(x => x.split('; ')).filter(x => x[1] === 'rel="next"')
        if (link.length > 0) {
          link = link[0][0]
          link = link.slice(1, link.length - 1)
          const innerResponse = await this.queryUrl(link, true)
          return data.concat(await getNextPage(innerResponse.headers, innerResponse.data))
        }
      }
      return data
    }

    return getNextPage(response.headers, response.data)
  }

  timeOutApiCalls() {
    if (this.isTimedOut) return

    this.isTimedOut = true
    this.apiTimeout = window.setTimeout(() => {
      window.clearTimeout(this.apiTimeout)
      this.isTimedOut = false
    }, GitHubAPI.timeoutPeriod)
  }

  handleError(error) {
    switch (error.response.status) {
      case 401:
        this.alertIfErrorResponseMessage(error, 'Bad credentials', oneLine`
          It appears the API token you entered for the ProjectHub Chrome extension is
          not valid 😕. Please go to ProjectHub’s options to learn how to set up a new
          API key. You can access the options page by clicking the gear to the right
          or going to your Chrome extensions page (chrome://extensions/).
        `)
        break

      case 403:
        this.alertIfErrorResponseMessage(error, 'API rate limit exceeded', oneLine`
          The ProjectHub Chrome extension has reached the limit of unauthenticated API
          calls it can make 😕. Please go to ProjectHub’s options to learn how to set
          up an API key for unlimited access (it’s easy!). Click the gear to the right
          or go to your Chrome extensions page (chrome://extensions/) to access
          ProjectHub’s options.
        `)
        break

      default:
        GitHubAPI.logError(error)
    }
  }

  alertIfErrorResponseMessage(error, key, msg) {
    if (error.response.data.message.includes(key) && !this.isTimedOut) {
      alert(msg)
      this.timeOutApiCalls()
    } else {
      GitHubAPI.logError(error)
    }
  }
}

export default new GitHubAPI()
