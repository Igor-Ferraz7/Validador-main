/* Botão "Manuais oficiais" no cabeçalho dos validadores.
 *
 * Uso (depois de docs/cnab/catalogo.js):
 *   <script src="docs/cnab/catalogo.js"></script>
 *   <script src="assets/docs-cnab.js" data-banco="033"></script>
 *
 * Lista os manuais do banco (e o padrão FEBRABAN) a partir do catálogo, com
 * link para o site oficial e, quando a página é aberta do disco, para a cópia
 * local baixada por tools/baixar-docs.ps1 (os PDFs não são publicados).
 * Usa as variáveis de cor da página (--bk, --br, ...).
 */
(function () {
  var script = document.currentScript;
  var codigo = script && script.getAttribute('data-banco');
  var cat = window.CNAB_DOCS;
  if (!codigo || !cat) return;

  var banco = null;
  for (var i = 0; i < cat.bancos.length; i++) if (cat.bancos[i].codigo === codigo) banco = cat.bancos[i];
  if (!banco) return;

  var local = location.protocol === 'file:';

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

  var html = '<div class="cnabdoc-h">Manuais oficiais · ' + esc(banco.nome) + ' (' + esc(banco.codigo) + ')</div>';
  // A versão-base só faz sentido na página do próprio validador.
  var naPaginaDoValidador = banco.validador &&
    decodeURIComponent(location.pathname).slice(-banco.validador.length) === banco.validador;
  if (banco.baseDoValidador && naPaginaDoValidador) {
    html += '<div class="cnabdoc-b">Este validador segue: <b>' + esc(banco.baseDoValidador) + '</b></div>';
  }
  html += '<ul>' + banco.documentos.map(function (d) { return itemHtml(banco.pasta, d); }).join('') + '</ul>';
  (cat.referencias || []).forEach(function (r) {
    html += '<div class="cnabdoc-s">Referência · ' + esc(r.nome) + '</div>' +
      '<ul>' + r.documentos.map(function (d) { return itemHtml(r.pasta, d); }).join('') + '</ul>';
  });
  html += '<div class="cnabdoc-f">Catálogo atualizado em ' + esc(cat.atualizadoEm) + '</div>';

  var css =
    '.cnabdoc-wrap{position:relative;display:flex;align-items:center;gap:10px;}' +
    '.cnabdoc-btn{font-family:var(--mono,monospace);font-size:11px;font-weight:700;cursor:pointer;' +
      'padding:6px 12px;border-radius:100px;border:1px solid var(--bk,#333);background:#fff;color:var(--bk,#333);' +
      'display:inline-flex;align-items:center;gap:6px;transition:background .15s,color .15s;}' +
    '.cnabdoc-btn:hover,.cnabdoc-btn[aria-expanded="true"]{background:var(--bk,#333);color:#fff;}' +
    '.cnabdoc-pop{position:absolute;right:0;top:calc(100% + 10px);z-index:1000;width:440px;max-width:calc(100vw - 32px);' +
      'max-height:70vh;overflow:auto;background:var(--cd,#fff);color:var(--tx,#111);border:1px solid var(--br,#ddd);' +
      'border-top:3px solid var(--bk,#333);border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.14);padding:14px 16px;' +
      'font-family:var(--mono,monospace);font-size:11px;line-height:1.5;text-align:left;}' +
    '.cnabdoc-pop[hidden]{display:none;}' +
    '.cnabdoc-h{font-family:var(--sans,sans-serif);font-weight:700;font-size:13px;margin-bottom:4px;}' +
    '.cnabdoc-b{color:var(--txd,#666);margin-bottom:10px;}' +
    '.cnabdoc-s{margin:12px 0 4px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--txd,#666);font-weight:700;}' +
    '.cnabdoc-pop ul{list-style:none;margin:0;padding:0;}' +
    '.cnabdoc-pop li{padding:10px 0;border-top:1px solid var(--br,#ddd);}' +
    '.cnabdoc-t{font-weight:700;}' +
    '.cnabdoc-m{color:var(--txd,#666);}' +
    '.cnabdoc-o{color:var(--txd,#666);font-style:italic;margin-top:2px;}' +
    '.cnabdoc-l{display:flex;gap:14px;margin-top:6px;}' +
    '.cnabdoc-l a{color:var(--bk,#333);font-weight:700;text-decoration:none;}' +
    '.cnabdoc-l a:hover{text-decoration:underline;}' +
    '.cnabdoc-f{margin-top:10px;padding-top:8px;border-top:1px solid var(--br,#ddd);color:var(--txd,#666);font-size:10px;}';

  function mount() {
    var header = document.querySelector('header');
    if (!header) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    // botão + popover ficam num bloco à direita, junto da etiqueta .htag
    var wrap = document.createElement('div');
    wrap.className = 'cnabdoc-wrap';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cnabdoc-btn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'cnabdoc-pop');
    btn.textContent = '📄 Manuais oficiais';
    var pop = document.createElement('div');
    pop.id = 'cnabdoc-pop';
    pop.className = 'cnabdoc-pop';
    pop.hidden = true;
    pop.innerHTML = html;

    var htag = header.querySelector('.htag');
    if (htag) header.insertBefore(wrap, htag);
    else header.appendChild(wrap);
    wrap.appendChild(btn);
    if (htag) wrap.appendChild(htag);
    wrap.appendChild(pop);

    function setOpen(open) {
      pop.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); setOpen(pop.hidden); });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
