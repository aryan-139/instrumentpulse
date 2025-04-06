import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, Company } from '../../services/dashboard.service';

@Component({
    selector: 'app-company-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './company-search.component.html',
    styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent {
    securityCode: string = '';
    company: Company | null = null;
    error: string | null = null;
    loading: boolean = false;

    constructor(private dashboardService: DashboardService) { }

    searchCompany() {
        if (!this.securityCode) {
            this.error = 'Please enter a security code';
            return;
        }

        this.loading = true;
        this.error = null;
        this.company = null;

        this.dashboardService.getCompanyBySecurityCode(this.securityCode)
            .subscribe({
                next: (company) => {
                    this.company = company;
                    this.loading = false;
                },
                error: (err) => {
                    this.error = err.error?.message || 'Failed to fetch company details';
                    this.loading = false;
                }
            });
    }
} 