#!/usr/bin/env coffee

fs       = require 'fs'
path     = require 'path'
_        = require 'lodash'
jsonfile = require 'jsonfile'

OPERATION_PATH = 'assets/json/operations'

class Injector
  filenames: =>
    fs.readdirSync OPERATION_PATH

  inject: =>
    _.each @filenames(), (filename) =>
      filepath = path.join(OPERATION_PATH, filename)
      operation = jsonfile.readFileSync filepath
      operation.nanocyte = name: "nanocyte-node-#{operation.class}"
      jsonfile.writeFileSync filepath, operation, spaces: 2

injector = new Injector
injector.inject()
