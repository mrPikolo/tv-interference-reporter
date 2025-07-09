import { Routes } from '@angular/router';
import { ReportListComponent } from './components/report-list/report-list.component';
import { ReportFormComponent } from './components/report-form/report-form.component';

export const routes: Routes = [
  { path: '', component: ReportListComponent },
  { path: 'report/new', component: ReportFormComponent },
  { path: '**', redirectTo: '' }
];
