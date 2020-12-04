const router = require('express').Router();
const { authorize } = require('../config/authorization');
const { protect } = require('../config/protect');
const {
  addPromoCodeUsesByUser,
  getPromoCodeUsesByUser,
  updatePromoCodeUsesByUser,
} = require('../controllers/promoCodeUsesByUserController');

router.use(protect);

router.route('/').post(authorize('user', 'admin'), addPromoCodeUsesByUser);
router
  .route('/:promoCodeUsesId')
  .get(getPromoCodeUsesByUser)
  .put(updatePromoCodeUsesByUser);

module.exports = router;
