import React        from 'react'
import PropTypes    from 'prop-types'

import { Issue }    from 'src/models'

import ProjectBoard from 'src/lib/ProjectBoard'

import BaseFilter   from 'components/Filters/BaseFilter'

import {
  colorRed, colorOrange, colorYellow, colorWhite, colorBlack,
} from 'src/utils'

export default class ParentFilter extends BaseFilter {
  static CACHE_KEY = 'issue-filter'

  static ALL_ISSUES = { id: '@all',       val: 'All'       }

  static propTypes = {
    ...BaseFilter.propTypes,

    onChange: PropTypes.func.isRequired,
  }

  static defaultState = {
    selectedIssue: ParentFilter.ALL_ISSUES,
    visibleIssueIds: [],
  }

  constructor(props) {
    super(props)

    ProjectBoard.afterLoaded.then(() => {
      ProjectBoard.cards.forEach((card) => {
        card.addEventListener('dblclick', (ev) => {
          const doubleClickedIssue = Issue.fromIssueElement(card)
          if (doubleClickedIssue.id === this.state.selectedIssue.id) {
            this.setState({
              selectedIssue: ParentFilter.ALL_ISSUES,
            }, this.props.onChange)
          } else {
            this.setState({
              selectedIssue: doubleClickedIssue,
            }, this.props.onChange)
          }
          ev.stopPropagation()
        })
      })
    })
  }

  async shouldDisplayCard(card) {
    const issue = Issue.fromIssueElement(card)

    if (!issue) {
      return false
    }

    if (this.state.selectedIssue.id === ParentFilter.ALL_ISSUES.id) {
      if (this.state.visibleIssueIds.includes(issue.id)) {
        colorWhite(card)
        this.setState(
          prevState => (
            { visibleIssueIds: prevState.visibleIssueIds.filter(id => id !== issue.id) }
          ),
        )
      }
      return true
    }

    const show = issue.id === this.state.selectedIssue.id ||
      issue.titleTokens.some(token => token.includes(this.state.selectedIssue.issueId))

    if (show) {
      const daysDiff = await issue.numberOfDaysInColumn()
      if (daysDiff > 7) {
        colorBlack(card)
      } else if (daysDiff > 4) {
        colorRed(card)
      } else if (daysDiff > 2) {
        colorOrange(card)
      } else if (daysDiff > 1) {
        colorYellow(card)
      }

      this.setState(prevState => ({ visibleIssueIds: [...prevState.visibleIssueIds, issue.id] }))
    }

    return show
  }

  render() {
    return (
      <>
      </>
    )
  }
}
