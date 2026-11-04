(function () {
  var KEY = 'withu-font-size';
  var SIZES = [
    { id: 's', label: '小', scale: 0.9, px: 14 },
    { id: 'm', label: '中', scale: 1, px: 17 },
    { id: 'l', label: '大', scale: 1.2, px: 21 }
  ];
  var root = document.documentElement;

  function find(id) {
    for (var i = 0; i < SIZES.length; i++) if (SIZES[i].id === id) return SIZES[i];
    return SIZES[1];
  }
  function load() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(id) {
    try { localStorage.setItem(KEY, id); } catch (e) { /* 存不了就只在這一頁有效 */ }
  }
  function apply(id) {
    var size = find(id);
    root.style.setProperty('--fs', size.scale);
    root.setAttribute('data-font-size', size.id);
    return size.id;
  }

  // 在畫面出現前就套用，避免字先小後大地閃一下
  var current = apply(load());

  var css =
    ':where(input, select, textarea) { font-size: inherit; }' +
    'body { padding-bottom: calc(72px + env(safe-area-inset-bottom)); }' +
    '.withu-fs { position: fixed; z-index: 1000; right: max(12px, env(safe-area-inset-right));' +
    ' bottom: max(12px, env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 2px;' +
    ' padding: 4px 4px 4px 14px; background: #fff; border: 1.5px solid #2F6F6A; border-radius: 999px;' +
    ' box-shadow: 0 6px 20px rgba(60,40,30,0.18);' +
    ' font-family: "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif; line-height: 1; }' +
    '.withu-fs-label { font-size: 14px; font-weight: 700; color: #2F6F6A; margin-right: 4px; white-space: nowrap; }' +
    '.withu-fs button { width: 40px; height: 40px; padding: 0; border: 0; border-radius: 50%; background: transparent;' +
    ' color: #2B2B2B; font-family: inherit; font-weight: 700; line-height: 1; cursor: pointer; }' +
    '.withu-fs button:hover { background: #E1EDEB; }' +
    '.withu-fs button[aria-pressed="true"] { background: #2F6F6A; color: #fff; }' +
    '.withu-fs button:focus-visible { outline: 3px solid #E8875B; outline-offset: 2px; }' +
    '@media print { .withu-fs { display: none; } }';

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.className = 'withu-fs';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', '字體大小');

    var label = document.createElement('span');
    label.className = 'withu-fs-label';
    label.textContent = '字級';
    box.appendChild(label);

    var buttons = SIZES.map(function (size) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = size.label;
      b.style.fontSize = size.px + 'px';
      b.setAttribute('aria-label', '字體' + size.label);
      b.setAttribute('aria-pressed', String(size.id === current));
      b.addEventListener('click', function () {
        current = apply(size.id);
        save(current);
        buttons.forEach(function (x, i) { x.setAttribute('aria-pressed', String(SIZES[i].id === current)); });
      });
      box.appendChild(b);
      return b;
    });

    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
