import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Download,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Upload,
  Link2,
  Eye,
  Loader2,
  Package,
  Palette,
  Type,
} from "lucide-react";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import BraceletPreview from "@/components/BraceletPreview";
import OrderEditor from "@/components/OrderEditor";
import { generateBraceletSVG, downloadSVG, downloadAllSVGs } from "@/lib/svgGenerator";
import {
  BRACELET_COLORS,
  BRACELET_SIZES,
  FRONT_FONTS,
  VERSO_FONT,
  BRACELET_SYMBOLS,
  EXPECTED_COLUMNS,
  type BraceletOrder,
} from "@/lib/constants";

function createEmptyOrder(index: number): BraceletOrder {
  return {
    id: "manual_" + Date.now() + "_" + index,
    nomeCliente: "",
    textoFrente: "",
    textoVerso: "",
    l2Verso: "",
    l1Dentro1: "",
    l2Dentro1: "",
    l1Dentro2: "",
    l2Dentro2: "",
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

export default function Home() {
  const { orders, setOrders, loading, error, fetchSheet, loadFromCSVText } = useGoogleSheets();
  const [sheetUrlInput, setSheetUrlInput] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFetchSheet = () => {
    if (!sheetUrlInput.trim()) {
      toast.error("Cole a URL da planilha Google Sheets");
      return;
    }
    fetchSheet(sheetUrlInput.trim());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      loadFromCSVText(text);
      toast.success("CSV carregado com sucesso!");
    };
    reader.readAsText(file);
  };

  const handleAddOrder = () => {
    const newOrder = createEmptyOrder(orders.length);
    setOrders([...orders, newOrder]);
    setSelectedIndex(orders.length);
    setEditingIndex(orders.length);
    toast.success("Novo pedido adicionado");
  };

  const handleDeleteOrder = (index: number) => {
    const updated = orders.filter((_, i) => i !== index);
    setOrders(updated);
    if (selectedIndex >= updated.length) setSelectedIndex(Math.max(0, updated.length - 1));
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
    if (orders.length === 0) return;
    const order = orders[selectedIndex];
    const svg = generateBraceletSVG(order);
    const filename = (order.nomeCliente || "pulseira").replace(/\s+/g, "_") + ".svg";
    downloadSVG(svg, filename);
    toast.success("SVG baixado: " + filename);
  };

  const handleDownloadAll = () => {
    if (orders.length === 0) return;
    downloadAllSVGs(orders);
    toast.success("Baixando " + orders.length + " SVGs...");
  };

  const currentOrder = orders[selectedIndex];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Pulseira Maker
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Gerador de Gabaritos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleDownloadCurrent} className="gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Baixar Atual</span>
                </Button>
                <Button size="sm" onClick={handleDownloadAll} className="gap-1.5 bg-primary text-primary-foreground">
                  <Download className="w-3.5 h-3.5" />
                  Baixar Todos ({orders.length})
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        {orders.length === 0 ? (
          /* Empty state - Data import */
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Hero section */}
            <div className="text-center space-y-3 pt-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Gerador de Gabaritos de Pulseiras
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Importe dados da sua planilha Google Sheets ou CSV para gerar automaticamente os gabaritos SVG personalizados.
              </p>
            </div>

            {/* Import options */}
            <Tabs defaultValue="sheets" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-secondary">
                <TabsTrigger value="sheets" className="gap-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  Google Sheets
                </TabsTrigger>
                <TabsTrigger value="csv" className="gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Upload CSV
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  Manual
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sheets" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                        URL da Planilha Google Sheets
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          value={sheetUrlInput}
                          onChange={(e) => setSheetUrlInput(e.target.value)}
                          className="bg-secondary border-border"
                          onKeyDown={(e) => e.key === "Enter" && handleFetchSheet()}
                        />
                        <Button onClick={handleFetchSheet} disabled={loading} className="bg-primary text-primary-foreground shrink-0">
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                          <span className="ml-1.5">Importar</span>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        A planilha precisa estar compartilhada como "Qualquer pessoa com o link pode ver".
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="csv" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6">
                    <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                    >
                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium">Clique para selecionar um arquivo CSV</p>
                      <p className="text-xs text-muted-foreground mt-1">ou arraste e solte aqui</p>
                    </button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="pt-6 text-center">
                    <Plus className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm mb-4">Crie pedidos manualmente, um por um.</p>
                    <Button onClick={handleAddOrder} className="bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-1.5" />
                      Criar Primeiro Pedido
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Expected columns reference */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Colunas Esperadas na Planilha
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {EXPECTED_COLUMNS.map((col) => (
                    <span key={col} className="px-2 py-1 bg-secondary rounded text-xs font-mono text-muted-foreground">
                      {col}
                    </span>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">COR:</strong> {BRACELET_COLORS.map((c) => c.name).join(", ")}
                  </p>
                  <p>
                    <strong className="text-foreground">FONTE_FRENTE:</strong> {FRONT_FONTS.map((f) => f.name).join(", ")} <span className="opacity-60">(verso sempre {VERSO_FONT.name})</span>
                  </p>
                  <p>
                    <strong className="text-foreground">TAMANHO:</strong> {BRACELET_SIZES.map((s) => s.name + " (" + s.cm + "cm)").join(", ")}
                  </p>
                  <p>
                    <strong className="text-foreground">SIMBOLO_FRENTE / SIMBOLO_FRENTE2 / SIMBOLO_VERSO:</strong> {BRACELET_SYMBOLS.map((s) => s.id).join(", ")}
                  </p>
                  <p>
                    <strong className="text-foreground">SIMBOLO_DENTRO1 / SIMBOLO_DENTRO2:</strong> whatsapp <span className="opacity-60">(apenas WhatsApp, posicionado antes do texto)</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Orders loaded - Main workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left panel - Order list */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Pedidos ({orders.length})
                </h2>
                <Button variant="ghost" size="sm" onClick={handleAddOrder} className="gap-1 text-primary">
                  <Plus className="w-3.5 h-3.5" />
                  Novo
                </Button>
              </div>

              <div className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
                {orders.map((order, i) => {
                  const colorInfo = BRACELET_COLORS.find((c) => c.name === order.cor);
                  return (
                    <div
                      key={order.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => { setSelectedIndex(i); setEditingIndex(null); }}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                        i === selectedIndex
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-md border border-white/20 shrink-0"
                          style={{ backgroundColor: colorInfo?.hex || "#000" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{order.nomeCliente || "Sem nome"}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.textoFrente || "—"} | {order.textoVerso || "—"}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); setEditingIndex(i); }}
                            className="p-1 rounded hover:bg-accent transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(i); }}
                            className="p-1 rounded hover:bg-destructive/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick actions */}
              <div className="pt-2 border-t border-border space-y-2">
                <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => { setOrders([]); setSelectedIndex(0); setEditingIndex(null); }}>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Importar Nova Planilha
                </Button>
              </div>
            </div>

            {/* Right panel - Preview & Editor */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-4">
              {currentOrder && (
                <>
                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={selectedIndex === 0}
                        onClick={() => { setSelectedIndex((i) => i - 1); setEditingIndex(null); }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-mono text-muted-foreground">
                        {selectedIndex + 1} / {orders.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={selectedIndex === orders.length - 1}
                        onClick={() => { setSelectedIndex((i) => i + 1); setEditingIndex(null); }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setEditingIndex(editingIndex === selectedIndex ? null : selectedIndex)}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {editingIndex === selectedIndex ? "Fechar Editor" : "Editar"}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadCurrent}>
                        <Download className="w-3.5 h-3.5" />
                        Baixar SVG
                      </Button>
                    </div>
                  </div>

                  {/* Editor (if open) */}
                  {editingIndex === selectedIndex && (
                    <OrderEditor
                      order={currentOrder}
                      onSave={handleSaveOrder}
                      onClose={() => setEditingIndex(null)}
                    />
                  )}

                  {/* Preview */}
                  <Card className="bg-card border-border overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Preview do Gabarito
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-border">
                        <BraceletPreview order={currentOrder} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order details summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Cor</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-5 h-5 rounded border border-white/20"
                          style={{ backgroundColor: BRACELET_COLORS.find((c) => c.name === currentOrder.cor)?.hex }}
                        />
                        <span className="text-sm font-medium">{currentOrder.cor}</span>
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Tamanho</p>
                      <p className="text-sm font-medium mt-1">{currentOrder.tamanhoCm}cm ({currentOrder.tamanhoLabel})</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Fonte Frente</p>
                      <p className="text-sm font-medium mt-1" style={{ fontFamily: getFontPreview(currentOrder.fonteFrente) }}>
                        {currentOrder.fonteFrente}
                      </p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Fonte Verso</p>
                      <p className="text-sm font-medium mt-1" style={{ fontFamily: VERSO_FONT.family, fontWeight: "bold" }}>
                        {VERSO_FONT.label} <span className="text-xs text-muted-foreground">(fixo)</span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="container text-center text-xs text-muted-foreground">
          Pulseira Maker — Gerador de Gabaritos SVG para Pulseiras de Silicone
        </div>
      </footer>
    </div>
  );
}

function getFontPreview(fontName: string): string {
  const font = FRONT_FONTS.find((f) => f.name === fontName);
  return font ? font.family : "Arial, sans-serif";
}
