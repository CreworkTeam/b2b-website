import mixpanel from 'mixpanel-browser';

mixpanel.init(import.meta.env.PUBLIC_MIXPANEL_TOKEN, {
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
});

function trackButtonClick({ buttonName, buttonUrl, eventName, section = '' }) {
  const properties = {
    button_name: buttonName,
    button_url: buttonUrl,
  };

  if (section) {
    properties.section = section;
  }

  mixpanel.track(eventName, properties);
}

export function setupButtonTracking() {
  document.addEventListener('click', (event) => {
    let target = null;

    if (event.target.tagName === 'A') {
      target = event.target;
    } else if (event.target.tagName === 'IMG' && event.target.parentNode.tagName === 'A') {
      target = event.target.parentNode;
    }

    if (target) {
      const buttonName = target.textContent.trim() || '';
      const buttonUrl = target.getAttribute('href') || '';
      const sectionElement = target.closest('[data-section]');
      const section = sectionElement?.getAttribute('data-section') || '';
      let eventName = 'Button_Clicked_';

      if (target.closest('nav')) {
        eventName += 'Navbar';
      } else if (target.closest('footer')) {
        eventName += 'Footer';
      } else {
        eventName += 'LandingPage';
      }

      trackButtonClick({ buttonName, buttonUrl, eventName, section });
    }
  });
}
