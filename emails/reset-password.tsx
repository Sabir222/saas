import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Heading,
  Img,
  Hr,
} from "@react-email/components"
import * as React from "react"

interface ResetPasswordProps {
  resetUrl: string
  userName?: string
}

export function ResetPassword({ resetUrl, userName }: ResetPasswordProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://resend.com/logo.png"
              width="40"
              height="40"
              alt="Logo"
              style={logo}
            />
          </Section>

          <Heading style={h1}>Reset your password</Heading>

          <Text style={text}>Hi{userName ? ` ${userName}` : ""},</Text>

          <Text style={text}>
            We received a request to reset your password. Click the button below
            to create a new password:
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href={resetUrl}>
              Reset password
            </Button>
          </Section>

          <Text style={text}>Or copy and paste this link in your browser:</Text>
          <Text style={link}>{resetUrl}</Text>

          <Hr style={hr} />

          <Text style={footer}>
            This link will expire in 1 hour. If you didn't request a password
            reset, you can safely ignore this email.
          </Text>

          <Text style={footer}>© 2026 SaaS. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  )
}

ResetPassword.PreviewProps = {
  resetUrl: "https://example.com/reset-password?token=abc123",
  userName: "John",
} as const

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
}

const logoSection = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "32px",
}

const logo = {
  borderRadius: "8px",
}

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 24px",
  padding: "0 24px",
}

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
  padding: "0 24px",
}

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
  padding: "0 24px",
}

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 24px",
}

const link = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 24px",
  padding: "0 24px",
  wordBreak: "break-all" as const,
}

const hr = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "24px 24px",
}

const footer = {
  color: "#9ca3af",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 8px",
  padding: "0 24px",
  textAlign: "center" as const,
}
