import { useState } from “react”;
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from “recharts”;

const SENHA_ADMIN = “casavelha2026”;

const LIMITE_MEI = 81000;

const PRODUTOS_INIT = [
{ id: “tg250”, nome: “Café Torrado em Grão 250g”,      preco: 22.0, cat: “Grão”,       emoji: “☕” },
{ id: “tg500”, nome: “Café Torrado em Grão 500g”,      preco: 40.0, cat: “Grão”,       emoji: “☕” },
{ id: “tm250”, nome: “Café Torrado Moído 250g”,         preco: 20.0, cat: “Moído”,      emoji: “🫙” },
{ id: “tm500”, nome: “Café Torrado Moído 500g”,         preco: 36.0, cat: “Moído”,      emoji: “🫙” },
{ id: “kt”,    nome: “Kit Degustação (grão + moído)”,   preco: 55.0, cat: “Kit”,        emoji: “🎁” },
{ id: “as”,    nome: “Assinatura Mensal 500g Moído”,    preco: 32.0, cat: “Assinatura”, emoji: “🔁” },
];

const CLIENTES_INIT = [
{ id: 1, nome: “Maria Silva”,  tel: “11991234567”, token: “maria-abc123” },
{ id: 2, nome: “João Pereira”, tel: “11987654321”, token: “joao-def456” },
{ id: 3, nome: “Ana Costa”,    tel: “11976543210”, token: “ana-ghi789” },
];

const PEDIDOS_INIT = [
{ id: 1, cid: 1, data: “28/03/2026”, mes: “Mar”, valor: 80,  itens: “☕ Grão 500g x1, 🫙 Moído 250g x2”, status: “Entregue”, cats: { Grão: 40, Moído: 40 } },
{ id: 2, cid: 1, data: “14/03/2026”, mes: “Mar”, valor: 55,  itens: “🎁 Kit Degustação x1”,               status: “Entregue”, cats: { Kit: 55 } },
{ id: 3, cid: 2, data: “30/03/2026”, mes: “Mar”, valor: 40,  itens: “☕ Grão 500g x1”,                    status: “Entregue”, cats: { Grão: 40 } },
{ id: 4, cid: 2, data: “15/02/2026”, mes: “Fev”, valor: 64,  itens: “🫙 Moído 500g x1, ☕ Grão 250g x1”,  status: “Entregue”, cats: { Moído: 36, Grão: 22 } },
{ id: 5, cid: 3, data: “31/03/2026”, mes: “Mar”, valor: 32,  itens: “🔁 Assinatura Mensal x1”,             status: “Entregue”, cats: { Assinatura: 32 } },
{ id: 6, cid: 3, data: “10/01/2026”, mes: “Jan”, valor: 55,  itens: “🎁 Kit Degustação x1”,               status: “Entregue”, cats: { Kit: 55 } },
{ id: 7, cid: 1, data: “20/01/2026”, mes: “Jan”, valor: 72,  itens: “☕ Grão 500g x1, 🔁 Assinatura x1”,  status: “Entregue”, cats: { Grão: 40, Assinatura: 32 } },
{ id: 8, cid: 2, data: “05/02/2026”, mes: “Fev”, valor: 110, itens: “🎁 Kit Degustação x2”,               status: “Entregue”, cats: { Kit: 110 } },
];

// ── TEMA ─────────────────────────────────────────────────────────────────────
const C = {
bg: “#faf8f5”, surface: “#ffffff”, border: “#e8e0d5”,
text: “#2c2118”, muted: “#8a7868”, accent: “#5c3d1e”,
gold: “#c8902a”, green: “#4a7c59”, red: “#c0392b”,
};
const fmt   = v => “R$ “ + Number(v).toFixed(2).replace(”.”, “,”);
const root  = { minHeight: “100vh”, background: C.bg, color: C.text, fontFamily: “‘Georgia’, serif” };
const card  = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 };
const inp   = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: “10px 14px”, color: C.text, fontSize: 14, fontFamily: “Georgia, serif”, width: “100%”, boxSizing: “border-box”, outline: “none” };
const lbl   = { fontSize: 11, color: C.muted, display: “block”, marginBottom: 4, letterSpacing: “0.06em”, textTransform: “uppercase” };

