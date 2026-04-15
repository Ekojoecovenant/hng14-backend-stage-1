import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';

const router = Router();

router.post('/', profileController.createProfile);
router.get('/', profileController.getAllProfiles);
router.get('/:id', profileController.getProfile);
router.delete('/:id', profileController.deleteProfile);

export default router;
