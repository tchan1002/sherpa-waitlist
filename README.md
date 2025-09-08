# Sherpa Waitlist

A single-page waitlist site for Sherpa, built with Next.js and integrated with Google Sheets for data collection.

## Features

- Responsive design with mobile-first approach
- Form validation and accessibility features
- Google Sheets integration for data collection
- SEO optimized with proper meta tags
- Clean, modern UI with generous whitespace

## Google Sheets Backend Setup

### 1. Create Google Sheet

Create a new Google Sheet with the following columns:
- **A1**: Timestamp
- **B1**: Email  
- **C1**: UserType
- **D1**: BusinessWebsite
- **E1**: UserAgent

### 2. Set up Google Apps Script

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Delete the default code and paste this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const body = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    body.email,
    body.user_type,
    body.business_website || "",
    e.postData.type
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### 3. Deploy the Script

1. Click **Deploy** → **New deployment**
2. Choose **Web app** as the type
3. Set **Execute as**: Me
4. Set **Who has access**: Anyone with the link
5. Click **Deploy**
6. Copy the web app URL

### 4. Configure Environment

1. Copy `env.example` to `.env.local`
2. Set your Google Apps Script URL:

```bash
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variable in Vercel dashboard
4. Deploy!

## Form Data Structure

The form submits the following JSON structure to your Google Sheets:

```json
{
  "email": "user@example.com",
  "user_type": "Personal" | "Enterprise", 
  "business_website": "https://company.com" // only for Enterprise
}
```

## Accessibility Features

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader announcements for status messages
- High contrast focus indicators
- Semantic HTML structure

## SEO Features

- Optimized meta tags and Open Graph data
- Canonical URL configuration
- Twitter Card support
- Structured data ready

## License

MIT
