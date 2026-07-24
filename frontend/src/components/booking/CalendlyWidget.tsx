import React, { useEffect } from 'react';
import { trackCalendlyOpened, trackOnCallSchedulePage, trackDiscoveryCallBooked } from '../../utils/mixpanel';

export default function CalendlyWidget() {
  useEffect(() => {
    // 1. Inject Calendly's official widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // 2. Listen to Calendly's postMessage signals
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data && e.data.event && typeof e.data.event === 'string' && e.data.event.indexOf('calendly') === 0) {
        // Ignore continuous internal page_height resize events to keep console clean
        if (e.data.event === 'calendly.page_height') return;

        console.log('Calendly Event Received:', e.data.event, e.data);

        if (e.data.event === 'calendly.event_type_viewed') {
          try {
            console.log('✅ Tracking Mixpanel Event: Calendly Opened');
            trackCalendlyOpened({ pageName: 'book_a_call', section: 'calendly-official-embed' });
          } catch (err) {
            console.error('Mixpanel error:', err);
          }
        }

        if (e.data.event === 'calendly.date_and_time_selected') {
          console.log('⏰ Calendly Event: Date & Time Slot Selected!');
          try {
            console.log('🚀 Tracking Mixpanel Event: on_call_schedule_page');
            trackOnCallSchedulePage({ pageName: 'book_a_call', section: 'calendly-official-embed' });
          } catch (err) {
            console.error('Mixpanel error:', err);
          }
        }

        if (e.data.event === 'calendly.event_scheduled') {
          try {
            console.log('🎉 Tracking Mixpanel Event: Call Booked Successfully!');
            trackDiscoveryCallBooked({ pageName: 'book_a_call', ctaSection: 'calendly-official-embed' });
          } catch (err) {
            console.error('Mixpanel error:', err);
          }
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full h-full pt-4 pb-12 flex items-center justify-center">
      <div
        className="calendly-inline-widget w-full max-w-6xl"
        data-url="https://calendly.com/creworklabs/30mins?hide_landing_page_details=0"
        style={{ minWidth: '320px', height: '700px', width: '100%' }}
      />
    </div>
  );
}