function Btn({ children, variant = “primary”, onClick, full, small, style = {} }) {
const s = {
primary:   { background: C.accent, color: “#fff”, border: “none” },
secondary: { background: “transparent”, color: C.accent, border: `1.5px solid ${C.accent}` },
ghost:     { background: “transparent”, color: C.muted, border: `1px solid ${C.border}` },
danger:    { background: C.red, color: “#fff”, border: “none” },
success:   { background: C.green, color: “#fff”, border: “none” },
};
return (
<button onClick={onClick} style={{ …s[variant], borderRadius: 8, padding: small ? “6px 14px” : “10px 20px”, cursor: “pointer”, fontSize: small ? 12 : 13, fontFamily: “Georgia, serif”, fontWeight: “bold”, width: full ? “100%” : undefined, letterSpacing: “0.02em”, …style }}>
{children}
</button>
);
}
function Badge({ children, color = C.muted }) {
return <span style={{ background: color + “18”, color, border: `1px solid ${color}40`, borderRadius: 20, padding: “3px 10px”, fontSize: 11, fontWeight: “bold” }}>{children}</span>;
}

function Navbar({ titulo, abas, aba, setAba, onSair }) {
return (
<div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: “0 24px”, display: “flex”, alignItems: “center”, justifyContent: “space-between”, height: 56, flexWrap: “wrap”, gap: 8 }}>
<span style={{ color: C.accent, fontWeight: “bold”, fontSize: 16, letterSpacing: “0.03em” }}>{titulo}</span>
<div style={{ display: “flex”, gap: 2, flexWrap: “wrap” }}>
{abas.map(a => (
<button key={a.k} onClick={() => setAba(a.k)} style={{ background: “transparent”, color: aba === a.k ? C.accent : C.muted, border: “none”, borderBottom: aba === a.k ? `2px solid ${C.accent}` : “2px solid transparent”, padding: “0 14px”, height: 56, cursor: “pointer”, fontSize: 13, fontFamily: “Georgia, serif”, fontWeight: aba === a.k ? “bold” : “normal” }}>{a.l}</button>
))}
</div>
<Btn variant="ghost" onClick={onSair} small>Sair</Btn>
</div>
);
}

// ── SPLASH ────────────────────────────────────────────────────────────────────
function Splash({ onAdmin, onCliente }) {
return (
<div style={{ …root, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<div style={{ textAlign: “center”, maxWidth: 360, padding: “0 24px” }}>
<div style={{ fontSize: 52, marginBottom: 16 }}>☕</div>
<h1 style={{ fontSize: 28, color: C.accent, margin: “0 0 6px”, letterSpacing: “0.04em” }}>Café Casa Velha</h1>
<p style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>Agroindústria Rural Familiar</p>
<div style={{ width: 40, height: 2, background: C.gold, margin: “0 auto 36px” }} />
<div style={{ display: “flex”, flexDirection: “column”, gap: 12 }}>
<Btn variant=“primary” onClick={onCliente} full style={{ padding: “14px 0”, fontSize: 15 }}>Área do Cliente</Btn>
<Btn variant=“ghost”   onClick={onAdmin}   full style={{ padding: “12px 0” }}>Gestão</Btn>
</div>
<p style={{ color: C.border, fontSize: 11, marginTop: 28 }}>Use o código recebido por WhatsApp para entrar</p>
</div>
</div>
);
}

// ── LOGIN CLIENTE ─────────────────────────────────────────────────────────────
function LoginCliente({ clientes, onLogin, onVoltar }) {
const [token, setToken] = useState(””);
const [erro, setErro]   = useState(false);
const tentar = () => {
const c = clientes.find(x => x.token === token.trim());
if (c) { setErro(false); onLogin(c); } else setErro(true);
};
return (
<div style={{ …root, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<div style={{ …card, maxWidth: 360, width: “90%”, margin: 24 }}>
<Btn variant=“ghost” onClick={onVoltar} small style={{ marginBottom: 24 }}>← Voltar</Btn>
<h2 style={{ color: C.accent, marginBottom: 4, fontSize: 20 }}>Bem-vindo(a)</h2>
<p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Cole o código recebido pelo WhatsApp</p>
<span style={lbl}>Código de acesso</span>
<input style={{ …inp, borderColor: erro ? C.red : C.border, marginBottom: 6 }} placeholder=“Ex: maria-abc123” value={token} onChange={e => setToken(e.target.value)} onKeyDown={e => e.key === “Enter” && tentar()} />
{erro && <p style={{ color: C.red, fontSize: 12, marginBottom: 8 }}>Código inválido. Tente novamente.</p>}
<Btn variant=“primary” onClick={tentar} full style={{ marginTop: 12, padding: 13 }}>Entrar</Btn>
<div style={{ marginTop: 20, background: C.bg, borderRadius: 8, padding: “12px 14px”, fontSize: 12, color: C.muted, borderLeft: `3px solid ${C.gold}` }}>
<strong style={{ color: C.gold }}>Códigos de teste:</strong><br />
maria-abc123 · joao-def456 · ana-ghi789
</div>
</div>
</div>
);
}

// ── LOGIN ADMIN ───────────────────────────────────────────────────────────────
function LoginAdmin({ onLogin, onVoltar }) {
const [senha, setSenha] = useState(””);
const [erro, setErro]   = useState(false);
const tentar = () => {
if (senha === SENHA_ADMIN) { setErro(false); onLogin(); }
else { setErro(true); setSenha(””); }
};
return (
<div style={{ …root, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<div style={{ …card, maxWidth: 360, width: “90%”, margin: 24 }}>
<Btn variant=“ghost” onClick={onVoltar} small style={{ marginBottom: 24 }}>← Voltar</Btn>
<div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
<h2 style={{ color: C.accent, marginBottom: 4, fontSize: 20 }}>Área Restrita</h2>
<p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Digite a senha de administrador</p>
<span style={lbl}>Senha</span>
<input
type=“password”
style={{ …inp, borderColor: erro ? C.red : C.border, marginBottom: 6 }}
placeholder=”••••••••”
value={senha}
onChange={e => setSenha(e.target.value)}
onKeyDown={e => e.key === “Enter” && tentar()}
/>
{erro && <p style={{ color: C.red, fontSize: 12, marginBottom: 8 }}>Senha incorreta.</p>}
<Btn variant=“primary” onClick={tentar} full style={{ marginTop: 12, padding: 13 }}>Entrar</Btn>
<p style={{ color: C.border, fontSize: 11, marginTop: 16, textAlign: “center” }}>Senha padrão: casavelha2026</p>
</div>
</div>
);
}

// ── ÁREA DO CLIENTE ───────────────────────────────────────────────────────────
function AreaCliente({ cliente, pedidos, produtos, onNovoPedido, onSair }) {
const [aba, setAba]           = useState(“inicio”);
const [carrinho, setCarrinho] = useState({});
const [obs, setObs]           = useState(””);
const [ok, setOk]             = useState(false);

const meusPedidos   = pedidos.filter(p => p.cid === cliente.id);
const totalGasto    = meusPedidos.reduce((a, p) => a + p.valor, 0);
const totalCarrinho = Object.entries(carrinho).reduce((a, [id, q]) => {
const p = produtos.find(x => x.id === id);
return a + (p ? p.preco * q : 0);
}, 0);

const finalizar = () => {
if (!totalCarrinho) return;
const desc = Object.entries(carrinho).filter(([, q]) => q > 0).map(([id, q]) => { const p = produtos.find(x => x.id === id); return `${p.emoji} ${p.nome} x${q}`; }).join(”, “);
const cats = {};
Object.entries(carrinho).filter(([, q]) => q > 0).forEach(([id, q]) => { const p = produtos.find(x => x.id === id); cats[p.cat] = (cats[p.cat] || 0) + p.preco * q; });
onNovoPedido({ id: Date.now(), cid: cliente.id, data: “01/04/2026”, mes: “Abr”, valor: totalCarrinho, itens: desc, status: “Pendente”, cats, obs });
setCarrinho({}); setObs(””); setOk(true);
setTimeout(() => { setOk(false); setAba(“historico”); }, 2200);
};

const abas = [{ k: “inicio”, l: “Início” }, { k: “pedido”, l: “Fazer Pedido” }, { k: “historico”, l: “Meus Pedidos” }];

return (
<div style={root}>
<Navbar titulo="☕ Café Casa Velha" abas={abas} aba={aba} setAba={setAba} onSair={onSair} />
<div style={{ maxWidth: 820, margin: “0 auto”, padding: “32px 20px” }}>
{ok && <div style={{ background: “#eaf4ee”, border: `1px solid ${C.green}`, borderRadius: 10, padding: “14px 18px”, marginBottom: 20, color: C.green, fontWeight: “bold” }}>✅ Pedido realizado! Entraremos em contato pelo WhatsApp.</div>}

```
    {aba === "inicio" && (
      <div>
        <h2 style={{ color: C.accent, marginBottom: 4 }}>Olá, {cliente.nome.split(" ")[0]} 👋</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>Bem-vindo(a) à sua área de pedidos.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
          {[{ label: "Pedidos realizados", val: meusPedidos.length, icon: "📦" }, { label: "Total investido", val: fmt(totalGasto), icon: "💰" }, { label: "Último pedido", val: meusPedidos[0]?.data || "—", icon: "📅" }].map((s, i) => (
            <div key={i} style={{ ...card, textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: "bold", color: C.accent }}>{s.val}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <Btn variant="primary" onClick={() => setAba("pedido")} style={{ padding: "13px 28px", fontSize: 14 }}>Fazer novo pedido →</Btn>
      </div>
    )}

    {aba === "pedido" && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <h2 style={{ color: C.accent, marginBottom: 18, fontSize: 18 }}>Produtos</h2>
          {produtos.map(p => {
            const q = carrinho[p.id] || 0;
            return (
              <div key={p.id} style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, padding: "14px 18px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: 13, marginBottom: 2 }}>{p.nome}</div>
                  <div style={{ color: C.gold, fontSize: 13, fontWeight: "bold" }}>{fmt(p.preco)}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{p.cat}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => setCarrinho(c => ({ ...c, [p.id]: Math.max(0, (c[p.id] || 0) - 1) }))} style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>−</button>
                  <span style={{ fontSize: 14, fontWeight: "bold", minWidth: 20, textAlign: "center" }}>{q}</span>
                  <button onClick={() => setCarrinho(c => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }))} style={{ background: C.accent, border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "sticky", top: 20 }}>
          <div style={card}>
            <h2 style={{ color: C.accent, marginBottom: 18, fontSize: 18 }}>Resumo do Pedido</h2>
            {Object.entries(carrinho).filter(([, q]) => q > 0).length === 0
              ? <p style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "24px 0" }}>Nenhum item selecionado</p>
              : <>
                {Object.entries(carrinho).filter(([, q]) => q > 0).map(([id, q]) => {
                  const p = produtos.find(x => x.id === id);
                  return (
                    <div key={id} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, padding: "9px 0", fontSize: 13 }}>
                      <span>{p.emoji} {p.nome} × {q}</span>
                      <span style={{ fontWeight: "bold" }}>{fmt(p.preco * q)}</span>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 10px", fontWeight: "bold", fontSize: 15, borderTop: `2px solid ${C.border}` }}>
                  <span>Total</span><span style={{ color: C.accent }}>{fmt(totalCarrinho)}</span>
                </div>
                <span style={lbl}>Observações</span>
                <textarea style={{ ...inp, minHeight: 70, resize: "vertical", marginBottom: 14 }} placeholder="Moagem, ponto de torra, endereço..." value={obs} onChange={e => setObs(e.target.value)} />
                <Btn variant="primary" onClick={finalizar} full style={{ padding: 13 }}>Confirmar pedido</Btn>
              </>}
          </div>
        </div>
      </div>
    )}

    {aba === "historico" && (
      <div>
        <h2 style={{ color: C.accent, marginBottom: 20, fontSize: 18 }}>Meus Pedidos</h2>
        {meusPedidos.length === 0
          ? <div style={{ ...card, textAlign: "center", padding: 48, color: C.muted }}>Você ainda não fez nenhum pedido.</div>
          : meusPedidos.map(p => (
            <div key={p.id} style={{ ...card, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: "bold", color: C.muted, fontSize: 13 }}>{p.data}</span>
                <Badge color={p.status === "Entregue" ? C.green : C.gold}>{p.status}</Badge>
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{p.itens}</div>
              <div style={{ fontWeight: "bold", fontSize: 15, color: C.accent }}>{fmt(p.valor)}</div>
            </div>
          ))}
      </div>
    )}
  </div>
</div>
```

);
}

// ── ÁREA ADMIN ────────────────────────────────────────────────────────────────
function AreaAdmin({ clientes, setClientes, pedidos, setPedidos, produtos, setProdutos, onSair }) {
const [aba, setAba] = useState(“dashboard”);
const abas = [{ k: “dashboard”, l: “Dashboard” }, { k: “produtos”, l: “Produtos” }, { k: “clientes”, l: “Clientes” }, { k: “pedidos”, l: “Pedidos” }, { k: “mei”, l: “MEI” }, { k: “links”, l: “Links” }];
return (
<div style={root}>
<Navbar titulo="☕ Café Casa Velha — Gestão" abas={abas} aba={aba} setAba={setAba} onSair={onSair} />
<div style={{ maxWidth: 1000, margin: “0 auto”, padding: “32px 20px” }}>
{aba === “dashboard” && <Dashboard clientes={clientes} pedidos={pedidos} />}
{aba === “produtos”  && <Produtos  produtos={produtos} setProdutos={setProdutos} />}
{aba === “clientes”  && <Clientes  clientes={clientes} setClientes={setClientes} pedidos={pedidos} />}
{aba === “pedidos”   && <Pedidos   clientes={clientes} pedidos={pedidos} />}
{aba === “mei”       && <MEI       pedidos={pedidos} />}
{aba === “links”     && <Links     clientes={clientes} />}
</div>
</div>
);
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ clientes, pedidos }) {
const total   = pedidos.reduce((a, p) => a + p.valor, 0);
const meses   = [“Jan”, “Fev”, “Mar”];
const grafico = meses.map(m => ({ mes: m, valor: pedidos.filter(p => p.mes === m).reduce((a, p) => a + p.valor, 0) }));
return (
<div>
<h2 style={{ color: C.accent, marginBottom: 20, fontSize: 20 }}>Visão Geral</h2>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(3,1fr)”, gap: 16, marginBottom: 24 }}>
{[{ label: “Clientes ativos”, val: clientes.length, icon: “👥”, cor: “#4a6fa5” }, { label: “Faturamento total”, val: fmt(total), icon: “💰”, cor: C.green }, { label: “Pedidos realizados”, val: pedidos.length, icon: “📦”, cor: C.gold }].map((s, i) => (
<div key={i} style={{ …card, borderTop: `3px solid ${s.cor}`, textAlign: “center”, padding: 20 }}>
<div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
<div style={{ fontSize: 22, fontWeight: “bold”, color: s.cor }}>{s.val}</div>
<div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{s.label}</div>
</div>
))}
</div>
<div style={card}>
<h3 style={{ color: C.accent, marginBottom: 16, fontSize: 15 }}>Faturamento por Mês</h3>
<ResponsiveContainer width="100%" height={200}>
<BarChart data={grafico} barSize={36}>
<XAxis dataKey=“mes” stroke={C.muted} tick={{ fontSize: 12 }} />
<YAxis stroke={C.muted} tick={{ fontSize: 12 }} tickFormatter={v => `R$${v}`} />
<Tooltip formatter={v => fmt(v)} contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8 }} />
<Bar dataKey=“valor” fill={C.accent} radius={[6, 6, 0, 0]} />
</BarChart>
</ResponsiveContainer>
</div>
</div>
);
}

// ── PRODUTOS (edição de preço) ────────────────────────────────────────────────
function Produtos({ produtos, setProdutos }) {
const [editando, setEditando] = useState(null); // id do produto em edição
const [tmpPreco, setTmpPreco] = useState(””);

const iniciarEdicao = (p) => { setEditando(p.id); setTmpPreco(String(p.preco)); };
const salvar = (id) => {
const novoPreco = parseFloat(tmpPreco.replace(”,”, “.”));
if (!isNaN(novoPreco) && novoPreco > 0) {
setProdutos(prev => prev.map(p => p.id === id ? { …p, preco: novoPreco } : p));
}
setEditando(null);
};

return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}>
<div>
<h2 style={{ color: C.accent, fontSize: 20, margin: “0 0 4px” }}>Produtos</h2>
<p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Clique em ✏️ para editar o preço de um produto.</p>
</div>
</div>
<div style={card}>
<table style={{ width: “100%”, borderCollapse: “collapse”, fontSize: 13 }}>
<thead>
<tr>{[“Produto”, “Categoria”, “Preço”, “”].map(h => (
<th key={h} style={{ textAlign: “left”, padding: “10px 14px”, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, letterSpacing: “0.06em”, textTransform: “uppercase” }}>{h}</th>
))}</tr>
</thead>
<tbody>
{produtos.map(p => (
<tr key={p.id}>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, fontWeight: “bold” }}>{p.emoji} {p.nome}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}` }}><Badge color={C.muted}>{p.cat}</Badge></td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}` }}>
{editando === p.id
? (
<div style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
<span style={{ color: C.muted, fontSize: 13 }}>R$</span>
<input
autoFocus
style={{ …inp, width: 90, padding: “6px 10px”, fontSize: 14 }}
value={tmpPreco}
onChange={e => setTmpPreco(e.target.value)}
onKeyDown={e => { if (e.key === “Enter”) salvar(p.id); if (e.key === “Escape”) setEditando(null); }}
/>
</div>
)
: <span style={{ color: C.gold, fontWeight: “bold” }}>{fmt(p.preco)}</span>
}
</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, textAlign: “right” }}>
{editando === p.id
? (
<div style={{ display: “flex”, gap: 8, justifyContent: “flex-end” }}>
<Btn variant=“success” small onClick={() => salvar(p.id)}>Salvar</Btn>
<Btn variant=“ghost” small onClick={() => setEditando(null)}>Cancelar</Btn>
</div>
)
: <Btn variant=“ghost” small onClick={() => iniciarEdicao(p)}>✏️ Editar</Btn>
}
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}

