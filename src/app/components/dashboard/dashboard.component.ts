import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InterferenceService } from '../../services/interference.service';
import { InterferenceReport, Technician } from '../../models/interference-report';

interface TechnicianStats {
  technician: Technician;
  activeReports: number;
  resolvedReports: number;
  averageResolutionTime?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2>Dashboard</h2>

      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h5 class="card-title">Total Reports</h5>
              <h2 class="mb-0">{{ reports.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <h5 class="card-title">Active Reports</h5>
              <h2 class="mb-0">{{ getActiveReportsCount() }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h5 class="card-title">Resolved Reports</h5>
              <h2 class="mb-0">{{ getResolvedReportsCount() }}</h2>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Technician Workload</h5>
            </div>
            <div class="card-body">
              <div *ngFor="let stat of technicianStats" class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <a [routerLink]="['/technicians', stat.technician.id]" class="text-decoration-none">
                    <span>{{ stat.technician.name }}</span>
                  </a>
                  <span class="badge" [class.bg-success]="stat.technician.isAvailable" [class.bg-danger]="!stat.technician.isAvailable">
                    {{ stat.technician.isAvailable ? 'Available' : 'Busy' }}
                  </span>
                </div>
                <div class="progress" style="height: 20px;">
                  <div class="progress-bar bg-info" 
                       [style.width]="(stat.activeReports / (stat.activeReports + stat.resolvedReports) * 100) + '%'"
                       *ngIf="stat.activeReports > 0">
                    {{ stat.activeReports }} Active
                  </div>
                  <div class="progress-bar bg-success" 
                       [style.width]="(stat.resolvedReports / (stat.activeReports + stat.resolvedReports) * 100) + '%'"
                       *ngIf="stat.resolvedReports > 0">
                    {{ stat.resolvedReports }} Resolved
                  </div>
                </div>
                <small class="text-muted" *ngIf="stat.averageResolutionTime">
                  Avg. Resolution Time: {{ formatDuration(stat.averageResolutionTime) }}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Recent Activity</h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <a *ngFor="let report of getRecentReports()" 
                   [routerLink]="['/reports', report.id]"
                   class="list-group-item list-group-item-action">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">{{ report.reporterName }}</h6>
                      <small class="text-muted">
                        {{ report.interferenceType }} on Channel {{ report.channelAffected }}
                      </small>
                    </div>
                    <span [class]="getStatusClass(report.status)">{{ report.status }}</span>
                  </div>
                  <div *ngIf="report.assignedTechnician" class="mt-2 text-muted">
                    <small>
                      <i class="bi bi-person-gear"></i>
                      Assigned to: {{ report.assignedTechnician.name }}
                    </small>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  reports: InterferenceReport[] = [];
  technicianStats: TechnicianStats[] = [];
  loading = true;
  error: string | null = null;

  constructor(private interferenceService: InterferenceService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.interferenceService.getAllReports().subscribe({
      next: (reports) => {
        this.reports = reports;
        this.calculateTechnicianStats();
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.error = 'Failed to load dashboard data.';
      }
    });
  }

  calculateTechnicianStats(): void {
    const technicianMap = new Map<number, TechnicianStats>();

    // Initialize stats for each technician
    this.reports.forEach(report => {
      if (report.assignedTechnician) {
        const tech = report.assignedTechnician;
        if (!technicianMap.has(tech.id)) {
          technicianMap.set(tech.id, {
            technician: tech,
            activeReports: 0,
            resolvedReports: 0
          });
        }

        const stats = technicianMap.get(tech.id)!;
        if (report.status === 'resolved') {
          stats.resolvedReports++;
        } else {
          stats.activeReports++;
        }
      }
    });

    this.technicianStats = Array.from(technicianMap.values());
  }

  getActiveReportsCount(): number {
    return this.reports.filter(r => r.status !== 'resolved').length;
  }

  getResolvedReportsCount(): number {
    return this.reports.filter(r => r.status === 'resolved').length;
  }

  getRecentReports(): InterferenceReport[] {
    return [...this.reports]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge bg-warning';
      case 'investigating':
        return 'badge bg-info';
      case 'resolved':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }
} 