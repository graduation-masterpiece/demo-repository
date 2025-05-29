import { useEffect } from 'react';
import axios from 'axios';

function useUTMLogger() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    let utmData = {
      source: urlParams.get('utm_source') || sessionStorage.getItem('utm_source'),
      medium: urlParams.get('utm_medium') || sessionStorage.getItem('utm_source'),
      campaign: urlParams.get('utm_campaign') || sessionStorage.getItem('utm_source'),
      content: parseInt(urlParams.get('utm_content') || sessionStorage.getItem('utm_content'), 10),
      access_time: sessionStorage.getItem('utm_access_time') || new Date(),
    };

    // 만약 링크 직접 입력 또는 메인 페이지로 들어왔을 때
    const isEmpty = !utmData.source && !utmData.medium && !utmData.campaign && !utmData.content;

    if (isEmpty) {
      utmData = {
        source: 'direct',
        medium: 'none',
        campaign: 'direct-access',
        content: -1,
        access_time: new Date(),
      };
    }

    // null 값 거르기
    const isValid = Object.values(utmData).every(val => typeof val === 'string' && val.length > 0);

    // UTM이 있을 경우에만 백엔드로 전송
    if (!isValid || sessionStorage.getItem('utm_logged')) return;
    
    console.log("Preparing to send UTM: ", utmData);

    const loggingUtm = async () => {
      try {
        const healthRes = await axios.get('/api/health');

        if (!healthRes.data?.ready) {
          console.warn("Server is not ready yet. Skipping UTM logging.");
          return;
        }
        
        await axios.post('/api/log-utm', utmData);
        
        sessionStorage.setItem('utm_logged', 'true');
      } catch (err) {
        console.error("UTM Logging Failed: ", err.response?.data || err);
      }
    };

    loggingUtm();
  }, []);
}

export default useUTMLogger;
