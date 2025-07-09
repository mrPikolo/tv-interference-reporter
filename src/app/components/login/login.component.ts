import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Login</h2>
              
              <div *ngIf="error" class="alert alert-danger">
                {{ error }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      formControlName="username"
                      [ngClass]="{'is-invalid': submitted && f['username'].errors}"
                      placeholder="Enter your username"
                    >
                    <div class="invalid-feedback" *ngIf="submitted && f['username'].errors?.['required']">
                      Username is required
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      [ngClass]="{'is-invalid': submitted && f['password'].errors}"
                      placeholder="Enter your password"
                    >
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      (click)="togglePasswordVisibility()"
                    >
                      <i class="bi" [class.bi-eye]="!showPassword" [class.bi-eye-slash]="showPassword"></i>
                    </button>
                    <div class="invalid-feedback" *ngIf="submitted && f['password'].errors?.['required']">
                      Password is required
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100" 
                  [disabled]="loading"
                >
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 15px;
    }
    .card-body {
      border-radius: 15px;
    }
    .input-group-text {
      background-color: transparent;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.loginForm.valid) {
      this.loading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error = 'Invalid username or password';
          this.loading = false;
        }
      });
    }
  }
} 