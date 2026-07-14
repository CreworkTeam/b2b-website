import { NextRequest, NextResponse } from 'next/server'
import { sendReportEmail } from '@/lib/resend'
import { prisma } from '@/lib/prisma'
import type { CaptureEmailRequest, LeadTag, Q4Answer } from '@/types'

// ─── Lead tag logic ───────────────────────────────────────────────────────────

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
        { status: 400 }
      )
    }

    if (!body.sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    // Derive lead tag from Q4 seriousness answer
    const leadTag = deriveLeadTag(body.q4)

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
      // Don't fail the request — email was still sent
    }

    // Build the report URL — frontend handles showing the full report
    const reportUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/report`

    // Send email via Resend (non-blocking — don't fail the request if email fails)
    try {
      await sendReportEmail({
        to: body.email,
        ideaSummary: body.quiz.q2 || 'your startup idea',
        archetype: body.archetype ?? 'saas_tool',
        reportUrl,
      })
    } catch (emailError) {
      // Log but don't block — user still gets their report
      console.error('[capture-email] Resend failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      leadTag,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    )
  }
}
