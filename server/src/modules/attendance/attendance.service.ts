import prisma from '../../config/database';
import { AuthRequest } from '../../middleware/auth.middleware';

export class AttendanceService {
  async clockIn(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already clocked in today
    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (existing && existing.clockIn) {
      throw new Error('Already clocked in today');
    }

    return prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
      create: {
        employeeId,
        date: today,
        clockIn: new Date(),
        status: 'PRESENT',
      },
      update: {
        clockIn: new Date(),
        status: 'PRESENT',
      },
    });
  }

  async clockOut(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (!attendance || !attendance.clockIn) {
      throw new Error('You must clock in before clocking out');
    }

    if (attendance.clockOut) {
      throw new Error('Already clocked out today');
    }

    const clockOut = new Date();
    const workHours = (clockOut.getTime() - attendance.clockIn.getTime()) / (1000 * 60 * 60);

    return prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut,
        workHours: Math.round(workHours * 100) / 100,
        status: workHours < 4 ? 'HALF_DAY' : 'PRESENT',
      },
    });
  }

  async getTodayStatus(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });
  }

  async getHistory(employeeId: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0);

    return prisma.attendance.findMany({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getMonthlySummary(employeeId: string, month?: number, year?: number) {
    const records = await this.getHistory(employeeId, month, year);

    const summary = {
      totalDays: records.length,
      present: records.filter(r => r.status === 'PRESENT').length,
      absent: records.filter(r => r.status === 'ABSENT').length,
      halfDay: records.filter(r => r.status === 'HALF_DAY').length,
      onLeave: records.filter(r => r.status === 'ON_LEAVE').length,
      totalWorkHours: records.reduce((sum, r) => sum + (r.workHours || 0), 0),
      averageWorkHours: 0,
    };

    const workedDays = summary.present + summary.halfDay;
    summary.averageWorkHours = workedDays > 0
      ? Math.round((summary.totalWorkHours / workedDays) * 100) / 100
      : 0;

    return { records, summary };
  }

  async getAllTodayAttendance() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.attendance.findMany({
      where: { date: today },
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            designation: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { clockIn: 'desc' },
    });
  }
}

export const attendanceService = new AttendanceService();
