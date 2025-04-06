import { Component, OnInit } from '@angular/core';
import { DashboardService, Company, StatusStats } from '../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';

type SearchMode = 'partial' | 'exact' | 'startsWith' | 'endsWith' | 'regex' | 'smart';

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
    searchMode: SearchMode = 'partial';
    searchModes: { value: SearchMode; label: string }[] = [
        { value: 'partial', label: 'Contains' },
        { value: 'exact', label: 'Exact Match' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' },
        { value: 'regex', label: 'Regex' },
        { value: 'smart', label: 'Smart' }
    ];
    private searchSubject = new Subject<string>();
    readonly Object = Object;

    constructor(
        private dashboardService: DashboardService,
        private router: Router
    ) {
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

    onSearchModeChange(): void {
        this.filterCompanies(this.searchTerm);
    }

    filterCompanies(searchTerm: string): void {
        if (!searchTerm) {
            this.filteredCompanies = this.companies;
            return;
        }

        const term = searchTerm.toLowerCase();
        this.filteredCompanies = this.companies.filter(company => {
            const fields = [
                company.securityName,
                company.securityCode,
                company.isinNumber,
                company.industry,
                company.sectorName
            ].map(f => f.toLowerCase());

            return fields.some(field => {
                switch (this.searchMode) {
                    case 'partial':
                        return field.includes(term);
                    case 'exact':
                        return field === term;
                    case 'startsWith':
                        return field.startsWith(term);
                    case 'endsWith':
                        return field.endsWith(term);
                    case 'regex':
                        try {
                            const regex = new RegExp(term, 'i');
                            return regex.test(field);
                        } catch (e) {
                            return false;
                        }
                    default:
                        return false;
                }
            });
        });
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

    getSearchPlaceholder(): string {
        switch (this.searchMode) {
            case 'partial':
                return 'Search by name, code, ISIN, industry or sector...';
            case 'exact':
                return 'Enter exact text to match...';
            case 'startsWith':
                return 'Enter text to match at the start...';
            case 'endsWith':
                return 'Enter text to match at the end...';
            case 'regex':
                return 'Enter regular expression pattern...';
            default:
                return 'Search...';
        }
    }

    getSearchModeIcon(): string {
        switch (this.searchMode) {
            case 'partial':
                return '⊂';
            case 'exact':
                return '=';
            case 'startsWith':
                return '^';
            case 'endsWith':
                return '$';
            case 'regex':
                return '.*';
            case 'smart':
                return 'smart'
            default:
                return '?';
        }
    }

    onCompanyClick(company: Company): void {
        this.router.navigate(['/company', company.securityCode]);
    }
} 