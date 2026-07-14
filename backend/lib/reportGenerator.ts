import type { Archetype, RouteKey, ReportA, ReportB, ReportC } from '@/types'
import path from 'path'
import fs from 'fs'

type MockFile = {
  A: ReportA
  B: ReportB
  C: ReportC
}

// ─── Loader ───────────────────────────────────────────────────────────────────

function loadMock(archetype: Archetype): MockFile {
  const filePath = path.join(
    process.cwd(),
    'data',
    'mock',
    `${archetype}.json`
  )

  // If a specific archetype file doesn't exist yet, fall back to saas_tool
  // This lets us ship V0 with just one mock file and add the rest incrementally
  const safePath = fs.existsSync(filePath)
    ? filePath
    : path.join(process.cwd(), 'data', 'mock', 'saas_tool.json')

  const raw = fs.readFileSync(safePath, 'utf-8')
  return JSON.parse(raw) as MockFile
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getReportA(archetype: Archetype): ReportA {
  const mock = loadMock(archetype)
  // Stamp the actual archetype so the frontend knows what was detected
  return { ...mock.A, archetype }
}

export function getReportB(archetype: Archetype): ReportB {
  const mock = loadMock(archetype)
  return { ...mock.B, archetype }
}

export function getReportC(archetype: Archetype): ReportC {
  const mock = loadMock(archetype)
  return { ...mock.C, archetype }
}

export function getReport(route: RouteKey, archetype: Archetype): ReportA | ReportB | ReportC {
  switch (route) {
    case 'A': return getReportA(archetype)
    case 'B': return getReportB(archetype)
    case 'C': return getReportC(archetype)
  }
}