import { useState, type ReactNode } from "react";
import type { BraceletOrder } from "@/lib/constants";
import {
  BRACELET_COLORS,
  BRACELET_SIZES,
  BRACELET_SYMBOLS,
  FRONT_FONTS,
  FRONT_MIN_FONT_SIZE,
  MIN_FONT_SIZE_11_5PT,
  MIN_FONT_SIZE_12PT,
  VERSO_FONT,
  calcDentroFontSize,
  calcFrontFontSize,
  calcVersoFontSize,
  canAddCharToDentro,
  canAddCharToFront,
  canAddCharToVerso,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CircleUserRound,
  Layers3,
  Palette,
  Save,
  Shapes,
  Type,
  X,
} from "lucide-react";

interface OrderEditorProps {
  order: BraceletOrder;
  onSave: (order: BraceletOrder) => void;
  onClose: () => void;
}

interface SectionCardProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

interface FieldProps {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

interface SymbolSelectorProps {
  label: string;
  value?: string;
  offset?: number;
  onValueChange: (value: string | undefined) => void;
  onOffsetChange: (value: number) => void;
}

const CONTROL_CLASS =
  "mt-1.5 h-10 border-border/80 bg-white shadow-sm focus-visible:border-primary/50 focus-visible:ring-primary/15";

function SectionCard({
  number,
  title,
  description,
  icon,
  children,
}: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-sm">
      <div className="flex items-start gap-3 border-b border-border/60 bg-gradient-to-r from-primary/[0.065] to-transparent px-4 py-4 sm:px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Etapa {number}
            </span>
          </div>
          <h3 className="mt-0.5 text-base font-bold">{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, className = "", children }: FieldProps) {
  return (
    <div className={className}>
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {hint && (
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function PositionControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-secondary/45 px-3 py-2.5">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Posição horizontal</span>
        <span className="rounded-md bg-white px-1.5 py-0.5 font-mono font-semibold text-foreground shadow-sm">
          {value > 0 ? "+" : ""}
          {value} mm
        </span>
      </div>
      <input
        type="range"
        min={-15}
        max={15}
        step={0.5}
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        className="mt-2 h-2 w-full cursor-pointer accent-primary"
      />
      <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground/70">
        <span>Esquerda</span>
        <span>Centro</span>
        <span>Direita</span>
      </div>
    </div>
  );
}

function SymbolSelector({
  label,
  value,
  offset = 0,
  onValueChange,
  onOffsetChange,
}: SymbolSelectorProps) {
  return (
    <Field label={label}>
      <Select
        value={value || "none"}
        onValueChange={nextValue =>
          onValueChange(nextValue === "none" ? undefined : nextValue)
        }
      >
        <SelectTrigger className={CONTROL_CLASS}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Nenhum símbolo</SelectItem>
          {BRACELET_SYMBOLS.map(symbol => (
            <SelectItem key={symbol.id} value={symbol.id}>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox={symbol.viewBox}
                  className="shrink-0"
                >
                  {symbol.paths.map((path, index) => (
                    <path
                      key={index}
                      d={path.d}
                      fill={path.fill}
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  ))}
                </svg>
                {symbol.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && <PositionControl value={offset} onChange={onOffsetChange} />}
    </Field>
  );
}

function FitMessage({
  state,
  label,
}: {
  state: { reduced: boolean; atLimit: boolean; ptSize: number };
  label: string;
}) {
  if (state.atLimit) {
    return (
      <p className="mt-1.5 text-xs font-medium text-destructive">
        {label}: limite atingido ({state.ptSize} pt mínimo).
      </p>
    );
  }
  if (state.reduced) {
    return (
      <p className="mt-1.5 text-xs font-medium text-amber-600">
        {label}: fonte ajustada para {state.ptSize} pt para o texto caber.
      </p>
    );
  }
  return null;
}

export default function OrderEditor({
  order,
  onSave,
  onClose,
}: OrderEditorProps) {
  const [form, setForm] = useState<BraceletOrder>({ ...order });

  const update = (
    field: keyof BraceletOrder,
    value: string | number | undefined
  ) => {
    setForm(previous => ({ ...previous, [field]: value }));
  };

  const handleColorChange = (colorName: string) => {
    const color = BRACELET_COLORS.find(item => item.name === colorName);
    if (color) {
      setForm(previous => ({
        ...previous,
        cor: color.name,
        corTexto: color.textColor,
      }));
    }
  };

  const handleSizeChange = (sizeName: string) => {
    const size = BRACELET_SIZES.find(item => item.name === sizeName);
    if (size) {
      setForm(previous => ({
        ...previous,
        tamanho: size.name,
        tamanhoLabel: size.label,
        tamanhoCm: size.cm,
      }));
    }
  };

  const handleSymbolChange = (
    symbolField: keyof BraceletOrder,
    offsetField: keyof BraceletOrder,
    value: string | undefined
  ) => {
    setForm(previous => ({
      ...previous,
      [symbolField]: value,
      ...(!value ? { [offsetField]: 0 } : {}),
    }));
  };

  const sizeName = form.tamanhoLabel || form.tamanho;
  const frontFontSize = calcFrontFontSize(
    form.textoFrente,
    form.fonteFrente,
    sizeName,
    form.simboloFrente,
    form.simboloFrente2,
    form.l2Frente || ""
  );
  const frontFont = FRONT_FONTS.find(font => font.name === form.fonteFrente);
  const frontOriginalSize = frontFont?.svgFontSize || 635;
  const frontBaseSize = form.l2Frente
    ? Math.min(
        frontOriginalSize,
        frontFont?.twoLineMaxFontSize || frontOriginalSize
      )
    : frontOriginalSize;
  const frontMinimumSize = form.l2Frente
    ? Math.min(FRONT_MIN_FONT_SIZE, frontBaseSize)
    : FRONT_MIN_FONT_SIZE;
  const frontFit = {
    reduced: frontFontSize < frontBaseSize,
    atLimit:
      frontFontSize <= frontMinimumSize &&
      (form.textoFrente.length > 0 || (form.l2Frente || "").length > 0),
    ptSize: Math.round((frontFontSize / 35.28) * 10) / 10,
  };

  const backFontSize = calcVersoFontSize(
    form.textoVerso,
    form.l2Verso || "",
    sizeName,
    form.simboloVerso,
    form.l3Verso
  );
  const backFit = {
    reduced: backFontSize < 423,
    atLimit:
      backFontSize <= MIN_FONT_SIZE_12PT &&
      [form.textoVerso, form.l2Verso, form.l3Verso].some(Boolean),
    ptSize: Math.round((backFontSize / 35.28) * 10) / 10,
  };

  const insideLeftFontSize = calcDentroFontSize(
    form.l1Dentro1,
    form.l2Dentro1,
    sizeName,
    form.simboloDentro1,
    form.l3Dentro1
  );
  const insideLeftFit = {
    reduced: insideLeftFontSize < 423,
    atLimit:
      insideLeftFontSize <= MIN_FONT_SIZE_11_5PT &&
      [form.l1Dentro1, form.l2Dentro1, form.l3Dentro1].some(Boolean),
    ptSize: Math.round((insideLeftFontSize / 35.28) * 10) / 10,
  };

  const insideRightFontSize = calcDentroFontSize(
    form.l1Dentro2,
    form.l2Dentro2,
    sizeName,
    form.simboloDentro2,
    form.l3Dentro2
  );
  const insideRightFit = {
    reduced: insideRightFontSize < 423,
    atLimit:
      insideRightFontSize <= MIN_FONT_SIZE_11_5PT &&
      [form.l1Dentro2, form.l2Dentro2, form.l3Dentro2].some(Boolean),
    ptSize: Math.round((insideRightFontSize / 35.28) * 10) / 10,
  };

  const updateFrontText = (
    field: "textoFrente" | "l2Frente",
    newValue: string
  ) => {
    const currentValue = form[field] || "";
    if (newValue.length <= currentValue.length) {
      update(field, newValue);
      return;
    }

    const otherLine =
      field === "textoFrente" ? form.l2Frente || "" : form.textoFrente;
    if (
      canAddCharToFront(
        newValue,
        form.fonteFrente,
        sizeName,
        form.simboloFrente,
        form.simboloFrente2,
        otherLine
      )
    ) {
      update(field, newValue);
    }
  };

  const updateBackText = (
    field: "textoVerso" | "l2Verso" | "l3Verso",
    newValue: string
  ) => {
    const currentValue = form[field] || "";
    if (newValue.length <= currentValue.length) {
      update(field, newValue);
      return;
    }

    const otherLines = [
      form.textoVerso,
      form.l2Verso || "",
      form.l3Verso || "",
    ].filter((_, index) => {
      const fields = ["textoVerso", "l2Verso", "l3Verso"];
      return fields[index] !== field;
    });
    if (
      canAddCharToVerso(
        newValue,
        otherLines[0] || "",
        sizeName,
        form.simboloVerso,
        otherLines[1] || ""
      )
    ) {
      update(field, newValue);
    }
  };

  const updateInsideText = (
    field:
      | "l1Dentro1"
      | "l2Dentro1"
      | "l3Dentro1"
      | "l1Dentro2"
      | "l2Dentro2"
      | "l3Dentro2",
    newValue: string,
    side: 1 | 2
  ) => {
    const currentValue = form[field] || "";
    if (newValue.length <= currentValue.length) {
      update(field, newValue);
      return;
    }

    const lines =
      side === 1
        ? [form.l1Dentro1, form.l2Dentro1, form.l3Dentro1 || ""]
        : [form.l1Dentro2, form.l2Dentro2, form.l3Dentro2 || ""];
    const fields =
      side === 1
        ? ["l1Dentro1", "l2Dentro1", "l3Dentro1"]
        : ["l1Dentro2", "l2Dentro2", "l3Dentro2"];
    const otherLines = lines.filter((_, index) => fields[index] !== field);
    const symbol = side === 1 ? form.simboloDentro1 : form.simboloDentro2;

    if (
      canAddCharToDentro(
        newValue,
        otherLines[0] || "",
        sizeName,
        symbol,
        otherLines[1] || ""
      )
    ) {
      update(field, newValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Formulário guiado
          </p>
          <h2 className="mt-1 text-xl font-bold">Editar pedido</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Preencha os blocos na ordem. Campos com “opcional” podem ficar
            vazios.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Fechar editor"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <SectionCard
        number={1}
        title="Dados do pedido"
        description="Identifique o cliente e defina as características físicas da pulseira."
        icon={<CircleUserRound className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do cliente" className="sm:col-span-2">
            <Input
              value={form.nomeCliente}
              onChange={event => update("nomeCliente", event.target.value)}
              placeholder="Ex.: João da Silva"
              className={CONTROL_CLASS}
            />
          </Field>

          <Field label="Quantidade">
            <Input
              type="number"
              min={1}
              value={form.quantidade || 1}
              onChange={event =>
                update(
                  "quantidade",
                  Math.max(1, Number.parseInt(event.target.value, 10) || 1)
                )
              }
              className={CONTROL_CLASS}
            />
          </Field>

          <Field label="Tamanho">
            <Select value={form.tamanho} onValueChange={handleSizeChange}>
              <SelectTrigger className={CONTROL_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRACELET_SIZES.map(size => (
                  <SelectItem key={size.name} value={size.name}>
                    {size.cm} cm — {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Cor da pulseira">
            <Select value={form.cor} onValueChange={handleColorChange}>
              <SelectTrigger className={CONTROL_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRACELET_COLORS.map(color => (
                  <SelectItem key={color.name} value={color.name}>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-md border border-black/15"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Fonte da frente">
            <Select
              value={form.fonteFrente}
              onValueChange={value => update("fonteFrente", value)}
            >
              <SelectTrigger className={CONTROL_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FRONT_FONTS.map(font => (
                  <SelectItem key={font.name} value={font.name}>
                    <span
                      style={{
                        fontFamily: font.family,
                        fontWeight:
                          font.name === "Kids Station" ||
                          font.name === "Milky Matcha"
                            ? "normal"
                            : "bold",
                      }}
                    >
                      {font.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        number={2}
        title="Parte da frente"
        description="Digite o texto principal e, se quiser, adicione uma segunda linha e símbolos."
        icon={<Type className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <Field label="Texto principal">
            <Input
              value={form.textoFrente}
              onChange={event =>
                updateFrontText("textoFrente", event.target.value)
              }
              placeholder="Texto que ficará em destaque"
              className={CONTROL_CLASS}
            />
          </Field>
          <Field label="Segunda linha" hint="Opcional">
            <Input
              value={form.l2Frente || ""}
              onChange={event =>
                updateFrontText("l2Frente", event.target.value)
              }
              placeholder="Complemento do texto principal"
              className={CONTROL_CLASS}
            />
          </Field>
          <FitMessage state={frontFit} label="Frente" />

          <div className="grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2">
            <SymbolSelector
              label="Símbolo antes do texto"
              value={form.simboloFrente}
              offset={form.offsetSimboloFrente}
              onValueChange={value =>
                handleSymbolChange(
                  "simboloFrente",
                  "offsetSimboloFrente",
                  value
                )
              }
              onOffsetChange={value => update("offsetSimboloFrente", value)}
            />
            <SymbolSelector
              label="Símbolo depois do texto"
              value={form.simboloFrente2}
              offset={form.offsetSimboloFrente2}
              onValueChange={value =>
                handleSymbolChange(
                  "simboloFrente2",
                  "offsetSimboloFrente2",
                  value
                )
              }
              onOffsetChange={value => update("offsetSimboloFrente2", value)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        number={3}
        title="Parte de trás"
        description={`Use até três linhas. A fonte do verso é sempre ${VERSO_FONT.label}.`}
        icon={<Palette className="h-4 w-4" />}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Linha 1" className="sm:col-span-2">
              <Input
                value={form.textoVerso}
                onChange={event =>
                  updateBackText("textoVerso", event.target.value)
                }
                placeholder="Texto do verso"
                className={CONTROL_CLASS}
              />
            </Field>
            <Field label="Linha 2" hint="Opcional">
              <Input
                value={form.l2Verso || ""}
                onChange={event =>
                  updateBackText("l2Verso", event.target.value)
                }
                placeholder="Segunda linha"
                className={CONTROL_CLASS}
              />
            </Field>
            <Field label="Linha 3" hint="Opcional">
              <Input
                value={form.l3Verso || ""}
                onChange={event =>
                  updateBackText("l3Verso", event.target.value)
                }
                placeholder="Terceira linha"
                className={CONTROL_CLASS}
              />
            </Field>
          </div>
          <FitMessage state={backFit} label="Verso" />
          <div className="border-t border-border/60 pt-4">
            <SymbolSelector
              label="Símbolo do verso"
              value={form.simboloVerso}
              offset={form.offsetSimboloVerso}
              onValueChange={value =>
                handleSymbolChange("simboloVerso", "offsetSimboloVerso", value)
              }
              onOffsetChange={value => update("offsetSimboloVerso", value)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        number={4}
        title="Parte interna"
        description="As duas metades internas são preenchidas separadamente. Todos os campos são opcionais."
        icon={<Layers3 className="h-4 w-4" />}
      >
        <div className="grid gap-4">
          <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <Shapes className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-bold">Metade esquerda</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Linha 1" className="sm:col-span-2">
                <Input
                  value={form.l1Dentro1}
                  onChange={event =>
                    updateInsideText("l1Dentro1", event.target.value, 1)
                  }
                  placeholder="Texto interno"
                  className={CONTROL_CLASS}
                />
              </Field>
              <Field label="Linha 2" hint="Opcional">
                <Input
                  value={form.l2Dentro1}
                  onChange={event =>
                    updateInsideText("l2Dentro1", event.target.value, 1)
                  }
                  placeholder="Segunda linha"
                  className={CONTROL_CLASS}
                />
              </Field>
              <Field label="Linha 3" hint="Opcional">
                <Input
                  value={form.l3Dentro1 || ""}
                  onChange={event =>
                    updateInsideText("l3Dentro1", event.target.value, 1)
                  }
                  placeholder="Terceira linha"
                  className={CONTROL_CLASS}
                />
              </Field>
            </div>
            <FitMessage state={insideLeftFit} label="Interior esquerdo" />
            <div className="mt-4 border-t border-border/60 pt-4">
              <SymbolSelector
                label="Símbolo interno esquerdo"
                value={form.simboloDentro1}
                offset={form.offsetSimboloDentro1}
                onValueChange={value =>
                  handleSymbolChange(
                    "simboloDentro1",
                    "offsetSimboloDentro1",
                    value
                  )
                }
                onOffsetChange={value => update("offsetSimboloDentro1", value)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <Shapes className="h-3.5 w-3.5" />
              </span>
              <p className="text-sm font-bold">Metade direita</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Linha 1" className="sm:col-span-2">
                <Input
                  value={form.l1Dentro2}
                  onChange={event =>
                    updateInsideText("l1Dentro2", event.target.value, 2)
                  }
                  placeholder="Texto interno"
                  className={CONTROL_CLASS}
                />
              </Field>
              <Field label="Linha 2" hint="Opcional">
                <Input
                  value={form.l2Dentro2}
                  onChange={event =>
                    updateInsideText("l2Dentro2", event.target.value, 2)
                  }
                  placeholder="Segunda linha"
                  className={CONTROL_CLASS}
                />
              </Field>
              <Field label="Linha 3" hint="Opcional">
                <Input
                  value={form.l3Dentro2 || ""}
                  onChange={event =>
                    updateInsideText("l3Dentro2", event.target.value, 2)
                  }
                  placeholder="Terceira linha"
                  className={CONTROL_CLASS}
                />
              </Field>
            </div>
            <FitMessage state={insideRightFit} label="Interior direito" />
            <div className="mt-4 border-t border-border/60 pt-4">
              <SymbolSelector
                label="Símbolo interno direito"
                value={form.simboloDentro2}
                offset={form.offsetSimboloDentro2}
                onValueChange={value =>
                  handleSymbolChange(
                    "simboloDentro2",
                    "offsetSimboloDentro2",
                    value
                  )
                }
                onOffsetChange={value => update("offsetSimboloDentro2", value)}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="sticky bottom-3 z-20 flex flex-col-reverse gap-2 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_16px_45px_-20px_rgba(39,55,125,0.5)] backdrop-blur-xl sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} className="bg-white">
          Cancelar
        </Button>
        <Button
          onClick={() => onSave(form)}
          className="gap-2 px-5 shadow-md shadow-primary/15"
        >
          <Save className="h-4 w-4" />
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}
