# India Quick Commerce Intelligence Dashboard

Research-driven dashboard monitoring Blinkit (Zomato), Swiggy Instamart, and Zepto across Mumbai, Delhi NCR, and Bangalore.

## Features

- **Executive KPIs**: MAU, DAU, engagement metrics
- **Growth vs Decline Drivers**: Industry-level signals
- **Consumer Intelligence**: Review scraping, sentiment analysis, complaint themes
- **Merchant Intelligence**: Commission pressure, payout confidence, pain points
- **Driver Intelligence**: Earnings stability, incentive volatility, work conditions
- **Company Comparison**: Side-by-side matrix across all three platforms
- **Risk Signals**: Early warning system for operational/regulatory deterioration
- **Market Events**: Regulatory, competitive, labor, and narrative timeline
- **Methodology**: Data sources, update frequency, confidence levels

## Structure

## Deployment

### GitHub Pages
1. Push all files to GitHub repository
2. Go to Settings → Pages
3. Select branch `main` and folder `/` (root)
4. Save and wait for deployment

### Vercel
1. Push to GitHub
2. Import repository in Vercel
3. Deploy (no build configuration needed)

## Auto-Update

The dashboard auto-refreshes every 5 minutes by fetching `data/dashboard.json`.

To enable true auto-update:
1. Use GitHub Actions to regenerate `dashboard.json` daily/hourly
2. Or use Vercel serverless functions to pull fresh data
3. Or manually update `dashboard.json` and push to GitHub

## Data Integrity

- **Risk count**: Auto-calculated from `risk_signals.items` array
- **All counts**: Derived from actual data, not hardcoded
- **Sentiment**: Aggregated from review scraping
- **Company comparison**: Updated weekly

## License

Research use only.
