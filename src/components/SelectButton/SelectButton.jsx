import React     from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button'
import Icon   from 'components/Icon'

import Option            from './Option'
import SelectedOptionVal from './SelectedOptionVal'


export default class SelectButton extends React.Component {
  static defaultProps = {
    className: '',
    type:      '',
  }

  static propTypes = {
    className:        PropTypes.string,
    type:             PropTypes.string,
    options:          PropTypes.arrayOf(PropTypes.shape(Option.propTypes.option)).isRequired,
    onChange:         PropTypes.func.isRequired,
    initialSelection: PropTypes.shape(Option.propTypes.option).isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isDropDownOpen: false,
      selection:      this.props.initialSelection,
    }
  }

  componentDidUpdate() {
    if (this.state.isDropDownOpen) {
      document.addEventListener('click', this.onDocumentClick, { once: true })
    }
  }

  onButtonClick = (event) => {
    if (event.altKey && !this.state.isDropDownOpen) {
      const nextOption = this.nextOption()

      this.setState({ selection: nextOption })
      this.props.onChange(nextOption)
    } else {
      this.setState(prevState => ({ isDropDownOpen: !prevState.isDropDownOpen }))
    }
  }

  onCloseClick = () => this.setState({ isDropDownOpen: false })

  onDocumentClick = (event) => {
    const isOutsideClick = !this.ref.contains(event.target)
    if (isOutsideClick) this.onCloseClick()
  }

  onOptionClick = (option) => {
    this.setState({
      isDropDownOpen: false,
      selection:      option,
    })

    this.props.onChange(option)
  }

  saveRef = (ref) => { this.ref = ref }

  nextOption() {
    const curIndex = this.props.options.findIndex(option => option.id === this.state.selection.id)
    let nextIndex  = curIndex + 1
    if (nextIndex >= this.props.options.length) nextIndex = 0

    return this.props.options[nextIndex]
  }

  render() {
    return (
      <div
        className={`select-menu select-menu-modal-right ${this.state.isDropDownOpen && 'active'} d-inline-block ${this.props.className}`}
        ref={this.saveRef}
      >

        <Button
          isActive={this.state.isDropDownOpen}
          aria-expanded={this.state.isDropDownOpen}
          aria-haspopup
          className="select-menu-button css-truncate"
          onClick={this.onButtonClick}
          type="button"
        >
          {this.props.type && (
            <>
              <Icon
                icon={this.props.type.toLowerCase()}
                ariaLabel={this.props.type}
                className="octicon-mute v-align-text-bottom"
                width="14"
              />
              &nbsp;
            </>
          )}
          <SelectedOptionVal option={this.state.selection} />
          {' '}
        </Button>

        <div className="select-menu-modal-holder" aria-expanded={this.state.isDropDownOpen}>
          <div className="select-menu-modal">
            <div className="select-menu-header text-left">
              <button type="button" onClick={this.onCloseClick} className="close-button">
                <Icon icon="x" ariaLabel="Close" width="12" />
              </button>
              <span className="select-menu-title">
                Select {this.props.type.toLowerCase() || 'option'}:
              </span>
            </div>

            <ol className="select-menu-list" role="listbox">
              {this.props.options.map(option => (
                <Option
                  key={option.id}
                  onClick={this.onOptionClick}
                  isSelected={option.id === this.state.selection.id}
                  option={option}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    )
  }
}
