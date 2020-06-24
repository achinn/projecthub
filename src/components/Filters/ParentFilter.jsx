import React        from 'react'
import PropTypes    from 'prop-types'

import { Issue }    from 'src/models'

import SelectButton from 'components/SelectButton'
import BaseFilter   from 'components/Filters/BaseFilter'

import {
  colorRed, colorOrange, colorYellow, colorWhite, colorBlack,
} from 'src/utils'

import GitHubAPI from 'src/lib/GitHubAPI'

export default class ParentFilter extends BaseFilter {
  static CACHE_KEY = 'issue-filter'

  static ALL_ISSUES = { id: '@all',       val: 'All'       }

  static propTypes = {
    ...BaseFilter.propTypes,

    issues:   PropTypes.arrayOf(PropTypes.instanceOf(Issue)),
    onChange: PropTypes.func.isRequired,
  }

  static defaultState = {
    selectedIssue: ParentFilter.ALL_ISSUES,
  }

  onChange = (issue) => {
    this.setState({
      selectedIssue: issue,
    }, this.props.onChange)
  }

  async shouldDisplayCard(card) {
    const issue = Issue.fromIssueElement(card)

    if (!issue) {
      return false
    }

    if (this.state.selectedIssue.id === ParentFilter.ALL_ISSUES.id) {
      colorWhite(card)
      return true
    }

    const show = issue.id === this.state.selectedIssue.id ||
      issue.titleTokens.some(token => token.includes(this.state.selectedIssue.issueId))

    if (show) {
      const timeline = await GitHubAPI.getTimeline(issue.repo, issue.issueId)
      const latestMoveDate = timeline
        .filter(ev => ev.event === 'moved_columns_in_project')
        .map(ev => new Date(ev.created_at))
        .reduce((latestDate, date) => (date > latestDate ? date : latestDate))
      const now = new Date()
      const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24
      const daysDiff = Math.ceil(Math.abs(now.getTime() - latestMoveDate.getTime()) /
        MILLISECONDS_PER_DAY)

      if (daysDiff > 7) {
        colorBlack(card)
      } else if (daysDiff > 4) {
        colorRed(card)
      } else if (daysDiff > 2) {
        colorOrange(card)
      } else if (daysDiff > 1) {
        colorYellow(card)
      }
    }

    return show
  }

  render() {
    const issueOptions = [
      ParentFilter.ALL_ISSUES,
      ...this.props.issues,
    ]

    return (
      <SelectButton
        className="mr-2"
        type="Issue"
        options={issueOptions}
        onChange={this.onChange}
        initialSelection={this.state.selectedIssue}
      />
    )
  }
}
