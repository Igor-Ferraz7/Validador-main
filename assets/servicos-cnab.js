/* Quadro "Tipos de serviço e finalidades" no rodapé das páginas de banco.
 *
 * Uso (depois de configs/servicos.js):
 *   <script src="configs/servicos.js"></script>
 *   <script src="assets/servicos-cnab.js" data-banco="237"></script>
 *
 * Com data-banco="auto" o banco inicial vem do atributo data-banco do <html>,
 * e a página troca chamando window.CnabServicos.montar('341') — é o que o
 * Preenchedor faz ao mudar de template.
 *
 * O quadro é desenhado num <canvas> a partir de configs/servicos.js, e não
 * guardado como imagem pronta: assim a figura nunca descola dos dados, segue o
 * tema claro/escuro e a cor do banco, e continua sendo baixável como PNG —
 * exatamente a mesma figura que está na tela. "Expandir" abre em tamanho
 * cheio; "Baixar PNG" salva em 3x.
 *
 * Junto do canvas vai uma versão em texto, escondida da tela mas visível para
 * leitor de tela e para quem quiser copiar os códigos.
 */
(function () {
  var script = document.currentScript;
  var inicial = script && script.getAttribute('data-banco');
  var DADOS = window.CNAB_SERVICOS;
  if (!DADOS) return;

  /* ---------- medidas do desenho (em pontos lógicos) ---------- */
  var W = 680, PAD = 20;
  var CPX = 16, CPY = 14;          // respiro interno do cartão de segmento
  var FAIXA = 34;                  // altura da tarja do segmento
  var COLGAP = 20;
  var INNER = W - 2 * PAD;
  var BODY = INNER - 2 * CPX;
  var COL1 = 232, COL2 = BODY - COL1 - COLGAP;
  var BPX = 10, BPY = 7, LH = 16, SUBH = 13, ITEMGAP = 6, ROTH = 18;
  var FAM = '"Mona Sans","Segoe UI",system-ui,-apple-system,sans-serif';

  // Acento de cada segmento: [tema claro, tema escuro].
  var ACENTO = {
    A: ['#0b5cad', '#74b8f2'],
    J: ['#6b4fa8', '#bda4ec'],
    O: ['#8f5b00', '#e3ad4e'],
    N: ['#18794e', '#63c795']
  };

  var raiz = null, canvas = null, legenda = null, pngCache = '';

  /* ---------- cores vindas do sistema visual ---------- */
  // As variáveis do ui.css usam color-mix(); o navegador só resolve isso ao
  // aplicar a cor em um elemento, então lemos de volta já como rgb().
  var sonda = null;
  function corVar(nome, reserva) {
    if (!sonda) {
      sonda = document.createElement('span');
      sonda.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;';
      document.body.appendChild(sonda);
    }
    sonda.style.color = reserva;
    sonda.style.color = 'var(' + nome + ',' + reserva + ')';
    return getComputedStyle(sonda).color || reserva;
  }

  // Aceita rgb()/rgba() (o que corVar devolve) e hexadecimal (os acentos de
  // segmento, que são literais aqui no arquivo).
  function rgb(cor) {
    var s = String(cor).trim();
    var h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(s);
    if (h) {
      var v = h[1];
      if (v.length === 3) v = v[0] + v[0] + v[1] + v[1] + v[2] + v[2];
      var n = parseInt(v, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    var m = /(-?[\d.]+)[,\s]+(-?[\d.]+)[,\s]+(-?[\d.]+)/.exec(s);
    return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
  }
  function alfa(cor, a) {
    var c = rgb(cor);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }
  function escuro() {
    var c = rgb(corVar('--bg', '#ffffff'));
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) < 128;
  }

  function paleta() {
    var dk = escuro();
    return {
      dk: dk,
      fundo: corVar('--cd', dk ? '#1b1a17' : '#ffffff'),
      tx: corVar('--tx', dk ? '#f2efe9' : '#14120e'),
      txd: corVar('--txd', dk ? '#9c968a' : '#69645a'),
      br: corVar('--br', dk ? '#34322c' : '#e9e6e0'),
      cd2: corVar('--cd2', dk ? '#201f1b' : '#fbfaf8'),
      bk: corVar('--bk', '#16140f'),
      ac: corVar('--ac', '#16140f'),
      acento: function (seg) {
        var par = ACENTO[seg] || ACENTO.A;
        return par[dk ? 1 : 0];
      }
    };
  }

  /* ---------- utilidades de desenho ---------- */
  function fonte(ctx, peso, tam) { ctx.font = peso + ' ' + tam + 'px ' + FAM; }

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function quebrar(ctx, txt, maxW) {
    var partes = String(txt).split(' '), linhas = [], atual = '';
    for (var i = 0; i < partes.length; i++) {
      var tentativa = atual ? atual + ' ' + partes[i] : partes[i];
      if (atual && ctx.measureText(tentativa).width > maxW) { linhas.push(atual); atual = partes[i]; }
      else atual = tentativa;
    }
    if (atual) linhas.push(atual);
    return linhas.length ? linhas : [''];
  }

  /* ---------- passo 1: medir ---------- */
  // Devolve o layout com as linhas já quebradas e a altura de cada peça, para
  // só então criar o canvas do tamanho certo.
  function medir(ctx, banco) {
    function coluna(itens, largura) {
      var altura = ROTH, blocos = [];
      itens.forEach(function (it, i) {
        var mostraGrupo = !!it.grupo && (i === 0 || itens[i - 1].grupo !== it.grupo);
        fonte(ctx, 600, 12.5);
        var codW = ctx.measureText(it.cod).width;
        fonte(ctx, 400, 12.5);
        var linhas = quebrar(ctx, it.txt, largura - 2 * BPX - codW - 7);
        var h = 2 * BPY + linhas.length * LH + (mostraGrupo ? SUBH : 0);
        blocos.push({ it: it, grupo: mostraGrupo ? it.grupo : '', linhas: linhas, codW: codW, h: h, y: altura });
        altura += h + ITEMGAP;
      });
      return { blocos: blocos, altura: altura - ITEMGAP };
    }

    var segmentos = banco.segmentos.map(function (s) {
      var c1 = coluna(s.servicos, COL1);
      var c2 = coluna(s.finalidades, COL2);
      var corpo = Math.max(c1.altura, c2.altura);
      var notas = [];
      if (s.notas && s.notas.length) {
        fonte(ctx, 400, 11.5);
        s.notas.forEach(function (n) { notas.push(quebrar(ctx, n, BODY - 14)); });
        corpo += 10;
        notas.forEach(function (ls) { corpo += ls.length * 15 + 4; });
      }
      return { s: s, c1: c1, c2: c2, notas: notas, altura: FAIXA + CPY + corpo + CPY };
    });

    var topo = PAD + 24 + 8 + 2 + 10 + 15 + 18;   // título, régua e subtítulo
    var total = topo;
    segmentos.forEach(function (g) { total += g.altura + 14; });
    return { segmentos: segmentos, topo: topo, altura: total - 14 + PAD };
  }

  /* ---------- passo 2: desenhar ---------- */
  function desenhar(ctx, banco, codigo, lay, p) {
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = p.fundo;
    ctx.fillRect(0, 0, W, lay.altura);

    // título: selo com o código do banco + nome, régua na cor do banco
    var y = PAD + 17;
    ctx.fillStyle = p.ac;
    rr(ctx, PAD, y - 13, 34, 18, 4);
    ctx.fill();
    fonte(ctx, 600, 11);
    ctx.fillStyle = corVar('--acc', '#fff');
    ctx.textAlign = 'center';
    ctx.fillText(codigo, PAD + 17, y + 1);
    ctx.textAlign = 'left';

    fonte(ctx, 600, 13.5);
    ctx.fillStyle = p.ac;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.06em';
    ctx.fillText('BANCO ' + banco.nome.toUpperCase(), PAD + 44, y + 1);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

    y += 11;
    ctx.fillStyle = alfa(p.ac, p.dk ? 0.55 : 0.85);
    ctx.fillRect(PAD, y, INNER, 2);

    y += 12;
    fonte(ctx, 400, 12);
    ctx.fillStyle = p.txd;
    ctx.fillText('Tipos de serviço e finalidades homologados · CNAB 240', PAD, y + 9);

    y = lay.topo;

    lay.segmentos.forEach(function (g) {
      var ac = p.acento(g.s.seg);

      // moldura do cartão
      ctx.fillStyle = p.cd2;
      rr(ctx, PAD, y, INNER, g.altura, 8); ctx.fill();
      ctx.strokeStyle = p.br; ctx.lineWidth = 1;
      rr(ctx, PAD + .5, y + .5, INNER - 1, g.altura - 1, 8); ctx.stroke();

      // tarja do segmento
      ctx.save();
      rr(ctx, PAD + .5, y + .5, INNER - 1, g.altura - 1, 8); ctx.clip();
      ctx.fillStyle = alfa(ac, p.dk ? 0.16 : 0.08);
      ctx.fillRect(PAD, y, INNER, FAIXA);
      ctx.fillStyle = p.br;
      ctx.fillRect(PAD, y + FAIXA - 1, INNER, 1);
      ctx.restore();

      // selo da letra do segmento
      ctx.fillStyle = alfa(ac, p.dk ? 0.3 : 0.16);
      rr(ctx, PAD + CPX, y + 9, 17, 17, 4); ctx.fill();
      fonte(ctx, 600, 11);
      ctx.fillStyle = ac;
      ctx.textAlign = 'center';
      ctx.fillText(g.s.seg, PAD + CPX + 8.5, y + 21);
      ctx.textAlign = 'left';

      fonte(ctx, 600, 12.5);
      ctx.fillStyle = ac;
      ctx.fillText('Segmento ' + g.s.seg + ' — ' + g.s.titulo, PAD + CPX + 25, y + 21);

      // colunas
      var topoCorpo = y + FAIXA + CPY;
      coluna(ctx, g.c1, PAD + CPX, topoCorpo, COL1, 'TIPO DE SERVIÇO', p);
      coluna(ctx, g.c2, PAD + CPX + COL1 + COLGAP, topoCorpo, COL2, 'FINALIDADE', p);

      // notas do banco, quando existem
      if (g.notas.length) {
        var ny = topoCorpo + Math.max(g.c1.altura, g.c2.altura) + 12;
        fonte(ctx, 400, 11.5);
        ctx.fillStyle = p.txd;
        g.notas.forEach(function (linhas) {
          linhas.forEach(function (l, i) {
            ctx.fillText((i === 0 ? '· ' : '  ') + l, PAD + CPX, ny + 11);
            ny += 15;
          });
          ny += 4;
        });
      }

      y += g.altura + 14;
    });
  }

  function coluna(ctx, col, x, y, largura, rotulo, p) {
    fonte(ctx, 500, 9.5);
    ctx.fillStyle = p.txd;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.09em';
    ctx.fillText(rotulo, x, y + 8);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

    col.blocos.forEach(function (b) {
      var by = y + b.y;
      ctx.fillStyle = p.dk ? alfa(p.tx, 0.06) : alfa(p.ac, 0.05);
      rr(ctx, x, by, largura, b.h, 6); ctx.fill();

      fonte(ctx, 600, 12.5);
      ctx.fillStyle = p.tx;
      ctx.fillText(b.it.cod, x + BPX, by + BPY + 12);

      var tx = x + BPX + b.codW + 7;
      fonte(ctx, 400, 12.5);
      ctx.fillStyle = p.tx;
      b.linhas.forEach(function (l, i) { ctx.fillText(l, tx, by + BPY + 12 + i * LH); });

      if (b.grupo) {
        fonte(ctx, 400, 10.5);
        ctx.fillStyle = p.txd;
        ctx.fillText(b.grupo, tx, by + BPY + 12 + b.linhas.length * LH + 1);
      }
    });
  }

  /* ---------- render ---------- */
  function render(codigo) {
    var banco = DADOS[codigo];
    if (!banco || !canvas) return;
    var p = paleta();
    var medidor = document.createElement('canvas').getContext('2d');
    var lay = medir(medidor, banco);

    var e = 2;
    canvas.width = Math.round(W * e);
    canvas.height = Math.round(lay.altura * e);
    canvas.style.width = W + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(e, 0, 0, e, 0, 0);
    desenhar(ctx, banco, codigo, lay, p);
    canvas.setAttribute('aria-label', 'Tipos de serviço e finalidades do ' + banco.nome);
    pngCache = '';
  }

  // PNG em 3x, redesenhado fora da tela para sair nítido em qualquer zoom.
  function png() {
    if (pngCache) return pngCache;
    var codigo = raiz.getAttribute('data-codigo');
    var banco = DADOS[codigo];
    var p = paleta();
    var medidor = document.createElement('canvas').getContext('2d');
    var lay = medir(medidor, banco);
    var e = 3;
    var c = document.createElement('canvas');
    c.width = Math.round(W * e);
    c.height = Math.round(lay.altura * e);
    var ctx = c.getContext('2d');
    ctx.setTransform(e, 0, 0, e, 0, 0);
    desenhar(ctx, banco, codigo, lay, p);
    pngCache = c.toDataURL('image/png');
    return pngCache;
  }

  function baixar() {
    var codigo = raiz.getAttribute('data-codigo');
    var a = document.createElement('a');
    a.href = png();
    a.download = 'servicos-finalidades-' + codigo + '-' +
      DADOS[codigo].nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- versão em texto (leitor de tela e cópia) ---------- */
  function textoHtml(banco) {
    function lista(itens) {
      return '<ul>' + itens.map(function (i) {
        return '<li>' + i.cod + ' — ' + i.txt + (i.grupo ? ' (' + i.grupo + ')' : '') + '</li>';
      }).join('') + '</ul>';
    }
    return banco.segmentos.map(function (s) {
      return '<h4>Segmento ' + s.seg + ' — ' + s.titulo + '</h4>' +
        '<p>Tipo de serviço:</p>' + lista(s.servicos) +
        '<p>Finalidade:</p>' + lista(s.finalidades) +
        (s.notas && s.notas.length ? '<ul>' + s.notas.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul>' : '');
    }).join('');
  }

  /* ---------- UI ---------- */
  var CSS =
    '.svc{margin-top:32px;}' +
    '.svc[hidden]{display:none;}' +
    '.svc-h{display:flex;align-items:center;justify-content:space-between;gap:12px 16px;flex-wrap:wrap;margin-bottom:12px;}' +
    '.svc-t{font-size:15px;font-weight:600;}' +
    '.svc-t span{display:block;font-size:13px;font-weight:400;color:var(--txd);}' +
    '.svc-b{display:flex;gap:8px;}' +
    '.svc-b button{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;font-size:13px;font-weight:500;' +
      'color:var(--tx);background:var(--cd);border:1px solid var(--br2);border-radius:var(--r-md,6px);transition:background .15s;}' +
    '.svc-b button:hover{background:var(--cd2);}' +
    '.svc-b svg{width:14px;height:14px;}' +
    '.svc-c{background:var(--cd);border:1px solid var(--br);border-radius:var(--r-lg,8px);padding:8px;overflow:auto;}' +
    '.svc-c canvas{display:block;max-width:100%;height:auto;margin:0 auto;}' +
    '.svc-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;}' +
    '.svc-ov{position:fixed;inset:0;z-index:2000;display:flex;flex-direction:column;gap:12px;padding:24px;' +
      'background:rgba(22,20,15,.72);overflow:auto;}' +
    '.svc-ov[hidden]{display:none;}' +
    '.svc-ov-b{display:flex;gap:8px;justify-content:flex-end;}' +
    '.svc-ov-b button{padding:8px 14px;font-size:13px;font-weight:500;color:var(--tx);background:var(--cd);' +
      'border:1px solid var(--br2);border-radius:var(--r-md,6px);}' +
    '.svc-ov img{display:block;margin:auto;max-width:100%;height:auto;border-radius:var(--r-lg,8px);' +
      'box-shadow:0 20px 60px rgba(0,0,0,.4);}';

  var IC_EXP = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9"/></svg>';
  var IC_DL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M2.5 12.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1"/></svg>';

  var overlay = null, overImg = null;

  function abrirOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'svc-ov';
      overlay.hidden = true;
      overlay.innerHTML =
        '<div class="svc-ov-b"><button type="button" data-dl>Baixar PNG</button>' +
        '<button type="button" data-fechar>Fechar</button></div><img alt="">';
      document.body.appendChild(overlay);
      overImg = overlay.querySelector('img');
      overlay.querySelector('[data-dl]').addEventListener('click', baixar);
      overlay.querySelector('[data-fechar]').addEventListener('click', fecharOverlay);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) fecharOverlay(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && !overlay.hidden) fecharOverlay();
      });
    }
    var codigo = raiz.getAttribute('data-codigo');
    overImg.src = png();
    overImg.alt = 'Tipos de serviço e finalidades do ' + DADOS[codigo].nome;
    overlay.hidden = false;
  }
  function fecharOverlay() { if (overlay) overlay.hidden = true; }

  function criar() {
    var alvo = document.querySelector('[data-servicos]') || document.querySelector('.wrap');
    if (!alvo) return false;
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    raiz = document.createElement('section');
    raiz.className = 'svc';
    raiz.innerHTML =
      '<div class="svc-h"><div class="svc-t">Tipos de serviço e finalidades' +
      '<span>O que o banco homologou para cada segmento. Posições 10-11 e 15-16 do header de lote.</span></div>' +
      '<div class="svc-b">' +
      '<button type="button" data-exp>' + IC_EXP + 'Expandir</button>' +
      '<button type="button" data-dl>' + IC_DL + 'Baixar PNG</button>' +
      '</div></div>' +
      '<div class="svc-c"><canvas role="img"></canvas></div>' +
      '<div class="svc-sr"></div>';
    if (alvo.hasAttribute('data-servicos')) alvo.appendChild(raiz);
    else alvo.appendChild(raiz);

    canvas = raiz.querySelector('canvas');
    legenda = raiz.querySelector('.svc-sr');
    raiz.querySelector('[data-exp]').addEventListener('click', abrirOverlay);
    raiz.querySelector('[data-dl]').addEventListener('click', baixar);

    // Redesenha quando o tema muda, para o quadro acompanhar claro/escuro.
    new MutationObserver(function () {
      var c = raiz.getAttribute('data-codigo');
      if (c) render(c);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-banco'] });

    return true;
  }

  /* Mostra o quadro do banco informado; sem dados, esconde a seção. */
  function montar(codigo) {
    if (!raiz && !criar()) return;
    var banco = DADOS[codigo];
    raiz.hidden = !banco;
    fecharOverlay();
    if (!banco) return;
    raiz.setAttribute('data-codigo', codigo);
    legenda.innerHTML = '<h3>Tipos de serviço e finalidades · ' + banco.nome + '</h3>' + textoHtml(banco);
    // As fontes da página mudam a medida do texto: só desenha depois de prontas.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { render(codigo); });
    else render(codigo);
  }

  window.CnabServicos = { montar: montar };

  function iniciar() {
    var codigo = inicial === 'auto' ? document.documentElement.getAttribute('data-banco') : inicial;
    if (codigo) montar(codigo);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
