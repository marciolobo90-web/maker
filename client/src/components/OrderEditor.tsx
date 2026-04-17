import { useState } from "react";
import type { BraceletOrder } from "@/lib/constants";
import { BRACELET_COLORS, FRONT_FONTS, VERSO_FONT, BRACELET_SIZES, BRACELET_SYMBOLS, canAddCharToFront, calcFrontFontSize, FRONT_MIN_FONT_SIZE, MIN_FONT_SIZE_12PT, calcVersoFontSize, canAddCharToVerso, calcDentroFontSize, canAddCharToDentro } from "@/lib/constants";
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
        <div className="col-span-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Texto Frente</Label>
          <Input
            value={form.textoFrente}
            onChange={(e) => {
              const newValue = e.target.value;
              // Se está apagando, sempre permitir
              if (newValue.length <= form.textoFrente.length) {
                update("textoFrente", newValue);
                return;
              }
              // Se está adicionando, verificar se cabe
              const sizeName = form.tamanhoLabel || form.tamanho;
              if (canAddCharToFront(form.textoFrente, form.fonteFrente, sizeName, form.simboloFrente, form.simboloFrente2)) {
                update("textoFrente", newValue);
              }
            }}
            className="mt-1 bg-secondary border-border"
          />
          {(() => {
            const sizeName = form.tamanhoLabel || form.tamanho;
            const currentFs = calcFrontFontSize(form.textoFrente, form.fonteFrente, sizeName, form.simboloFrente, form.simboloFrente2);
            const isReduced = currentFs < (FRONT_FONTS.find(f => f.name === form.fonteFrente)?.svgFontSize || 635);
            const isAtLimit = currentFs <= FRONT_MIN_FONT_SIZE;
            const ptSize = Math.round(currentFs / 35.28 * 10) / 10;
            if (isAtLimit) {
              return <p className="text-xs text-destructive mt-1">Limite atingido (fonte: {ptSize}pt mínimo). Não é possível adicionar mais caracteres.</p>;
            }
            if (isReduced) {
              return <p className="text-xs text-amber-500 mt-1">Fonte reduzida para {ptSize}pt para caber na área de personalização.</p>;
            }
            return null;
          })()}
        </div>

        {/* Texto Verso L1 */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Texto Verso (Linha 1)</Label>
          <Input
            value={form.textoVerso}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= form.textoVerso.length) { update("textoVerso", newValue); return; }
              const sizeName = form.tamanhoLabel || form.tamanho;
              if (canAddCharToVerso(form.textoVerso, form.l2Verso || "", sizeName, form.simboloVerso)) {
                update("textoVerso", newValue);
              }
            }}
            className="mt-1 bg-secondary border-border"
          />
        </div>

        {/* Texto Verso L2 */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Texto Verso (Linha 2)</Label>
          <Input
            value={form.l2Verso || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= (form.l2Verso || "").length) { update("l2Verso", newValue); return; }
              const sizeName = form.tamanhoLabel || form.tamanho;
              if (canAddCharToVerso(form.l2Verso || "", form.textoVerso, sizeName, form.simboloVerso)) {
                update("l2Verso", newValue);
              }
            }}
            className="mt-1 bg-secondary border-border"
            placeholder="Opcional"
          />
          {(() => {
            const sizeName = form.tamanhoLabel || form.tamanho;
            const currentFs = calcVersoFontSize(form.textoVerso, form.l2Verso || "", sizeName, form.simboloVerso);
            const isReduced = currentFs < 423;
            const isAtLimit = currentFs <= MIN_FONT_SIZE_12PT;
            const ptSize = Math.round(currentFs / 35.28 * 10) / 10;
            if (isAtLimit && (form.textoVerso.length > 0 || (form.l2Verso || "").length > 0)) {
              return <p className="text-xs text-destructive mt-1">Verso: limite atingido ({ptSize}pt mínimo).</p>;
            }
            if (isReduced) {
              return <p className="text-xs text-amber-500 mt-1">Verso: fonte reduzida para {ptSize}pt.</p>;
            }
            return null;
          })()}
        </div>

        {/* Dentro L1/L2 */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L1 Dentro (esq)</Label>
          <Input
            value={form.l1Dentro1}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= form.l1Dentro1.length) { update("l1Dentro1", newValue); return; }
              const sizeName = form.tamanhoLabel || form.tamanho;
              if (canAddCharToDentro(form.l1Dentro1, form.l2Dentro1, sizeName, form.simboloDentro1)) {
                update("l1Dentro1", newValue);
              }
            }}
            className="mt-1 bg-secondary border-border"
          />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L2 Dentro (esq)</Label>
          <Input
            value={form.l2Dentro1}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= form.l2Dentro1.length) { update("l2Dentro1", newValue); return; }
              const sizeName = form.tamanhoLabel || form.tamanho;
              if (canAddCharToDentro(form.l2Dentro1, form.l1Dentro1, sizeName, form.simboloDentro1)) {
                update("l2Dentro1", newValue);
              }
            }}
            className="mt-1 bg-secondary border-border"
            placeholder="Opcional"
          />
          {(() => {
            const sizeName = form.tamanhoLabel || form.tamanho;
            const currentFs = calcDentroFontSize(form.l1Dentro1, form.l2Dentro1, sizeName, form.simboloDentro1);
            const isReduced = currentFs < 423;
            const isAtLimit = currentFs <= MIN_FONT_SIZE_12PT;
            const ptSize = Math.round(currentFs / 35.28 * 10) / 10;
            if (isAtLimit && (form.l1Dentro1.length > 0 || form.l2Dentro1.length > 0)) {
              return <p className="text-xs text-destructive mt-1">Dentro (esq): limite atingido ({ptSize}pt mínimo).</p>;
            }
            if (isReduced) {
              return <p className="text-xs text-amber-500 mt-1">Dentro (esq): fonte reduzida para {ptSize}pt.</p>;
            }
            return null;
          })()}
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L1 Dentro (dir)</Label>
          <Input
            value={form.l1Dentro2}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= form.l1Dentro2.length) { update("l1Dentro2", newValue); return; }
              const sizeName = form.tamanhoLabel || form.tamanho;
              if (canAddCharToDentro(form.l1Dentro2, form.l2Dentro2, sizeName, form.simboloDentro2)) {
                update("l1Dentro2", newValue);
              }
            }}
            className="mt-1 bg-secondary border-border"
          />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">L2 Dentro (dir)</Label>
          <Input
            value={form.l2Dentro2}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= form.l2Dentro2.length) { update("l2Dentro2", newValue); return; }
              const sizeName = form.tamanhoLabel || form.tamanho;
              if (canAddCharToDentro(form.l2Dentro2, form.l1Dentro2, sizeName, form.simboloDentro2)) {
                update("l2Dentro2", newValue);
              }
            }}
            className="mt-1 bg-secondary border-border"
            placeholder="Opcional"
          />
          {(() => {
            const sizeName = form.tamanhoLabel || form.tamanho;
            const currentFs = calcDentroFontSize(form.l1Dentro2, form.l2Dentro2, sizeName, form.simboloDentro2);
            const isReduced = currentFs < 423;
            const isAtLimit = currentFs <= MIN_FONT_SIZE_12PT;
            const ptSize = Math.round(currentFs / 35.28 * 10) / 10;
            if (isAtLimit && (form.l1Dentro2.length > 0 || form.l2Dentro2.length > 0)) {
              return <p className="text-xs text-destructive mt-1">Dentro (dir): limite atingido ({ptSize}pt mínimo).</p>;
            }
            if (isReduced) {
              return <p className="text-xs text-amber-500 mt-1">Dentro (dir): fonte reduzida para {ptSize}pt.</p>;
            }
            return null;
          })()}
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
              {FRONT_FONTS.map((f) => (
                <SelectItem key={f.name} value={f.name}>
                  <span style={{ fontFamily: f.family, fontWeight: f.name === "Kids Station" || f.name === "Milky Matcha" ? "normal" : "bold" }}>{f.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fonte Verso (fixa) */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Fonte Verso</Label>
          <div className="mt-1 px-3 py-2 bg-secondary border border-border rounded-md text-sm text-muted-foreground">
            <span style={{ fontFamily: VERSO_FONT.family, fontWeight: "bold" }}>{VERSO_FONT.label}</span>
            <span className="text-xs ml-2 opacity-60">(fixo)</span>
          </div>
        </div>

        {/* Símbolo Frente (antes do texto) */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Símbolo Frente (antes)</Label>
          <Select value={form.simboloFrente || "none"} onValueChange={(v) => { update("simboloFrente", v === "none" ? undefined : v); if (v === "none") update("offsetSimboloFrente", 0); }}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {BRACELET_SYMBOLS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox={s.viewBox} className="shrink-0">
                      {s.paths.map((p, i) => (
                        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" clipRule="evenodd" />
                      ))}
                    </svg>
                    {s.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.simboloFrente && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Posição horizontal</span>
                <span className="text-xs text-muted-foreground font-mono">{(form.offsetSimboloFrente || 0) > 0 ? "+" : ""}{form.offsetSimboloFrente || 0}mm</span>
              </div>
              <input type="range" min={-15} max={15} step={0.5} value={form.offsetSimboloFrente || 0} onChange={(e) => update("offsetSimboloFrente", parseFloat(e.target.value))} className="w-full h-2 mt-1 accent-primary cursor-pointer" />
              <div className="flex justify-between text-[10px] text-muted-foreground opacity-50"><span>← esq</span><span>centro</span><span>dir →</span></div>
            </div>
          )}
        </div>

        {/* Símbolo Frente 2 (depois do texto) */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Símbolo Frente (depois)</Label>
          <Select value={form.simboloFrente2 || "none"} onValueChange={(v) => { update("simboloFrente2", v === "none" ? undefined : v); if (v === "none") update("offsetSimboloFrente2", 0); }}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {BRACELET_SYMBOLS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox={s.viewBox} className="shrink-0">
                      {s.paths.map((p, i) => (
                        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" clipRule="evenodd" />
                      ))}
                    </svg>
                    {s.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.simboloFrente2 && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Posição horizontal</span>
                <span className="text-xs text-muted-foreground font-mono">{(form.offsetSimboloFrente2 || 0) > 0 ? "+" : ""}{form.offsetSimboloFrente2 || 0}mm</span>
              </div>
              <input type="range" min={-15} max={15} step={0.5} value={form.offsetSimboloFrente2 || 0} onChange={(e) => update("offsetSimboloFrente2", parseFloat(e.target.value))} className="w-full h-2 mt-1 accent-primary cursor-pointer" />
              <div className="flex justify-between text-[10px] text-muted-foreground opacity-50"><span>← esq</span><span>centro</span><span>dir →</span></div>
            </div>
          )}
        </div>

        {/* Símbolo Verso */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Símbolo Verso</Label>
          <Select value={form.simboloVerso || "none"} onValueChange={(v) => { update("simboloVerso", v === "none" ? undefined : v); if (v === "none") update("offsetSimboloVerso", 0); }}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {BRACELET_SYMBOLS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox={s.viewBox} className="shrink-0">
                      {s.paths.map((p, i) => (
                        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" clipRule="evenodd" />
                      ))}
                    </svg>
                    {s.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.simboloVerso && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Posição horizontal</span>
                <span className="text-xs text-muted-foreground font-mono">{(form.offsetSimboloVerso || 0) > 0 ? "+" : ""}{form.offsetSimboloVerso || 0}mm</span>
              </div>
              <input type="range" min={-15} max={15} step={0.5} value={form.offsetSimboloVerso || 0} onChange={(e) => update("offsetSimboloVerso", parseFloat(e.target.value))} className="w-full h-2 mt-1 accent-primary cursor-pointer" />
              <div className="flex justify-between text-[10px] text-muted-foreground opacity-50"><span>← esq</span><span>centro</span><span>dir →</span></div>
            </div>
          )}
        </div>

        {/* Símbolo Dentro 1 */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Símbolo Dentro (esq)</Label>
          <Select value={form.simboloDentro1 || "none"} onValueChange={(v) => { update("simboloDentro1", v === "none" ? undefined : v); if (v === "none") update("offsetSimboloDentro1", 0); }}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {BRACELET_SYMBOLS.filter((s) => ["whatsapp", "gota", "alerta", "brasil"].includes(s.id)).map((sym) => (
                <SelectItem key={sym.id} value={sym.id}>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox={sym.viewBox} className="shrink-0">
                      {sym.paths.map((p, i) => (
                        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" clipRule="evenodd" />
                      ))}
                    </svg>
                    {sym.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.simboloDentro1 && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Posição horizontal</span>
                <span className="text-xs text-muted-foreground font-mono">{(form.offsetSimboloDentro1 || 0) > 0 ? "+" : ""}{form.offsetSimboloDentro1 || 0}mm</span>
              </div>
              <input type="range" min={-15} max={15} step={0.5} value={form.offsetSimboloDentro1 || 0} onChange={(e) => update("offsetSimboloDentro1", parseFloat(e.target.value))} className="w-full h-2 mt-1 accent-primary cursor-pointer" />
              <div className="flex justify-between text-[10px] text-muted-foreground opacity-50"><span>← esq</span><span>centro</span><span>dir →</span></div>
            </div>
          )}
        </div>

        {/* Símbolo Dentro 2 */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Símbolo Dentro (dir)</Label>
          <Select value={form.simboloDentro2 || "none"} onValueChange={(v) => { update("simboloDentro2", v === "none" ? undefined : v); if (v === "none") update("offsetSimboloDentro2", 0); }}>
            <SelectTrigger className="mt-1 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {BRACELET_SYMBOLS.filter((s) => ["whatsapp", "gota", "alerta", "brasil"].includes(s.id)).map((sym) => (
                <SelectItem key={sym.id} value={sym.id}>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox={sym.viewBox} className="shrink-0">
                      {sym.paths.map((p, i) => (
                        <path key={i} d={p.d} fill={p.fill} fillRule="evenodd" clipRule="evenodd" />
                      ))}
                    </svg>
                    {sym.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.simboloDentro2 && (
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Posição horizontal</span>
                <span className="text-xs text-muted-foreground font-mono">{(form.offsetSimboloDentro2 || 0) > 0 ? "+" : ""}{form.offsetSimboloDentro2 || 0}mm</span>
              </div>
              <input type="range" min={-15} max={15} step={0.5} value={form.offsetSimboloDentro2 || 0} onChange={(e) => update("offsetSimboloDentro2", parseFloat(e.target.value))} className="w-full h-2 mt-1 accent-primary cursor-pointer" />
              <div className="flex justify-between text-[10px] text-muted-foreground opacity-50"><span>← esq</span><span>centro</span><span>dir →</span></div>
            </div>
          )}
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
