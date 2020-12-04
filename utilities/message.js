/**
 * Global message Object
 * Read-only properties are not super common,
 * but they can be created using Object.defineProperty() or Object.freeze()
 */
module.exports = Object.freeze({
  // Common Message
  THIS_IN_VALID_MONGODB_ID: 'This is not valid mongodb id',
  RequestBodyIsEmpty: 'Request body is empty!',
  DATAFETCH: 'Data fetching successful!',
  CREATESUCCESSFUL: 'Create successful!',
  PARTICULARDATAFATCH: 'Particular data fatch successful!',
  UPDATE_PARTICULAR_DOCUMENT: 'Particular document update successful!',
  DELETE_PARTICULAR_DOCUMENT: 'Particular document delete successful!',
});
