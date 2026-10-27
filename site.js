/* ============================================================
   会計エンテック事務所 — shared behaviour
   v2.0 · 2026-10-26
   Every feature degrades safely: if the element is absent, the
   block is skipped. Nothing here talks to a network endpoint.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var LANG_KEY = 'entech-lang';
  var LANGS = ['ja', 'zh', 'en'];

  /* ---------- 枠 · session colour --------------------------------------------
     The logo's solid square is filled with --square-500. Swapping that one token
     repaints the logo, every CTA, the focus rings and the swatch in a single
     move — no second asset, no re-export, no rasterised variant.

     Persisted in localStorage next to the language so one session keeps both.
     PRODUCTION NOTE: the session colour is a brand decision, not a visitor
     setting. Ship the five --square-* values per deployment (or per campaign);
     keep the picker itself on the design-system / handoff pages only. The
     ?square= parameter is what the client uses to preview a colour. */
  var SQ_KEY = 'entech-square';
  var SQ = {
    g1:   { n: '翠 エメラルド',     c: ['#E4F8F0', '#1DC386', '#19A874', '#117952', '#1DC386'] },
    o1:   { n: '朱橙 バーミリオン', c: ['#FDEBE4', '#F1561E', '#E2460E', '#AF3509', '#F1561E'] },
    b1:   { n: '藍 ブルー',        c: ['#E5EDF7', '#2466BC', '#1F58A2', '#153E74', '#5085C9'] },
    c1:   { n: 'シアン',           c: ['#E3F4F8', '#15A1C1', '#128AA5', '#0B6074', '#15A1C1'] },
    p1:   { n: '紫 パープル',      c: ['#F0E7F7', '#7F3BBA', '#6F34A3', '#522579', '#A06ECC'] },
    m1:   { n: '桃 マゼンタ',      c: ['#FBE6EF', '#DD2C79', '#CA216A', '#9B1751', '#E14589'] },
    g5:   { n: '深緑 ディープ',    c: ['#E3EEE9', '#15754B', '#105B3A', '#072C1C', '#44916F'] },
    o5:   { n: '焦茶橙 バーント',  c: ['#F5EAE2', '#AA4C0E', '#8E3F0C', '#5B2807', '#BB703E'] },
    mono: { n: '墨 スミ',          c: ['#F4F6F7', '#23292E', '#1A1F23', '#0E1113', '#C9CED3'] }
  };
  var SQ_DEFAULT = 'g1';

  function applySquare(key) {
    if (!SQ[key]) key = SQ_DEFAULT;
    var c = SQ[key].c;
    root.style.setProperty('--square-100', c[0]);
    root.style.setProperty('--square-500', c[1]);
    root.style.setProperty('--square-600', c[2]);
    root.style.setProperty('--square-700', c[3]);
    root.style.setProperty('--square-dark', c[4]);
    document.querySelectorAll('[data-square]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-square') === key));
    });
    document.querySelectorAll('[data-square-label]').forEach(function (el) {
      el.textContent = SQ[key].n + '  ' + c[1];
    });
    try { localStorage.setItem(SQ_KEY, key); } catch (e) {}
  }

  (function initSquare() {
    var k = null;
    try { k = new URLSearchParams(location.search).get('square'); } catch (e) {}
    if (!k || !SQ[k]) {
      try { k = localStorage.getItem(SQ_KEY); } catch (e) {}
    }
    applySquare(k || SQ_DEFAULT);
  })();

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-square]');
    if (b) applySquare(b.getAttribute('data-square'));
  });

  /* Page-level metadata per locale.
     Production splits these into separate URLs (/ , /zh-tw/ , /en/)
     each with its own <title>/<meta>; the prototype swaps them live so
     one file can be reviewed in three languages. */
  var META = {
    home: {
      ja: {
        title: '会計エンテック事務所｜会計・財務業務の自動化とDX設計',
        desc: '会計エンテック事務所は、記帳・請求・経費・月次レポートなど会計財務業務の自動化を設計する事務所です。Power Automate・UiPath・AIエージェント・Power BI を用い、会計領域に限らず業務プロセスの自動化を設計・実装します。'
      },
      zh: {
        title: '会計エンテック事務所｜會計財務流程自動化與 DX 設計',
        desc: '会計エンテック事務所專注設計會計財務流程自動化：記帳、請款、費用、月結報表。運用 Power Automate、UiPath、AI Agent 與 Power BI，從流程本體出發設計，不限於會計領域。'
      },
      en: {
        title: 'Entech Office — Accounting & Finance Automation and DX Design',
        desc: 'Entech Office designs automation for accounting and finance work — bookkeeping, invoicing, expenses, monthly reporting — with Power Automate, UiPath, AI agents and Power BI.'
      }
    },
    courses: {
      ja: {
        title: '講座｜会計エンテック事務所 — 会計業務の自動化を実務から学ぶ',
        desc: '会計・財務業務を題材に、業務の分解からフロー設計、ツールでの実装までを扱う講座。初級・中級・上級の3段階、単堂講座と開講準備中のコースを掲載しています。'
      },
      zh: {
        title: '課程｜会計エンテック事務所 — 從實務學會計流程自動化',
        desc: '以會計財務業務為題材，從流程拆解、流程設計到工具實作的系列課程。分初級、中級、進階三級，收錄單堂課程與開課準備中的完整課程。'
      },
      en: {
        title: 'Courses — Learn Accounting Automation from Real Practice | Entech Office',
        desc: 'Courses built on real accounting and finance work: breaking down a process, designing the flow, then implementing it in a tool. Three levels, single-session classes and full courses in preparation.'
      }
    },
    member: {
      ja: {
        title: '会員機能は準備中｜会計エンテック事務所',
        desc: '会計エンテック事務所の会員機能は現在準備中です。'
      },
      zh: {
        title: '會員功能準備中｜会計エンテック事務所',
        desc: '会計エンテック事務所的會員功能目前仍在準備中。'
      },
      en: {
        title: 'Member Access Coming Soon | Entech Office',
        desc: 'Member access at Entech Office is currently in preparation.'
      }
    },
    design: {
      ja: { title: 'UI デザインシステム｜会計エンテック事務所', desc: '' },
      zh: { title: 'UI 設計系統｜会計エンテック事務所', desc: '' },
      en: { title: 'UI Design System | Entech Office', desc: '' }
    }
  };

  var HTML_LANG = { ja: 'ja', zh: 'zh-Hant', en: 'en' };

  function readLang() {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (q && LANGS.indexOf(q) > -1) return q;
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved && LANGS.indexOf(saved) > -1) return saved;
    return 'ja';
  }

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', HTML_LANG[lang] || 'ja');

    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });

    /* option labels */
    document.querySelectorAll('option[data-ja]').forEach(function (o) {
      var v = o.getAttribute('data-' + lang);
      if (v) o.textContent = v;
    });

    /* placeholders */
    document.querySelectorAll('[data-ph-ja]').forEach(function (el) {
      var v = el.getAttribute('data-ph-' + lang);
      if (v) el.setAttribute('placeholder', v);
    });

    /* page metadata */
    var page = document.body.getAttribute('data-page') || 'home';
    var pack = META[page] && META[page][lang];
    if (pack) {
      if (pack.title) document.title = pack.title;
      var d = document.querySelector('meta[name="description"]');
      if (d && pack.desc) d.setAttribute('content', pack.desc);
      var ogt = document.querySelector('meta[property="og:title"]');
      if (ogt && pack.title) ogt.setAttribute('content', pack.title);
      var ogd = document.querySelector('meta[property="og:description"]');
      if (ogd && pack.desc) ogd.setAttribute('content', pack.desc);
    }

    document.querySelectorAll('[data-lang-live]').forEach(function (el) {
      el.textContent = lang === 'ja' ? '日本語' : (lang === 'zh' ? '繁體中文' : 'English');
    });

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  applyLang(readLang());
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-set-lang]');
    if (b) applyLang(b.getAttribute('data-set-lang'));
  });

  /* ---------- Mobile navigation ---------- */
  var mBtn = document.querySelector('[data-mnav-toggle]');
  var mNav = document.querySelector('[data-mnav]');
  if (mBtn && mNav) {
    mBtn.addEventListener('click', function () {
      var open = mNav.getAttribute('data-open') === '1';
      mNav.setAttribute('data-open', open ? '0' : '1');
      mBtn.setAttribute('aria-expanded', String(!open));
    });
    mNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        mNav.setAttribute('data-open', '0');
        mBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Member features are not public yet ---------- */

  /* ---------- Course filters (courses.html) ---------- */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var cardsAll = Array.prototype.slice.call(document.querySelectorAll('[data-ccard]'));
    var countEl = document.querySelector('[data-cresult]');
    var emptyEl = document.querySelector('[data-cempty]');

    function activeSet(kind) {
      var hit = filterBar.querySelector('[data-fkind="' + kind + '"][aria-pressed="true"]');
      return hit ? hit.getAttribute('data-fval') : 'all';
    }
    function runFilter() {
      var cat = activeSet('cat');
      var lvl = activeSet('lvl');
      var shown = 0;
      cardsAll.forEach(function (c) {
        var okCat = cat === 'all' || c.getAttribute('data-cat') === cat;
        var okLvl = lvl === 'all' || c.getAttribute('data-lvl') === lvl;
        var show = okCat && okLvl;
        c.hidden = !show;
        if (show) shown++;
      });
      if (countEl) countEl.textContent = String(shown);
      if (emptyEl) emptyEl.setAttribute('data-on', shown === 0 ? '1' : '0');
    }
    filterBar.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-fkind]');
      if (!b) return;
      var kind = b.getAttribute('data-fkind');
      filterBar.querySelectorAll('[data-fkind="' + kind + '"]').forEach(function (x) {
        x.setAttribute('aria-pressed', String(x === b));
      });
      runFilter();
    });
    runFilter();
  }

  /* ---------- Prototype forms: validate in page, never post ---------- */
  document.querySelectorAll('form[data-proto-form]').forEach(function (form) {
    var ok = form.querySelector('[data-form-ok]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      form.querySelectorAll('input[required],select[required],textarea[required]').forEach(function (el) {
        var wrap = el.closest('.field');
        var err = wrap && wrap.querySelector('[data-field-err]');
        var valid = el.checkValidity();
        el.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (err) err.setAttribute('data-on', valid ? '0' : '1');
        if (!valid && !bad) { bad = true; el.focus(); }
      });
      if (ok) ok.setAttribute('data-on', bad ? '0' : '1');
      if (!bad && ok) ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
