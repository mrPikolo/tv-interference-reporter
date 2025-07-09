import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InterferenceReport, Technician } from '../models/interference-report';

@Injectable({
  providedIn: 'root'
})
export class InterferenceService {
  private apiUrl = 'http://localhost:8080/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Report related endpoints
  getAllReports(): Observable<InterferenceReport[]> {
    return this.http.get<InterferenceReport[]>(`${this.apiUrl}/reports`)
      .pipe(catchError(this.handleError));
  }

  getReport(id: string): Observable<InterferenceReport> {
    return this.http.get<InterferenceReport>(`${this.apiUrl}/reports/${id}`)
      .pipe(catchError(this.handleError));
  }

  createReport(report: Omit<InterferenceReport, 'id' | 'createdAt' | 'updatedAt' | 'assignedTechnician' | 'assignedAt'>): Observable<InterferenceReport> {
    return this.http.post<InterferenceReport>(`${this.apiUrl}/reports`, report, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateReport(id: string, report: Partial<InterferenceReport>): Observable<InterferenceReport> {
    return this.http.put<InterferenceReport>(`${this.apiUrl}/reports/${id}`, report, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reports/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Technician related endpoints
  getAllTechnicians(): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${this.apiUrl}/technicians`)
      .pipe(catchError(this.handleError));
  }

  getAvailableTechnicians(): Observable<Technician[]> {
    return this.http.get<Technician[]>(`${this.apiUrl}/technicians/available`)
      .pipe(catchError(this.handleError));
  }

  assignTechnician(reportId: string, technicianId: number): Observable<InterferenceReport> {
    return this.http.post<InterferenceReport>(
      `${this.apiUrl}/reports/${reportId}/assign/${technicianId}`,
      {},
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  unassignTechnician(reportId: string): Observable<InterferenceReport> {
    return this.http.post<InterferenceReport>(
      `${this.apiUrl}/reports/${reportId}/unassign`,
      {},
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  updateTechnicianNotes(reportId: string, notes: string): Observable<InterferenceReport> {
    return this.http.put<InterferenceReport>(
      `${this.apiUrl}/reports/${reportId}/notes`,
      { notes },
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      // Handle specific HTTP status codes
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request - please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized - please log in';
          break;
        case 403:
          errorMessage = 'Forbidden - you don\'t have permission to access this resource';
          break;
        case 404:
          errorMessage = 'Report not found';
          break;
        case 500:
          errorMessage = 'Server error - please try again later';
          break;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 