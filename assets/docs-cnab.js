/* Botão "Manuais oficiais" no cabeçalho das páginas de banco.
 *
 * Uso (depois de docs/cnab/catalogo.js):
 *   <script src="docs/cnab/catalogo.js"></script>
 *   <script src="assets/docs-cnab.js" data-banco="033"></script>
 *
 * Com data-banco="auto", o banco inicial vem do atributo data-banco do <html>,
 * e a página troca de banco chamando window.CnabDocs.montar('341') (usado pelo
 * Preenchedor, que muda de banco conforme o template escolhido).
 *
 * Lista os manuais do banco (e o padrão FEBRABAN) a partir do catálogo, com
 * link para o site oficial e, quando a página é aberta do disco, para a cópia
 * local baixada por tools/baixar-docs.ps1 (os PDFs não são publicados).
 * Usa as variáveis e o botão secundário de assets/ui.css.
 */
(function () {
  var script = document.currentScript;
  var inicial = script && script.getAttribute('data-banco');
  var cat = window.CNAB_DOCS;
  if (!cat) return;

  var local = location.protocol === 'file:';
  var btn = null, pop = null, wrap = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function itemHtml(pasta, d) {
    var meta = [d.versao ? 'versão ' + d.versao : '', d.data || ''].filter(Boolean).join(' · ');
    var links = '<a href="' + esc(d.url) + '" target="_blank" rel="noopener">Fonte oficial ↗</a>';
    if (local) {
      links += '<a href="docs/cnab/' + encodeURIComponent(pasta) + '/' + encodeURIComponent(d.arquivo) +
        '" target="_blank" title="Baixada por tools/baixar-docs.ps1">Cópia local</a>';
    }
    return '<li><div class="cnabdoc-t">' + esc(d.titulo) + '</div>' +
      (meta ? '<div class="cnabdoc-m">' + esc(meta) + '</div>' : '') +
      (d.observacao ? '<div class="cnabdoc-o">' + esc(d.observacao) + '</div>' : '') +
      '<div class="cnabdoc-l">' + links + '</div></li>';
  }

  function htmlDoBanco(banco) {
    var html = '<div class="cnabdoc-h">Manuais oficiais · ' + esc(banco.nome) + ' (' + esc(banco.codigo) + ')</div>';
    // A versão-base só faz sentido no validador de remessa, que carrega as
    // regras do banco em window.CNAB_REMESSA (validadores/<codigo>-<banco>.js).
    var naPaginaDoValidador = !!(window.CNAB_REMESSA && window.CNAB_REMESSA[banco.codigo]);
    if (banco.baseDoValidador && naPaginaDoValidador) {
      html += '<div class="cnabdoc-b">Este validador segue: <b>' + esc(banco.baseDoValidador) + '</b></div>';
    }
    html += '<ul>' + banco.documentos.map(function (d) { return itemHtml(banco.pasta, d); }).join('') + '</ul>';
    (cat.referencias || []).forEach(function (r) {
      html += '<div class="cnabdoc-s">Referência · ' + esc(r.nome) + '</div>' +
        '<ul>' + r.documentos.map(function (d) { return itemHtml(r.pasta, d); }).join('') + '</ul>';
    });
    return html + '<div class="cnabdoc-f">Catálogo atualizado em ' + esc(cat.atualizadoEm) + '</div>';
  }

  // O botão usa o desenho do botão secundário de assets/ui.css (.cnabdoc-btn).
  var css =
    '.cnabdoc-wrap{position:relative;display:flex;align-items:center;gap:16px;}' +
    '.cnabdoc-btn[hidden]{display:none;}' +
    '.cnabdoc-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:1000;width:440px;max-width:calc(100vw - 32px);' +
      'max-height:70vh;overflow:auto;background:var(--cd,#fff);color:var(--tx,#111);border:1px solid var(--br2,#ccc);' +
      'border-radius:8px;box-shadow:0 12px 32px rgba(22,20,15,.12);padding:16px 20px;' +
      'font-size:13px;line-height:1.5;text-align:left;}' +
    '.cnabdoc-pop[hidden]{display:none;}' +
    '.cnabdoc-h{font-weight:600;font-size:15px;margin-bottom:4px;}' +
    '.cnabdoc-b{color:var(--txd,#666);margin-bottom:12px;}' +
    '.cnabdoc-b b{color:var(--tx,#111);font-weight:600;}' +
    '.cnabdoc-s{margin:16px 0 4px;font-size:13px;color:var(--txd,#666);font-weight:500;}' +
    '.cnabdoc-pop ul{list-style:none;margin:0;padding:0;}' +
    '.cnabdoc-pop li{padding:12px 0;border-top:1px solid var(--br,#ddd);}' +
    '.cnabdoc-t{font-weight:600;font-size:14px;}' +
    '.cnabdoc-m{color:var(--txd,#666);}' +
    '.cnabdoc-o{color:var(--txd,#666);margin-top:2px;}' +
    '.cnabdoc-l{display:flex;gap:16px;margin-top:6px;}' +
    '.cnabdoc-l a{color:var(--tx,#111);font-weight:500;text-decoration:underline;text-decoration-color:var(--br2,#ccc);' +
      'text-underline-offset:3px;transition:text-decoration-color .15s;}' +
    '.cnabdoc-l a:hover{text-decoration-color:currentColor;}' +
    '.cnabdoc-f{margin-top:4px;padding-top:12px;border-top:1px solid var(--br,#ddd);color:var(--txd,#666);font-size:12px;}';

  var ICONE = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M9.5 1.5h-5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-9l-3-3Z"/>' +
    '<path d="M9.5 1.5v3h3M6 8.5h4M6 11h4"/></svg>';

  function setOpen(open) {
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  // Cria botão e popover à direita do cabeçalho, junto da .htag; ou dentro de
  // um elemento [data-manuais], quando a página tem um lugar próprio para ele.
  var estilo = false;
  function criar() {
    var alvo = document.querySelector('[data-manuais]');
    var header = alvo || document.querySelector('header');
    if (!header) return false;
    if (!estilo) {
      var st = document.createElement('style');
      st.textContent = css;
      document.head.appendChild(st);
      estilo = true;
    }

    wrap = document.createElement('div');
    wrap.className = 'cnabdoc-wrap';
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cnabdoc-btn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'cnabdoc-pop');
    btn.innerHTML = ICONE + 'Manuais oficiais';
    pop = document.createElement('div');
    pop.id = 'cnabdoc-pop';
    pop.className = 'cnabdoc-pop';
    pop.hidden = true;

    var htag = alvo ? null : header.querySelector('.htag');
    if (htag) header.insertBefore(wrap, htag);
    else header.appendChild(wrap);
    if (htag) wrap.appendChild(htag);
    wrap.appendChild(btn);
    wrap.appendChild(pop);

    btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(pop.hidden); });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
    if (!criar.ouvindo) {
      document.addEventListener('click', function () { if (pop) setOpen(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pop) setOpen(false); });
      criar.ouvindo = true;
    }
    return true;
  }

  /* Mostra os manuais do banco informado; sem manuais catalogados, esconde o botão.
     Se a página redesenhou o lugar do botão, ele é criado de novo. */
  function montar(codigo) {
    if ((!btn || !document.contains(wrap)) && !criar()) return;
    var banco = null;
    for (var i = 0; i < cat.bancos.length; i++) if (cat.bancos[i].codigo === codigo) banco = cat.bancos[i];
    setOpen(false);
    btn.hidden = !banco;
    pop.innerHTML = banco ? htmlDoBanco(banco) : '';
  }

  window.CnabDocs = { montar: montar };

  function iniciar() {
    var codigo = inicial === 'auto' ? document.documentElement.getAttribute('data-banco') : inicial;
    if (codigo) montar(codigo);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
