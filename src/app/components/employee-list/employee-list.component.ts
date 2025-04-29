import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../services/notification.service';
import { Employee, EmployeeResponse } from '../../models/employee.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DepartmentBadgeComponent } from '../shared/department-badge/department-badge.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    DepartmentBadgeComponent
  ],
  providers: [ConfirmationService],
  template: `
    <div class="container">
      <div class="header">
        <h1>Employee Management</h1>
        <button class="btn btn-primary" (click)="navigateToAddEmployee()">
          <i class="pi pi-plus"></i> Add Employee
        </button>
      </div>

      <div class="search-container">
        <span class="search-icon">
          <i class="pi pi-search"></i>
        </span>
        <input 
          type="text" 
          class="form-control search-input" 
          placeholder="Search employees by name..." 
          [(ngModel)]="searchTerm"
          (input)="onSearchChange()" />
      </div>

      <div *ngIf="loading" class="loading">
        <p>Loading employees...</p>
      </div>

      <div *ngIf="!loading && employees.length === 0" class="empty-state">
        <p>No employees found. Add a new employee to get started.</p>
      </div>

      <div *ngIf="!loading && employees.length > 0" class="employee-grid">
        <div class="employee-card card" *ngFor="let employee of filteredEmployees">
          <div class="employee-header">
            <h3>{{ employee.name }}</h3>
            <app-department-badge [department]="employee.department"></app-department-badge>
          </div>
          <div class="employee-details">
            <p><i class="pi pi-envelope"></i> {{ employee.email }}</p>
            <p><i class="pi pi-calendar"></i> Added: {{ employee.createdAt | date:'mediumDate' }}</p>
          </div>
          <div class="employee-actions">
            <button class="btn btn-secondary" (click)="navigateToEditEmployee(employee.id)">
              <i class="pi pi-pencil"></i> Edit
            </button>
            <button class="btn btn-danger" (click)="confirmDelete(employee)">
              <i class="pi pi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <p-confirmDialog 
      header="Confirm Deletion" 
      icon="pi pi-exclamation-triangle"
      acceptButtonStyleClass="btn btn-danger"
      rejectButtonStyleClass="btn btn-secondary">
    </p-confirmDialog>
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

    .loading, .empty-state {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .employee-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .employee-card {
      display: flex;
      flex-direction: column;
    }

    .employee-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .employee-details {
      flex: 1;
      margin-bottom: 1rem;
    }

    .employee-details p {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
    }

    .employee-details i {
      margin-right: 0.5rem;
      color: var(--gray-500);
    }

    .employee-actions {
      display: flex;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .employee-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeResponse[] = [];
  filteredEmployees: EmployeeResponse[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = [...this.employees];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTermLower)
    );
  }

  searchEmployees(): void {
    if (!this.searchTerm.trim()) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployeesByName(this.searchTerm).subscribe({
      next: (data) => {
        this.filteredEmployees = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/new']);
  }

  navigateToEditEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  confirmDelete(employee: EmployeeResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.name}?`,
      accept: () => {
        this.deleteEmployee(employee.id);
      }
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Employee deleted successfully');
        this.loadEmployees();
      }
    });
  }
}