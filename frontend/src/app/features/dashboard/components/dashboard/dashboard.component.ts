import { Component, OnInit } from '@angular/core';
import { DashboardService, Company, StatusStats } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    companies: Company[] = [];
    statusStats: StatusStats[] = [];
    selectedStatus: string = 'all';
    loading: boolean = true;
    error: string | null = null;
    readonly Object = Object;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.loadCompanies();
        this.loadStatusStats();
    }

    loadCompanies(): void {
        this.loading = true;
        this.error = null;

        if (this.selectedStatus === 'all') {
            this.dashboardService.getCompanies().subscribe({
                next: (companies: Company[]) => {
                    this.companies = companies;
                    this.loading = false;
                },
                error: (error: any) => {
                    this.error = 'Failed to load companies';
                    this.loading = false;
                    console.error('Error loading companies:', error);
                }
            });
        } else {
            this.dashboardService.getCompaniesByStatus(this.selectedStatus).subscribe({
                next: (response) => {
                    this.companies = response.companies;
                    this.loading = false;
                },
                error: (error: any) => {
                    this.error = 'Failed to load companies';
                    this.loading = false;
                    console.error('Error loading companies:', error);
                }
            });
        }
    }

    loadStatusStats(): void {
        this.dashboardService.getStatusStats().subscribe({
            next: (stats) => {
                this.statusStats = stats;
            },
            error: (error) => {
                console.error('Error loading status stats:', error);
            }
        });
    }

    onStatusChange(status: string): void {
        this.selectedStatus = status;
        this.loadCompanies();
    }
} 