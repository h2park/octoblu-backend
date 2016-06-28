_    = require 'lodash'
fs   = require 'fs'
path = require 'path'

nodes = [
  "alljoyn"
  "android"
  "apple"
  "arduino"
  "banjocanyon"
  "bb8"
  "beacon"
  "beaglebone"
  "bean"
  "blendmicro"
  "blink1"
  "blinky-tape"
  "cc3200"
  "chromecast"
  "cis"
  "citrix-receiver"
  "cloud"
  "cloudsight"
  "corsair"
  "curie"
  "device-discoverer"
  "discovery-master"
  "dynamicj5"
  "edison"
  "fadecandy"
  "firebase_forwarder"
  "galileo"
  "gateblu"
  "google-vision"
  "http-connector"
  "hue-button"
  "hue-light"
  "hue"
  "initial-state"
  "insteon"
  "intel-aim"
  "lifx-light"
  "lifx"
  "lumencache"
  "meshlium"
  "midi"
  "mindwave"
  "minidrones"
  "myo"
  "myq"
  "node-copter"
  "oculus"
  "osc"
  "polar"
  "powershell"
  "rallyfighter"
  "relayr"
  "serial"
  "shell"
  "sonos"
  "spark"
  "tentacle-serial"
  "tessel"
  "twitter-stream"
  "upc-lookup"
  "wemo"
  "xen-director"
]

class DeprecateNodes
  convertNode: (fileName) =>
    filePath = path.join(__dirname, "../assets/json/nodetypes/device/#{fileName}.json")
    node = JSON.parse fs.readFileSync filePath
    node.deprecated = true
    node.categories = ["Deprecated Devices"]
    fs.writeFileSync filePath, JSON.stringify(node, null, 2)

  run: =>
    _.each nodes, @convertNode

new DeprecateNodes().run()
