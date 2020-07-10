import App from 'src/lib/App'

import {
  BaseModel,
  Label,
  User,
  Issue,
  Column,
} from 'src/models'


const Session = {
  serialize(obj) {
    return JSON.stringify(obj)
  },

  deserialize(json) {
    return JSON.parse(json, (key, val) => {
      if (!val || !val[BaseModel.SERIALIZE_KEY]) return val

      switch (val[BaseModel.SERIALIZE_KEY]) {
        case Label.CACHE_KEY:
          return new Label(val)
        case User.CACHE_KEY:
          return new User(val)
        case Issue.CACHE_KEY:
          return new Issue(val)
        case Column.CACHE_KEY:
          return new Column(val)

        default:
          throw new Error(`Don’t know how to deserialize ${val[BaseModel.SERIALIZE_KEY]}`)
      }
    })
  },

  get(key, defaultVal) {
    return this.deserialize(sessionStorage.getItem(`${App.namespace}-${key}`)) || defaultVal
  },

  set(key, val) {
    if (typeof val === 'function') {
      val = val(this.get(key)) // eslint-disable-line no-param-reassign
    }

    return sessionStorage.setItem(`${App.namespace}-${key}`, this.serialize(val))
  },
}

export default Session
