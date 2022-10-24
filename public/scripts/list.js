/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllLists(fields) {
    fetch('/api/lists')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function viewListsByOwner(fields) {
    fetch(`/api/lists?owner=${fields.owner}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createList(fields) {
    fetch('/api/lists', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function editList(fields) {
    fetch(`/api/lists/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteList(fields) {
    fetch(`/api/lists/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  