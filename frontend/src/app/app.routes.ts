import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { CompanyDetailsComponent } from './features/dashboard/components/company-details/company-details.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'company/:code', component: CompanyDetailsComponent }
];
