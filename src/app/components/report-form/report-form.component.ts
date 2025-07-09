import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InterferenceService } from '../../services/interference.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InterferenceType } from '../../models/interference-report';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Report Interference</h2>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <form [formGroup]="reportForm" (ngSubmit)="onSubmit()" class="needs-validation">
        <!-- Contact Information -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Contact Information</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="reporterName" class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="reporterName"
                  formControlName="reporterName"
                  [ngClass]="{'is-invalid': submitted && f['reporterName'].errors}"
                >
                <div class="invalid-feedback" *ngIf="submitted && f['reporterName'].errors?.['required']">
                  Name is required
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <input
                  type="tel"
                  class="form-control"
                  id="phoneNumber"
                  formControlName="phoneNumber"
                  [ngClass]="{'is-invalid': submitted && f['phoneNumber'].errors}"
                >
                <div class="invalid-feedback" *ngIf="submitted && f['phoneNumber'].errors?.['required']">
                  Phone number is required
                </div>
                <div class="invalid-feedback" *ngIf="submitted && f['phoneNumber'].errors?.['pattern']">
                  Please enter a valid phone number
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  formControlName="email"
                  [ngClass]="{'is-invalid': submitted && f['email'].errors}"
                >
                <div class="invalid-feedback" *ngIf="submitted && f['email'].errors?.['required']">
                  Email is required
                </div>
                <div class="invalid-feedback" *ngIf="submitted && f['email'].errors?.['email']">
                  Please enter a valid email address
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label for="address" class="form-label">Address</label>
                <input
                  type="text"
                  class="form-control"
                  id="address"
                  formControlName="address"
                  [ngClass]="{'is-invalid': submitted && f['address'].errors}"
                >
                <div class="invalid-feedback" *ngIf="submitted && f['address'].errors?.['required']">
                  Address is required
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Information -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">Service Information</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Service Type</label>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" formControlName="serviceType" value="TV" id="typeTV">
                <label class="btn btn-outline-primary" for="typeTV">TV</label>

                <input type="radio" class="btn-check" formControlName="serviceType" value="INTERNET" id="typeInternet">
                <label class="btn btn-outline-primary" for="typeInternet">Internet</label>

                <input type="radio" class="btn-check" formControlName="serviceType" value="BOTH" id="typeBoth">
                <label class="btn btn-outline-primary" for="typeBoth">Both</label>
              </div>
            </div>

            <!-- TV-specific fields -->
            <div *ngIf="showTVFields">
              <div class="mb-3">
                <label for="channelAffected" class="form-label">Affected Channel</label>
                <input
                  type="text"
                  class="form-control"
                  id="channelAffected"
                  formControlName="channelAffected"
                  [ngClass]="{'is-invalid': submitted && f['channelAffected'].errors}"
                >
              </div>
            </div>

            <!-- Internet-specific fields -->
            <div *ngIf="showInternetFields" formGroupName="internetDetails">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="downloadSpeed" class="form-label">Download Speed (Mbps)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="downloadSpeed"
                    formControlName="downloadSpeed"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label for="uploadSpeed" class="form-label">Upload Speed (Mbps)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="uploadSpeed"
                    formControlName="uploadSpeed"
                  >
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="latency" class="form-label">Latency (ms)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="latency"
                    formControlName="latency"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label for="packetLoss" class="form-label">Packet Loss (%)</label>
                  <input
                    type="number"
                    class="form-control"
                    id="packetLoss"
                    formControlName="packetLoss"
                  >
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="routerModel" class="form-label">Router Model</label>
                  <input
                    type="text"
                    class="form-control"
                    id="routerModel"
                    formControlName="routerModel"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label for="modemModel" class="form-label">Modem Model</label>
                  <input
                    type="text"
                    class="form-control"
                    id="modemModel"
                    formControlName="modemModel"
                  >
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="wifiAffected"
                      formControlName="wifiAffected"
                    >
                    <label class="form-check-label" for="wifiAffected">
                      Wi-Fi Affected
                    </label>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="ethernetAffected"
                      formControlName="ethernetAffected"
                    >
                    <label class="form-check-label" for="ethernetAffected">
                      Ethernet Affected
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="interferenceType" class="form-label">Type of Interference</label>
              <select
                class="form-select"
                id="interferenceType"
                formControlName="interferenceType"
                [ngClass]="{'is-invalid': submitted && f['interferenceType'].errors}"
              >
                <option value="">Select type...</option>
                <optgroup *ngIf="showTVFields" label="TV Issues">
                  <option value="TV_SIGNAL_LOSS">Signal Loss</option>
                  <option value="TV_DISTORTION">Picture Distortion</option>
                  <option value="TV_AUDIO_ISSUES">Audio Issues</option>
                  <option value="TV_CHANNEL_FREEZING">Channel Freezing</option>
                  <option value="TV_PIXELATION">Pixelation</option>
                </optgroup>
                <optgroup *ngIf="showInternetFields" label="Internet Issues">
                  <option value="INTERNET_SLOW">Slow Connection</option>
                  <option value="INTERNET_INTERMITTENT">Intermittent Connection</option>
                  <option value="INTERNET_NO_CONNECTION">No Connection</option>
                  <option value="INTERNET_HIGH_LATENCY">High Latency</option>
                </optgroup>
                <option value="OTHER">Other</option>
              </select>
              <div class="invalid-feedback" *ngIf="submitted && f['interferenceType'].errors?.['required']">
                Please select the type of interference
              </div>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="description"
                rows="3"
                formControlName="description"
                [ngClass]="{'is-invalid': submitted && f['description'].errors}"
                placeholder="Please describe the issue in detail..."
              ></textarea>
              <div class="invalid-feedback" *ngIf="submitted && f['description'].errors?.['required']">
                Description is required
              </div>
              <div class="invalid-feedback" *ngIf="submitted && f['description'].errors?.['minlength']">
                Description must be at least 10 characters
              </div>
            </div>

            <div class="mb-3">
              <label for="timeObserved" class="form-label">Time Observed</label>
              <input
                type="datetime-local"
                class="form-control"
                id="timeObserved"
                formControlName="timeObserved"
                [ngClass]="{'is-invalid': submitted && f['timeObserved'].errors}"
              >
              <div class="invalid-feedback" *ngIf="submitted && f['timeObserved'].errors?.['required']">
                Time is required
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            Submit Report
          </button>
          <button type="button" class="btn btn-secondary" routerLink="/reports">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class ReportFormComponent implements OnInit {
  reportForm: FormGroup;
  isSubmitting = false;
  submitted = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private interferenceService: InterferenceService,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
      reporterName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9-+()\\s]*$')]],
      email: ['', [Validators.required, Validators.email]],
      serviceType: ['', [Validators.required]],
      channelAffected: [''],
      interferenceType: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      timeObserved: ['', [Validators.required]],
      internetDetails: this.fb.group({
        downloadSpeed: [null],
        uploadSpeed: [null],
        latency: [null],
        packetLoss: [null],
        routerModel: [''],
        modemModel: [''],
        wifiAffected: [false],
        ethernetAffected: [false]
      })
    });

    // Subscribe to serviceType changes to update form validation
    this.reportForm.get('serviceType')?.valueChanges.subscribe(value => {
      const channelControl = this.reportForm.get('channelAffected');
      if (this.showTVFields) {
        channelControl?.setValidators([Validators.required]);
      } else {
        channelControl?.clearValidators();
      }
      channelControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {}

  get f() { return this.reportForm.controls; }

  get showTVFields(): boolean {
    const serviceType = this.reportForm.get('serviceType')?.value;
    return serviceType === 'TV' || serviceType === 'BOTH';
  }

  get showInternetFields(): boolean {
    const serviceType = this.reportForm.get('serviceType')?.value;
    return serviceType === 'INTERNET' || serviceType === 'BOTH';
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.reportForm.valid) {
      this.loading = true;
      const formValue = this.reportForm.value;

      // Only include internetDetails if internet service is affected
      if (!this.showInternetFields) {
        delete formValue.internetDetails;
      }

      // Only include channelAffected if TV service is affected
      if (!this.showTVFields) {
        delete formValue.channelAffected;
      }

      this.interferenceService.createReport({
        ...formValue,
        status: 'pending'
      }).subscribe({
        next: () => {
          this.router.navigate(['/reports']);
        },
        error: (error) => {
          console.error('Error submitting report:', error);
          this.error = 'Failed to submit report. Please try again.';
          this.loading = false;
        }
      });
    }
  }
} 