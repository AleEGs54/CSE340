const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build details by id view
 * ************************** */
invCont.buildDetailsById = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getDetailsById(invId);
  const view = await utilities.buildDetailsView(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/details", { 
    title: vehicleName,
    nav,
    view,
   })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.throwError = async function (req, res, next) {
  throw new Error("Intentional 500 error triggered");
}

module.exports = invCont;