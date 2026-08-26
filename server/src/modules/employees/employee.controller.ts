import { Request, Response } from 'express';
import { employeeService } from './employee.service';
import { sendSuccess, sendError } from '../../utils/response';

export class EmployeeController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, search, departmentId, status } = req.query;
      const result = await employeeService.getAll({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
        departmentId: departmentId as string,
        status: status as string,
      });
      sendSuccess(res, result.employees, 'Employees retrieved', 200, result.meta);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const employee = await employeeService.getById(req.params.id as string);
      sendSuccess(res, employee, 'Employee retrieved');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const employee = await employeeService.create(req.body);
      sendSuccess(res, employee, 'Employee created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const employee = await employeeService.update(req.params.id as string, req.body);
      sendSuccess(res, employee, 'Employee updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await employeeService.delete(req.params.id as string);
      sendSuccess(res, null, 'Employee deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getDashboardStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await employeeService.getDashboardStats();
      sendSuccess(res, stats, 'Dashboard stats retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const employeeController = new EmployeeController();
