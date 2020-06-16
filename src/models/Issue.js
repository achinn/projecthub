import BaseModel from './BaseModel'

export default class Issue extends BaseModel {
  static CACHE_KEY = 'issue'

  static fromIssueElement = (issue) => {
    const type = JSON.parse(issue.dataset.cardType)[0]

    if (type !== 'issue') {
      return null
    }

    const repo = JSON.parse(issue.dataset.cardRepo)[0]
    const titleData = JSON.parse(issue.dataset.cardTitle)
    const issueId = Number(titleData[titleData.length - 2])
    return new Issue({
      repo,
      issueId,
      titleTokens: titleData,
    })
  }

  constructor({ repo, issueId, titleTokens }) {
    super()

    this.repo = repo
    this.issueId   = issueId
    this.titleTokens = titleTokens
    this.id = `${repo}-${issueId}`
    this.val = `${repo} ${issueId}`
  }
}
