import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container">
          <div class="logo">
            <h1>Rainbow HR</h1>
          </div>
        </div>
      </header>
      
      <main class="app-content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <div class="container">
          <p>&copy; 2025 Rainbow Computer All rights reserved.</p>
        </div>
      </footer>
    </div>
    
    <p-toast position="top-right"></p-toast>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-header {
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .app-content {
      flex: 1;
    }
    
    .app-footer {
      background-color: var(--gray-800);
      color: white;
      padding: 1rem 0;
      margin-top: 2rem;
    }
    
    .app-footer p {
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class AppComponent {
  title = 'Rainbow-HR';
}