// ── CLIENTES ──────────────────────────────────────────────────────────────────
function Clientes({ clientes, setClientes, pedidos }) {
const [form, setForm] = useState({ nome: “”, tel: “”, token: “” });
const [show, setShow] = useState(false);
const salvar = () => {
if (!form.nome) return;
const token = form.token || `${form.nome.split(" ")[0].toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`;
setClientes(prev => […prev, { …form, id: Date.now(), token }]);
setForm({ nome: “”, tel: “”, token: “” }); setShow(false);
};
return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}>
<h2 style={{ color: C.accent, fontSize: 20, margin: 0 }}>Clientes</h2>
<Btn variant=“primary” onClick={() => setShow(!show)}>+ Novo Cliente</Btn>
</div>
{show && (
<div style={{ …card, marginBottom: 20 }}>
<h3 style={{ color: C.accent, marginBottom: 16, fontSize: 15 }}>Cadastrar Cliente</h3>
{[[“nome”, “Nome *”], [“tel”, “Telefone (WhatsApp)”], [“token”, “Código de acesso (deixe em branco para gerar)”]].map(([k, l]) => (
<div key={k} style={{ marginBottom: 14 }}>
<span style={lbl}>{l}</span>
<input style={inp} value={form[k]} onChange={e => setForm(p => ({ …p, [k]: e.target.value }))} />
</div>
))}
<div style={{ display: “flex”, gap: 10 }}>
<Btn variant="success" onClick={salvar}>Salvar</Btn>
<Btn variant=“ghost” onClick={() => setShow(false)}>Cancelar</Btn>
</div>
</div>
)}
<div style={card}>
<table style={{ width: “100%”, borderCollapse: “collapse”, fontSize: 13 }}>
<thead>
<tr>{[“Nome”, “Telefone”, “Pedidos”, “Total Gasto”].map(h => (
<th key={h} style={{ textAlign: “left”, padding: “10px 14px”, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, letterSpacing: “0.06em”, textTransform: “uppercase” }}>{h}</th>
))}</tr>
</thead>
<tbody>
{clientes.map(c => {
const cp  = pedidos.filter(p => p.cid === c.id);
const tot = cp.reduce((a, p) => a + p.valor, 0);
return (
<tr key={c.id}>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, fontWeight: “bold” }}>{c.nome}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, color: C.muted }}>{c.tel}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}` }}>{cp.length}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, color: C.green, fontWeight: “bold” }}>{fmt(tot)}</td>
</tr>
);
})}
</tbody>
</table>
</div>
</div>
);
}

// ── PEDIDOS ───────────────────────────────────────────────────────────────────
function Pedidos({ clientes, pedidos }) {
return (
<div>
<h2 style={{ color: C.accent, marginBottom: 20, fontSize: 20 }}>Todos os Pedidos</h2>
<div style={card}>
<table style={{ width: “100%”, borderCollapse: “collapse”, fontSize: 13 }}>
<thead>
<tr>{[“Cliente”, “Data”, “Produtos”, “Valor”, “Status”].map(h => (
<th key={h} style={{ textAlign: “left”, padding: “10px 14px”, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, letterSpacing: “0.06em”, textTransform: “uppercase” }}>{h}</th>
))}</tr>
</thead>
<tbody>
{pedidos.map(p => {
const c = clientes.find(x => x.id === p.cid);
return (
<tr key={p.id}>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, fontWeight: “bold” }}>{c?.nome || “—”}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, color: C.muted }}>{p.data}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, color: C.muted, fontSize: 12 }}>{p.itens}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, color: C.accent, fontWeight: “bold” }}>{fmt(p.valor)}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}` }}><Badge color={p.status === “Entregue” ? C.green : C.gold}>{p.status}</Badge></td>
</tr>
);
})}
</tbody>
</table>
</div>
</div>
);
}

