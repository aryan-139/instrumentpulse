import { Component, OnInit } from '@angular/core';
import { DashboardService, Company, StatusStats } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    companies: Company[] = [];
    filteredCompanies: Company[] = [];
    statusStats: StatusStats[] = [];
    selectedStatus: string = 'all';
    loading: boolean = true;
    error: string | null = null;
    searchTerm: string = '';
    private searchSubject = new Subject<string>();
    readonly Object = Object;

    constructor(private dashboardService: DashboardService) {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(searchTerm => {
            this.filterCompanies(searchTerm);
        });
    }

    ngOnInit(): void {
        this.loadCompanies();
        this.loadStatusStats();
    }

    onSearchInput(): void {
        this.searchSubject.next(this.searchTerm);
    }

    filterCompanies(searchTerm: string): void {
        if (!searchTerm) {
            this.filteredCompanies = this.companies;
            return;
        }

        const term = searchTerm.toLowerCase();
        this.filteredCompanies = this.companies.filter(company =>
            company.securityName.toLowerCase().includes(term) ||
            company.securityCode.toLowerCase().includes(term) ||
            company.isinNumber.toLowerCase().includes(term) ||
            company.industry.toLowerCase().includes(term) ||
            company.sectorName.toLowerCase().includes(term)
        );
    }

    loadCompanies(): void {
        this.loading = true;
        this.error = null;

        if (this.selectedStatus === 'all') {
            this.dashboardService.getCompanies().subscribe({
                next: (companies: Company[]) => {
                    this.companies = companies;
                    this.filteredCompanies = companies;
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
                    this.filteredCompanies = response.companies;
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
        this.searchTerm = ''; // Reset search when changing status
        this.loadCompanies();
    }
} 