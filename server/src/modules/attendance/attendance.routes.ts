import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Employee self-service
router.post('/clock-in', (req, res) => attendanceController.clockIn(req, res));
router.post('/clock-out', (req, res) => attendanceController.clockOut(req, res));
router.get('/today', (req, res) => attendanceController.getTodayStatus(req, res));
router.get('/history', (req, res) => attendanceController.getHistory(req, res));
router.get('/summary', (req, res) => attendanceController.getMonthlySummary(req, res));

// Admin/HR/Manager — view employee attendance
router.get('/today/all', authorize('ADMIN', 'HR', 'MANAGER'), (req, res) => attendanceController.getAllTodayAttendance(req, res));
router.get('/history/:employeeId', authorize('ADMIN', 'HR', 'MANAGER'), (req, res) => attendanceController.getHistory(req, res));
router.get('/summary/:employeeId', authorize('ADMIN', 'HR', 'MANAGER'), (req, res) => attendanceController.getMonthlySummary(req, res));

export default router;
