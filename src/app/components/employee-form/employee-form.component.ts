import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notification.service';
import { Department, Employee, EmployeeRequest } from '../../models/employee.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h1>
        <button class="btn btn-secondary" (click)="navigateBack()">
          <i class="pi pi-arrow-left"></i> Back
        </button>
      </div>

      <div class="card form-card">
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name" class="form-label">Name</label>
            <input 
              id="name" 
              type="text" 
              class="form-control" 
              formControlName="name"
              [ngClass]="{'invalid': isFieldInvalid('name')}" />
            <div *ngIf="isFieldInvalid('name')" class="error-message">
              <span *ngIf="employeeForm.get('name')?.errors?.['required']">Name is required</span>
              <span *ngIf="employeeForm.get('name')?.errors?.['pattern']">Name must contain only letters and spaces</span>
              <span *ngIf="employeeForm.get('name')?.errors?.['maxlength']">Name must be less than 100 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              type="email" 
              class="form-control" 
              formControlName="email"
              [ngClass]="{'invalid': isFieldInvalid('email')}" />
            <div *ngIf="isFieldInvalid('email')" class="error-message">
              <span *ngIf="employeeForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="employeeForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
              <span *ngIf="employeeForm.get('email')?.errors?.['pattern']">Please enter a valid email address</span>
            </div>
          </div>

          <div class="form-group">
            <label for="department" class="form-label">Department</label>
            <select
              id="department"
              class="form-control"
              formControlName="department"
              [ngClass]="{'invalid': isFieldInvalid('department')}">
              <option value="">Select Department</option>
              <option *ngFor="let dept of departmentOptions" [value]="dept.value">{{dept.label}}</option>
            </select>
            <div *ngIf="isFieldInvalid('department')" class="error-message">
              <span *ngIf="employeeForm.get('department')?.errors?.['required']">Department is required</span>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              (click)="resetForm()">
              Reset
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="employeeForm.invalid || loading">
              {{ isEditMode ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-card {
      max-width: 600px;
      margin: 0 auto;
    }

    .invalid {
      border-color: var(--danger-color);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId?: number;
  loading = false;
  
departmentOptions = [
  { label: 'HR', value: Department.HR },
  { label: 'Finance', value: Department.FINANCE },
  { label: 'IT', value: Department.IT },
  { label: 'Operations', value: Department.OPERATIONS }
];
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.employeeId = +id;
        this.loadEmployee(this.employeeId);
      }
    });
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z ]+$'),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      department: ['', Validators.required]
    });
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          name: employee.name,
          email: employee.email,
          department: employee.department
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.navigateBack();
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched(this.employeeForm);
      return;
    }

    const employeeData: EmployeeRequest = this.employeeForm.value;
    this.loading = true;

    if (this.isEditMode && this.employeeId) {
      this.updateEmployee(this.employeeId, employeeData);
    } else {
      this.createEmployee(employeeData);
    }
  }

  createEmployee(employee: EmployeeRequest): void {
    this.employeeService.createEmployee(employee).subscribe({
      next: () => {
        this.notificationService.showSuccess('Employee created successfully');
        this.navigateBack();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateEmployee(id: number, employee: EmployeeRequest): void {
    this.employeeService.updateEmployee(id, employee).subscribe({
      next: () => {
        this.notificationService.showSuccess('Employee updated successfully');
        this.navigateBack();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    if (this.isEditMode && this.employeeId) {
      this.loadEmployee(this.employeeId);
    } else {
      this.employeeForm.reset();
    }
  }

  navigateBack(): void {
    this.router.navigate(['/employees']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}