// Runs before the page paints so the chosen theme never flashes. Dark is the default; a saved choice wins.
(function () {
  try {
    var saved = localStorage.getItem('delchaos-theme');
    document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
  } catch {
    document.documentElement.dataset.theme = 'dark';
  }
})();
