import { Request, Response } from 'express';
import { attendanceService } from './attendance.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AttendanceController {
  async clockIn(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.employeeId) {
        sendError(res, 'Employee profile not found', 400);
        return;
      }
      const attendance = await attendanceService.clockIn(req.user.employeeId);
      sendSuccess(res, attendance, 'Clocked in successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async clockOut(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.employeeId) {
        sendError(res, 'Employee profile not found', 400);
        return;
      }
      const attendance = await attendanceService.clockOut(req.user.employeeId);
      sendSuccess(res, attendance, 'Clocked out successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getTodayStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.employeeId) {
        sendError(res, 'Employee profile not found', 400);
        return;
      }
      const status = await attendanceService.getTodayStatus(req.user.employeeId);
      sendSuccess(res, status, 'Today status retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const employeeId = (req.params.employeeId as string) || req.user?.employeeId;
      if (!employeeId) {
        sendError(res, 'Employee ID required', 400);
        return;
      }
      const month = req.query.month as string | undefined;
      const year = req.query.year as string | undefined;
      const history = await attendanceService.getHistory(
        employeeId,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined,
      );
      sendSuccess(res, history, 'Attendance history retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getMonthlySummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const employeeId = (req.params.employeeId as string) || req.user?.employeeId;
      if (!employeeId) {
        sendError(res, 'Employee ID required', 400);
        return;
      }
      const month = req.query.month as string | undefined;
      const year = req.query.year as string | undefined;
      const summary = await attendanceService.getMonthlySummary(
        employeeId,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined,
      );
      sendSuccess(res, summary, 'Monthly summary retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getAllTodayAttendance(_req: Request, res: Response): Promise<void> {
    try {
      const attendance = await attendanceService.getAllTodayAttendance();
      sendSuccess(res, attendance, 'Today attendance retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const attendanceController = new AttendanceController();
