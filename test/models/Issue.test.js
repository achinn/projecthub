import { oneLine } from 'common-tags'

import { Issue } from 'src/models'
import { stringToDOM } from 'src/utils'

describe('Issue', () => {
  describe('.fromIssueElement()', () => {
    it('creates a new Issue from an issue element', () => {
      const issueElement = stringToDOM(oneLine`
        <article 
          class="issue-card project-card position-relative rounded-2 box-shadow bg-white my-2 mx-0 border ws-normal js-project-column-card js-socket-channel js-updatable-content draggable js-keyboard-movable"
          data-card-repo="[&quot;org/repo&quot;]" 
          data-card-title="[&quot;title&quot;,&quot;1234&quot;,&quot;#1234&quot;]"
          data-card-type="[&quot;issue&quot;]">
        </article>
      `)

      const issue = Issue.fromIssueElement(issueElement)

      expect(issue.repo).toBe('org/repo')
      expect(issue.issueId).toBe(1234)
      expect(issue.titleTokens).toStrictEqual(['title', '1234', '#1234'])
      expect(issue.id).toBe('org/repo-1234')
      expect(issue.val).toBe('org/repo 1234')
    })

    it('returns null from a note element', () => {
      const issueElement = stringToDOM(oneLine`
        <article 
          class="issue-card project-card position-relative rounded-2 box-shadow bg-white my-2 mx-0 border ws-normal js-project-column-card js-socket-channel js-updatable-content draggable js-keyboard-movable"
          data-card-type="[&quot;note&quot;]"
        </article>
      `)

      const issue = Issue.fromIssueElement(issueElement)

      expect(issue).toBe(null)
    })
  })
})
