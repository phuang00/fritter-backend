/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllSearches(fields) {
    fetch('/api/searches')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function viewSearchesByUser(fields) {
    fetch(`/api/searches?author=${fields.user}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createSearch(fields) {
    fetch('/api/searches', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function editSearch(fields) {
    fetch(`/api/searches/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteSearch(fields) {
    fetch(`/api/searches/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }

  function deleteSearchesByUser(fields) {
    fetch(`/api/searches/user/${fields.user}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  