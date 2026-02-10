// Online count simulation
function getRandomOnlineUsers() {
  const base = 140;
  const variation = Math.floor(Math.random() * 80) - 40;
  const timeFactor = Math.sin(Date.now() / 1000 / 60 / 15) * 30;
  return Math.max(80, Math.round(base + variation + timeFactor));
}

function updateOnlineCount() {
  const countEl = document.getElementById("online-count");
  if (countEl) {
    countEl.textContent = getRandomOnlineUsers().toLocaleString();
  }
}

updateOnlineCount();
setInterval(updateOnlineCount, 8000 + Math.random() * 6000);
