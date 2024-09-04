import mixpanel from 'mixpanel-browser';
import * as changeCase from 'change-case';

mixpanel.init(import.meta.env.PUBLIC_MIXPANEL_TOKEN, {
  track_pageview: true,
  persistence: 'localStorage',
  ignore_dnt: true,
});

function trackButtonClick({ eventName, ...args }) {
  const properties = Object.keys(args).reduce(
    (acc, key) => {
      if (args[key]) {
        acc[changeCase.snakeCase(key)] = args[key];
      }
      return acc;
    },
    {
      event_name: eventName,
    },
  );

  mixpanel.track(eventName, properties);
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
        const buttonName = target?.textContent.trim() || '';
        const buttonUrl = target?.getAttribute('href') || '';
        const sectionElement = target.closest('[data-section]');
        const section = sectionElement?.getAttribute('data-section') || '';
        const btnType = target.closest('[data-btntype]')?.getAttribute('data-btntype') || '';
        const caseStudy =
          target.closest('[data-case-study]')?.getAttribute('data-case-study') || '';
        let eventName = 'Button_Clicked_';

        if (target.closest('nav')) {
          eventName += 'Navbar';
        } else if (target.closest('footer')) {
          eventName += 'Footer';
        } else {
          eventName += pageName;
        }

        trackButtonClick({ buttonName, buttonUrl, btnType, caseStudy, eventName, section });
      }
    },
    true,
  );
}