// ── MEI ───────────────────────────────────────────────────────────────────────
function MEI({ pedidos }) {
const total    = pedidos.reduce((a, p) => a + p.valor, 0);
const pct      = Math.min((total / LIMITE_MEI) * 100, 100);
const projecao = (total / 3) * 12;
const meses    = [“Jan”, “Fev”, “Mar”];
const grafico  = meses.map(m => ({ mes: m, valor: pedidos.filter(p => p.mes === m).reduce((a, p) => a + p.valor, 0) }));
const cats     = {};
pedidos.forEach(p => Object.entries(p.cats || {}).forEach(([k, v]) => { cats[k] = (cats[k] || 0) + v; }));
const pizzaData = Object.entries(cats).map(([name, value]) => ({ name, value }));
const CORES    = [C.accent, C.green, C.gold, “#4a6fa5”, “#a05c7b”];
const exportar = () => {
const csv  = [[“Mês”, “Faturamento”], …grafico.map(g => [g.mes, g.valor.toFixed(2)])].map(l => l.join(”,”)).join(”\n”);
const a = Object.assign(document.createElement(“a”), { href: URL.createObjectURL(new Blob([csv], { type: “text/csv” })), download: “relatorio-mei.csv” });
a.click();
};
return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}>
<h2 style={{ color: C.accent, fontSize: 20, margin: 0 }}>Controle MEI — 2026</h2>
<Btn variant="success" onClick={exportar}>↓ Exportar CSV</Btn>
</div>
<div style={{ …card, marginBottom: 20 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 10, fontSize: 13 }}>
<span style={{ color: C.muted }}>Limite anual MEI: <strong style={{ color: C.text }}>R$ 81.000</strong></span>
<span style={{ fontWeight: “bold”, color: pct > 80 ? C.red : C.green }}>{pct.toFixed(1)}% utilizado</span>
</div>
<div style={{ background: C.bg, borderRadius: 8, height: 14, overflow: “hidden”, marginBottom: 20 }}>
<div style={{ width: `${pct}%`, height: “100%”, background: pct > 80 ? C.red : C.green, borderRadius: 8, transition: “width 1s” }} />
</div>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(4,1fr)”, gap: 12 }}>
{[{ label: “Faturado”, val: fmt(total), cor: C.green }, { label: “Limite/ano”, val: fmt(LIMITE_MEI), cor: “#4a6fa5” }, { label: “Restante”, val: fmt(Math.max(LIMITE_MEI - total, 0)), cor: total > LIMITE_MEI ? C.red : C.text }, { label: “Projeção anual”, val: fmt(projecao), cor: projecao > LIMITE_MEI ? C.red : C.gold }].map((s, i) => (
<div key={i} style={{ textAlign: “center” }}>
<div style={{ fontWeight: “bold”, color: s.cor, fontSize: 15 }}>{s.val}</div>
<div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{s.label}</div>
</div>
))}
</div>
{projecao > LIMITE_MEI && <div style={{ marginTop: 14, background: “#fef0ee”, border: `1px solid ${C.red}`, borderRadius: 8, padding: “10px 14px”, fontSize: 12, color: C.red }}>⚠️ Projeção anual ultrapassa o limite MEI. Recomenda-se consultar um contador.</div>}
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 20, marginBottom: 20 }}>
<div style={card}>
<h3 style={{ color: C.accent, marginBottom: 14, fontSize: 14 }}>Faturamento Mensal</h3>
<ResponsiveContainer width="100%" height={180}>
<BarChart data={grafico} barSize={30}><XAxis dataKey=“mes” stroke={C.muted} tick={{ fontSize: 11 }} /><YAxis stroke={C.muted} tick={{ fontSize: 11 }} tickFormatter={v => `R$${v}`} /><Tooltip formatter={v => fmt(v)} contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8 }} /><Bar dataKey=“valor” fill={C.accent} radius={[4, 4, 0, 0]} /></BarChart>
</ResponsiveContainer>
</div>
<div style={card}>
<h3 style={{ color: C.accent, marginBottom: 14, fontSize: 14 }}>Por Categoria</h3>
<ResponsiveContainer width="100%" height={180}>
<PieChart><Pie data={pizzaData} dataKey=“value” nameKey=“name” cx=“50%” cy=“50%” outerRadius={68} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11} labelLine={false}>{pizzaData.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}</Pie><Tooltip formatter={v => fmt(v)} contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8 }} /></PieChart>
</ResponsiveContainer>
</div>
</div>
<div style={card}>
<h3 style={{ color: C.accent, marginBottom: 14, fontSize: 14 }}>Detalhamento por Mês</h3>
<table style={{ width: “100%”, borderCollapse: “collapse”, fontSize: 13 }}>
<thead><tr>{[“Mês”, “Faturamento”, “% do Limite MEI”].map(h => <th key={h} style={{ textAlign: “left”, padding: “10px 14px”, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, textTransform: “uppercase”, letterSpacing: “0.05em” }}>{h}</th>)}</tr></thead>
<tbody>
{grafico.map(g => { const p = (g.valor / LIMITE_MEI) * 100; return (
<tr key={g.mes}>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, fontWeight: “bold” }}>{g.mes} 2026</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}`, color: C.green, fontWeight: “bold” }}>{fmt(g.valor)}</td>
<td style={{ padding: “12px 14px”, borderBottom: `1px solid ${C.bg}` }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<div style={{ flex: 1, background: C.bg, borderRadius: 6, height: 8 }}><div style={{ width: `${Math.min(p, 100)}%`, height: “100%”, borderRadius: 6, background: C.green }} /></div>
<span style={{ fontSize: 11, color: C.muted, minWidth: 44 }}>{p.toFixed(2)}%</span>
</div>
</td>
</tr>
); })}
</tbody>
</table>
</div>
</div>
);
}

// ── LINKS ─────────────────────────────────────────────────────────────────────
function Links({ clientes }) {
const [copiado, setCopiado] = useState(null);
const copiar = (token, id) => { navigator.clipboard.writeText(token); setCopiado(id); setTimeout(() => setCopiado(null), 2000); };
return (
<div>
<h2 style={{ color: C.accent, marginBottom: 6, fontSize: 20 }}>Links de Acesso</h2>
<p style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>Envie o código pelo WhatsApp para cada cliente acessar a área dele.</p>
<div style={{ display: “flex”, flexDirection: “column”, gap: 12 }}>
{clientes.map(c => {
const msg = encodeURIComponent(`Olá, ${c.nome.split(" ")[0]}! ☕ Seu código de acesso ao Café Casa Velha: *${c.token}*`);
const wa  = `https://wa.me/55${(c.tel || "").replace(/\D/g, "")}?text=${msg}`;
return (
<div key={c.id} style={{ …card, display: “flex”, alignItems: “center”, justifyContent: “space-between”, flexWrap: “wrap”, gap: 14 }}>
<div>
<div style={{ fontWeight: “bold”, marginBottom: 6 }}>{c.nome}</div>
<code style={{ fontSize: 13, color: C.gold, background: C.bg, padding: “4px 10px”, borderRadius: 6, border: `1px solid ${C.border}` }}>{c.token}</code>
</div>
<div style={{ display: “flex”, gap: 10 }}>
<Btn variant={copiado === c.id ? “success” : “ghost”} small onClick={() => copiar(c.token, c.id)}>{copiado === c.id ? “✓ Copiado” : “Copiar código”}</Btn>
<a href={wa} target=”_blank” rel=“noreferrer” style={{ background: “#25d366”, color: “#fff”, border: “none”, borderRadius: 8, padding: “6px 16px”, cursor: “pointer”, fontSize: 12, fontFamily: “Georgia, serif”, fontWeight: “bold”, textDecoration: “none”, display: “inline-block” }}>💬 WhatsApp</a>
</div>
</div>
);
})}
</div>
</div>
);
}

