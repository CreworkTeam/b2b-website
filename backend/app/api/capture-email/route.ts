import { NextRequest, NextResponse } from 'next/server'
import { sendReportEmail, sendCompanyLeadNotification } from '@/lib/resend'
import { prisma } from '@/lib/prisma'
import type { CaptureEmailRequest, LeadTag, Q4Answer } from '@/types'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

function deriveLeadTag(q4: Q4Answer | null): LeadTag {
  switch (q4) {
    case 'waitlist':    return 'HOT'
    case 'few_convos':  return 'WARM'
    default:            return 'NURTURE'
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CaptureEmailRequest = await req.json()

    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!body.sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Derive lead tag from Q4 seriousness answer
    const leadTag = deriveLeadTag(body.q4)

    // Extract location, IP, and User-Agent headers from Vercel / proxy
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || undefined
    const country = req.headers.get('x-vercel-ip-country') || undefined
    const city = req.headers.get('x-vercel-ip-city') || undefined
    const userAgent = req.headers.get('user-agent') || undefined
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'medium',
      timeStyle: 'short',
    }) + ' UTC'

    // Upsert lead via Prisma. Do not fail the request if DB write fails.
    try {
      await prisma.lead.upsert({
        where: { sessionId: body.sessionId },
        create: {
          sessionId: body.sessionId,
          email: body.email,
          archetype: body.archetype ?? null,
          q1: body.quiz.q1 ?? null,
          q2: body.quiz.q2 ?? null,
          q3: body.quiz.q3 ?? null,
          q4: body.quiz.q4 ?? null,
          leadTag,
          capturedAt: new Date(),
        },
        update: {
          email: body.email,
          archetype: body.archetype ?? null,
          q1: body.quiz.q1 ?? null,
          q2: body.quiz.q2 ?? null,
          q3: body.quiz.q3 ?? null,
          q4: body.quiz.q4 ?? null,
          leadTag,
          capturedAt: new Date(),
        },
      })
    } catch (dbError) {
      console.error('[capture-email] Prisma error:', dbError)
    }

    // Build the report URL
    const reportUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/report`

    // Send user report email
    try {
      await sendReportEmail({
        to: body.email,
        ideaSummary: body.quiz.q2 || 'your startup idea',
        archetype: body.archetype ?? 'saas_tool',
        reportUrl,
      })
    } catch (emailError) {
      console.error('[capture-email] sendReportEmail failed:', emailError)
    }

    // Send enriched lead notification to Company Email
    try {
      await sendCompanyLeadNotification({
        userEmail: body.email,
        leadTag,
        ideaSummary: body.quiz.q2 || 'No idea description provided',
        archetype: body.archetype ?? undefined,
        quiz: body.quiz,
        locationInfo: { ip, country, city, userAgent },
        timestamp,
      })
    } catch (companyEmailErr) {
      console.error('[capture-email] sendCompanyLeadNotification failed:', companyEmailErr)
    }

    return NextResponse.json(
      {
        success: true,
        leadTag,
      },
      { headers: corsHeaders }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500, headers: corsHeaders }
    )
  }
}
