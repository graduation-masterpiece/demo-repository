import { useEffect } from 'react';

function useUTMLogger() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    let utmData = {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      content: urlParams.get('utm_content'),
    };

    // 만약 링크 직접 입력 또는 메인 페이지로 들어왔을 때
    const isEmpty = !utmData.source && !utmData.medium && !utmData.campaign && !utmData.content;

    if (isEmpty) {
      utmData = {
        source: 'direct',
        medium: 'none',
        campaign: 'direct-access',
        content: '0',
      };
    }

    // UTM 기록이 있는지 확인
    const alreadyLogged = sessionStorage.getItem('utm_logged');

    // UTM 기록이 없을 경우에만 백엔드로 전송
    if (!alreadyLogged) {
      fetch('/api/log-utm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(utmData),
      }).then(() => {
        sessionStorage.setItem('utm_logged', 'true');
        sessionStorage.setItem('utm_source', utmData.source || '');
        sessionStorage.setItem('utm_medium', utmData.medium || '');
        sessionStorage.setItem('utm_campaign', utmData.campaign || '');
        sessionStorage.setItem('utm_content', utmData.content || '');
      }).catch((err) => {
        console.error("UTM Logging Failed: ", err);
      });
    }
  }, []);
}

export default useUTMLogger;
