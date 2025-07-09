import { Component, OnInit } from '@angular/core';
import { InterferenceService } from '../../services/interference.service';
import { InterferenceReport, Technician } from '../../models/interference-report';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Interference Reports</h2>
      
      <div class="mb-3">
        <button class="btn btn-primary" routerLink="/report/new">
          <i class="bi bi-plus-circle"></i> New Report
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
        <div *ngFor="let report of reports" class="col">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title">{{ report.reporterName }}</h5>
                <div>
                  <span [class]="getStatusClass(report.status)">{{ report.status }}</span>
                  <span class="badge bg-info ms-1">{{ report.serviceType }}</span>
                </div>
              </div>
              
              <p class="card-text">
                <ng-container *ngIf="report.serviceType === 'TV' || report.serviceType === 'BOTH'">
                  <strong>Channel:</strong> {{ report.channelAffected }}<br>
                </ng-container>
                <strong>Type:</strong> {{ formatInterferenceType(report.interferenceType) }}<br>
                <strong>Time:</strong> {{ formatDate(report.timeObserved) }}
              </p>

              <div *ngIf="report.internetDetails" class="mb-3">
                <h6 class="mb-2">Internet Details</h6>
                <div class="small">
                  <div *ngIf="report.internetDetails.downloadSpeed">
                    <strong>Download:</strong> {{ report.internetDetails.downloadSpeed }} Mbps
                  </div>
                  <div *ngIf="report.internetDetails.uploadSpeed">
                    <strong>Upload:</strong> {{ report.internetDetails.uploadSpeed }} Mbps
                  </div>
                  <div *ngIf="report.internetDetails.latency">
                    <strong>Latency:</strong> {{ report.internetDetails.latency }} ms
                  </div>
                  <div *ngIf="report.internetDetails.packetLoss">
                    <strong>Packet Loss:</strong> {{ report.internetDetails.packetLoss }}%
                  </div>
                  <div class="mt-1">
                    <span class="badge" 
                          [class.bg-danger]="report.internetDetails.wifiAffected"
                          [class.bg-secondary]="!report.internetDetails.wifiAffected">
                      Wi-Fi {{ report.internetDetails.wifiAffected ? 'Affected' : 'OK' }}
                    </span>
                    <span class="badge ms-1" 
                          [class.bg-danger]="report.internetDetails.ethernetAffected"
                          [class.bg-secondary]="!report.internetDetails.ethernetAffected">
                      Ethernet {{ report.internetDetails.ethernetAffected ? 'Affected' : 'OK' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <strong>Assigned Technician:</strong>
                <div class="d-flex align-items-center gap-2 mt-2">
                  <select 
                    class="form-select form-select-sm" 
                    [ngModel]="report.assignedTechnician?.id"
                    (ngModelChange)="assignTechnician(report.id, $event)"
                    [disabled]="report.status === 'resolved'"
                  >
                    <option [ngValue]="null">Not Assigned</option>
                    <option *ngFor="let tech of availableTechnicians" [ngValue]="tech.id">
                      {{ tech.name }} - {{ tech.specialization }}
                    </option>
                  </select>
                  <button 
                    *ngIf="report.assignedTechnician"
                    class="btn btn-sm btn-outline-danger"
                    (click)="unassignTechnician(report.id)"
                    [disabled]="report.status === 'resolved'"
                  >
                    <i class="bi bi-person-x"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3" *ngIf="report.assignedTechnician">
                <strong>Technician Notes:</strong>
                <textarea 
                  class="form-control form-control-sm mt-2"
                  rows="2"
                  [ngModel]="report.technicianNotes"
                  (blur)="updateNotes(report.id, $event)"
                  [disabled]="report.status === 'resolved'"
                  placeholder="Add technician notes..."
                ></textarea>
              </div>

              <div class="d-flex gap-2">
                <button 
                  class="btn btn-sm"
                  [class.btn-success]="report.status === 'pending'"
                  [class.btn-warning]="report.status === 'investigating'"
                  [class.btn-secondary]="report.status === 'resolved'"
                  (click)="cycleStatus(report)"
                >
                  <i class="bi" 
                    [class.bi-play-fill]="report.status === 'pending'"
                    [class.bi-check-circle]="report.status === 'investigating'"
                    [class.bi-arrow-counterclockwise]="report.status === 'resolved'"
                  ></i>
                  {{ getNextStatusLabel(report.status) }}
                </button>
              </div>
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
export class ReportListComponent implements OnInit {
  reports: InterferenceReport[] = [];
  availableTechnicians: Technician[] = [];
  loading = true;
  error: string | null = null;

  constructor(private interferenceService: InterferenceService) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadAvailableTechnicians();
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;
    
    this.interferenceService.getAllReports().subscribe({
      next: (reports) => {
        this.reports = reports;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.error = 'Failed to load reports. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadAvailableTechnicians(): void {
    this.interferenceService.getAvailableTechnicians().subscribe({
      next: (technicians) => {
        this.availableTechnicians = technicians;
      },
      error: (error) => {
        console.error('Error loading technicians:', error);
      }
    });
  }

  assignTechnician(reportId: number, technicianId: number | null): void {
    if (technicianId === null) {
      this.unassignTechnician(reportId);
      return;
    }

    this.interferenceService.assignTechnician(reportId.toString(), technicianId).subscribe({
      next: (updatedReport) => {
        this.updateReportInList(updatedReport);
        this.loadAvailableTechnicians(); // Refresh available technicians
      },
      error: (error) => {
        console.error('Error assigning technician:', error);
        this.error = 'Failed to assign technician. Please try again.';
      }
    });
  }

  unassignTechnician(reportId: number): void {
    this.interferenceService.unassignTechnician(reportId.toString()).subscribe({
      next: (updatedReport) => {
        this.updateReportInList(updatedReport);
        this.loadAvailableTechnicians(); // Refresh available technicians
      },
      error: (error) => {
        console.error('Error unassigning technician:', error);
        this.error = 'Failed to unassign technician. Please try again.';
      }
    });
  }

  updateNotes(reportId: number, event: Event): void {
    const notes = (event.target as HTMLTextAreaElement).value;
    this.interferenceService.updateTechnicianNotes(reportId.toString(), notes).subscribe({
      next: (updatedReport) => {
        this.updateReportInList(updatedReport);
      },
      error: (error) => {
        console.error('Error updating notes:', error);
        this.error = 'Failed to update notes. Please try again.';
      }
    });
  }

  cycleStatus(report: InterferenceReport): void {
    const statusCycle: Record<'pending' | 'investigating' | 'resolved', InterferenceReport['status']> = {
      'pending': 'investigating',
      'investigating': 'resolved',
      'resolved': 'pending'
    };

    const newStatus = statusCycle[report.status];
    this.interferenceService.updateReport(report.id.toString(), { status: newStatus }).subscribe({
      next: (updatedReport) => {
        this.updateReportInList(updatedReport);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.error = 'Failed to update status. Please try again.';
      }
    });
  }

  getNextStatusLabel(currentStatus: string): string {
    const labels: Record<string, string> = {
      'pending': 'Start Investigation',
      'investigating': 'Mark Resolved',
      'resolved': 'Reopen'
    };
    return labels[currentStatus];
  }

  updateReportInList(updatedReport: InterferenceReport): void {
    const index = this.reports.findIndex(r => r.id === updatedReport.id);
    if (index !== -1) {
      this.reports[index] = updatedReport;
      this.reports = [...this.reports]; // Trigger change detection
    }
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  formatInterferenceType(type: string): string {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
} 