import { Router } from 'express';
import { departmentController } from './department.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createDepartmentSchema, updateDepartmentSchema } from './department.schema';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => departmentController.getAll(req, res));
router.get('/:id', (req, res) => departmentController.getById(req, res));

// Create/Update/Delete restricted to ADMIN and HR
router.post('/', authorize('ADMIN', 'HR'), validate(createDepartmentSchema), (req, res) => departmentController.create(req, res));
router.put('/:id', authorize('ADMIN', 'HR'), validate(updateDepartmentSchema), (req, res) => departmentController.update(req, res));
router.delete('/:id', authorize('ADMIN'), (req, res) => departmentController.delete(req, res));

export default router;
