import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        email: {
          not: '',
        },
      },
      orderBy: {
        capturedAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    })
  } catch (error) {
    console.error('[api/leads] Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads from database' },
      { status: 500 }
    )
  }
}
