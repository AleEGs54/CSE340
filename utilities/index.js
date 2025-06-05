const invModel = require("../models/inventory-model");
const Util = {};
const jwt = require('jsonwebtoken')
require('dotenv').config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();

  let list = '<ul class="navigation-list">';
  list +=
    '<li class="navigation-list-link"><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li class="navigation-list-link">';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li class="inv-item">';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildDetailsView = async function (data) {
  let display;
  if (data) {
    display = `
    <div class="details-wrap">    
      <img class='details-picture' src="${data.inv_image}" alt="${
      data.inv_model
    }'s picture">
      <div class="details">
      <h2 class='details-subtitle'>${data.inv_make} ${
      data.inv_model
    } Details</h2>
        <div class="details-info">
          <p class='car-price'><span class='highlight'>Price: </span>$${new Intl.NumberFormat(
            "en-US"
          ).format(data.inv_price)}</p>
          <p><span class='highlight'>Description: </span>${
            data.inv_description
          }</p>
          <p><span class='highlight'>Color: </span>${data.inv_color}</p>
          <p><span class='highlight'>Miles: </span>${new Intl.NumberFormat(
            "en-US"
          ).format(data.inv_miles)}</p>
        </div>
      </div>
    </div>

    `;
    return display;
  } else {
    display +=
      '<p class="notice">Sorry, no information available about this vehicle.</p>';
  }
};

//Build the select, part of the form
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = `
<select id='classificationList' name="classification_id" required>
  <option value="" disabled ${classification_id?? 'selected'}>Choose a Classification</option>
  ${data.rows.map((row) => {
   return `<option value="${row.classification_id}"
      ${classification_id != null &&
        row.classification_id == classification_id?
        "selected" : ""
      }>${row.classification_name}</option>`
  }).join('')
}
</select>`

  return classificationList
};


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData){
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        console.log(res.locals)
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash('notice', 'Please log in')
    return res.redirect('/account/login')
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
