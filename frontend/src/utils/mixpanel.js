import mixpanel from 'mixpanel-browser';
import * as changeCase from 'change-case';

mixpanel.init(import.meta.env.PUBLIC_MIXPANEL_TOKEN || 'dummy_token', {
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
});

function safeMixpanelTrack(eventName, properties) {
  try {
    if (import.meta.env.PUBLIC_MIXPANEL_TOKEN && mixpanel && typeof mixpanel.track === 'function') {
      mixpanel.track(eventName, properties);
    }
  } catch (err) {
    // Silently handle tracking block from browser tracking prevention or adblockers
  }
}

function trackButtonClick({ eventName, ...args }) {
  const properties = Object.keys(args).reduce((acc, key) => {
    if (args[key]) {
      acc[changeCase.snakeCase(key)] = args[key];
    }
    return acc;
  }, {});

  if (properties.btn_type === 'blog') {
    properties.featured_blog = properties.featured_blog === 'true';
  } else {
    delete properties.featured_blog;
  }

  safeMixpanelTrack(eventName, properties);
}

export function setupButtonTracking({ pageName = 'LandingPage' }) {
  document.addEventListener(
    'click',
    (event) => {
      let target = null;

      if (
        event.target.tagName === 'A' ||
        event.target.tagName === 'BUTTON' ||
        event.target.closest('a') ||
        event.target.closest('button')
      ) {
        target = event.target.closest('a') || event.target.closest('button');
      } else if (event.target.tagName === 'IMG' && event.target.parentNode.tagName === 'A') {
        target = event.target.parentNode;
      }

      if (target) {
        const buttonName = target?.getAttribute('data-btnname') || target?.textContent.trim() || '';
        const buttonUrl = target?.getAttribute('href') || '';
        const sectionElement = target.closest('[data-section]');
        const section = sectionElement?.getAttribute('data-section') || '';
        const btnType = target.closest('[data-btntype]')?.getAttribute('data-btntype') || '';
        const caseStudy =
          target.closest('[data-case-study]')?.getAttribute('data-case-study') || '';
        const featuredBlog =
          target.closest('[data-featured-blog]')?.getAttribute('data-featured-blog') || '';
        let eventName = 'Button_Clicked_';

        if (target.closest('nav')) {
          eventName += 'Navbar';
        } else if (target.closest('footer')) {
          eventName += 'Footer';
        } else {
          eventName += pageName;
        }

        trackButtonClick({
          buttonName,
          buttonUrl,
          btnType,
          featuredBlog,
          caseStudy,
          eventName,
          section,
        });
      }
    },
    true,
  );
}

// Helper to extract UTM parameters and referrer
function getURLContext() {
  if (typeof window === 'undefined') return {};
  const urlParams = new URLSearchParams(window.location.search);
  return {
    referrer: document.referrer || 'direct',
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
  };
}

// -------------------------------------------------------------
// FUNNEL 1: MAIN SITE EVENTS
// -------------------------------------------------------------

export function trackPageView(pageName) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('page_viewed', {
    page_name: pageName, // 'homepage' | 'overnight-cto' | 'agentic-ai-systems'
    ...getURLContext(),
  });
}

export function trackCTAClick({ ctaLabel, pageName, section }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('cta_clicked', {
    cta_label: ctaLabel,
    page_name: pageName,
    section: section,
  });
}

export function trackPathSelected({ path, sourcePage = 'homepage' }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('path_selected', {
    path: path, // 'agentic-ai-systems' | 'overnight-cto'
    source_page: sourcePage,
  });
}

export function trackCalendlyOpened({ pageName, section }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('calendly_opened', {
    page_name: pageName,
    section: section,
  });
}

export function trackDiscoveryCallBooked({ pageName, ctaSection }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('discovery_call_booked', {
    page_name: pageName,
    cta_section: ctaSection,
  });

  // Fire GA4 conversion event
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'call_booked', {
      source_page: window.location.pathname,
      page_name: pageName,
      cta_section: ctaSection,
      event_category: 'conversion',
    });
  }
}

