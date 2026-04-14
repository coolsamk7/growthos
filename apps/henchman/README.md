# Henchman - Email Worker Service

Henchman is a Kafka consumer service that handles email notifications for Growthos.

## Features

- 📧 Welcome emails for new user signups
- 🔐 OTP/verification code emails
- 🎨 Beautiful HTML email templates
- ⚡ Kafka-based event processing
- 🔧 Configurable SMTP settings

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure your SMTP settings:

```bash
cp .env.example .env
```

### 3. SMTP Configuration

#### Gmail Setup (Recommended for Development)

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable **2-Step Verification** (Security section)
3. Generate an **App Password**:
   - Go to Security > 2-Step Verification > App passwords
   - Select "Mail" and "Other" (name it "Growthos")
   - Copy the 16-character password
4. Update your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

#### Other SMTP Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
```

### 4. Start Kafka (if not running)

```bash
# Using Docker
docker run -d -p 9092:9092 apache/kafka:latest
```

### 5. Run the Service

```bash
# Development mode
yarn dev

# Production mode
yarn build
yarn prod
```

## Usage

### Sending Welcome Email

Produce a message to the `mail` Kafka topic:

```json
{
  "type": "signup_welcome",
  "email": "user@example.com",
  "firstName": "John"
}
```

### Sending OTP Email

Produce a message to the `mail` Kafka topic:

```json
{
  "type": "send_otp",
  "email": "user@example.com",
  "code": "123456"
}
```

## Testing

You can test email functionality using a tool like [Mailtrap](https://mailtrap.io/) or [MailHog](https://github.com/mailhog/MailHog) for local development:

### MailHog (Local Testing)

```bash
# Run MailHog
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Update .env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=

# View emails at http://localhost:8025
```

## Architecture

```
API Service → Kafka Topic (mail) → Henchman Consumer → SMTP Server → User Email
```

## Email Templates

The service includes professionally designed HTML email templates:

- **Welcome Email**: Sent when a user signs up
- **OTP Email**: Sent for account verification

Templates are responsive and include:
- Modern, clean design
- Growthos branding
- Clear call-to-action buttons
- Mobile-friendly layout

## Troubleshooting

### Emails not sending

1. Check SMTP credentials in `.env`
2. Verify SMTP server allows connections from your IP
3. Check logs for error messages: `yarn dev`
4. Test SMTP connection separately

### Gmail "Less secure app" error

Gmail requires App Passwords instead of your regular password. Follow the Gmail setup instructions above.

### Port 587 blocked

Some networks block port 587. Try:
- Port 465 with `SMTP_SECURE=true`
- Port 25 (usually blocked by ISPs)
- Use a different network/VPN

## Development

### Adding New Email Types

1. Add a new event type in `mail.consumer.ts`:
```typescript
case 'new_event_type':
    await this.mailService.sendNewEmail(event.email, event.data);
    break;
```

2. Add the email method in `mail.service.ts`:
```typescript
async sendNewEmail(email: string, data: any) {
    // Implementation
}
```

3. Create a template method:
```typescript
private getNewEmailTemplate(data: any): string {
    const content = `...`;
    return this.getEmailBaseTemplate(content);
}
```

## License

UNLICENSED
