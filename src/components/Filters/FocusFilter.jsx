import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import App from 'src/lib/App'

import BaseFilter from 'components/Filters/BaseFilter'
import Button from 'components/Button'


export default class FocusFilter extends BaseFilter {
  static CACHE_KEY = 'focus-filter'

  static propTypes = {
    ...BaseFilter.propTypes,

    onChange:    PropTypes.func.isRequired,
  }

  static defaultState = {
    isToggled: false,
  }

  // TODO: Make this dynamic/editable
  static HIDE_COLUMNS = [
    '8190805', // MLS Countdown
    '4312722', // Icebox
    // '3242375', // Backlog
  ]

  onClick = () => {
    this.setState(prevState => ({
      isToggled: !prevState.isToggled,
    }), this.props.onChange)
  }

  shouldDisplayCard(card) {
    if (!this.state.isToggled) return true

    const assignees = JSON.parse(card.dataset.cardAssignee || '[]')
    return isEmpty(assignees) || assignees.includes(App.currentUser)
  }

  shouldDisplayColumn(column) {
    if (!this.state.isToggled) return true
    return !FocusFilter.HIDE_COLUMNS.includes(column.dataset.id)
  }

  render() {
    return (
      <Button isActive={this.state.isToggled} onClick={this.onClick} className="mr-2">
        Focus
      </Button>
    )
  }
}
