/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllHighlights(fields) {
    fetch('/api/highlights')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function viewHighlightsByAuthor(fields) {
    fetch(`/api/highlights?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createHighlight(fields) {
    fetch('/api/highlights', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function updateHighlightByFreet(fields) {
    fetch(`/api/highlights/freet/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

  function updateHighlight(fields) {
    fetch(`/api/highlights/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

  function deleteHighlightByFreet(fields) {
    fetch(`/api/highlights/freet/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteHighlight(fields) {
    fetch(`/api/highlights/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteHighlightsByUser(fields) {
    fetch(`/api/highlights/user/${fields.author}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }