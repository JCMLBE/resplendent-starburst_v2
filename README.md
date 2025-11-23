<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10RkPqBTxkK5WXAwk7NtbgSaNowXPLS3e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Admin Panel

An admin panel is available at `/orbadmin-ai` for managing the AI's knowledge base and system instructions.

### Setup

To enable the admin panel, you need to set an `ADMIN_PASSWORD` environment variable:

**For local development:**
Add to your `.env.local` file:
```
ADMIN_PASSWORD=your_secure_password_here
```

**For Netlify production:**
1. Go to your site's settings in Netlify
2. Navigate to "Environment variables"
3. Add a new variable:
   - Key: `ADMIN_PASSWORD`
   - Value: Your secure password
4. Redeploy your site

### Features

- **Knowledge Base Management**: Edit the AI's knowledge base content
- **System Instructions Management**: Modify how the AI behaves and responds
- **Password Protected**: Secure access with environment variable-based authentication
- **Persistent Storage**: Changes are stored using Netlify Blobs and persist across deploys
