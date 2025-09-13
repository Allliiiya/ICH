# Vercel 307 Redirect Troubleshooting

## Domain: icheritagecn.com

### Common Causes of 307 Redirects on Vercel:

1. **Domain not properly configured in Vercel dashboard**
2. **DNS settings pointing to wrong endpoint**
3. **HTTPS redirect loop**
4. **Conflicting routing configuration**

### Step-by-Step Fix:

#### 1. Check Vercel Dashboard
- Go to your project on Vercel dashboard
- Navigate to Settings → Domains
- Ensure `icheritagecn.com` is added as a domain
- Check that DNS configuration shows "Valid Configuration"

#### 2. DNS Configuration
Your DNS should point to:
- **A Record**: `76.76.19.61` (or current Vercel IP)
- **CNAME**: `cname.vercel-dns.com`

#### 3. Force HTTPS Settings
In Vercel dashboard:
- Go to Settings → Domains
- Click on your domain
- Ensure "Redirect to HTTPS" is enabled
- Check "Include subdomains" if needed

#### 4. Deployment Settings
Verify in Vercel dashboard → Settings → Git:
- Production Branch: `main`
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

#### 5. Environment Variables (if needed)
Add these in Vercel dashboard → Settings → Environment Variables:
```
VITE_NODE_ENV=production
```

### Quick Fixes to Try:

1. **Re-deploy**: Force a new deployment from Vercel dashboard
2. **Clear DNS cache**: Wait 24-48 hours for DNS propagation
3. **Try www subdomain**: Add `www.icheritagecn.com` and test
4. **Check browser console**: Look for specific error messages

### Test Commands:
```bash
# Check DNS resolution
nslookup icheritagecn.com

# Check HTTP headers
curl -I https://icheritagecn.com

# Test with curl
curl -v https://icheritagecn.com
```

### Contact Points:
- Vercel Support: https://vercel.com/support
- Check Vercel Status: https://vercel-status.com
- DNS Propagation Checker: https://dnschecker.org