import React        from 'react'
import PropTypes    from 'prop-types'

import { Column, Issue }    from 'src/models'

import ProjectBoard from 'src/lib/ProjectBoard'

import BaseFilter   from 'components/Filters/BaseFilter'

import {
  colorRed, colorOrange, colorYellow, colorWhite, colorBlack,
} from 'src/utils'

export default class ColumnFilter extends BaseFilter {
  static CACHE_KEY = 'column-filter'

  static ALL = { id: '@all',       val: 'All'       }

  static propTypes = {
    ...BaseFilter.propTypes,

    onChange: PropTypes.func.isRequired,
  }

  static defaultState = {
    selectedColumn: ColumnFilter.ALL,
    visibleIssueIds: [],
  }

  constructor(props) {
    super(props)

    ProjectBoard.afterLoaded.then(() => {
      ProjectBoard.columns.forEach((column) => {
        column.addEventListener('dblclick', () => {
          const doubleClickedColumn = Column.fromColumnElement(column)
          if (doubleClickedColumn.id === this.state.selectedColumn.id) {
            this.setState({
              selectedColumn: ColumnFilter.ALL,
            }, this.props.onChange)
          } else {
            this.setState({
              selectedColumn: doubleClickedColumn,
            }, this.props.onChange)
          }
        })
      })
    })
  }

  shouldDisplayColumn(column) {
    if (this.state.selectedColumn.id === ColumnFilter.ALL.id ||
        this.state.selectedColumn.id === Column.fromColumnElement(column).id) {
      return true
    }
    return false
  }

  async shouldDisplayCard(card) {
    const issue = Issue.fromIssueElement(card)

    if (!issue ||
      (this.state.selectedColumn.id !== ColumnFilter.ALL.id &&
        issue.columnId !== this.state.selectedColumn.id)) {
      return false
    }

    if (this.state.selectedColumn.id === ColumnFilter.ALL.id) {
      if (this.state.visibleIssueIds.includes(issue.id)) {
        colorWhite(card)
        this.setState(
          prevState => (
            { visibleIssueIds: prevState.visibleIssueIds.filter(id => id !== issue.id) }
          ),
        )
      }
    } else {
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

    return true
  }

  render() {
    return (
      <>
      </>
    )
  }
}
