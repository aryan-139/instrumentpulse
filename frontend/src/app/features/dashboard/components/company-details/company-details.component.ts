import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
export class CompanyDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  company: Company | null = null;
  loading = true;
  error: string | null = null;
  private tradingViewScript: HTMLScriptElement | null = null;

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

  ngAfterViewInit(): void {
    this.initializeTradingViewWidget();
  }

  ngOnDestroy(): void {
    if (this.tradingViewScript) {
      document.body.removeChild(this.tradingViewScript);
    }
  }

  private initializeTradingViewWidget(): void {
    if (this.tradingViewScript) {
      document.body.removeChild(this.tradingViewScript);
    }

    this.tradingViewScript = document.createElement('script');
    this.tradingViewScript.src = 'https://s3.tradingview.com/tv.js';
    this.tradingViewScript.async = true;
    this.tradingViewScript.onload = () => {
      if (this.company) {
        this.createTradingViewWidget();
      }
    };
    document.body.appendChild(this.tradingViewScript);
  }

  private createTradingViewWidget(): void {
    if (!this.company) return;

    const widgetConfig = {
      autosize: true,
      symbol: `BSE:${this.company.securityId}`,
      interval: 'D',
      timezone: "Asia/Kolkata",
      theme: 'light',
      style: '3',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      details: true,
      container_id: 'tradingview_widget',
      withdateranges: true,
    };

    new (window as any).TradingView.widget(widgetConfig);
  }

  loadCompanyDetails(securityCode: string): void {
    this.dashboardService.getCompanyBySecurityCode(securityCode).subscribe({
      next: (company) => {
        this.company = company;
        this.loading = false;
        this.initializeTradingViewWidget();
      },
      error: (err) => {
        this.error = 'Failed to load company details';
        this.loading = false;
        console.error('Error loading company details:', err);
      }
    });
  }
}
