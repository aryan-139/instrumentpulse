import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Company {
    securityCode: string;
    issuerName: string;
    securityId: string;
    securityName: string;
    status: string;
    group: string;
    faceValue: number;
    isinNumber: string;
    industry: string;
    instrument: string;
    sectorName: string;
    industryNewName: string;
    igroupName: string;
    isubgroupName: string;
}

export interface StatusStats {
    status: string;
    count: number;
    percentage: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }

    // Get all companies
    getCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.apiUrl}/api/bse/companies`);
    }

    // Get companies by status
    getCompaniesByStatus(status: string): Observable<{ status: string; count: number; companies: Company[] }> {
        return this.http.get<{ status: string; count: number; companies: Company[] }>(
            `${this.apiUrl}/api/bse/companies/status/${status}`
        );
    }

    // Get status statistics
    getStatusStats(): Observable<StatusStats[]> {
        return this.http.get<StatusStats[]>(`${this.apiUrl}/api/bse/status-stats`);
    }

    // Add a new company
    addCompany(company: Company): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/api/bse/companies`, company);
    }
} 