import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  FileSpreadsheet,
  Layers3,
  Link2,
  ListChecks,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import BraceletPreview from "@/components/BraceletPreview";
import OrderEditor from "@/components/OrderEditor";
import { downloadAllSVGs, downloadSVG, generateBraceletSVG } from "@/lib/svgGenerator";
import {
  BRACELET_COLORS,
  BRACELET_SIZES,
  BRACELET_SYMBOLS,
  EXPECTED_COLUMNS,
  FRONT_FONTS,
  type BraceletOrder,
} from "@/lib/constants";

function createEmptyOrder(index: number): BraceletOrder {
  const uniqueId =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}_${index}_${Math.random().toString(36).slice(2, 10)}`;

  return {
    id: `manual_${uniqueId}`,
    nomeCliente: "",
    textoFrente: "",
    l2Frente: "",
    textoVerso: "",
    l2Verso: "",
    l3Verso: "",
    l1Dentro1: "",
    l2Dentro1: "",
    l3Dentro1: "",
    l1Dentro2: "",
    l2Dentro2: "",
    l3Dentro2: "",
    cor: "Preto",
    corTexto: "#FFFFFF",
    fonteFrente: "Segoe Print Negrito",
    fonteVerso: "Calibri Negrito",
    tamanho: "M adulto",
    tamanhoLabel: "M adulto",
    tamanhoCm: "18,5",
    quantidade: 1,
  };
}

function getImportSuccessMessage(count: number): string {
  const suffix = count === 1 ? "" : "s";
  return `${count} pedido${suffix} importado${suffix}`;
}

function WorkflowStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
        {number}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function OrderPreviewPanel({ order, onDownload }: { order: BraceletOrder; onDownload: () => void }) {
  const braceletColor = BRACELET_COLORS.find((color) => color.name === order.cor);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-white/70 bg-white/90 shadow-[0_20px_60px_-35px_rgba(39,55,125,0.45)]">
        <div className="flex items-center justify-between border-b border-border/70 bg-gradient-to-r from-primary/[0.08] to-transparent px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Visualização do gabarito</p>
              <p className="text-xs text-muted-foreground">Atualizada com os dados salvos</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 bg-white" onClick={onDownload}>
            <Download className="h-3.5 w-3.5" />
            Baixar SVG
          </Button>
        </div>
        <CardContent className="p-4 sm:p-5">
          <div className="rounded-2xl border border-border/70 bg-white p-2 shadow-inner">
            <BraceletPreview order={order} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Cor</p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-6 w-6 rounded-lg border border-black/10 shadow-sm"
              style={{ backgroundColor: braceletColor?.hex || "#000000" }}
            />
            <span className="text-sm font-semibold">{order.cor}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Tamanho</p>
          <p className="mt-2 text-sm font-semibold">{order.tamanhoCm} cm</p>
          <p className="text-xs text-muted-foreground">{order.tamanhoLabel}</p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Fonte da frente</p>
          <p className="mt-2 truncate text-sm font-semibold" style={{ fontFamily: getFontPreview(order.fonteFrente) }}>
            {order.fonteFrente}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Quantidade</p>
          <p className="mt-2 text-sm font-semibold">{order.quantidade || 1} unidade(s)</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { orders, setOrders, loading, error, fetchSheet, loadFromCSVText } = useGoogleSheets();
  const [sheetUrlInput, setSheetUrlInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [importingMore, setImportingMore] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFetchSheet = async () => {
    if (!sheetUrlInput.trim()) {
      toast.error("Cole a URL da planilha Google Sheets");
      return;
    }

    const result = await fetchSheet(sheetUrlInput.trim());
    if (result.ok) {
      toast.success(getImportSuccessMessage(result.count));
      setImportingMore(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const text = typeof loadEvent.target?.result === "string" ? loadEvent.target.result : "";
      const result = loadFromCSVText(text);
      if (result.ok) {
        toast.success(getImportSuccessMessage(result.count));
        setImportingMore(false);
      } else {
        toast.error(result.error);
      }
      input.value = "";
    };
    reader.onerror = () => {
      toast.error("Não foi possível ler o arquivo CSV.");
      input.value = "";
    };
    reader.readAsText(file);
  };

  const handleAddOrder = () => {
    const newOrder = createEmptyOrder(orders.length);
    setOrders([...orders, newOrder]);
    setSelectedIndex(orders.length);
    setEditingIndex(orders.length);
    setImportingMore(false);
    toast.success("Novo pedido adicionado");
  };

  const handleDeleteOrder = (index: number) => {
    const updated = orders.filter((_, orderIndex) => orderIndex !== index);
    setOrders(updated);

    if (index < selectedIndex) {
      setSelectedIndex(selectedIndex - 1);
    } else if (selectedIndex >= updated.length) {
      setSelectedIndex(Math.max(0, updated.length - 1));
    }

    if (editingIndex === index) setEditingIndex(null);
    toast.info("Pedido removido");
  };

  const handleSaveOrder = (updatedOrder: BraceletOrder) => {
    if (editingIndex === null) return;
    const updated = [...orders];
    updated[editingIndex] = updatedOrder;
    setOrders(updated);
    setEditingIndex(null);
    toast.success("Pedido atualizado");
  };

  const handleDownloadCurrent = () => {
    const order = orders[selectedIndex];
    if (!order) return;
    const svg = generateBraceletSVG(order);
    const filename = `${(order.nomeCliente || "pulseira").replace(/\s+/g, "_")}.svg`;
    downloadSVG(svg, filename);
    toast.success(`SVG baixado: ${filename}`);
  };

  const handleDownloadAll = () => {
    if (orders.length === 0) return;
    downloadAllSVGs(orders);
    toast.success(`Baixando ${orders.length} SVGs...`);
  };

  const currentOrder = orders[selectedIndex];
  const isEditing = editingIndex === selectedIndex;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 shadow-[0_8px_30px_-24px_rgba(28,39,94,0.65)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-700 text-primary-foreground shadow-lg shadow-primary/20">
              <Package className="h-5 w-5" />
              <span className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-cyan-300/50" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">Pulseira Maker</h1>
                <span className="hidden rounded-full bg-primary/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary sm:inline">
                  SVG
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Gabaritos prontos para produção</p>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadCurrent} className="hidden gap-1.5 bg-white sm:flex">
                <Download className="h-3.5 w-3.5" />
                Atual
              </Button>
              <Button size="sm" onClick={handleDownloadAll} className="gap-1.5 shadow-md shadow-primary/15">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Baixar todos</span>
                <span>({orders.length})</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container flex-1 py-6 sm:py-8">
        {orders.length === 0 || importingMore ? (
          <div className="mx-auto max-w-5xl space-y-7">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-white via-indigo-50/80 to-cyan-50/70 px-6 py-8 shadow-[0_28px_80px_-45px_rgba(49,46,129,0.55)] sm:px-10 sm:py-10">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="relative max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Preenchimento simples e guiado
                </div>
                <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Crie gabaritos de pulseiras com menos cliques.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Importe seus pedidos ou comece manualmente. Depois revise o preview e baixe os arquivos prontos para produção.
                </p>
              </div>
            </section>

            <div className="grid gap-3 md:grid-cols-3">
              <WorkflowStep number={1} title="Adicione os pedidos" description="Use Google Sheets, CSV ou preenchimento manual." />
              <WorkflowStep number={2} title="Revise e personalize" description="Confira textos, cores, tamanhos e símbolos." />
              <WorkflowStep number={3} title="Baixe os gabaritos" description="Exporte um pedido ou o lote completo em SVG." />
            </div>

            <Card className="overflow-hidden border-white/70 bg-white/90 shadow-[0_24px_70px_-45px_rgba(39,55,125,0.5)]">
              <div className="border-b border-border/70 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Passo 1</p>
                    <h3 className="text-lg font-bold">Como você quer começar?</h3>
                  </div>
                </div>
              </div>
              <CardContent className="p-5 sm:p-7">
                <Tabs defaultValue="sheets" className="w-full">
                  <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-secondary/80 p-1.5">
                    <TabsTrigger value="sheets" className="gap-1.5 rounded-xl py-2.5 data-[state=active]:shadow-sm">
                      <Link2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Google Sheets</span>
                      <span className="sm:hidden">Sheets</span>
                    </TabsTrigger>
                    <TabsTrigger value="csv" className="gap-1.5 rounded-xl py-2.5 data-[state=active]:shadow-sm">
                      <Upload className="h-4 w-4" />
                      CSV
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="gap-1.5 rounded-xl py-2.5 data-[state=active]:shadow-sm">
                      <Edit3 className="h-4 w-4" />
                      Manual
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sheets" className="mt-5">
                    <div className="rounded-2xl border border-border/70 bg-secondary/35 p-5">
                      <label htmlFor="sheet-url" className="text-sm font-semibold">Link da planilha</label>
                      <p className="mt-1 text-xs text-muted-foreground">
                        A planilha deve estar compartilhada como “Qualquer pessoa com o link”.
                      </p>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Input
                          id="sheet-url"
                          placeholder="Cole aqui o link do Google Sheets"
                          value={sheetUrlInput}
                          onChange={(event) => setSheetUrlInput(event.target.value)}
                          className="h-11 bg-white"
                          onKeyDown={(event) => event.key === "Enter" && handleFetchSheet()}
                        />
                        <Button onClick={handleFetchSheet} disabled={loading} className="h-11 gap-2 px-5 shadow-sm">
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                          Importar pedidos
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="csv" className="mt-5">
                    <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="group w-full rounded-2xl border-2 border-dashed border-primary/20 bg-primary/[0.025] p-8 text-center transition hover:border-primary/45 hover:bg-primary/[0.055]"
                    >
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-105">
                        <Upload className="h-5 w-5" />
                      </span>
                      <span className="mt-4 block text-sm font-semibold">Selecionar arquivo CSV</span>
                      <span className="mt-1 block text-xs text-muted-foreground">Arquivos .csv ou .txt</span>
                    </button>
                  </TabsContent>

                  <TabsContent value="manual" className="mt-5">
                    <div className="flex flex-col items-center rounded-2xl border border-border/70 bg-secondary/35 px-5 py-8 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Plus className="h-5 w-5" />
                      </span>
                      <p className="mt-4 text-sm font-semibold">Criar um pedido do zero</p>
                      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                        Você será levado ao formulário guiado para preencher cada parte da pulseira.
                      </p>
                      <Button onClick={handleAddOrder} className="mt-5 gap-2 px-5">
                        <Plus className="h-4 w-4" />
                        {orders.length === 0 ? "Criar primeiro pedido" : "Criar novo pedido"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {error && (
                  <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {importingMore && orders.length > 0 && (
                  <div className="mt-5 flex justify-center">
                    <Button variant="outline" onClick={() => setImportingMore(false)} className="gap-1.5 bg-white">
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Voltar aos {orders.length} pedidos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <details className="group rounded-2xl border border-white/70 bg-white/75 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold sm:px-6">
                <span className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-primary" />
                  Ver formato esperado da planilha
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-border/60 px-5 py-5 sm:px-6">
                <div className="flex flex-wrap gap-1.5">
                  {EXPECTED_COLUMNS.map((column) => (
                    <span key={column} className="rounded-lg bg-secondary px-2 py-1 font-mono text-[11px] text-muted-foreground">
                      {column}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 text-xs text-muted-foreground md:grid-cols-2">
                  <p><strong className="text-foreground">Cores:</strong> {BRACELET_COLORS.map((color) => color.name).join(", ")}</p>
                  <p><strong className="text-foreground">Tamanhos:</strong> {BRACELET_SIZES.map((size) => `${size.name} (${size.cm} cm)`).join(", ")}</p>
                  <p><strong className="text-foreground">Fontes:</strong> {FRONT_FONTS.map((font) => font.name).join(", ")}</p>
                  <p><strong className="text-foreground">Símbolos:</strong> códigos {BRACELET_SYMBOLS.map((symbol) => symbol.id).join(", ")}</p>
                </div>
              </div>
            </details>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
              <Card className="overflow-hidden border-white/70 bg-white/90 shadow-[0_18px_50px_-38px_rgba(39,55,125,0.55)] lg:sticky lg:top-24">
                <div className="border-b border-border/70 bg-gradient-to-r from-primary/[0.08] to-transparent px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Arquivo atual</p>
                      <h2 className="mt-1 text-base font-bold">{orders.length} pedido(s)</h2>
                    </div>
                    <Button size="sm" onClick={handleAddOrder} className="gap-1.5 shadow-sm">
                      <Plus className="h-3.5 w-3.5" />
                      Novo
                    </Button>
                  </div>
                </div>

                <CardContent className="p-3">
                  <div className="max-h-[calc(100vh-330px)] space-y-2 overflow-y-auto pr-1">
                    {orders.map((order, index) => {
                      const colorInfo = BRACELET_COLORS.find((color) => color.name === order.cor);
                      const selected = index === selectedIndex;

                      return (
                        <div
                          key={order.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedIndex(index);
                            setEditingIndex(null);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              setSelectedIndex(index);
                              setEditingIndex(null);
                            }
                          }}
                          className={`group rounded-2xl border p-3 transition-all ${
                            selected
                              ? "border-primary/35 bg-primary/[0.065] shadow-sm"
                              : "border-transparent bg-secondary/45 hover:border-primary/20 hover:bg-primary/[0.035]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <span
                                className="block h-9 w-9 rounded-xl border border-black/10 shadow-sm"
                                style={{ backgroundColor: colorInfo?.hex || "#000000" }}
                              />
                              {selected && (
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-white">
                                  <CheckCircle2 className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">{order.nomeCliente || `Pedido ${index + 1}`}</p>
                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {order.textoFrente || "Sem texto na frente"}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-0.5 opacity-70 transition group-hover:opacity-100">
                              <button
                                type="button"
                                aria-label={`Editar pedido ${index + 1}`}
                                title="Editar pedido"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedIndex(index);
                                  setEditingIndex(index);
                                }}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white hover:text-primary"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Excluir pedido ${index + 1}`}
                                title="Excluir pedido"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDeleteOrder(index);
                                }}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 space-y-2 border-t border-border/70 pt-3">
                    <Button variant="outline" size="sm" className="w-full gap-1.5 bg-white" onClick={() => setImportingMore(true)}>
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Importar mais pedidos
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => {
                        if (window.confirm("Tem certeza que deseja limpar todo o arquivo? Esta ação não pode ser desfeita.")) {
                          setOrders([]);
                          setSelectedIndex(0);
                          setEditingIndex(null);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Limpar arquivo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <section className="space-y-5 lg:col-span-8 xl:col-span-9">
              {currentOrder && (
                <>
                  <div className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-white"
                          aria-label="Pedido anterior"
                          disabled={selectedIndex === 0}
                          onClick={() => {
                            setSelectedIndex((index) => index - 1);
                            setEditingIndex(null);
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-white"
                          aria-label="Próximo pedido"
                          disabled={selectedIndex === orders.length - 1}
                          onClick={() => {
                            setSelectedIndex((index) => index + 1);
                            setEditingIndex(null);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Pedido {selectedIndex + 1} de {orders.length}</p>
                        <h2 className="truncate text-lg font-bold">{currentOrder.nomeCliente || "Pedido sem nome"}</h2>
                      </div>
                    </div>

                    <Button
                      variant={isEditing ? "secondary" : "default"}
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setEditingIndex(isEditing ? null : selectedIndex)}
                    >
                      {isEditing ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                      {isEditing ? "Ver somente o preview" : "Editar pedido"}
                    </Button>
                  </div>

                  {isEditing ? (
                    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
                      <OrderEditor order={currentOrder} onSave={handleSaveOrder} onClose={() => setEditingIndex(null)} />
                      <div className="xl:sticky xl:top-24">
                        <OrderPreviewPanel order={currentOrder} onDownload={handleDownloadCurrent} />
                      </div>
                    </div>
                  ) : (
                    <OrderPreviewPanel order={currentOrder} onDownload={handleDownloadCurrent} />
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-white/60 bg-white/55 py-4 backdrop-blur-sm">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>Pulseira Maker</span>
          <span>Gabaritos SVG para pulseiras de silicone</span>
        </div>
      </footer>
    </div>
  );
}

function getFontPreview(fontName: string): string {
  const font = FRONT_FONTS.find((fontOption) => fontOption.name === fontName);
  return font ? font.family : "Arial, sans-serif";
}
