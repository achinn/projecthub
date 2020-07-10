import BaseModel from './BaseModel'

export default class Column extends BaseModel {
  static CACHE_KEY = 'column'

  static fromColumnElement = (column) => {
    const id = column.dataset.id
    return new Column({ id })
  }

  constructor({ id }) {
    super()

    this.id = id
  }
}
