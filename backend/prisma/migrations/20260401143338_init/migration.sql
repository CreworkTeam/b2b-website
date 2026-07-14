-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "archetype" TEXT,
    "q1" TEXT,
    "q2" TEXT,
    "q3" TEXT,
    "q4" TEXT,
    "lead_tag" TEXT,
    "captured_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_session_id_key" ON "leads"("session_id");
