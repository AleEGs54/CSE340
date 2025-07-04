const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

async function getDetailsById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [invId]
    );
    return data.rows[0];
  } catch (error) {
    console.error(`getdetailsbyiderror: ${error}`);
  }
}

async function checkExistingClassificationName(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const name = await pool.query(sql, [classification_name]);
    return name.rowCount;
  } catch (error) {
    console.error(`checkExistingClassificationName error: ${error}`);
  }
}

async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO classification (classification_name) VALUES ($1) RETURNING *`;
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Add Vehicle process
 * ************************** */

async function addVehicleToInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try {
    const sql = `
    INSERT INTO inventory 
    (inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
    `;

    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Edit Vehicle process
 * ************************** */

async function updateInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  inv_id
) {
  try {
    const sql = `
    UPDATE inventory 
    SET inv_make = $1,
    inv_model = $2,
    inv_year = $3,
    inv_description = $4,
    inv_image = $5,
    inv_thumbnail = $6,
    inv_price = $7,
    inv_miles = $8,
    inv_color = $9,
    classification_id = $10
    WHERE inv_id = $11
    RETURNING *
    `;

    const data =  await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ]);

    return data.rows[0]
  } catch (error) {
    console.error('Model error: ' + error)
  }
}

/* ***************************
 *  Delete Vehicle process
 * ************************** */

async function deleteInventory(inv_id) {
  try {
    const sql = `DELETE FROM inventory WHERE inv_id = $1`;

    const data =  await pool.query(sql, [inv_id]);

    return data
  } catch (error) {
    console.error('Delete Inventory Error: ' + error)
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getDetailsById,
  checkExistingClassificationName,
  addClassification,
  addVehicleToInventory,
  updateInventory,
  deleteInventory
};
