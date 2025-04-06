import express from 'express';
import { CSVService } from '../services/csvService';

const router = express.Router();

// Get all BSE companies from CSV
router.get('/companies', async (req, res) => {
    try {
        const companies = await CSVService.getBSECompanies();
        res.json(companies);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch BSE companies',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get companies by status
router.get('/companies/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const companies = await CSVService.getCompaniesByStatus(status);

        if (companies.length === 0) {
            return res.status(404).json({
                error: 'No companies found',
                message: `No companies found with status: ${status}`
            });
        }

        res.json({
            status,
            count: companies.length,
            companies
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch companies by status',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get status statistics
router.get('/status-stats', async (req, res) => {
    try {
        const stats = await CSVService.getStatusStatistics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch status statistics',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Add a new BSE company to CSV
router.post('/companies', async (req, res) => {
    try {
        const company = req.body;
        await CSVService.addBSECompany(company);
        res.status(201).json({ message: 'Company added successfully' });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to add company',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 