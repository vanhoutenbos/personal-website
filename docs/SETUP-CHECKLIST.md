# Analytics Setup Checklist

Use this checklist to quickly set up Google Analytics and Search Console for your website.

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

### 2. Google Search Console Setup (5 minutes)

- [ ] Go to https://search.google.com/search-console
- [ ] Sign in with your Google account
- [ ] Click "Add Property"
- [ ] Choose "URL prefix" and enter: https://www.jeanpaulvanhouten.nl
- [ ] Choose verification method: **HTML tag**
- [ ] Copy ONLY the content value from the meta tag (the part between quotes after `content=`)
  - Example: If the tag is `<meta name="google-site-verification" content="abc123xyz" />`, copy only `abc123xyz`
- [ ] Add to `_config.yml`:
  ```yaml
  google_site_verification: "abc123xyz"
  ```

### 3. Deploy and Verify (5 minutes)

- [ ] Commit and push your changes:
  ```bash
  git add _config.yml
  git commit -m "Configure Google Analytics and Search Console"
  git push
  ```
- [ ] Wait 2-5 minutes for GitHub Pages to deploy
- [ ] Verify Google Search Console:
  - Return to Search Console
  - Click "Verify" button
  - Should show success ✅
- [ ] Submit sitemap in Search Console:
  - In Search Console, go to "Sitemaps" section
  - Add sitemap URL: `https://www.jeanpaulvanhouten.nl/sitemap.xml`
  - Click "Submit"
- [ ] Test Google Analytics:
  - Visit your website
  - Go to Google Analytics → Reports → Realtime
  - Should see yourself as a visitor within 1-2 minutes

### 4. Verify Everything Works

- [ ] Visit https://www.jeanpaulvanhouten.nl/robots.txt
  - Should display robots.txt content
- [ ] Visit https://www.jeanpaulvanhouten.nl/llm.txt
  - Should display structured information
- [ ] Visit https://www.jeanpaulvanhouten.nl/sitemap.xml
  - Should display XML sitemap
- [ ] Check page source for analytics:
  - View source of any page
  - Search for "gtag" - should find Google Analytics code
  - Search for "google-site-verification" - should find meta tag
- [ ] Check Google Analytics Real-time report
  - Should show visitors when you browse the site

## 📊 Post-Setup (Optional)

### Google Analytics Configuration
- [ ] Set up goals/conversions (e.g., contact form submissions)
- [ ] Configure enhanced measurement events
- [ ] Set up custom reports
- [ ] Link to Google Ads (if applicable)

### Google Search Console Monitoring  
- [ ] Check indexing status weekly
- [ ] Monitor "Performance" tab for search metrics
- [ ] Review "Coverage" for any crawl errors
- [ ] Check "Enhancements" for structured data issues

### Privacy & Compliance
- [ ] Consider adding a privacy policy page
- [ ] Consider adding a cookie consent banner (if needed for GDPR)
- [ ] Review data retention settings in Google Analytics

## 📚 Resources

- Setup guide: `docs/analytics-seo-setup.md`
- Config example: `docs/config-example.yml`
- Google Analytics Help: https://support.google.com/analytics
- Google Search Console Help: https://support.google.com/webmasters

## ❓ Troubleshooting

**Analytics not showing in real-time?**
- Check that `google_analytics_id` is correctly formatted in `_config.yml`
- Ensure site has been deployed after config changes
- Try in incognito/private browsing mode
- Check browser console for JavaScript errors

**Search Console verification failing?**
- Ensure you copied only the content value (not the entire meta tag)
- Check that `google_site_verification` has no extra spaces or quotes
- Wait a few minutes after deployment and try again
- View page source to confirm meta tag is present

**Sitemap not found?**
- Ensure `jekyll-sitemap` is in your Gemfile
- Check that it's listed in `plugins:` section of `_config.yml`
- Site must be deployed for sitemap to generate

Need more help? Check the detailed documentation in `docs/analytics-seo-setup.md`
