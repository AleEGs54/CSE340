'use strict';

// Get a list of accounts based on the account_type
let typeList = document.querySelector("#typeList")
typeList.addEventListener('change', () => {
    let account_type = typeList.value
 
    //Get accounts based on account_type
    let typeURL = '/account/administration/getTypes/' + account_type;
    fetch(typeURL)
    .then(response => {
        if (response.ok){
            return response.json();
        }
        throw Error("Network response was not OK")
    })
    .then(data => {
        buildAccountsList(data)
    })
    .catch(error => {
        console.error(`There was a problem: ${error.message}`)
    })
})

// Build accounts into HTML table components and inject into DOM 
function buildAccountsList(data) {
    let accountDisplay = document.getElementById('inventoryDisplay')
    //Set up the table labels
    let dataTable = `
    <thead>
        <tr>
            <th>Account Owner</th><td>Type</td><td>&nbsp;</td><td>&nbsp;</td>
        </tr>
    </thead>
<tbody>
    ${data.map(account => {
        return `
            <tr'>
                <td>${account.account_firstname} ${account.account_lastname}</td>
                <td>${account.account_type}</td>
                <td><a href="/account/administration/edit/${account.account_id}" title='Click to update'>Modify</a></td>
                <td><a href="/account/administration/delete/${account.account_id}" title='Click to delete'>Delete</a></td>
            </tr>
        `
    }).join('')}
</tbody>
        `

        accountDisplay.innerHTML = dataTable
}