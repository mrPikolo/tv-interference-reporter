import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InterferenceService } from '../../services/interference.service';
import { Technician } from '../../models/interference-report';

@Component({
  selector: 'app-technician-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{ isEditMode ? 'Edit' : 'Add' }} Technician</h2>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <form [formGroup]="technicianForm" (ngSubmit)="onSubmit()" class="needs-validation">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            id="name"
            formControlName="name"
            [ngClass]="{'is-invalid': submitted && technicianForm.get('name')?.errors}"
          >
          <div class="invalid-feedback" *ngIf="submitted && technicianForm.get('name')?.errors?.['required']">
            Name is required
          </div>
        </div>

        <div class="mb-3">
          <label for="specialization" class="form-label">Specialization</label>
          <input
            type="text"
            class="form-control"
            id="specialization"
            formControlName="specialization"
            [ngClass]="{'is-invalid': submitted && technicianForm.get('specialization')?.errors}"
          >
          <div class="invalid-feedback" *ngIf="submitted && technicianForm.get('specialization')?.errors?.['required']">
            Specialization is required
          </div>
        </div>

        <div class="mb-3">
          <label for="contactNumber" class="form-label">Contact Number</label>
          <input
            type="tel"
            class="form-control"
            id="contactNumber"
            formControlName="contactNumber"
            [ngClass]="{'is-invalid': submitted && technicianForm.get('contactNumber')?.errors}"
          >
          <div class="invalid-feedback" *ngIf="submitted && technicianForm.get('contactNumber')?.errors?.['required']">
            Contact number is required
          </div>
          <div class="invalid-feedback" *ngIf="submitted && technicianForm.get('contactNumber')?.errors?.['pattern']">
            Please enter a valid phone number
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            formControlName="email"
            [ngClass]="{'is-invalid': submitted && technicianForm.get('email')?.errors}"
          >
          <div class="invalid-feedback" *ngIf="submitted && technicianForm.get('email')?.errors?.['required']">
            Email is required
          </div>
          <div class="invalid-feedback" *ngIf="submitted && technicianForm.get('email')?.errors?.['email']">
            Please enter a valid email address
          </div>
        </div>

        <div class="mb-3 form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="isAvailable"
            formControlName="isAvailable"
          >
          <label class="form-check-label" for="isAvailable">Available for Assignment</label>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            {{ isEditMode ? 'Update' : 'Create' }} Technician
          </button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class TechnicianFormComponent implements OnInit {
  technicianForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private interferenceService: InterferenceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.technicianForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9-+()\\s]*$')]],
      email: ['', [Validators.required, Validators.email]],
      isAvailable: [true]
    });
  }

  ngOnInit(): void {
    const technicianId = this.route.snapshot.params['id'];
    if (technicianId) {
      this.isEditMode = true;
      this.loadTechnician(technicianId);
    }
  }

  loadTechnician(id: number): void {
    // Add load technician functionality when implemented in the service
    console.log('Load technician:', id);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.technicianForm.valid) {
      this.loading = true;
      const technicianData = this.technicianForm.value;

      // Add create/update functionality when implemented in the service
      console.log('Submit technician:', technicianData);
      
      // Simulate success
      setTimeout(() => {
        this.router.navigate(['/technicians']);
      }, 1000);
    }
  }

  goBack(): void {
    this.router.navigate(['/technicians']);
  }
} 