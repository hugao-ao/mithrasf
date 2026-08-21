/**
 * Curva de evolução do patrimônio. Área dourada, linha sólida, marcas verticais
 * nos meses em que um objetivo saca dinheiro, e linha tracejada no zero quando
 * a série fica negativa.
 */
export function Grafico({
  serie,
  marcas = [],
}: {
  serie: number[];
  marcas?: number[];
}) {
  const W = 660;
  const H = 210;
  const P = 10;
  if (!serie.length) return null;

  const max = Math.max(...serie, 1);
  const min = Math.min(...serie, 0);
  const span = max - min || 1;
  const X = (k: number) => P + (k * (W - 2 * P)) / Math.max(serie.length - 1, 1);
  const Y = (v: number) => H - P - ((v - min) / span) * (H - 2 * P);
  const pontos = serie.map((v, k) => `${X(k).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  const fim = serie[serie.length - 1];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Evolução do patrimônio ao longo do tempo"
        className="block h-auto w-full"
      >
        <defs>
          <linearGradient id="grad-patrimonio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D4AF37" stopOpacity="0.28" />
            <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>

        {marcas
          .filter((m) => m >= 0 && m < serie.length)
          .map((m, i) => (
            <line
              key={i}
              x1={X(m).toFixed(1)}
              y1={P}
              x2={X(m).toFixed(1)}
              y2={H - P}
              stroke="#D4AF37"
              strokeWidth="1"
              opacity="0.28"
            />
          ))}

        {min < 0 && (
          <line
            x1={P}
            y1={Y(0).toFixed(1)}
            x2={W - P}
            y2={Y(0).toFixed(1)}
            stroke="#F87171"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.7"
          />
        )}

        <polygon
          points={`${P},${H - P} ${pontos} ${W - P},${H - P}`}
          fill="url(#grad-patrimonio)"
        />
        <polyline
          points={pontos}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle
          cx={X(serie.length - 1).toFixed(1)}
          cy={Y(fim).toFixed(1)}
          r="3.5"
          fill="#D4AF37"
        />
      </svg>
    </div>
  );
}