export function trackNewsletterSignup() {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('newsletter_signup', {
    source_page: window.location.pathname,
  });

  // Fire GA4 conversion event
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'newsletter_signup', {
      source_page: window.location.pathname,
      event_category: 'conversion',
    });
  }
}

// -------------------------------------------------------------
// FUNNEL 2: LEAD MAGNET (FOUNDER OS) EVENTS
// -------------------------------------------------------------

export function trackLeadMagnetClicked({ sourcePage, sourceSection }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('lead_magnet_clicked', {
    source_page: sourcePage,
    source_section: sourceSection,
  });
}

export function trackFounderOSLandingViewed() {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('founder_os_landing_viewed');
}

export function trackQuizStarted() {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('quiz_started');
}

export function trackQuizStepCompleted({ stepNumber, stepName, answer }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('quiz_step_completed', {
    step_number: stepNumber,
    step_name: stepName,
    answer: answer,
  });
}

export function trackQuizAbandoned({ abandonedAtStep }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('quiz_abandoned', {
    abandoned_at_step: abandonedAtStep,
  });
}

export function trackQuizSubmitted({ journeyStage, targetAudience, validationStatus }) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('quiz_submitted', {
    journey_stage: journeyStage,
    target_audience: targetAudience,
    validation_status: validationStatus,
  });
}

export function trackReportViewed(tabName) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('report_viewed', {
    tab_name: tabName,
  });
}

export function trackEmailCaptured(capturePoint) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('email_captured', {
    capture_point: capturePoint,
  });
}

export function trackReportCTAClicked(ctaLabel) {
  if (typeof window === 'undefined') return;
  safeMixpanelTrack('report_cta_clicked', {
    cta_label: ctaLabel,
  });
}

// -------------------------------------------------------------
// HELPER FOR AUTO-TRACKING FUNNEL EVENTS & CALENDLY
// -------------------------------------------------------------

export function setupFunnelAutoTracking({ pageName = 'homepage' } = {}) {
  if (typeof window === 'undefined') return;

  // Track page view
  trackPageView(pageName);

  // Listen to Calendly iframe postMessage events
  window.addEventListener('message', (e) => {
    if (e.data && e.data.event && typeof e.data.event === 'string' && e.data.event.indexOf('calendly') === 0) {
      if (e.data.event === 'calendly.event_type_viewed') {
        trackCalendlyOpened({ pageName, section: 'calendly-modal' });
      }
      if (e.data.event === 'calendly.event_scheduled') {
        trackDiscoveryCallBooked({ pageName, ctaSection: 'calendly-modal' });
      }
    }
  });

  // Track CTA / Path / Lead magnet clicks
  document.addEventListener(
    'click',
    (event) => {
      let target = null;
      if (
        event.target.tagName === 'A' ||
        event.target.tagName === 'BUTTON' ||
        event.target.closest('a') ||
        event.target.closest('button')
      ) {
        target = event.target.closest('a') || event.target.closest('button');
      }

      if (!target) return;

      const sectionElement = target.closest('[data-section]');
      const section = sectionElement?.getAttribute('data-section') ||
                      (target.closest('nav') ? 'nav' : target.closest('footer') ? 'footer' : 'hero');

      const href = target.getAttribute('href') || '';

      const path = target.getAttribute('data-path') || 
                   (href.includes('agentic-ai-systems') ? 'agentic-ai-systems' : 
                    href.includes('overnight-cto') ? 'overnight-cto' : null);

      if (path && pageName === 'homepage') {
        trackPathSelected({ path, sourcePage: pageName });
      }

      if (href.includes('calendly')) {
        trackCalendlyOpened({ pageName, section });
      }

      if (target.hasAttribute('data-lead-magnet') || href.includes('lead-magnet') || href.includes('founder-os')) {
        trackLeadMagnetClicked({ sourcePage: pageName, sourceSection: section });
      }

      const ctaLabel = target.getAttribute('data-cta-label') || target.textContent.trim();
      if (ctaLabel) {
        trackCTAClick({ ctaLabel, pageName, section });
      }
    },
    true
  );
}


