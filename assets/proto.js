// Izuke prototype (Nov 2026) — shared behaviour for every screen.
//
// - Theme: ?theme=dark (or #dark) draws the page in the app's dark palette.
//   The same file is both the light and the dark screen.
// - ?shot draws the bare screen at 390x844 with no frame or controls around
//   it, for exporting images (the website's help page uses these).
// - Fills in the shared pieces a screen asks for:
//     <div data-status></div>            iPhone status bar (data-status="light" on photos)
//     <nav data-tabbar="map|explore|matches|profile"></nav>
//     <div data-home></div>              home indicator
// - Outside the phone: back to the screen map, and a light/dark switch.
(function () {
  var params = new URLSearchParams(location.search);
  var dark = params.get('theme') === 'dark' || location.hash === '#dark';
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  var shot = params.has('shot');
  if (shot) document.documentElement.classList.add('shot');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    document.querySelectorAll('[data-status]').forEach(function (el) {
      el.className = 'status' + (el.getAttribute('data-status') === 'light' ? ' light' : '');
      el.innerHTML = '<span>9:41</span><span class="island"></span>' +
        '<span class="r"><i class="ph-fill ph-cell-signal-high"></i><i class="ph-fill ph-wifi-high"></i><i class="ph-fill ph-battery-high"></i></span>';
    });

    var tabs = [
      ['map', 'ph-map-trifold', 'Map'],
      ['explore', 'ph-compass', 'Explore'],
      ['+', '', ''],
      ['matches', 'ph-chats-circle', 'Matches'],
      ['profile', 'ph-user-circle', 'Profile']
    ];
    var targets = { map: 'map_home.html', explore: 'explore.html', '+': 'meetup_post.html', matches: 'matches.html', profile: 'profile.html' };
    document.querySelectorAll('[data-tabbar]').forEach(function (el) {
      var on = el.getAttribute('data-tabbar');
      el.className = 'tabbar';
      el.innerHTML = tabs.map(function (t) {
        var href = targets[t[0]] + location.search;
        if (t[0] === '+') return '<a class="fab" href="' + href + '"><i class="ph-bold ph-plus"></i></a>';
        var cls = 'tab' + (t[0] === on ? ' on' : '');
        var icon = (t[0] === on ? 'ph-fill ' : 'ph ') + t[1];
        var badge = t[0] === 'matches' ? '<span class="badge">2</span>' : '';
        return '<a class="' + cls + '" href="' + href + '"><i class="' + icon + '"></i>' + badge + t[2] + '</a>';
      }).join('');
    });

    document.querySelectorAll('[data-home]').forEach(function (el) { el.className = 'home-ind'; });

    // Keep the theme when following links between screens.
    if (location.search) {
      document.querySelectorAll('.phone a[href$=".html"]').forEach(function (a) {
        if (a.getAttribute('href').indexOf('?') < 0) a.setAttribute('href', a.getAttribute('href') + location.search);
      });
    }

    if (shot || window.self !== window.top) return; // exporting, or a thumbnail
    var inScreens = /\/screens\//.test(location.pathname);
    var back = document.createElement('a');
    back.className = 'proto-fab l';
    back.href = (inScreens ? '../' : '') + 'index.html' + (dark ? '?theme=dark' : '');
    back.innerHTML = '<i class="ph ph-squares-four"></i>All screens';
    document.body.appendChild(back);

    var sw = document.createElement('a');
    sw.className = 'proto-fab r';
    var p = new URLSearchParams(location.search);
    if (dark) p.delete('theme'); else p.set('theme', 'dark');
    var q = p.toString();
    sw.href = location.pathname + (q ? '?' + q : '');
    sw.innerHTML = dark ? '<i class="ph ph-sun"></i>Light' : '<i class="ph ph-moon"></i>Dark';
    document.body.appendChild(sw);
  });
})();
