export type Role = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'UNPAID' | 'MATERNITY' | 'PATERNITY';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'WEEKEND' | 'HOLIDAY';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
  id: string;
  email: string;
  role: Role;
  employeeId?: string | null;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  joiningDate: string;
  designation: string;
  salary?: number;
  status: EmployeeStatus;
  profilePhoto?: string;
  departmentId?: string;
  department?: { id: string; name: string };
  managerId?: string;
  manager?: { id: string; firstName: string; lastName: string };
  subordinates?: { id: string; firstName: string; lastName: string; designation: string }[];
  user?: { id: string; email: string; role: Role };
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  headId?: string;
  head?: { id: string; firstName: string; lastName: string; designation?: string };
  employees?: Employee[];
  _count?: { employees: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface Attendance {
  id: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  workHours?: number;
  status: AttendanceStatus;
  notes?: string;
  employeeId: string;
  employee?: Employee;
  createdAt?: string;
}

export interface Leave {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  remarks?: string;
  employeeId: string;
  employee?: Employee;
  approverId?: string;
  approver?: { firstName: string; lastName: string };
  createdAt?: string;
}

export interface LeaveBalance {
  id: string;
  year: number;
  leaveType: LeaveType;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  employeeId: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departments: number;
  recentJoinees: {
    id: string;
    firstName: string;
    lastName: string;
    joiningDate: string;
    designation: string;
  }[];
}

export interface LeaveDashboardStats {
  pendingCount: number;
  todayOnLeave: (Leave & { employee: Employee })[];
}

export interface AttendanceSummary {
  records: Attendance[];
  summary: {
    totalDays: number;
    present: number;
    absent: number;
    halfDay: number;
    onLeave: number;
    totalWorkHours: number;
    averageWorkHours: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
