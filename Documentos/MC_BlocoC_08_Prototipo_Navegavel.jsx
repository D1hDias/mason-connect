import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ============ MASON CONNECT — Protótipo de Alta Fidelidade (Fase 1) ============
   Design System: marrom #855023 · dourado #CAAA67 · creme #F5EFE3
   Dados de exemplo — nenhuma informação real. */

const C = {
  brown: "#855023", deep: "#4F2E12", gold: "#CAAA67", cream: "#F5EFE3",
  bg: "#FBF9F4", text: "#3A3A3A", soft: "#8A7A63",
  ok: "#4E7A3A", warn: "#B07A1F", crit: "#9E3B22",
};

const membros = [
  { id: 1, nome: "Leonardo A.", cat: "Gestor", seg: "Consultoria Empresarial", plano: "Anual", st: "ativo", faltas: 0 },
  { id: 2, nome: "Luetil S.", cat: "Gestor", seg: "Gestão Estratégica", plano: "Anual", st: "ativo", faltas: 0 },
  { id: 3, nome: "Harrison M.", cat: "Administrativo", seg: "Comunicação", plano: "Mensal", st: "ativo", faltas: 1 },
  { id: 4, nome: "Davi R.", cat: "Empresário", seg: "Advocacia Tributária", plano: "Mensal", st: "ativo", faltas: 2 },
  { id: 5, nome: "Eduardo M.", cat: "Empresário", seg: "Arquitetura", plano: "Mensal", st: "ativo", faltas: 0 },
  { id: 6, nome: "Jackson P.", cat: "Empresário", seg: "Seguros", plano: "Mensal", st: "pendente", faltas: 0 },
  { id: 7, nome: "Rafael T.", cat: "Empresário", seg: "Contabilidade", plano: "Gratuito", st: "ativo", faltas: 0 },
];

const indicacoesInit = [
  { id: 1, ind: "Davi R.", dest: "Eduardo M.", desc: "Projeto de sede para cliente do setor logístico", est: "fechado", valor: 85000, dias: 0 },
  { id: 2, ind: "Luetil S.", dest: "Davi R.", desc: "Reestruturação tributária de indústria alimentícia", est: "andamento", valor: null, dias: 3 },
  { id: 3, ind: "Eduardo M.", dest: "Rafael T.", desc: "Migração contábil de grupo com 3 CNPJs", est: "contato", valor: null, dias: 6 },
  { id: 4, ind: "Harrison M.", dest: "Jackson P.", desc: "Seguro empresarial para transportadora", est: "registrada", valor: null, dias: 8 },
  { id: 5, ind: "Leonardo A.", dest: "Luetil S.", desc: "Diagnóstico de gestão para rede de clínicas", est: "fechado", valor: 42000, dias: 0 },
];

const lancamentos = [
  { d: "01/07", desc: "Mensalidades competência 07/2026 (5 pagas)", cat: "Mensalidade", v: 650 },
  { d: "28/06", desc: "Coffee break — Coworking de junho", cat: "Coffee break", v: -380 },
  { d: "21/06", desc: "Mensalidade avulsa — Rafael T. (cortesia encerrada)", cat: "Mensalidade", v: 130 },
  { d: "14/06", desc: "Locação de sala — treinamento 12 Pilares", cat: "Evento", v: -450 },
  { d: "07/06", desc: "Mensalidades competência 06/2026 (6 pagas)", cat: "Mensalidade", v: 780 },
];

const evolucao = [
  { m: "Fev", valor: 38 }, { m: "Mar", valor: 55 }, { m: "Abr", valor: 47 },
  { m: "Mai", valor: 92 }, { m: "Jun", valor: 118 }, { m: "Jul", valor: 127 },
];
const porMembro = [
  { n: "Davi", q: 7 }, { n: "Luetil", q: 6 }, { n: "Eduardo", q: 5 }, { n: "Leonardo", q: 4 }, { n: "Harrison", q: 3 },
];

