/**
 * Global message Object
 * Read-only properties are not super common,
 * but they can be created using Object.defineProperty() or Object.freeze()
 */
module.exports = Object.freeze({
  // Common Message
  THIS_IN_VALID_MONGODB_ID: 'This is not valid mongodb _id',
  REQUEST_BODY_IS_EMPTY: 'Request body is empty!',
  DATA_FETCH: 'Data fetching successful!',
  CREATE_SUCCESSFUL: 'Create successful!',
  PARTICULAR_DATA_FATCH: 'Particular data fatch successful!',
  UPDATE_PARTICULAR_DOCUMENT: 'Particular document update successful!',
  DELETE_PARTICULAR_DOCUMENT: 'Particular document delete successful!',
});
