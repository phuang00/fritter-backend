/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllPresets(fields) {
  fetch('/api/presets')
    .then(showResponse)
    .catch(showResponse);
}

function viewPresetsByOwner(fields) {
  fetch(`/api/presets?owner=${fields.owner}`)
    .then(showResponse)
    .catch(showResponse);
}

function createPreset(fields) {
  fetch('/api/presets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editPreset(fields) {
  fetch(`/api/presets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deletePreset(fields) {
  fetch(`/api/presets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
