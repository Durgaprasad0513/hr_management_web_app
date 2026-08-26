import { PrismaClient, Role, Gender, LeaveType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.leaveBalance.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();

  // Create Departments
  const engineering = await prisma.department.create({
    data: { name: 'Engineering', description: 'Software Development & Engineering' },
  });

  const hr = await prisma.department.create({
    data: { name: 'Human Resources', description: 'HR & People Operations' },
  });

  const marketing = await prisma.department.create({
    data: { name: 'Marketing', description: 'Marketing & Communications' },
  });

  const finance = await prisma.department.create({
    data: { name: 'Finance', description: 'Finance & Accounting' },
  });

  const operations = await prisma.department.create({
    data: { name: 'Operations', description: 'Business Operations' },
  });

  console.log('✅ Departments created');

  // Create Employees
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin Employee
  const adminEmployee = await prisma.employee.create({
    data: {
      employeeCode: 'EMP001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@hrms.com',
      phone: '+91 9876543210',
      dateOfBirth: new Date('1985-06-15'),
      gender: Gender.MALE,
      address: '123 Admin Street',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001',
      joiningDate: new Date('2020-01-01'),
      designation: 'System Administrator',
      salary: 150000,
      departmentId: engineering.id,
    },
  });

  // HR Manager
  const hrManager = await prisma.employee.create({
    data: {
      employeeCode: 'EMP002',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@hrms.com',
      phone: '+91 9876543211',
      dateOfBirth: new Date('1990-03-22'),
      gender: Gender.FEMALE,
      address: '456 HR Lane',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500002',
      joiningDate: new Date('2021-03-15'),
      designation: 'HR Manager',
      salary: 120000,
      departmentId: hr.id,
    },
  });

  // Engineering Manager
  const engManager = await prisma.employee.create({
    data: {
      employeeCode: 'EMP003',
      firstName: 'Rahul',
      lastName: 'Verma',
      email: 'rahul.verma@hrms.com',
      phone: '+91 9876543212',
      dateOfBirth: new Date('1988-11-10'),
      gender: Gender.MALE,
      address: '789 Tech Park',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500003',
      joiningDate: new Date('2020-06-01'),
      designation: 'Engineering Manager',
      salary: 180000,
      departmentId: engineering.id,
    },
  });

  // Regular Employees
  const employee1 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP004',
      firstName: 'Ananya',
      lastName: 'Patel',
      email: 'ananya.patel@hrms.com',
      phone: '+91 9876543213',
      dateOfBirth: new Date('1995-07-08'),
      gender: Gender.FEMALE,
      address: '101 Dev Street',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500004',
      joiningDate: new Date('2022-01-10'),
      designation: 'Software Engineer',
      salary: 90000,
      departmentId: engineering.id,
      managerId: engManager.id,
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP005',
      firstName: 'Vikram',
      lastName: 'Singh',
      email: 'vikram.singh@hrms.com',
      phone: '+91 9876543214',
      dateOfBirth: new Date('1993-02-28'),
      gender: Gender.MALE,
      address: '202 Code Ave',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500005',
      joiningDate: new Date('2022-06-20'),
      designation: 'Senior Software Engineer',
      salary: 110000,
      departmentId: engineering.id,
      managerId: engManager.id,
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP006',
      firstName: 'Meera',
      lastName: 'Reddy',
      email: 'meera.reddy@hrms.com',
      phone: '+91 9876543215',
      dateOfBirth: new Date('1994-12-05'),
      gender: Gender.FEMALE,
      address: '303 Market Road',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500006',
      joiningDate: new Date('2021-09-01'),
      designation: 'Marketing Specialist',
      salary: 85000,
      departmentId: marketing.id,
    },
  });

  const employee4 = await prisma.employee.create({
    data: {
      employeeCode: 'EMP007',
      firstName: 'Arjun',
      lastName: 'Kumar',
      email: 'arjun.kumar@hrms.com',
      phone: '+91 9876543216',
      dateOfBirth: new Date('1991-08-18'),
      gender: Gender.MALE,
      address: '404 Finance Blvd',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500007',
      joiningDate: new Date('2021-04-12'),
      designation: 'Financial Analyst',
      salary: 95000,
      departmentId: finance.id,
    },
  });

  console.log('✅ Employees created');

  // Update department heads
  await prisma.department.update({
    where: { id: engineering.id },
    data: { headId: engManager.id },
  });

  await prisma.department.update({
    where: { id: hr.id },
    data: { headId: hrManager.id },
  });

  console.log('✅ Department heads assigned');

  // Create Users (login accounts)
  await prisma.user.createMany({
    data: [
      { email: 'admin@hrms.com', password: hashedPassword, role: Role.ADMIN, employeeId: adminEmployee.id },
      { email: 'priya.sharma@hrms.com', password: hashedPassword, role: Role.HR, employeeId: hrManager.id },
      { email: 'rahul.verma@hrms.com', password: hashedPassword, role: Role.MANAGER, employeeId: engManager.id },
      { email: 'ananya.patel@hrms.com', password: hashedPassword, role: Role.EMPLOYEE, employeeId: employee1.id },
      { email: 'vikram.singh@hrms.com', password: hashedPassword, role: Role.EMPLOYEE, employeeId: employee2.id },
      { email: 'meera.reddy@hrms.com', password: hashedPassword, role: Role.EMPLOYEE, employeeId: employee3.id },
      { email: 'arjun.kumar@hrms.com', password: hashedPassword, role: Role.EMPLOYEE, employeeId: employee4.id },
    ],
  });

  console.log('✅ User accounts created');

  // Create Leave Balances for current year
  const currentYear = new Date().getFullYear();
  const allEmployees = [adminEmployee, hrManager, engManager, employee1, employee2, employee3, employee4];

  for (const emp of allEmployees) {
    await prisma.leaveBalance.createMany({
      data: [
        { employeeId: emp.id, year: currentYear, leaveType: LeaveType.CASUAL, totalDays: 12, remainingDays: 12 },
        { employeeId: emp.id, year: currentYear, leaveType: LeaveType.SICK, totalDays: 10, remainingDays: 10 },
        { employeeId: emp.id, year: currentYear, leaveType: LeaveType.EARNED, totalDays: 15, remainingDays: 15 },
      ],
    });
  }

  console.log('✅ Leave balances initialized');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login Credentials (password for all: password123):');
  console.log('   Admin:    admin@hrms.com');
  console.log('   HR:       priya.sharma@hrms.com');
  console.log('   Manager:  rahul.verma@hrms.com');
  console.log('   Employee: ananya.patel@hrms.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
