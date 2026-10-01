// 田崎土建 提案用デモ：メニュー開閉とデモ応募フォーム
// フォームの入力内容は外部送信・保存・ログ出力を一切行わない。
(function () {
  'use strict';

  // スマホメニュー
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('global-nav');
  function closeNav() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); toggle.focus(); }
  });

  // デモ応募フォーム
  var form = document.getElementById('apply-form');
  var steps = {};
  form.querySelectorAll('.form-step').forEach(function (el) { steps[el.dataset.step] = el; });
  var $ = function (id) { return document.getElementById(id); };

  function show(step) {
    Object.keys(steps).forEach(function (k) { steps[k].hidden = (k !== step); });
    var focusEl = steps[step].querySelector('[tabindex="-1"]') || steps[step].querySelector('input');
    if (focusEl) focusEl.focus({ preventScroll: true });
    form.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function setError(input, errId, msg) {
    var err = $(errId);
    if (msg) {
      err.textContent = msg; err.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      err.textContent = ''; err.hidden = true;
      input.removeAttribute('aria-invalid');
    }
    return !msg;
  }

  function validate() {
    var name = $('f-name'), kana = $('f-kana'), tel = $('f-tel'), mail = $('f-mail'), agree = $('f-agree');
    var telVal = tel.value.replace(/[‐－ー−\s]/g, '-').trim();
    var results = [
      setError(name, 'e-name', name.value.trim() ? '' : 'お名前を入力してください。'),
      setError(kana, 'e-kana', !kana.value.trim() ? 'ふりがなを入力してください。'
        : (/^[ぁ-んー\s　]+$/.test(kana.value.trim()) ? '' : 'ふりがなは、ひらがなで入力してください。')),
      setError(tel, 'e-tel', !telVal ? '電話番号を入力してください。'
        : (/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/.test(telVal) && telVal.replace(/-/g, '').length >= 10 ? '' : '電話番号の形式を確認してください（例：0153-00-0000）。')),
      setError(mail, 'e-mail', !mail.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim()) ? '' : 'メールアドレスの形式を確認してください。'),
      setError(agree, 'e-agree', agree.checked ? '' : 'デモであることの確認にチェックを入れてください。')
    ];
    var firstBad = form.querySelector('[aria-invalid="true"]');
    if (firstBad) firstBad.focus();
    return results.every(Boolean);
  }

  function buildConfirm() {
    var license = form.querySelector('input[name="demo-license"]:checked');
    var rows = [
      ['お名前', $('f-name').value.trim()],
      ['ふりがな', $('f-kana').value.trim()],
      ['電話番号', $('f-tel').value.trim()],
      ['メールアドレス', $('f-mail').value.trim() || '（未入力）'],
      ['車両系建設機械の運転技能者の資格', license ? license.value : '（未選択）'],
      ['ご質問など', $('f-note').value.trim() || '（未入力）']
    ];
    var list = $('confirm-list');
    list.textContent = '';
    rows.forEach(function (r) {
      var div = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1];
      div.appendChild(dt); div.appendChild(dd); list.appendChild(div);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    buildConfirm();
    show('confirm');
  });
  $('btn-back').addEventListener('click', function () { show('input'); });
  $('btn-done').addEventListener('click', function () {
    form.reset();               // 入力内容を破棄（送信・保存はしない）
    $('confirm-list').textContent = '';
    show('done');
  });
  $('btn-reset').addEventListener('click', function () { show('input'); });
})();
