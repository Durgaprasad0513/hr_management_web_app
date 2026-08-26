import { Request, Response } from 'express';
import { departmentService } from './department.service';
import { sendSuccess, sendError } from '../../utils/response';

export class DepartmentController {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const departments = await departmentService.getAll();
      sendSuccess(res, departments, 'Departments retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.getById(req.params.id as string);
      sendSuccess(res, department, 'Department retrieved');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.create(req.body);
      sendSuccess(res, department, 'Department created successfully', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const department = await departmentService.update(req.params.id as string, req.body);
      sendSuccess(res, department, 'Department updated successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await departmentService.delete(req.params.id as string);
      sendSuccess(res, null, 'Department deleted successfully');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const departmentController = new DepartmentController();