// ── RAIZ ──────────────────────────────────────────────────────────────────────
export default function Root() {
const [tela, setTela]               = useState(“splash”);
const [clienteLogado, setClienteLogado] = useState(null);
const [clientes, setClientes]       = useState(CLIENTES_INIT);
const [pedidos,  setPedidos]        = useState(PEDIDOS_INIT);
const [produtos, setProdutos]       = useState(PRODUTOS_INIT);

if (tela === “splash”)      return <Splash    onAdmin={() => setTela(“login-admin”)} onCliente={() => setTela(“login-cliente”)} />;
if (tela === “login-cliente”) return <LoginCliente clientes={clientes} onLogin={c => { setClienteLogado(c); setTela(“cliente”); }} onVoltar={() => setTela(“splash”)} />;
if (tela === “login-admin”) return <LoginAdmin onLogin={() => setTela(“admin”)} onVoltar={() => setTela(“splash”)} />;
if (tela === “cliente” && clienteLogado) return (
<AreaCliente cliente={clienteLogado} pedidos={pedidos} produtos={produtos}
onNovoPedido={p => setPedidos(prev => [p, …prev])}
onSair={() => { setTela(“splash”); setClienteLogado(null); }} />
);
if (tela === “admin”) return (
<AreaAdmin clientes={clientes} setClientes={setClientes}
pedidos={pedidos} setPedidos={setPedidos}
produtos={produtos} setProdutos={setProdutos}
onSair={() => setTela(“splash”)} />
);
return null;
}
