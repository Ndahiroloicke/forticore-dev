# Supabase OTP Email Configuration Guide

To enable OTP (One-Time Password) codes instead of verification links in emails, you need to configure your Supabase project settings.

## Steps to Configure OTP in Supabase

### 1. Access Your Supabase Dashboard
Navigate to your Supabase project at [https://supabase.com/dashboard](https://supabase.com/dashboard)

### 2. Go to Authentication Settings
1. Click on **Authentication** in the left sidebar
2. Click on **Email Templates**

### 3. Modify the Confirm Signup Template
1. Find the **Confirm signup** template
2. Click on it to edit
3. You'll see the default template uses `{{ .ConfirmationURL }}`

### 4. Change to OTP Format
Replace the template content to use OTP instead of link. Here's a sample template:

```html
<h2>Confirm Your Email</h2>

<p>Thank you for signing up with FortiCore!</p>

<p>Your verification code is:</p>

<h1 style="font-size: 32px; letter-spacing: 8px; font-weight: bold; text-align: center; padding: 20px; background: #f3f4f6; border-radius: 8px;">
  {{ .Token }}
</h1>

<p>This code will expire in 24 hours.</p>

<p>If you didn't create an account with us, please ignore this email.</p>

<p>Thanks,<br>The FortiCore Team</p>
```

### 5. Update Email Settings (Alternative Method)

If you want to programmatically control this, you can also:

1. Go to **Authentication** → **Providers** → **Email**
2. Enable **Confirm email** toggle
3. Set **Mailer** to use OTP-based confirmation

### 6. Environment Variables

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 7. Test the Flow

1. Sign up with a new email
2. You should receive an email with an 8-digit OTP code
3. Enter the code on the verification page
4. Get redirected to the dashboard upon success

## Troubleshooting

### Still Receiving Links Instead of OTP?

If you're still receiving email verification links instead of OTP codes:

1. **Check Email Template**: Make sure you're using `{{ .Token }}` instead of `{{ .ConfirmationURL }}`
2. **Clear Cache**: Clear your browser cache and try again
3. **Supabase Plan**: Some features might require a paid Supabase plan
4. **Alternative**: You can also configure Supabase to disable email confirmation entirely in development

### Email Not Arriving?

1. Check your spam folder
2. Verify the email provider settings in Supabase
3. Check Supabase logs for any email sending errors
4. For development, consider using Supabase's built-in email catching feature

## Using Magic Links (Alternative)

If you prefer to use magic links instead of OTP:

1. Keep the default `{{ .ConfirmationURL }}` in the email template
2. Update the signup flow to use `emailRedirectTo: ${window.location.origin}/auth/callback`
3. Remove the OTP verification page from the flow
4. Users will click the link and be automatically signed in

## Important Notes

- The OTP token is typically 6 digits
- Tokens expire after 24 hours (configurable in Supabase settings)
- Rate limiting applies to prevent abuse (typically 60 seconds between resends)
- The verification must happen before the user can sign in

## References

- [Supabase Email Auth Documentation](https://supabase.com/docs/guides/auth/auth-email)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
