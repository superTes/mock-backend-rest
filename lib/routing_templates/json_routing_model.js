const routing_templates = require('.')
const {get_koa_request_method} = require('../commons')

/**
 * @param {object}  jsom_model object
 * @returns {string} return string with KOA routing model
 */
function get_routing_model(jsom_model) {
  const temp_model = JSON.stringify(jsom_model)
  const top_base =
    'const Router = require("koa-router") \n' +
    'const fs = require("fs") \n' +
    'const path = require("path") \n' +
    'const {request} = require("../commons") \n' +
    `// temp_model ${temp_model} \n` +
    'const router = new Router()'

  const bottom_base = '\n module.exports = router.routes() \n'
  const {api} = jsom_model
  const routing_model = api.reduce((current_model, {method, ...rest}) => {

    const koa_method = get_koa_request_method(method)
    const koa_rout_executor = routing_templates[koa_method](rest)
    current_model += '\n' + koa_rout_executor

    return current_model
  }, '')

  const full_model =
    top_base +
    routing_model +
    bottom_base

  return full_model
}

module.exports = {
  get_routing_model
}
