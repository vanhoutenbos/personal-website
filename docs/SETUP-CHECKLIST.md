# Analytics Setup Checklist

Use this checklist to quickly set up Google Analytics for your website.

## ✅ Pre-Setup (Already Done)
- [x] robots.txt created
- [x] llm.txt created  
- [x] Analytics include file created
- [x] Default layout updated to include analytics
- [x] Documentation written

## 🔧 Your Setup Tasks

### 1. Google Analytics 4 Setup (5 minutes)

- [ ] Go to https://analytics.google.com
- [ ] Sign in with your Google account
- [ ] Click "Start measuring" (or "Admin" if you already have properties)
- [ ] Create a new GA4 property:
  - Property name: "Jean-Paul van Houten Portfolio" (or your preference)
  - Time zone: Select your time zone
  - Currency: Select your currency
- [ ] Set up a data stream:
  - Platform: Web
  - Website URL: https://www.jeanpaulvanhouten.nl
  - Stream name: "Website traffic" (or your preference)
- [ ] Copy your **Measurement ID** (format: G-XXXXXXXXXX)
- [ ] Add to `_config.yml`:
  ```yaml
  google_analytics_id: "G-XXXXXXXXXX"
  ```

### 2. Deploy and Verify (5 minutes)

- [ ] Commit and push your changes:
  ```bash
  git add _config.yml
  git commit -m "Configure Google Analytics"
  git push
  ```
- [ ] Wait 2-5 minutes for GitHub Pages to deploy
- [ ] Test Google Analytics:
  - Visit your website
  - Go to Google Analytics → Reports → Realtime
  - Should see yourself as a visitor within 1-2 minutes

### 3. Verify Everything Works

- [ ] Visit https://www.jeanpaulvanhouten.nl/robots.txt
  - Should display robots.txt content
- [ ] Visit https://www.jeanpaulvanhouten.nl/llm.txt
  - Should display structured information
- [ ] Visit https://www.jeanpaulvanhouten.nl/sitemap.xml
  - Should display XML sitemap
- [ ] Check page source for analytics:
  - View source of any page
  - Search for "gtag" - should find Google Analytics code
- [ ] Check Google Analytics Real-time report
  - Should show visitors when you browse the site

## 📊 Post-Setup (Optional)

### Google Analytics Configuration
- [ ] Set up goals/conversions (e.g., contact form submissions)
- [ ] Configure enhanced measurement events
- [ ] Set up custom reports
- [ ] Link to Google Ads (if applicable)

### Privacy & Compliance
- [ ] Consider adding a privacy policy page
- [ ] Consider adding a cookie consent banner (if needed for GDPR)
- [ ] Review data retention settings in Google Analytics

## 📚 Resources

- Setup guide: `docs/analytics-seo-setup.md`
- Config example: `docs/config-example.yml`
- Google Analytics Help: https://support.google.com/analytics

## ❓ Troubleshooting

**Analytics not showing in real-time?**
- Check that `google_analytics_id` is correctly formatted in `_config.yml`
- Ensure site has been deployed after config changes
- Try in incognito/private browsing mode
- Check browser console for JavaScript errors

**Sitemap not found?**
- Ensure `jekyll-sitemap` is in your Gemfile
- Check that it's listed in `plugins:` section of `_config.yml`
- Site must be deployed for sitemap to generate

Need more help? Check the detailed documentation in `docs/analytics-seo-setup.md`
