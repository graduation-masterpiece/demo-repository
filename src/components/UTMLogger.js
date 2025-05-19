import { useEffect } from 'react';

function useUTMLogger() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      content: urlParams.get('utm_content'),
    };

    const alreadyLogged = localStorage.getItem('utm_logged');

    // UTM이 있을 경우에만 백엔드로 전송
    if ((utmData.source || utmData.medium || utmData.campaign || utmData.content) && !alreadyLogged) {
      fetch('/api/log-utm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(utmData),
      }).then(() => {
        localStorage.setItem('utm_logged', 'true');
        localStorage.setItem('utm_source', utmData.source || '');
        localStorage.setItem('utm_medium', utmData.medium || '');
        localStorage.setItem('utm_campaign', utmData.campaign || '');
        localStorage.setItem('utm_content', utmData.content || '');
      });
    }
  }, []);
}

export default useUTMLogger;
