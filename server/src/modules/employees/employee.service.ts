import prisma from '../../config/database';
import { CreateEmployeeInput, UpdateEmployeeInput } from './employee.schema';
import { Prisma } from '@prisma/client';

export class EmployeeService {
  async getAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { employeeCode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.departmentId) {
      where.departmentId = query.departmentId;
    }

    if (query.status) {
      where.status = query.status as any;
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          department: { select: { id: true, name: true } },
          manager: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      employees,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, firstName: true, lastName: true } },
        subordinates: { select: { id: true, firstName: true, lastName: true, designation: true } },
        user: { select: { id: true, email: true, role: true } },
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }

  async create(data: CreateEmployeeInput) {
    const employee = await prisma.employee.create({
      data: {
        employeeCode: data.employeeCode,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender as any,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        joiningDate: new Date(data.joiningDate),
        designation: data.designation,
        salary: data.salary,
        departmentId: data.departmentId,
        managerId: data.managerId,
        status: data.status as any,
      },
      include: {
        department: { select: { id: true, name: true } },
      },
    });

    return employee;
  }

  async update(id: string, data: UpdateEmployeeInput) {
    const updateData: any = { ...data };

    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }
    if (data.joiningDate) {
      updateData.joiningDate = new Date(data.joiningDate);
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        department: { select: { id: true, name: true } },
      },
    });

    return employee;
  }

  async delete(id: string) {
    // Check for associated user and delete it first
    await prisma.user.deleteMany({ where: { employeeId: id } });
    await prisma.employee.delete({ where: { id } });
  }

  async getDashboardStats() {
    const [totalEmployees, activeEmployees, departments, recentJoinees] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.department.count(),
      prisma.employee.findMany({
        where: {
          joiningDate: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
        select: { id: true, firstName: true, lastName: true, joiningDate: true, designation: true },
        orderBy: { joiningDate: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      departments,
      recentJoinees,
    };
  }
}

export const employeeService = new EmployeeService();
