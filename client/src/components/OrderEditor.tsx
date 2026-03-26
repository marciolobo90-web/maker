import { useState } from "react";
import type { BraceletOrder } from "@/lib/constants";
import { BRACELET_COLORS, FRONT_BACK_FONTS, BRACELET_SIZES, BRACELET_SYMBOLS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface OrderEditorProps {
  order: BraceletOrder;
  onSave: (order: BraceletOrder) => void;
  onClose: () => void;
}

export default function OrderEditor({ order, onSave, onClose }: OrderEditorProps) {
  const [form, setForm] = useState<BraceletOrder>({ ...order });

  const update = (field: keyof BraceletOrder, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (colorName: string) => {
    const color = BRACELET_COLORS.find((c) => c.name === colorName);
    if (color) {
      setForm((prev) => ({ ...prev, cor: color.name, corTexto: color.textColor }));
    }
  };

  const handleSizeChange = (sizeName: string) => {
    const size = BRACELET_SIZES.find((s) => s.name === sizeName);
    if (size) {
      setForm((prev) => ({ ...prev, tamanho: size.name, tamanhoLabel: size.label, tamanhoCm: size.cm }));
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          Editar Pedido
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Cliente */}
        <div className="col-span-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Nome do Cliente</Label>
          <Input value={form.nomeCliente} onChange={(e) => update("nomeCliente", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>

        {/* Texto Frente */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Texto Frente</Label>
          <Input value={form.textoFrente} onChange={(e) => update("textoFrente", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>

        {/* Texto Verso */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Texto Verso</Label>
          <Input value={form.textoVerso} onChange={(e) => update("textoVerso", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>

        {/* Dentro L1/L2 */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L1 Dentro (esq)</Label>
          <Input value={form.l1Dentro1} onChange={(e) => update("l1Dentro1", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L2 Dentro (esq)</Label>
          <Input value={form.l2Dentro1} onChange={(e) => update("l2Dentro1", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L1 Dentro (dir)</Label>
          <Input value={form.l1Dentro2} onChange={(e) => update("l1Dentro2", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L2 Dentro (dir)</Label>
          <Input value={form.l2Dentro2} onChange={(e) => update("l2Dentro2", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>

        {/* Cor */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Cor da Pulseira</Label>
          <Select value={form.cor} onValueChange={handleColorChange}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRACELET_COLORS.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm border border-gray-400" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tamanho */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Tamanho</Label>
          <Select value={form.tamanho} onValueChange={handleSizeChange}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRACELET_SIZES.map((s) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.cm} cm - {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fonte Frente */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Fonte Frente</Label>
          <Select value={form.fonteFrente} onValueChange={(v) => update("fonteFrente", v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRONT_BACK_FONTS.map((f) => (
                <SelectItem key={f.name} value={f.name}>
                  <span style={{ fontFamily: f.family }}>{f.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fonte Verso */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Fonte Verso</Label>
          <Select value={form.fonteVerso} onValueChange={(v) => update("fonteVerso", v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRONT_BACK_FONTS.map((f) => (
                <SelectItem key={f.name} value={f.name}>
                  <span style={{ fontFamily: f.family }}>{f.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Símbolo Frente */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Símbolo Frente</Label>
          <Select value={form.simboloFrente || "none"} onValueChange={(v) => update("simboloFrente", v === "none" ? undefined : v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {BRACELET_SYMBOLS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <img src={s.svgUrl} alt={s.name} width="16" height="16" className="object-contain" />
                    {s.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Símbolo Verso */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Símbolo Verso</Label>
          <Select value={form.simboloVerso || "none"} onValueChange={(v) => update("simboloVerso", v === "none" ? undefined : v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {BRACELET_SYMBOLS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <img src={s.svgUrl} alt={s.name} width="16" height="16" className="object-contain" />
                    {s.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantidade */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Quantidade</Label>
          <Input
            type="number"
            min={1}
            value={form.quantidade || 1}
            onChange={(e) => update("quantidade", parseInt(e.target.value) || 1)}
            className="mt-1 bg-secondary border-border"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={() => onSave(form)} className="bg-primary text-primary-foreground hover:opacity-90">
          Salvar Alterações
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
