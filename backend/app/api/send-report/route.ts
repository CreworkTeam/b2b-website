import { NextRequest, NextResponse } from 'next/server'
import { sendFullReportEmail } from '@/lib/resend'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, sessionId, reports } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    if (!sessionId || !reports) {
      return NextResponse.json(
        { error: 'sessionId and reports are required' },
        { status: 400 }
      )
    }

    // Retrieve ideaSummary and archetype from DB using sessionId
    const lead = await prisma.lead.findUnique({
      where: { sessionId },
    })

    const ideaSummary = lead?.q2 || 'your startup idea'
    const archetype = lead?.archetype || 'saas_tool'

    // Send the full report email via Resend
    try {
      await sendFullReportEmail({
        to: email,
        ideaSummary,
        archetype,
        reports,
      })
    } catch (emailError) {
      console.error('[send-report] Resend failed:', emailError)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[send-report] Internal error:', error)
    return NextResponse.json(
      { error: 'Failed to send report' },
      { status: 500 }
    )
  }
}
