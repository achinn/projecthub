import GitHubAPI from 'src/lib/GitHubAPI'
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
    const columnId = issue.dataset.columnId
    return new Issue({
      repo,
      issueId,
      titleTokens: titleData,
      columnId,
    })
  }

  constructor({
    repo, issueId, titleTokens, columnId,
  }) {
    super()

    this.repo = repo
    this.issueId   = issueId
    this.titleTokens = titleTokens
    this.columnId = columnId
    this.id = `${repo}-${issueId}`
    this.val = `${repo} ${issueId}`
  }

  async numberOfDaysInColumn() {
    const MOVED_IN_EVENT_TYPES = [
      'moved_columns_in_project',
      'converted_note_to_issue',
      'added_to_project',
    ]
    const timeline = await GitHubAPI.getTimeline(this.repo, this.issueId)
    const latestMoveDate = timeline
      .filter(ev => MOVED_IN_EVENT_TYPES.includes(ev.event))
      .map(ev => new Date(ev.created_at))
      .reduce((latestDate, date) => (date > latestDate ? date : latestDate))
    const now = new Date()
    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24
    const daysDiff = Math.ceil(Math.abs(now.getTime() - latestMoveDate.getTime()) /
      MILLISECONDS_PER_DAY)
    return daysDiff
  }
}
