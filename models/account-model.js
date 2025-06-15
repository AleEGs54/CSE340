const pool = require("../database");

/* **********************
 *   Check for any existing email that may match
 * ********************* */
async function checkExistingEmailInclusive(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for any existing email that may match the first email, 
      and excludes the second email in the search
 * ********************* */
async function checkExistingEmailExclusive(
  new_account_email,
  current_account_email
) {
  try {
    const sql =
      "SELECT * FROM account WHERE account_email = $1 AND account_email != $2";
    const email = await pool.query(sql, [
      new_account_email,
      current_account_email,
    ]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
  account_type = null
) {
  try {
    let sql
    let result 
    //If account_type exists, add it to the query, if not, be 'Client'.
    if (account_type){
      sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING *"
      result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
      account_type
    ]);
    } else {
      sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
      result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    }



    return result
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Login account
 * *************************** */

async function accountLogin(account_email, account_password) {
  try {
    const sql = `SELECT * FROM account 
        WHERE account_email = $1
        AND account_password = $2`;
    return await pool.query(sql, [account_email, account_password]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found.");
  }
}

/* *****************************
 * Return account data using account_id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching id found.");
  }
}

/* *****************************
 * Update Account Information
 * ***************************** */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
  account_type = null
) {
  try {

    let result

  if (account_type){
     result = await pool.query(
      `
      UPDATE account 
      SET account_firstname = $1,
           account_lastname = $2,
           account_email = $3,
           account_type = $4
      WHERE account_id = $5 
      RETURNING *`,
      [account_firstname, account_lastname, account_email, account_type, account_id]
    );
  
  } else {

     result = await pool.query(
      `
      UPDATE account 
      SET account_firstname = $1,
           account_lastname = $2,
           account_email = $3
      WHERE account_id = $4 
      RETURNING *`,
      [account_firstname, account_lastname, account_email, account_id]
    );
  }

  return result;

  } catch (error) {
    return new Error("An error ocurred during the update. Try again later.");
  }
  }

/* *****************************
 * Update Password
 * ***************************** */
async function updatePassword(
  hashedPassword, account_id
) {
  try {
    const result = await pool.query(
      `
      UPDATE account 
      SET account_password = $1
      WHERE account_id = $2 
      RETURNING *`,
      [hashedPassword, account_id]
    );
    return result;
  } catch (error) {
    return new Error("An error ocurred during the update. Try again later.");
  }
}

/* ***************************
 *  Delete Account process
 * ************************** */

async function deleteAccount(account_id) {
  try {
    const sql = `DELETE FROM account WHERE account_id = $1`;

    const data =  await pool.query(sql, [account_id]);

    return data
  } catch (error) {
    console.error('Delete Account Error: ' + error)
  }
}

async function getAccountsByType(account_type) {
  try {
      const sql = `
      SELECT * FROM account
      WHERE account_type = $1`
      const data = await pool.query(sql, [account_type])

      return data.rows
  } catch (error) {
    
  }
}

module.exports = {
  registerAccount,
  checkExistingEmailInclusive,
  accountLogin,
  getAccountByEmail,
  getAccountById,
  checkExistingEmailExclusive,
  updateAccount,
  updatePassword,
  getAccountsByType,
  deleteAccount
};
