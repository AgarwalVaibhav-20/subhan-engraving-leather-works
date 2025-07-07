import {
  Html,
  Head,
  Preview,
  Font,
  Container,
  Img,
  Text,
  Heading,
  Section,
  Row,
} from '@react-email/components';
import * as React from 'react';

type VerificationEmailProps = {
  fullname: string;
  otp: string;
};

export function VerificationEmail({ fullname, otp }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>Verify Your Email - Subhan Engraving Leather Works</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your OTP to verify your email with Subhan Engraving Leather Works</Preview>

      <Section style={{ backgroundColor: '#f9fafb', padding: '50px 0' }}>
        <Container
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '48px',
            maxWidth: '640px',
            margin: '0 auto',
            fontFamily: 'Roboto, sans-serif',
            boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
            border: '1px solid #e9ecef',
          }}
        >
          <Row style={{ justifyContent: 'center', marginBottom: '32px' }}>
            <Img
              src="https://yourdomain.com/logo.png" // Replace with actual image URL
              alt="Subhan Engraving Logo"
              width="72"
              height="72"
              style={{ borderRadius: '12px', display: 'block' }}
            />
          </Row>

          <Heading
            as="h2"
            style={{
              fontSize: '24px',
              textAlign: 'center',
              color: '#1a1a1a',
              marginBottom: '12px',
              fontWeight: '600',
            }}
          >
            Email Verification Required
          </Heading>

          <Text
            style={{
              textAlign: 'center',
              fontSize: '16px',
              color: '#444',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}
          >
            Hi <strong>{fullname}</strong>, <br />
            To continue using <strong>Subhan Engraving Leather Works</strong>, please verify your email address using the OTP code below.
          </Text>

          <Row style={{ justifyContent: 'center', margin: '32px 0' }}>
            <Text
              style={{
                backgroundColor: '#edf2f7',
                padding: '18px 40px',
                borderRadius: '10px',
                fontSize: '38px',
                fontWeight: '700',
                letterSpacing: '8px',
                textAlign: 'center',
                color: '#1a202c',
              }}
            >
              {otp}
            </Text>
          </Row>

          <Text
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px',
            }}
          >
            This code is valid for <strong>5 minutes</strong>.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: '#888',
            }}
          >
            If you did not request this, you can safely ignore this email.
          </Text>

          <Text
            style={{
              fontSize: '12px',
              color: '#adb5bd',
              textAlign: 'center',
              marginTop: '48px',
              borderTop: '1px solid #dee2e6',
              paddingTop: '20px',
              lineHeight: '1.5',
            }}
          >
            &copy; {new Date().getFullYear()} Subhan Engraving Leather Works<br />
            Precision. Craftsmanship. Leather that speaks quality.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
