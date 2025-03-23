// Update window manager to be more efficient

export function initWindowManager(windowElem) {
  // Use requestAnimationFrame for smooth updates
  let rafId = null;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;

  const header = windowElem.querySelector('.window-header');
  if (!header) return;

  header.style.cursor = 'move';
  
  function startDragging(e) {
    e.preventDefault();
    isDragging = true;

    // Get current transform
    const transform = new WebKitCSSMatrix(getComputedStyle(windowElem).transform);
    lastX = transform.m41;
    lastY = transform.m42;
    
    startX = e.clientX - lastX;
    startY = e.clientY - lastY;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDragging);
  }

  function onDrag(e) {
    if (!isDragging) return;

    // Cancel any existing animation frame
    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    // Schedule new frame
    rafId = requestAnimationFrame(() => {
      const x = e.clientX - startX;
      const y = e.clientY - startY;
      
      windowElem.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      lastX = x;
      lastY = y;
    });
  }

  function stopDragging() {
    isDragging = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDragging);
  }

  header.addEventListener('mousedown', startDragging);
}