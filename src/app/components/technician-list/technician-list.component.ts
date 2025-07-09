import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InterferenceService } from '../../services/interference.service';
import { Technician } from '../../models/interference-report';

@Component({
  selector: 'app-technician-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2>Technicians</h2>
      
      <div class="mb-3">
        <button class="btn btn-primary" [routerLink]="['/technicians/new']">
          <i class="bi bi-plus-circle"></i> Add New Technician
        </button>
      </div>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div *ngFor="let technician of technicians" class="col">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ technician.name }}</h5>
              <p class="card-text">
                <strong>Specialization:</strong> {{ technician.specialization }}<br>
                <strong>Contact:</strong> {{ technician.contactNumber }}<br>
                <strong>Email:</strong> {{ technician.email }}
              </p>
              <div class="mb-2">
                <span class="badge" [ngClass]="technician.isAvailable ? 'bg-success' : 'bg-danger'">
                  {{ technician.isAvailable ? 'Available' : 'Busy' }}
                </span>
              </div>
              <button class="btn btn-sm btn-outline-primary me-2" [routerLink]="['/technicians', technician.id]">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" (click)="deleteTechnician(technician.id)">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class TechnicianListComponent implements OnInit {
  technicians: Technician[] = [];
  loading = true;
  error: string | null = null;

  constructor(private interferenceService: InterferenceService) {}

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.loading = true;
    this.error = null;
    
    this.interferenceService.getAllTechnicians().subscribe({
      next: (technicians) => {
        this.technicians = technicians;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
        this.error = 'Failed to load technicians. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteTechnician(id: number): void {
    if (confirm('Are you sure you want to delete this technician?')) {
      // Add delete functionality when implemented in the service
      console.log('Delete technician:', id);
    }
  }
} 