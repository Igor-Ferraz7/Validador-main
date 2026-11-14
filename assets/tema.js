/* Tema claro/escuro, comum a todas as páginas.
 *
 * Carregue no <head>, antes de assets/ui.css, para a página já abrir no tema certo:
 *   <script src="assets/tema.js"></script>
 *
 * O tema vale para a central inteira: fica salvo no navegador (ou segue o
 * sistema, enquanto ninguém escolher) e é posto em <html data-theme="light|dark">.
 * A central avisa a página aberta no iframe por postMessage; aberta sozinha,
 * a página ganha o próprio botão no cabeçalho.
 */
(function () {
  var CHAVE = 'cnab.tema';
  var root = document.documentElement;
  var ouvintes = [];
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function valido(t) { return t === 'dark' || t === 'light'; }
  function salvo() {
    try { var v = localStorage.getItem(CHAVE); return valido(v) ? v : null; } catch (e) { return null; }
  }
  function sistema() { return mq && mq.matches ? 'dark' : 'light'; }
  function atual() { return root.getAttribute('data-theme') || 'light'; }
  function aplicar(t) {
    root.setAttribute('data-theme', t);
    ouvintes.forEach(function (f) { f(t); });
  }
  function definir(t) {
    if (!valido(t)) return;
    try { localStorage.setItem(CHAVE, t); } catch (e) {}
    aplicar(t);
  }
  function alternar() { definir(atual() === 'dark' ? 'light' : 'dark'); }

  aplicar(salvo() || sistema());
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function () { if (!salvo()) aplicar(sistema()); });
  }
  // Aviso da central para a página no iframe.
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && valido(d.cnabTema)) aplicar(d.cnabTema);
  });

  var LUA = '<svg class="cnab-tema__lua" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z"/></svg>';
  var SOL = '<svg class="cnab-tema__sol" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="2.8"/><path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9"/></svg>';

  function botao() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cnab-tema';
    b.innerHTML = LUA + SOL;
    function rotulo(t) { b.setAttribute('aria-label', t === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'); b.title = b.getAttribute('aria-label'); }
    rotulo(atual());
    ouvintes.push(rotulo);
    b.addEventListener('click', alternar);
    return b;
  }

  window.CnabTema = {
    atual: atual, definir: definir, alternar: alternar, botao: botao,
    aoMudar: function (f) { ouvintes.push(f); }
  };

  // Página aberta sozinha (fora da central): botão no fim do cabeçalho.
  if (window.self === window.top) {
    document.addEventListener('DOMContentLoaded', function () {
      var header = document.querySelector('header');
      if (header) header.appendChild(botao());
    });
  }
})();
