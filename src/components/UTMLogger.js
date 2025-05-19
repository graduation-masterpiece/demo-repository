import { useEffect } from 'react';

function useUTMLogger() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
    };

    // UTM이 있을 경우에만 백엔드로 전송
    if (utmData.source || utmData.medium || utmData.campaign) {
      fetch('/api/log-utm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(utmData),
      });
    }
  }, []);
}

export default useUTMLogger;
