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
  }

  constructor(props) {
    super(props)

    ProjectBoard.afterLoaded.then(() => {
      ProjectBoard.cards.forEach((card) => {
        card.addEventListener('dblclick', () => {
          const doubleClickedIssue = Issue.fromIssueElement(card)
          if (doubleClickedIssue.id === this.state.selectedIssue.id) {
            this.onChange(ParentFilter.ALL_ISSUES)
          } else {
            this.onChange(doubleClickedIssue)
          }
        })
      })
    })
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