const EST = {
  registrada: { t: "Registrada", bg: C.cream, fg: "#6B4A2B" },
  contato: { t: "Em contato", bg: "#F3E4C8", fg: C.warn },
  andamento: { t: "Em andamento", bg: "#EADFC9", fg: C.brown },
  fechado: { t: "Fechado", bg: "#E4EBD9", fg: C.ok },
};

const fmt = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Badge({ children, bg, fg }) {
  return <span style={{ background: bg, color: fg }} className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide">{children}</span>;
}
function Card({ children, className = "", pad = true }) {
  return <div className={`bg-white rounded-xl ${pad ? "p-5" : ""} ${className}`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,.12)" }}>{children}</div>;
}
function SectionTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <h1 style={{ fontFamily: "Georgia, serif", color: C.brown }} className="text-3xl font-bold">{children}</h1>
      {sub && <p style={{ color: C.soft }} className="text-sm mt-1">{sub}</p>}
      <div style={{ background: C.gold }} className="h-0.5 w-16 mt-3 rounded" />
    </div>
  );
}
function Stat({ label, value, hint, color = C.brown }) {
  return (
    <Card>
      <p style={{ color: C.soft }} className="text-xs uppercase tracking-widest font-semibold">{label}</p>
      <p style={{ fontFamily: "Georgia, serif", color }} className="text-3xl font-bold mt-1">{value}</p>
      {hint && <p style={{ color: C.soft }} className="text-xs mt-1">{hint}</p>}
    </Card>
  );
}

