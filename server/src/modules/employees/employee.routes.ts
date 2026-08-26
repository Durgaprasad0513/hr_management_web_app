import { Router } from 'express';
import { employeeController } from './employee.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.schema';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/dashboard-stats', (req, res) => employeeController.getDashboardStats(req, res));
router.get('/', (req, res) => employeeController.getAll(req, res));
router.get('/:id', (req, res) => employeeController.getById(req, res));

// Create/Update/Delete restricted to ADMIN and HR
router.post('/', authorize('ADMIN', 'HR'), validate(createEmployeeSchema), (req, res) => employeeController.create(req, res));
router.put('/:id', authorize('ADMIN', 'HR'), validate(updateEmployeeSchema), (req, res) => employeeController.update(req, res));
router.delete('/:id', authorize('ADMIN', 'HR'), (req, res) => employeeController.delete(req, res));

export default router;
