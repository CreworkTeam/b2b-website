import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

type SendReportEmailParams = {
  to: string
  ideaSummary: string
  archetype: string
  reportUrl: string
}

export async function sendReportEmail({
  to,
  ideaSummary,
  archetype,
  reportUrl,
}: SendReportEmailParams) {
  const archetypeLabel: Record<string, string> = {
    saas_tool: 'SaaS Tool',
    marketplace: 'Marketplace',
    consumer_app: 'Consumer App',
    ai_wrapper: 'AI-Powered Tool',
    b2b_platform: 'B2B Platform',
    community: 'Community Platform',
    ecommerce: 'E-Commerce',
    developer_tool: 'Developer Tool',
  }

  const label = archetypeLabel[archetype] ?? 'Startup'

  const mailOptions = {
    from: `"Founder OS" <${process.env.EMAIL_USER}>`,
    to,
    bcc: process.env.COMPANY_EMAIL || 'creworkgroup@gmail.com',
    subject: `Your ${label} founder report is ready`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:8px;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:32px 40px 24px;border-bottom:1px solid #222222;">
                      <p style="margin:0;font-size:13px;color:#666666;letter-spacing:0.1em;text-transform:uppercase;">Crework Labs</p>
                      <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;">Founder OS</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px 40px;">
                      <p style="margin:0 0 16px;font-size:15px;color:#aaaaaa;line-height:1.6;">
                        Your report is ready. Here's a quick summary of what we found for your idea:
                      </p>

                      <!-- Idea pill -->
                      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;padding:16px 20px;margin:0 0 24px;">
                        <p style="margin:0 0 4px;font-size:11px;color:#555555;text-transform:uppercase;letter-spacing:0.08em;">Your idea</p>
                        <p style="margin:0;font-size:14px;color:#dddddd;line-height:1.5;">${ideaSummary}</p>
                      </div>

                      <!-- What's inside -->
                      <p style="margin:0 0 12px;font-size:13px;font-weight:500;color:#ffffff;">Your report includes:</p>
                      <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 28px;">
                        <tr>
                          <td style="padding:8px 0;border-bottom:1px solid #1e1e1e;">
                            <span style="font-size:13px;color:#aaaaaa;">A &nbsp;&nbsp;</span>
                            <span style="font-size:13px;color:#dddddd;">Idea Validator — demand signals, communities, competitor gaps</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;border-bottom:1px solid #1e1e1e;">
                            <span style="font-size:13px;color:#aaaaaa;">B &nbsp;&nbsp;</span>
                            <span style="font-size:13px;color:#dddddd;">MVP Scope Builder — what to build, what to skip, complexity score</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;">
                            <span style="font-size:13px;color:#aaaaaa;">C &nbsp;&nbsp;</span>
                            <span style="font-size:13px;color:#dddddd;">Build Readiness Audit — spec check, team fit, 3-week roadmap</span>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background:#ffffff;border-radius:6px;">
                            <a href="${reportUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:500;color:#000000;text-decoration:none;letter-spacing:-0.01em;">
                              View your full report →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #1e1e1e;">
                      <p style="margin:0;font-size:12px;color:#444444;line-height:1.6;">
                        Sent by <a href="https://creworklabs.com" style="color:#666666;text-decoration:none;">Crework Labs</a> · 
                        We build MVPs for non-technical founders ·
                        <a href="https://creworklabs.com" style="color:#666666;text-decoration:none;">Unsubscribe</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}

type SendFullReportEmailParams = {
  to: string
  ideaSummary: string
  archetype: string
  reports: {
    A: any
    B: any
    C: any
  }
}

export async function sendFullReportEmail({
  to,
  ideaSummary,
  archetype,
  reports,
}: SendFullReportEmailParams) {
  const archetypeLabel: Record<string, string> = {
    saas_tool: 'SaaS Tool',
    marketplace: 'Marketplace',
    consumer_app: 'Consumer App',
    ai_wrapper: 'AI-Powered Tool',
    b2b_platform: 'B2B Platform',
    community: 'Community Platform',
    ecommerce: 'E-Commerce',
    developer_tool: 'Developer Tool',
  }

  const label = archetypeLabel[archetype] ?? 'Startup'
  
  // Extract data safely
  const reportA = reports?.A || {}
  const reportB = reports?.B || {}
  const reportC = reports?.C || {}

  const buildNow = reportB?.coreFeatures?.map((f: any) => f.name) || ['Core user action', 'Basic onboarding']
  const skip = reportB?.skipFeatures?.map((f: any) => f.name) || ['AI matching', 'Subscription tiers']

  const weeks = reportC?.roadmap || [
    { week: 1, title: 'Core Mechanics', objective: 'Build the primary action' },
    { week: 2, title: 'Data & State', objective: 'Connect the backend' },
    { week: 3, title: 'Polish & Launch', objective: 'Refine UI and deploy' },
  ]

  const mailOptions = {
    from: `"Founder OS" <${process.env.EMAIL_USER}>`,
    to,
    bcc: process.env.COMPANY_EMAIL || 'creworkgroup@gmail.com',
    subject: `Your ${label} founder report is ready`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;border-radius:8px;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:32px 40px 24px;border-bottom:1px solid #222222;">
                      <p style="margin:0;font-size:13px;color:#666666;letter-spacing:0.1em;text-transform:uppercase;">Crework Labs</p>
                      <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;">Founder OS</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:32px 40px;">
                      <p style="margin:0 0 16px;font-size:15px;color:#aaaaaa;line-height:1.6;">
                        Your full report is here. We analyzed your idea across demand signals, MVP scope, and technical readiness:
                      </p>

                      <!-- Idea pill -->
                      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;padding:16px 20px;margin:0 0 32px;">
                        <p style="margin:0 0 4px;font-size:11px;color:#555555;text-transform:uppercase;letter-spacing:0.08em;">Your idea</p>
                        <p style="margin:0;font-size:14px;color:#dddddd;line-height:1.5;">${ideaSummary}</p>
                      </div>

                      <!-- Validation Scores -->
                      <p style="margin:0 0 16px;font-size:11px;color:#555555;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #222;padding-bottom:8px;">A. Validation & Demand</p>
                      <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 32px;">
                        <tr>
                          <td style="padding:8px 0;width:50%;">
                            <span style="font-size:13px;color:#aaaaaa;">Validation Score</span>
                          </td>
                          <td style="padding:8px 0;text-align:right;">
                            <span style="font-size:14px;color:#ffffff;font-weight:600;">${reportA?.overallScore || '7.5'}/10</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;width:50%;">
                            <span style="font-size:13px;color:#aaaaaa;">Search Demand</span>
                          </td>
                          <td style="padding:8px 0;text-align:right;">
                            <span style="font-size:14px;color:#ffffff;font-weight:600;">${reportA?.scores?.searchDemand || '7'}/10</span>
                          </td>
                        </tr>
                      </table>

                      <!-- Scope -->
                      <p style="margin:0 0 16px;font-size:11px;color:#555555;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #222;padding-bottom:8px;">B. MVP Scope</p>
                      <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 32px;">
                        <tr>
                          <td style="padding:12px 0 8px;" colspan="2">
                            <span style="font-size:12px;color:#ffffff;font-weight:600;">Build Now:</span>
                          </td>
                        </tr>
                        ${buildNow.map((f: string) => `
                        <tr>
                          <td style="padding:4px 0 4px 16px;">
                            <span style="font-size:13px;color:#dddddd;">• ${f}</span>
                          </td>
                        </tr>`).join('')}
                        <tr>
                          <td style="padding:16px 0 8px;" colspan="2">
                            <span style="font-size:12px;color:#aaaaaa;font-weight:600;">Skip for MVP:</span>
                          </td>
                        </tr>
                        ${skip.map((f: string) => `
                        <tr>
                          <td style="padding:4px 0 4px 16px;">
                            <span style="font-size:13px;color:#777777;">• ${f}</span>
                          </td>
                        </tr>`).join('')}
                      </table>

                      <!-- Roadmap -->
                      <p style="margin:0 0 16px;font-size:11px;color:#555555;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #222;padding-bottom:8px;">C. 3-Week Roadmap</p>
                      <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 32px;">
                        ${weeks.slice(0, 3).map((w: any) => `
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;">
                            <p style="margin:0 0 4px;font-size:12px;color:#aaaaaa;font-weight:600;">Week ${w.week}: ${w.title}</p>
                            <p style="margin:0;font-size:13px;color:#dddddd;">${w.objective || (w.deliverables ? w.deliverables.join(', ') : '')}</p>
                          </td>
                        </tr>
                        `).join('')}
                      </table>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #1e1e1e;">
                      <p style="margin:0;font-size:12px;color:#444444;line-height:1.6;">
                        Sent by <a href="https://creworklabs.com" style="color:#666666;text-decoration:none;">Crework Labs</a> · 
                        We build MVPs for non-technical founders ·
                        <a href="https://creworklabs.com" style="color:#666666;text-decoration:none;">Unsubscribe</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}

type SendCompanyLeadParams = {
  userEmail: string
  leadTag: string
  ideaSummary: string
  archetype?: string
  quiz: {
    q1?: string | null
    q2?: string | null
    q3?: string | null
    q4?: string | null
  }
  locationInfo?: {
    ip?: string
    country?: string
    city?: string
  }
}

export async function sendCompanyLeadNotification({
  userEmail,
  leadTag,
  ideaSummary,
  archetype,
  quiz,
  locationInfo,
}: SendCompanyLeadParams) {
  const companyMail = process.env.COMPANY_EMAIL || 'creworkgroup@gmail.com'
  const tagColor = leadTag === 'HOT' ? '#ef4444' : leadTag === 'WARM' ? '#f59e0b' : '#3b82f6'

  const mailOptions = {
    from: `"Founder OS Leads" <${process.env.EMAIL_USER}>`,
    to: companyMail,
    subject: `[NEW LEAD - ${leadTag}] ${userEmail} generated a report`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;color:#f8fafc;padding:24px;margin:0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:10px;padding:32px;border:1px solid #334155;">
                  <tr>
                    <td style="border-bottom:1px solid #334155;padding-bottom:20px;margin-bottom:20px;">
                      <table width="100%">
                        <tr>
                          <td><h2 style="margin:0;font-size:20px;color:#ffffff;font-weight:700;">🎯 New Founder OS Lead Captured</h2></td>
                          <td text-align="right" align="right">
                            <span style="background:${tagColor};color:#ffffff;font-weight:bold;padding:6px 14px;border-radius:20px;font-size:12px;display:inline-block;">${leadTag} LEAD</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px 0 10px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;font-weight:bold;">User Email Address</p>
                      <p style="margin:0 0 20px;font-size:18px;font-weight:bold;color:#38bdf8;">${userEmail}</p>

                      <div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:16px 20px;margin-0 0 20px;">
                        <p style="margin:0 0 6px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;font-weight:bold;">Core Startup Idea (Q2)</p>
                        <p style="margin:0;font-size:15px;color:#f1f5f9;line-height:1.5;">"${ideaSummary}"</p>
                      </div>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;border-bottom:1px solid #283548;">Archetype:</td>
                          <td style="padding:8px 0;color:#ffffff;font-size:13px;font-weight:bold;text-align:right;border-bottom:1px solid #283548;">${archetype || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;border-bottom:1px solid #283548;">Stage (Q1):</td>
                          <td style="padding:8px 0;color:#ffffff;font-size:13px;text-align:right;border-bottom:1px solid #283548;">${quiz.q1 || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;border-bottom:1px solid #283548;">Target Audience (Q3):</td>
                          <td style="padding:8px 0;color:#ffffff;font-size:13px;text-align:right;border-bottom:1px solid #283548;">${quiz.q3 || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;border-bottom:1px solid #283548;">Goal / Seriousness (Q4):</td>
                          <td style="padding:8px 0;color:#ffffff;font-size:13px;text-align:right;border-bottom:1px solid #283548;">${quiz.q4 || 'N/A'}</td>
                        </tr>
                        ${
                          locationInfo?.country || locationInfo?.ip
                            ? `
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;">Location / IP:</td>
                          <td style="padding:8px 0;color:#38bdf8;font-size:13px;text-align:right;">${locationInfo.city ? locationInfo.city + ', ' : ''}${locationInfo.country || ''} (IP: ${locationInfo.ip || 'N/A'})</td>
                        </tr>
                        `
                            : ''
                        }
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }

  return transporter.sendMail(mailOptions)
}