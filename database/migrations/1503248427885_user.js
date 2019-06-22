'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('name')
      table.string('img')
      table.string('country')
      table.string('state')
      table.date('birthday')
      table.string('phone')
      table.boolean('isaActive').defaultTo(1)
      table.integer('userType')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
