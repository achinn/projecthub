import React        from 'react'
import PropTypes    from 'prop-types'

import { Issue }    from 'src/models'

import SelectButton from 'components/SelectButton'
import BaseFilter   from 'components/Filters/BaseFilter'


export default class IssueFilter extends BaseFilter {
  static CACHE_KEY = 'issue-filter'

  static ALL_ISSUES = { id: '@all',       val: 'All'       }

  static propTypes = {
    ...BaseFilter.propTypes,

    issues:   PropTypes.arrayOf(PropTypes.instanceOf(Issue)),
    onChange: PropTypes.func.isRequired,
  }

  static defaultState = {
    selectedIssue: IssueFilter.ALL_ISSUES,
  }

  onChange = (issue) => {
    this.setState({
      selectedIssue: issue,
    }, this.props.onChange)
  }

  shouldDisplayCard(card) {
    const issue = Issue.fromIssueElement(card)

    if (!issue) {
      return false
    }

    switch (this.state.selectedIssue.id) {
      case IssueFilter.ALL_ISSUES.id:
        return true

      default:
        return issue.id === this.state.selectedIssue.id ||
          issue.titleTokens.some(token => token.includes(this.state.selectedIssue.issueId))
    }
  }

  render() {
    const issueOptions = [
      IssueFilter.ALL_ISSUES,
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
