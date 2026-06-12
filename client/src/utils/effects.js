import { playGemCollectSound } from './audio';

export const spawnFlyingGems = (targetOrEvent, count = 8) => {
  let startX = 0;
  let startY = 0;
  
  if (targetOrEvent instanceof HTMLElement) {
    const rect = targetOrEvent.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  } else if (targetOrEvent && typeof targetOrEvent.clientX === 'number') {
    startX = targetOrEvent.clientX;
    startY = targetOrEvent.clientY;
  } else if (targetOrEvent && targetOrEvent.target) {
    const rect = targetOrEvent.target.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  } else {
    startX = window.innerWidth / 2;
    startY = window.innerHeight / 2;
  }
  
  const targetEl = document.getElementById('header-gems-badge');
  let targetX = window.innerWidth - 100;
  let targetY = 30;
  if (targetEl) {
    const targetRect = targetEl.getBoundingClientRect();
    targetX = targetRect.left + targetRect.width / 2;
    targetY = targetRect.top + targetRect.height / 2;
  }
  
  playGemCollectSound();
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const gem = document.createElement('div');
      gem.style.position = 'fixed';
      gem.style.left = '0';
      gem.style.top = '0';
      gem.style.width = '28px';
      gem.style.height = '28px';
      gem.style.pointerEvents = 'none';
      gem.style.zIndex = '9999';
      gem.innerHTML = `
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; filter: drop-shadow(0 3px 5px rgba(37,99,235,0.45));">
          <path d="M32 2L8 22L32 62L56 22L32 2Z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="3.5" stroke-linejoin="round" />
          <path d="M32 2L20 22L32 62L44 22L32 2Z" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3.5" stroke-linejoin="round" />
          <path d="M20 22H44" stroke="#1e3a8a" stroke-width="3.5" stroke-linejoin="round" />
          <path d="M32 2V22" stroke="#1e3a8a" stroke-width="3.5" stroke-linejoin="round" />
        </svg>
      `;
      document.body.appendChild(gem);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 50;
      const burstX = startX + Math.cos(angle) * distance;
      const burstY = startY + Math.sin(angle) * distance;
      
      const keyframes = [
        { transform: `translate(${startX - 14}px, ${startY - 14}px) scale(0) rotate(0deg)`, opacity: 0 },
        { transform: `translate(${burstX - 14}px, ${burstY - 14}px) scale(1.35) rotate(${Math.random() * 90}deg)`, opacity: 1, offset: 0.15 },
        { transform: `translate(${targetX - 14}px, ${targetY - 14}px) scale(0.5) rotate(${360 + Math.random() * 360}deg)`, opacity: 0.8 }
      ];
      
      const anim = gem.animate(keyframes, {
        duration: 900 + Math.random() * 400,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
      });
      
      anim.onfinish = () => {
        gem.remove();
        
        if (targetEl && i === count - 1) {
          targetEl.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.25)', offset: 0.3 },
            { transform: 'scale(0.92)', offset: 0.75 },
            { transform: 'scale(1)' }
          ], { duration: 350, easing: 'ease-out' });
        }
      };
    }, i * 65);
  }
};
