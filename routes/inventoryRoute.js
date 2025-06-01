// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const validation = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.buildInvManagement))
router.get('/add-classification', utilities.handleErrors(invController.buildClassificationForm))
router.get('/add-inventory', utilities.handleErrors(invController.buildInvForm))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailsById));
router.get('/errors/error', utilities.handleErrors(invController.throwError))

router.post(
    '/add-classification',
    validation.newClassificationRules(),
    validation.checkClassificationName,
    utilities.handleErrors(invController.addClassification)
 )

router.post(
    '/add-inventory',
    validation.newVehicleRules(),
    validation.checkVehicleRules,
    utilities.handleErrors(invController.addVehicleToInventory)
 )
module.exports = router;