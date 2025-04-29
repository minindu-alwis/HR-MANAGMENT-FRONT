export interface Employee {
  id?: number;
  name: string;
  email: string;
  department: Department;
  createdAt?: string;
  updatedAt?: string;
}

export enum Department {
  FINANCE = 'FINANCE',
  HR = 'HR',
  IT = 'IT',
  OPERATIONS = 'OPERATIONS'
}

export interface EmployeeRequest {
  name: string;
  email: string;
  department: Department;
}

export interface EmployeeResponse {
  id: number;
  name: string;
  email: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}