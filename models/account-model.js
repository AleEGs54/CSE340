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
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
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
  account_email
) {
  try {
    const result = await pool.query(
      `
      UPDATE account 
      SET account_firstname = $1,
           account_lastname = $2,
           account_email = $3
      WHERE account_id = $4 
      RETURNING *`,
      [account_firstname, account_lastname, account_email, account_id]
    );
    console.log(result.rows[0])
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
    console.log(result.rows[0])
    return result;
  } catch (error) {
    return new Error("An error ocurred during the update. Try again later.");
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
  updatePassword
};