/* ---------- TELAS ---------- */
function Painel({ perfil }) {
  const fechadoTri = 127000 + 118000 + 92000;
  return (
    <div>
      <SectionTitle sub="Terça-feira, 3 de julho de 2026 · Núcleo Rio de Janeiro">
        {perfil === "Empresário" ? "Bom dia, Irmão" : "Painel da Gestão"}
      </SectionTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Gerado no trimestre" value={fmt(fechadoTri)} hint="negócios fechados · agregado do grupo" />
        <Stat label="Presença média" value="87%" hint="reuniões oficiais · últimos 90 dias" color={C.ok} />
        <Stat label="Indicações no mês" value="9" hint="5 já em contato ou andamento" />
        {perfil !== "Empresário" ? (
          <Stat label="Caixa de julho" value={fmt(730)} hint="receitas − despesas da competência" />
        ) : (
          <Stat label="Suas indicações" value="6" hint="2 negócios fechados a partir delas" color={C.gold} />
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <p className="font-semibold mb-1" style={{ color: C.brown }}>Valor gerado pelo grupo (R$ mil)</p>
          <div style={{ height: 210 }}>
            <ResponsiveContainer>
              <LineChart data={evolucao} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#EFE8DA" vertical={false} />
                <XAxis dataKey="m" stroke={C.soft} fontSize={12} tickLine={false} />
                <YAxis stroke={C.soft} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [`R$ ${v} mil`, "Fechado"]} />
                <Line type="monotone" dataKey="valor" stroke={C.brown} strokeWidth={3} dot={{ fill: C.gold, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="font-semibold mb-3" style={{ color: C.brown }}>{perfil === "Gestor" ? "Atenção da gestão" : "Avisos"}</p>
          <div className="space-y-3 text-sm">
            {perfil === "Gestor" && (
              <div className="flex gap-2"><span style={{ color: C.crit }}>●</span><p><b>Davi R.</b> está na 2ª falta consecutiva. Momento da ligação fraterna.</p></div>
            )}
            <div className="flex gap-2"><span style={{ color: C.warn }}>●</span><p>Indicação para <b>Jackson P.</b> sem primeiro contato há 8 dias (SLA: 7).</p></div>
            {perfil === "Gestor" && (
              <div className="flex gap-2"><span style={{ color: C.warn }}>●</span><p><b>1 cadastro pendente</b> aguarda sua aprovação.</p></div>
            )}
            <div className="flex gap-2"><span style={{ color: C.ok }}>●</span><p>Reconhecimento na próxima reunião: <b>2 fechamentos</b> a celebrar.</p></div>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <p className="font-semibold mb-1" style={{ color: C.brown }}>Pauta de reconhecimento — reunião de 08/07</p>
        <p className="text-sm" style={{ color: C.text }}>
          Fechamento confirmado: <b>Eduardo M.</b> (indicação de <b>Davi R.</b>) e <b>Luetil S.</b> (indicação de <b>Leonardo A.</b>).
          Os valores permanecem restritos às partes e à gestão — o grupo celebra o agregado.
        </p>
      </Card>
    </div>
  );
}

function Membros({ perfil }) {
  const [filtro, setFiltro] = useState("todos");
  const lista = membros.filter((m) => (filtro === "pendentes" ? m.st === "pendente" : true));
  return (
    <div>
      <SectionTitle sub="7 cadeiras ocupadas · 1 cadastro pendente · exclusividade por segmento">Membros e Cadeiras</SectionTitle>
      <div className="flex gap-2 mb-4">
        {["todos", "pendentes"].map((f) => (
          <button key={f} onClick={() => setFiltro(f)}
            className="px-4 h-10 rounded-lg text-sm font-semibold capitalize"
            style={filtro === f ? { background: C.brown, color: "#fff" } : { border: `1.5px solid ${C.gold}`, color: C.brown }}>
            {f}
          </button>
        ))}
      </div>
      <Card pad={false} className="overflow-hidden">
        {lista.map((m, i) => (
          <div key={m.id} className="flex items-center justify-between px-5 py-3.5" style={{ background: i % 2 ? C.cream : "#fff" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: m.st === "pendente" ? C.soft : C.brown, fontFamily: "Georgia, serif" }}>
                {m.nome[0]}
              </div>
              <div>
                <p className="font-semibold">{m.nome} <span className="text-xs font-normal" style={{ color: C.soft }}>· {m.cat}</span></p>
                <p className="text-xs" style={{ color: C.soft }}>Cadeira: {m.seg} · Plano {m.plano}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {m.faltas === 2 && <Badge bg="#F6E3D9" fg={C.crit}>2 faltas seguidas</Badge>}
              {m.st === "pendente" ? (
                perfil === "Gestor"
                  ? <button className="px-3 h-9 rounded-lg text-sm font-semibold text-white" style={{ background: C.brown }}>Aprovar cadastro</button>
                  : <Badge bg={C.cream} fg="#6B4A2B">Pendente</Badge>
              ) : (
                <Badge bg="#E4EBD9" fg={C.ok}>Ativo</Badge>
              )}
            </div>
          </div>
        ))}
      </Card>
      <p className="text-xs mt-3" style={{ color: C.soft }}>Aprovação registra autor, data e hora na trilha de auditoria (RN-02 · RN-33). CIM, Loja e Potência são obrigatórios no cadastro (RN-01).</p>
    </div>
  );
}

function Reuniao() {
  const [pres, setPres] = useState({ 1: "presente", 2: "presente", 3: "presente", 4: "falta", 5: "representado", 7: "presente" });
  const ciclo = ["presente", "falta", "justificada", "representado"];
  const cfg = {
    presente: { t: "Presente", bg: "#E4EBD9", fg: C.ok },
    falta: { t: "Falta", bg: "#F6E3D9", fg: C.crit },
    justificada: { t: "Justificada", bg: "#F3E4C8", fg: C.warn },
    representado: { t: "Representado", bg: "#F0E6CF", fg: "#8A6A3F" },
  };
  const toque = (id) => setPres((p) => ({ ...p, [id]: ciclo[(ciclo.indexOf(p[id] || "presente") + 1) % 4] }));
  const ativos = membros.filter((m) => m.st === "ativo");
  const presentes = ativos.filter((m) => ["presente", "representado"].includes(pres[m.id])).length;
  return (
    <div>
      <SectionTitle sub="Reunião quinzenal online · hoje, 19h30 · conta para o limite de faltas">Presença ao Vivo</SectionTitle>
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold" style={{ color: C.brown }}>Rodada de Negócios — 03/07/2026</p>
            <p className="text-sm" style={{ color: C.soft }}>Toque no nome para alternar o registro. Um toque = um estado.</p>
          </div>
          <p style={{ fontFamily: "Georgia, serif", color: C.brown }} className="text-2xl font-bold">{presentes}/{ativos.length}</p>
        </div>
      </Card>
      <div className="grid sm:grid-cols-2 gap-3">
        {ativos.map((m) => {
          const s = cfg[pres[m.id] || "presente"];
          return (
            <button key={m.id} onClick={() => toque(m.id)}
              className="flex items-center justify-between rounded-xl px-4 h-16 text-left"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.12)", border: `1.5px solid ${s.fg}22` }}>
              <div>
                <p className="font-semibold">{m.nome}</p>
                <p className="text-xs" style={{ color: C.soft }}>{m.seg}</p>
              </div>
              <Badge bg={s.bg} fg={s.fg}>{s.t}</Badge>
            </button>
          );
        })}
      </div>
      <Card className="mt-4">
        <p className="font-semibold mb-1" style={{ color: C.brown }}>Convidados desta reunião</p>
        <p className="text-sm">Carlos N. (Logística) — anfitrião: <b>Davi R.</b> · 2ª participação: sinalizar candidatura (RN-21)</p>
      </Card>
    </div>
  );
}

function Indicacoes({ perfil }) {
  const [inds, setInds] = useState(indicacoesInit);
  const [nova, setNova] = useState(false);
  const [form, setForm] = useState({ dest: "", desc: "" });
  const cols = ["registrada", "contato", "andamento", "fechado"];
  const registrar = () => {
    if (!form.dest || !form.desc) return;
    setInds([{ id: Date.now(), ind: "Você", dest: form.dest, desc: form.desc, est: "registrada", valor: null, dias: 0 }, ...inds]);
    setForm({ dest: "", desc: "" }); setNova(false);
  };
  return (
    <div>
      <SectionTitle sub="O crédito da indicação é perpétuo e imutável (RN-11) · SLA de 1º contato: 7 dias">Indicações e Negócios</SectionTitle>
      {!nova ? (
        <button onClick={() => setNova(true)} className="mb-4 px-5 h-11 rounded-lg font-semibold text-white" style={{ background: C.brown }}>
          Registrar indicação
        </button>
      ) : (
        <Card className="mb-4">
          <p className="font-semibold mb-3" style={{ color: C.brown }}>Nova indicação</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: C.soft }}>Destinatário</label>
              <input value={form.dest} onChange={(e) => setForm({ ...form, dest: e.target.value })}
                placeholder="Irmão ou empresa" className="w-full h-11 mt-1 px-3 rounded-lg outline-none"
                style={{ border: "1px solid #D9CDB8" }} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: C.soft }}>Oportunidade</label>
              <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Descreva a oportunidade" className="w-full h-11 mt-1 px-3 rounded-lg outline-none"
                style={{ border: "1px solid #D9CDB8" }} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={registrar} className="px-5 h-10 rounded-lg font-semibold text-white" style={{ background: C.brown }}>Confirmar registro</button>
            <button onClick={() => setNova(false)} className="px-5 h-10 rounded-lg font-semibold" style={{ border: `1.5px solid ${C.gold}`, color: C.brown }}>Cancelar</button>
          </div>
        </Card>
      )}
      <div className="grid md:grid-cols-4 gap-3">
        {cols.map((c) => (
          <div key={c}>
            <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: C.soft }}>{EST[c].t}</p>
            <div className="space-y-3">
              {inds.filter((i) => i.est === c).map((i) => (
                <Card key={i.id} className="p-4">
                  <p className="text-xs font-semibold" style={{ color: C.brown }}>⚿ {i.ind} → {i.dest}</p>
                  <p className="text-sm mt-1 leading-snug">{i.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge bg={EST[c].bg} fg={EST[c].fg}>{EST[c].t}</Badge>
                    {c === "fechado" && i.valor && perfil !== "Empresário" && (
                      <span className="text-sm font-bold" style={{ fontFamily: "Georgia, serif", color: C.ok }}>{fmt(i.valor)}</span>
                    )}
                    {c === "fechado" && perfil === "Empresário" && (
                      <span className="text-xs" style={{ color: C.soft }}>valor restrito</span>
                    )}
                    {c === "registrada" && i.dias > 7 && <Badge bg="#F6E3D9" fg={C.crit}>SLA vencido</Badge>}
                    {c === "contato" && i.dias >= 6 && <Badge bg="#F3E4C8" fg={C.warn}>SLA {7 - i.dias}d</Badge>}
                  </div>
                  {c === "andamento" && (
                    <button className="mt-3 w-full h-10 rounded-lg text-sm font-semibold text-white" style={{ background: C.brown }}>
                      Confirmar fechamento
                    </button>
                  )}
                </Card>
              ))}
              {inds.filter((i) => i.est === c).length === 0 && (
                <p className="text-xs italic" style={{ color: C.soft }}>Nada por aqui. A próxima Rodada de Negócios muda isso.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Financeiro() {
  const rec = lancamentos.filter((l) => l.v > 0).reduce((a, l) => a + l.v, 0);
  const desp = lancamentos.filter((l) => l.v < 0).reduce((a, l) => a - l.v, 0);
  return (
    <div>
      <SectionTitle sub="Sem multa e sem juros (RN-07) · toda mensalidade paga gera lançamento automático (RN-31)">Financeiro do Grupo</SectionTitle>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Stat label="Receitas (60 dias)" value={fmt(rec)} color={C.ok} />
        <Stat label="Despesas (60 dias)" value={fmt(desp)} color={C.crit} />
        <Stat label="Resultado" value={fmt(rec - desp)} />
      </div>
      <Card pad={false} className="overflow-hidden">
        <div className="px-5 py-3 font-semibold text-white" style={{ background: C.brown }}>Extrato do caixa</div>
        {lancamentos.map((l, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3 text-sm" style={{ background: i % 2 ? C.cream : "#fff" }}>
            <div className="flex items-center gap-4">
              <span className="w-12" style={{ color: C.soft }}>{l.d}</span>
              <div>
                <p>{l.desc}</p>
                <p className="text-xs" style={{ color: C.soft }}>{l.cat}</p>
              </div>
            </div>
            <span className="font-semibold tabular-nums" style={{ fontFamily: "Georgia, serif", color: l.v > 0 ? C.ok : C.text }}>
              {l.v > 0 ? "+" : "−"} {fmt(Math.abs(l.v))}
            </span>
          </div>
        ))}
      </Card>
      <Card className="mt-4">
        <p className="font-semibold" style={{ color: C.brown }}>Mensalidades · competência 07/2026</p>
        <p className="text-sm mt-1">5 pagas · 1 em aberto · <b>Davi R.</b> acumula 2 competências — a 3ª gera alerta para conversa fraterna (RN-28). Nenhuma suspensão é automática.</p>
      </Card>
    </div>
  );
}

function Relatorios() {
  return (
    <div>
      <SectionTitle sub="Dashboards com valores agregados · o individual permanece restrito (RN-26)">Relatórios e Dashboards</SectionTitle>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <p className="font-semibold mb-1" style={{ color: C.brown }}>Indicações por membro (semestre)</p>
          <div style={{ height: 230 }}>
            <ResponsiveContainer>
              <BarChart data={porMembro} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#EFE8DA" vertical={false} />
                <XAxis dataKey="n" stroke={C.soft} fontSize={12} tickLine={false} />
                <YAxis stroke={C.soft} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [v, "Indicações"]} />
                <Bar dataKey="q" fill={C.brown} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="font-semibold mb-3" style={{ color: C.brown }}>Funil do semestre</p>
          {[["Indicações registradas", 25, 1], ["Em contato ou andamento", 14, 0.56], ["Negócios fechados", 9, 0.36]].map(([t2, n, w], i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1"><span>{t2}</span><b style={{ fontFamily: "Georgia, serif" }}>{n}</b></div>
              <div className="h-3 rounded-full" style={{ background: C.cream }}>
                <div className="h-3 rounded-full" style={{ width: `${w * 100}%`, background: i === 2 ? C.ok : C.gold }} />
              </div>
            </div>
          ))}
          <p className="text-xs mt-2" style={{ color: C.soft }}>Conversão indicação → fechamento: 36% · ticket médio agregado: R$ 41 mil</p>
        </Card>
      </div>
      <Card className="mt-4">
        <p className="font-semibold mb-2" style={{ color: C.brown }}>Membro Destaque — critério transparente (RN-27)</p>
        <p className="text-sm">Fórmula do trimestre: presenças (peso 2) + indicações (peso 3) + fechamentos gerados a terceiros (peso 4) + convidados (peso 1). Líder atual: <b>Davi R.</b> — quem gera valor torna-se inesquecível.</p>
      </Card>
    </div>
  );
}

function Config() {
  const params = [
    ["Limite de faltas consecutivas", "3 reuniões", "RN-08b"],
    ["SLA de primeiro contato da indicação", "7 dias", "RN-23"],
    ["Convidados por membro por reunião", "2", "RN-21"],
    ["Antecedência para falta justificada", "24 horas", "RN-19"],
    ["Política de comissão", "Pendente de ratificação", "RN-09"],
  ];
  return (
    <div>
      <SectionTitle sub="Somente o perfil Gestor edita · nenhuma regra vive em código (RNF-07)">Parâmetros do Grupo</SectionTitle>
      <div className="grid md:grid-cols-2 gap-4">
        <Card pad={false} className="overflow-hidden">
          <div className="px-5 py-3 font-semibold text-white" style={{ background: C.brown }}>Planos de mensalidade</div>
          {[["Gratuito", "R$ 0,00 · exige justificativa (RN-29)"], ["Mensal", "R$ 130,00 por competência"], ["Anual", "R$ 1.248,00 · equivale a R$ 104/mês"]].map(([n, d2], i) => (
            <div key={n} className="flex items-center justify-between px-5 py-3.5" style={{ background: i % 2 ? C.cream : "#fff" }}>
              <div><p className="font-semibold">{n}</p><p className="text-xs" style={{ color: C.soft }}>{d2}</p></div>
              <button className="px-3 h-9 rounded-lg text-sm font-semibold" style={{ border: `1.5px solid ${C.gold}`, color: C.brown }}>Editar valor</button>
            </div>
          ))}
        </Card>
        <Card pad={false} className="overflow-hidden">
          <div className="px-5 py-3 font-semibold text-white" style={{ background: C.brown }}>Regras parametrizáveis</div>
          {params.map(([n, v, rn], i) => (
            <div key={n} className="flex items-center justify-between px-5 py-3.5" style={{ background: i % 2 ? C.cream : "#fff" }}>
              <div><p className="text-sm font-semibold">{n}</p><p className="text-xs" style={{ color: C.soft }}>{rn}</p></div>
              <Badge bg={v.includes("Pendente") ? "#F3E4C8" : C.cream} fg={v.includes("Pendente") ? C.warn : "#6B4A2B"}>{v}</Badge>
            </div>
          ))}
        </Card>
      </div>
      <Card className="mt-4">
        <p className="font-semibold" style={{ color: C.brown }}>Trilha de auditoria (RN-33)</p>
        <p className="text-sm mt-1">Hoje, 10h12 — <b>Leonardo A.</b> aprovou o cadastro de Rafael T. · Ontem, 21h47 — <b>Eduardo M.</b> confirmou fechamento de negócio · 30/06, 09h05 — <b>Harrison M.</b> lançou despesa de coffee break. Registros imutáveis.</p>
      </Card>
    </div>
  );
}

/* ---------- APP ---------- */
export default function MasonConnectPrototipo() {
  const [tela, setTela] = useState("login");
  const [perfil, setPerfil] = useState("Gestor");
  useEffect(() => { document.title = "Mason Connect — Protótipo"; }, []);

  if (tela === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: C.deep }}>
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 text-center" style={{ boxShadow: "0 8px 30px rgba(0,0,0,.35)" }}>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: C.brown, fontFamily: "Georgia, serif" }}>M</div>
            <h1 className="text-3xl font-bold mt-4" style={{ fontFamily: "Georgia, serif", color: C.brown }}>Mason Connect</h1>
            <p className="text-sm mt-1" style={{ color: C.soft }}>Da confiança entre Irmãos à prosperidade mensurável</p>
            <div className="text-left mt-6">
              <label className="text-xs uppercase tracking-wide font-semibold" style={{ color: C.soft }}>Entrar como</label>
              <select value={perfil} onChange={(e) => setPerfil(e.target.value)}
                className="w-full h-11 mt-1 px-3 rounded-lg outline-none bg-white" style={{ border: "1px solid #D9CDB8" }}>
                <option>Gestor</option><option>Administrativo</option><option>Empresário</option>
              </select>
            </div>
            <button onClick={() => setTela("painel")} className="w-full h-12 rounded-lg font-semibold text-white mt-5" style={{ background: C.brown }}>
              Entrar no sistema
            </button>
            <p className="text-xs mt-4" style={{ color: C.soft }}>Protótipo navegável · Fase 1 · dados de exemplo</p>
          </div>
        </div>
      </div>
    );
  }

  const nav = [
    ["painel", "Painel"], ["membros", "Membros"], ["reuniao", "Presença"],
    ["indicacoes", "Indicações"],
    ...(perfil !== "Empresário" ? [["financeiro", "Financeiro"]] : []),
    ["relatorios", "Relatórios"],
    ...(perfil === "Gestor" ? [["config", "Parâmetros"]] : []),
  ];
  const telas = { painel: <Painel perfil={perfil} />, membros: <Membros perfil={perfil} />, reuniao: <Reuniao />, indicacoes: <Indicacoes perfil={perfil} />, financeiro: <Financeiro />, relatorios: <Relatorios />, config: <Config /> };

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: C.bg, color: C.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <aside className="md:w-60 md:min-h-screen flex md:flex-col items-center md:items-stretch justify-between md:justify-start px-4 md:px-0 py-3 md:py-0" style={{ background: C.brown }}>
        <div className="hidden md:flex items-center gap-3 px-5 py-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "#fff", color: C.brown, fontFamily: "Georgia, serif" }}>M</div>
          <div>
            <p className="text-white font-bold leading-tight" style={{ fontFamily: "Georgia, serif" }}>Mason Connect</p>
            <p className="text-xs" style={{ color: C.gold }}>Núcleo Rio de Janeiro</p>
          </div>
        </div>
        <nav className="flex md:flex-col gap-1 md:px-3 overflow-x-auto">
          {nav.map(([id, label]) => (
            <button key={id} onClick={() => setTela(id)}
              className="px-4 h-11 rounded-lg text-sm font-semibold text-left whitespace-nowrap"
              style={tela === id ? { background: "#FFFFFF22", color: "#fff", borderLeft: `3px solid ${C.gold}` } : { color: "#EADFC9" }}>
              {label}
            </button>
          ))}
        </nav>
        <div className="hidden md:block mt-auto px-5 py-5">
          <p className="text-xs" style={{ color: C.gold }}>Perfil: {perfil}</p>
          <button onClick={() => setTela("login")} className="text-xs text-white underline mt-1">Trocar perfil</button>
        </div>
        <button onClick={() => setTela("login")} className="md:hidden text-xs" style={{ color: C.gold }}>Sair</button>
      </aside>
      <main className="flex-1 p-5 md:p-8 max-w-6xl">{telas[tela]}</main>
    </div>
  );
}
