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