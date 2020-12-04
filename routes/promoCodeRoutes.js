const router = require('express').Router();
const {
  getPromoCodes,
  getPromoCode,
  addPromoCode,
  updatePromoCode,
  removePromoCode,
} = require('../controllers/promoCodeController');

//Invoked middleware.
const advanceResults = require('../middleware/advancedResults');
const { protect } = require('../config/protect');
const { authorize } = require('../config/authorization');

//Product model
const PromoCode = require('../models/promoCodeModel');

router.use(protect);

router
  .route('/')
  .get(advanceResults(PromoCode), getPromoCodes)
  .post(authorize('admin'), addPromoCode);

router
  .route('/:promoCodeId')
  .get(getPromoCode)
  .put(authorize('admin'), updatePromoCode)
  .delete(authorize('admin'), removePromoCode);

module.exports = router;
