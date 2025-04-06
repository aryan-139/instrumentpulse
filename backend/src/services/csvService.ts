import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

interface BSECompany {
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

interface StatusStats {
    status: string;
    count: number;
    percentage: number;
}

export class CSVService {
    private static readonly CSV_FILE_PATH = path.join(__dirname, '../data/bse_companies.csv');

    static async getBSECompanies(): Promise<BSECompany[]> {
        try {
            const fileContent = fs.readFileSync(this.CSV_FILE_PATH, 'utf-8');
            const records = parse(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                relax_quotes: true,
                relax_column_count: true,
                skip_records_with_error: true,
                escape: '\\'
            });

            return records.map((record: any) => ({
                securityCode: record['Security Code'],
                issuerName: record['Issuer Name'],
                securityId: record['Security Id'],
                securityName: record['Security Name'],
                status: record['Status'],
                group: record['Group'],
                faceValue: parseFloat(record['Face Value']),
                isinNumber: record['ISIN No'],
                industry: record['Industry'],
                instrument: record['Instrument'],
                sectorName: record['Sector Name'],
                industryNewName: record['Industry New Name'],
                igroupName: record['Igroup Name'],
                isubgroupName: record['ISubgroup Name']
            }));
        } catch (error) {
            console.error('Error reading CSV file:', error);
            throw new Error('Failed to read BSE companies data');
        }
    }

    static async getCompaniesByStatus(status: string): Promise<BSECompany[]> {
        try {
            const companies = await this.getBSECompanies();
            return companies.filter(company =>
                company.status.toLowerCase() === status.toLowerCase()
            );
        } catch (error) {
            console.error('Error filtering companies by status:', error);
            throw new Error('Failed to filter companies by status');
        }
    }

    static async getStatusStatistics(): Promise<StatusStats[]> {
        try {
            const companies = await this.getBSECompanies();
            const statusMap = new Map<string, number>();
            const totalCompanies = companies.length;

            // Count companies by status
            companies.forEach(company => {
                const status = company.status || 'Unknown';
                statusMap.set(status, (statusMap.get(status) || 0) + 1);
            });

            // Convert to array and calculate percentages
            return Array.from(statusMap.entries())
                .map(([status, count]) => ({
                    status,
                    count,
                    percentage: Number(((count / totalCompanies) * 100).toFixed(2))
                }))
                .sort((a, b) => b.count - a.count);
        } catch (error) {
            console.error('Error getting status statistics:', error);
            throw new Error('Failed to get status statistics');
        }
    }

    static async addBSECompany(company: BSECompany): Promise<void> {
        try {
            const csvLine = `\n${company.securityCode},"${company.issuerName}",${company.securityId},"${company.securityName}",${company.status},${company.group},${company.faceValue},${company.isinNumber},"${company.industry}",${company.instrument},"${company.sectorName}","${company.industryNewName}","${company.igroupName}","${company.isubgroupName}"`;
            fs.appendFileSync(this.CSV_FILE_PATH, csvLine);
        } catch (error) {
            console.error('Error adding company to CSV:', error);
            throw new Error('Failed to add company data');
        }
    }

    static async getCompanyBySecurityCode(securityCode: string): Promise<BSECompany | null> {
        try {
            const companies = await this.getBSECompanies();
            const company = companies.find(company =>
                company.securityCode === securityCode
            );
            return company || null;
        } catch (error) {
            console.error('Error finding company by security code:', error);
            throw new Error('Failed to find company by security code');
        }
    }
}