import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardService, Company } from '../../services/dashboard.service';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  company: Company | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    const securityCode = this.route.snapshot.paramMap.get('code');
    if (securityCode) {
      this.loadCompanyDetails(securityCode);
    } else {
      this.error = 'No company code provided';
      this.loading = false;
    }
  }

  loadCompanyDetails(securityCode: string): void {
    this.dashboardService.getCompanies().subscribe({
      next: (companies) => {
        this.company = companies.find(c => c.securityCode === securityCode) || null;
        if (!this.company) {
          this.error = 'Company not found';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load company details';
        this.loading = false;
        console.error('Error loading company details:', err);
      }
    });
  }
}
