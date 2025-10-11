# Personal Portfolio Website

A clean and modern portfolio website built with Jekyll for GitHub Pages.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Layout**: Modern design with light background and blue accent color
- **Portfolio Focus**: Showcases projects and work effectively
- **Easy to Customize**: Simple structure with organized files
- **SEO Optimized**: Includes sitemap, robots.txt, structured data, and llm.txt
- **Analytics Ready**: Google Analytics 4 and Search Console integration built-in

## Pages

- **Home**: Welcome page with hero section and introduction
- **Portfolio**: Showcase of projects with grid layout
- **About**: Information about skills, experience, and approach
- **Blog**: Placeholder for future blog posts
- **Contact**: Contact form for getting in touch

## Local Development

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Run the Jekyll server:
   ```bash
   bundle exec jekyll serve
   ```

3. Open your browser and visit `http://localhost:4000`

## Deployment

This site is configured for GitHub Pages deployment. Simply push to the main branch, and GitHub Pages will automatically build and deploy your site.

## Structure

```
├── _includes/          # Reusable components (nav, footer)
├── _layouts/          # Page layouts (default)
├── _posts/            # Blog posts (Markdown files)
├── assets/
│   └── css/          # Stylesheets
├── _config.yml       # Site configuration
├── index.html        # Home page
├── portfolio.html    # Portfolio page
├── about.html        # About page
├── blog.html         # Blog page
└── contact.html      # Contact page
```

## Customization

- Edit `_config.yml` to update site title, description, and URL
- Modify `assets/css/custom.scss` to change colors and styles
- Update page content in the HTML files
- Add blog posts to `_posts/` directory using format: `YYYY-MM-DD-title.md`

## Analytics and SEO Setup

The site is ready for Google Analytics and Search Console integration. See [docs/analytics-seo-setup.md](docs/analytics-seo-setup.md) for detailed setup instructions.

**Quick setup**:
1. Get your Google Analytics 4 Measurement ID from https://analytics.google.com
2. Get your Google Search Console verification code from https://search.google.com/search-console
3. Add to `_config.yml`:
   ```yaml
   google_analytics_id: "G-XXXXXXXXXX"
   google_site_verification: "your_verification_code"
   ```

**What's included**:
- ✅ Google Analytics 4 integration
- ✅ Google Search Console verification
- ✅ robots.txt for search engine crawlers
- ✅ llm.txt for AI/LLM crawlers
- ✅ Automatic sitemap generation (jekyll-sitemap)
- ✅ SEO meta tags (jekyll-seo-tag)
- ✅ Structured data (JSON-LD Person schema)

## Contact Form

The contact form uses Formspree. To enable it:
1. Sign up at [Formspree](https://formspree.io)
2. Replace `YOUR_FORM_ID` in `contact.html` with your form ID

## License

All rights reserved.