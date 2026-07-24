import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

function base64UrlEncode(str: string | Buffer): string {
  const buf = typeof str === 'string' ? Buffer.from(str) : str;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const header = JSON.stringify({ alg: 'RS256', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const claimSet = JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  });

  const encodedHeader = base64UrlEncode(header);
  const encodedClaimSet = base64UrlEncode(claimSet);
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(privateKey);
  const encodedSignature = base64UrlEncode(signature);

  const jwt = `${signatureInput}.${encodedSignature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Failed to authenticate with Google OAuth');
  }

  return data.access_token;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { fullName, email, guestEmail, notes, selectedDate, selectedTime, timezone = 'Asia/Kolkata' } = body;

    if (!fullName || !email || !selectedDate || !selectedTime) {
      return new Response(JSON.stringify({ error: 'Missing required booking fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'team@creworklabs.com';

    // If credentials are not yet configured in .env, return mock success
    if (!serviceEmail || !rawPrivateKey) {
      console.warn('Google Service Account credentials not found in .env. Returning simulated success.');
      return new Response(
        JSON.stringify({
          success: true,
          simulated: true,
          message: 'Booking saved locally. Configure GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env for live Google Meet invites.',
          meetLink: 'https://meet.google.com/abc-defg-hij',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

    // 1. Get OAuth Access Token
    const accessToken = await getAccessToken(serviceEmail, privateKey);

    // 2. Calculate Start and End ISO strings (30 min duration)
    const year = 2026;
    const month = 6; // July (0-indexed 6)
    const isPM = selectedTime.includes('pm');
    const [hStr, mStr] = selectedTime.replace(/am|pm/g, '').split(':');
    let hour = parseInt(hStr, 10);
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    const min = parseInt(mStr, 10);

    const startDate = new Date(Date.UTC(year, month, selectedDate, hour - 5, min - 30)); // Offset for IST UTC+5:30
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    const attendees = [
      { email: calendarId },
      { email },
    ];
    if (guestEmail) attendees.push({ email: guestEmail });

    // 3. Create Google Calendar Event via API
    const eventPayload = {
      summary: `Quick Catchup with ${fullName}`,
      description: `Quick Catchup 30-min discovery call.\n\nAttendee: ${fullName} (${email})\nNotes: ${notes || 'None'}`,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const gcalResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      }
    );

    const eventData = await gcalResponse.json();

    if (!gcalResponse.ok) {
      console.error('Google Calendar API Error:', eventData);
      throw new Error(eventData.error?.message || 'Failed to create Google Calendar event');
    }

    const meetLink = eventData.hangoutLink || eventData.conferenceData?.entryPoints?.[0]?.uri || 'https://meet.google.com/call';

    return new Response(
      JSON.stringify({
        success: true,
        eventId: eventData.id,
        meetLink,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Booking API exception:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
