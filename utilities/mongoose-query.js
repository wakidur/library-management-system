/**
 * find
 * @param {*}
 */

function find(model, option) {
  return new Promise((resolve, reject) => {
    model
      .find(option)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * findOne
 * @param {*} model
 * @param {*} option
 */

function findOne(model, option) {
  return new Promise((resolve, reject) => {
    model
      .findOne(option)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * find, populate
 * @param {*} model
 * @param {*} option
 * @param {*} popOptions
 */

function findWithPopulate(model, option, popOptions) {
  return new Promise((resolve, reject) => {
    model
      .find(option)
      .populate(popOptions)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
/**
 * Count Documents
 * return count number
 * @param {*} model
 */

function countDocuments(model) {
  return new Promise((resolve, reject) => {
    model
      .countDocuments()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Find by id and Populate
 *
 * @param {*} model
 * @param {*} id
 * @param {*} popOptions
 */

function findByIdAndPopulate(model, id, popOptions) {
  // support for Find by id and popOptions
  return new Promise((resolve, reject) => {
    model
      .findById(id)
      .populate(popOptions)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Find by ID
 * @param {*} model
 * @param {*} id
 */
function findById(model, id) {
  // Support for Find by Id
  return new Promise((resolve, reject) => {
    model
      .findById(id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Create model
 * @param {*} model
 * @param {*} bodyObj
 */

function create(model, bodyObj) {
  return new Promise((resolve, reject) => {
    model
      .create(bodyObj)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Dynamic find One And Delete operation
 * @param {*} model
 * @param {*} id
 */
function remove(model, id) {
  return new Promise((resolve, reject) => {
    model
      .remove({
        _id: id,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Dynamic find One And Delete operation
 * @param {*} model
 * @param {*} id
 */
function findByIdAndDelete(model, _id) {
  return new Promise((resolve, reject) => {
    model
      .findByIdAndDelete(_id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Find by id and update
 * @param {*} model
 * @param {*} id
 * @param {*} bodyObj
 * @param {*} option
 */

function findByIdAndUpdate(model, id, bodyObj, option) {
  return new Promise((resolve, reject) => {
    model
      .findByIdAndUpdate(id, bodyObj, option)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * To build up common query support for mongoose
 * Method Name
 * find, countDocuments, findById, create, remove, findByIdAndUpdate
 */

module.exports = {
  find,
  findOne,
  countDocuments,
  findWithPopulate,
  findByIdAndPopulate,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
  create,
  remove,
};
