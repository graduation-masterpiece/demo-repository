import { useEffect } from 'react';
import axios from 'axios';

function useUTMLogger() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    let utmData = {
      source: urlParams.get('utm_source') || sessionStorage.getItem('utm_source'),
      medium: urlParams.get('utm_medium') || sessionStorage.getItem('utm_source'),
      campaign: urlParams.get('utm_campaign') || sessionStorage.getItem('utm_source'),
      content: parseInt(urlParams.get('utm_content') || sessionStorage.getItem('utm_content'), 10);,
      access_time: sessionStorage.getItem('utm_access_time') || currentTime,
    };

    // 만약 링크 직접 입력 또는 메인 페이지로 들어왔을 때
    const isEmpty = !utmData.source && !utmData.medium && !utmData.campaign && !utmData.content;

    if (isEmpty) {
      utmData = {
        source: 'direct',
        medium: 'none',
        campaign: 'direct-access',
        content: -1,
        access_time: currentTime,
      };
    }

    // null 값 거르기
    const isValid = utmData.source != null && utmData.medium != null && utmData.campaign != null;

    // UTM이 있을 경우에만 백엔드로 전송
    if (!isValid || sessionStorage.getItem('utm_logged')) return;
    
    console.log("Preparing to send UTM: ", utmData);

    const loggingUtm = async () => {
      try {
        const healthRes = await axios.get('/api/health');
        console.log("Returned healthRes: ", healthRes.data);

        if (!healthRes.data?.ready) {
          console.warn("Server is not ready yet. Skipping UTM logging.");
          return;
        }
        
        await axios.post('/api/log-utm', {
          source: utmData.source,
          medium: utmData.medium,
          campaign: utmData.campaign,
          content: utmData.content,
          access_time: utmData.access_time,
        });
        
        sessionStorage.setItem('utm_logged', 'true');
      } catch (err) {
        console.error("UTM Logging Failed: ", err.response?.data || err);
      }
    };

    loggingUtm();
  }, []);
}

export default useUTMLogger;
