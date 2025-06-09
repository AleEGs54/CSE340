// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validation = require("../utilities/inventory-validation");

// Route to build inventory by classification view
/* ***************************
 *  GET
 * ************************** */
router.get(
  "/",
  utilities.checkPrivileges,
  utilities.handleErrors(invController.buildInvManagement)
);
router.get(
  "/add-classification",
  utilities.checkPrivileges,
  utilities.handleErrors(invController.buildClassificationForm)
);
router.get(
  "/add-inventory",
  utilities.checkPrivileges,
  utilities.handleErrors(invController.buildInvForm)
);
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildDetailsById)
);
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get(
  "/edit/:inventory_id",
  utilities.checkPrivileges,
  utilities.handleErrors(invController.buildEditForm)
);

router.get(
  "/delete/:inventory_id",
  utilities.checkPrivileges,
  utilities.handleErrors(invController.buildDeleteForm)
);

router.get("/errors/error", utilities.handleErrors(invController.throwError));

/* ***************************
 *  POST
 * ************************** */
router.post(
  "/add-classification",
  utilities.checkPrivileges,
  validation.newClassificationRules(),
  validation.checkClassificationName,
  utilities.handleErrors(invController.addClassification)
);

router.post(
  "/add-inventory",
  utilities.checkPrivileges,
  validation.newInventoryRules(),
  validation.checkInventoryData,
  utilities.handleErrors(invController.addVehicleToInventory)
);

router.post(
  "/edit-inventory/",
  utilities.checkPrivileges,
  validation.newInventoryRules(),
  validation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.post(
  "/delete-inventory/",
  utilities.checkPrivileges,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
