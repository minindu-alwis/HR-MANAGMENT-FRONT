import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="department-badge" [ngClass]="'department-' + departmentClass">
      {{ department }}
    </span>
  `,
  styles: [`
    .department-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
  `]
})
export class DepartmentBadgeComponent {
  @Input() department!: string;

  get departmentClass(): string {
    return this.department?.toLowerCase() || '';
  }
}