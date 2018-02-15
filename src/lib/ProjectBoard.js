import { isEmpty, uniqBy, sortBy } from 'lodash'

import { Session } from 'src/lib'
import { Label, User } from 'src/models'
import { Memoized, show, hide } from 'src/utils'


const ProjectBoard = {
  CACHE_KEY: 'board-state',

  defaultState: {
    hideNewColumnButton: false,
  },

  @Memoized
  get isEditable() {
    return !!document.querySelector('.project-header-link[aria-label="Add cards"]')
  },

  @Memoized
  get container() {
    return document.querySelector('.project-columns-container')
  },

  @Memoized
  get afterLoaded() {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const finishedLoading = this.container.querySelector('include-fragment') === null

        if (finishedLoading) {
          resolve()
          observer.disconnect()
        }
      })

      observer.observe(this.container, { childList: true, subtree: true })
    })
  },

  @Memoized
  get newColumnButton() {
    return this.container.querySelector('.js-new-project-column-container .js-new-column-button')
  },

  get cards() {
    return Array.from(this.container.querySelectorAll('.issue-card'))
  },

  get columns() {
    return Array.from(this.container.querySelectorAll('.project-column'))
  },

  get assignees() {
    const avatars = Array.from(this.container.querySelectorAll('.avatar img'))
    if (isEmpty(avatars)) return []

    let users = avatars.map(avatar => User.fromAvatarElement(avatar))
    users = uniqBy(users, user => user.id)
    users = sortBy(users, [user => user.name.toLowerCase()])

    return users
  },

  get labels() {
    let labels = Array.from(this.container.querySelectorAll('.issue-card-label'))
    if (isEmpty(labels)) return []

    labels = labels.map(label => Label.fromLabelElement(label))
    labels = uniqBy(labels, label => label.id)
    labels = sortBy(labels, [label => label.val.toLowerCase()])

    return labels
  },

  get shouldNewColumnButtonBeHidden() {
    return Session.get(this.CACHE_KEY, this.defaultState).hideNewColumnButton
  },

  async init() {
    await this.afterLoaded

    this.renderNewColumnButton()
  },

  toggleNewColumnButton() {
    if (!this.newColumnButton) return

    Session.set(this.CACHE_KEY, prev => ({
      ...prev,
      hideNewColumnButton: !(prev && prev.hideNewColumnButton),
    }))

    this.renderNewColumnButton()
  },

  renderNewColumnButton() {
    if (!this.newColumnButton) return

    this.shouldNewColumnButtonBeHidden ? hide(this.newColumnButton) : show(this.newColumnButton)
  },
}

export default ProjectBoard
