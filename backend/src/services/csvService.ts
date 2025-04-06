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
                skip_records_with_error: true
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

    static async addBSECompany(company: BSECompany): Promise<void> {
        try {
            const csvLine = `\n${company.securityCode},"${company.issuerName}",${company.securityId},"${company.securityName}",${company.status},${company.group},${company.faceValue},${company.isinNumber},"${company.industry}",${company.instrument},"${company.sectorName}","${company.industryNewName}","${company.igroupName}","${company.isubgroupName}"`;
            fs.appendFileSync(this.CSV_FILE_PATH, csvLine);
        } catch (error) {
            console.error('Error adding company to CSV:', error);
            throw new Error('Failed to add company data');
        }
    }
}