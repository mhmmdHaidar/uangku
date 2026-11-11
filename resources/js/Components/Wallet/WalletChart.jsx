import { formatRupiah } from '@/Utils/format';
import { useState, useMemo } from 'react';
import { BarChart3, LineChart, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownLeft } from '@/Components/Icons/PhosphorDuotone';

export default function WalletChart({
    chartData = [],
    timeframe = '1m',
    onTimeframeChange,
    dateRangeFormatted = '',
    walletName = '',
}) {
    const [chartMode, setChartMode] = useState('bar'); // 'bar' or 'area'
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Compute maximum value for Y-axis scaling
    const maxValue = useMemo(() => {
        let max = 0;
        chartData.forEach((item) => {
            if (item.income > max) max = item.income;
            if (item.expense > max) max = item.expense;
        });
        return max > 0 ? max * 1.15 : 1000000;
    }, [chartData]);

    const formatYTick = (val) => {
        if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}M`;
        if (val >= 1000000) return `${(val / 1000000).toFixed(0)}jt`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}rb`;
        return val.toString();
    };

    const yTicks = [1, 0.75, 0.5, 0.25, 0].map((ratio) => maxValue * ratio);

    const totalIncome = useMemo(() => chartData.reduce((acc, curr) => acc + curr.income, 0), [chartData]);
    const totalExpense = useMemo(() => chartData.reduce((acc, curr) => acc + curr.expense, 0), [chartData]);
    const netDifference = totalIncome - totalExpense;

    // SVG Dimensions
    const svgWidth = 800;
    const svgHeight = 280;
    const paddingLeft = 45;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 40;

    const plotWidth = svgWidth - paddingLeft - paddingRight;
    const plotHeight = svgHeight - paddingTop - paddingBottom;

    const step = chartData.length > 1 ? plotWidth / (chartData.length - 1) : plotWidth;

    const incomePoints = chartData.map((d, i) => {
        const x = paddingLeft + (chartData.length === 1 ? plotWidth / 2 : i * step);
        const y = paddingTop + plotHeight - (d.income / maxValue) * plotHeight;
        return { x, y, ...d };
    });

    const expensePoints = chartData.map((d, i) => {
        const x = paddingLeft + (chartData.length === 1 ? plotWidth / 2 : i * step);
        const y = paddingTop + plotHeight - (d.expense / maxValue) * plotHeight;
        return { x, y, ...d };
    });

    const createCurvedPath = (points) => {
        if (points.length === 0) return '';
        if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? i : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;

            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    };

    const incomePath = createCurvedPath(incomePoints);
    const expensePath = createCurvedPath(expensePoints);

    const incomeAreaPath =
        incomePoints.length > 0
            ? `${incomePath} L ${incomePoints[incomePoints.length - 1].x} ${paddingTop + plotHeight} L ${incomePoints[0].x} ${paddingTop + plotHeight} Z`
            : '';

    const expenseAreaPath =
        expensePoints.length > 0
            ? `${expensePath} L ${expensePoints[expensePoints.length - 1].x} ${paddingTop + plotHeight} L ${expensePoints[0].x} ${paddingTop + plotHeight} Z`
            : '';

    // Bar chart layout calculations
    const numBars = chartData.length;
    const barSlotWidth = numBars > 0 ? plotWidth / numBars : 0;
    const singleBarWidth = Math.max(4, Math.min(18, (barSlotWidth - 10) / 2));

    const timeframes = [
        { key: '1w', label: '1 Minggu' },
        { key: '1m', label: '1 Bulan' },
        { key: '6m', label: '6 Bulan' },
        { key: '1y', label: '1 Tahun' },
        { key: 'all', label: 'Semua' },
    ];

    const hoveredData = hoveredIndex !== null ? chartData[hoveredIndex] : null;

    return (
        <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-6 border border-slate-200/90 dark:border-white/[0.08]">
            {/* Top Toolbar: Title, Period, Metric Summary, and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Tren Arus Kas {walletName ? `• ${walletName}` : ''}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Grafik Pemasukan vs Pengeluaran
                    </h3>
                    {dateRangeFormatted && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{dateRangeFormatted}</span>
                        </p>
                    )}
                </div>

                {/* Metric Badges for the selected period */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25 text-xs shadow-2xs">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Masuk:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {formatRupiah(totalIncome)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/25 text-xs shadow-2xs">
                        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Keluar:</span>
                        <span className="font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                            {formatRupiah(totalExpense)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-xs shadow-2xs">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Selisih:</span>
                        <span
                            className={`font-bold tabular-nums ${
                                netDifference >= 0
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : 'text-rose-700 dark:text-rose-400'
                            }`}
                        >
                            {netDifference >= 0 ? '+' : ''}
                            {formatRupiah(netDifference)}
                        </span>
                    </div>
                </div>

                {/* Timeframe & Display Mode Controls */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Timeframe filter pills */}
                    <div className="flex items-center p-1 bg-slate-200/60 dark:bg-white/[0.04] rounded-xl border border-slate-300/80 dark:border-white/[0.05]">
                        {timeframes.map((tf) => (
                            <button
                                key={tf.key}
                                type="button"
                                onClick={() => onTimeframeChange(tf.key)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                                    timeframe === tf.key
                                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-300/80 dark:border-transparent'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>

                    {/* Chart Style Toggle: Bar vs Area */}
                    <div className="hidden sm:flex items-center p-1 bg-slate-200/60 dark:bg-white/[0.04] rounded-xl border border-slate-300/80 dark:border-white/[0.05]">
                        <button
                            type="button"
                            onClick={() => setChartMode('bar')}
                            title="Tampilan Grafik Batang"
                            className={`p-1.5 rounded-lg transition ${
                                chartMode === 'bar'
                                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs border border-slate-300/80 dark:border-transparent'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartMode('area')}
                            title="Tampilan Grafik Garis / Area"
                            className={`p-1.5 rounded-lg transition ${
                                chartMode === 'area'
                                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs border border-slate-300/80 dark:border-transparent'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            <LineChart className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full overflow-hidden select-none">
                <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto overflow-visible"
                    style={{ maxHeight: '340px' }}
                >
                    <defs>
                        <linearGradient id="walletIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="walletExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>

                    {/* Y-Axis Horizontal Grid Lines */}
                    {yTicks.map((val, idx) => {
                        const y = paddingTop + (idx / (yTicks.length - 1)) * plotHeight;
                        return (
                            <g key={idx}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={svgWidth - paddingRight}
                                    y2={y}
                                    stroke="currentColor"
                                    className="text-slate-200/80 dark:text-white/5"
                                    strokeDasharray={idx === yTicks.length - 1 ? '0' : '3 3'}
                                    strokeWidth="1"
                                />
                                <text
                                    x={paddingLeft - 8}
                                    y={y + 3.5}
                                    textAnchor="end"
                                    fontSize="10"
                                    fill="currentColor"
                                    className="text-slate-400 font-mono"
                                >
                                    {formatYTick(val)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Bar Chart Mode */}
                    {chartMode === 'bar' &&
                        chartData.map((d, i) => {
                            const slotX = paddingLeft + i * barSlotWidth;
                            const centerX = slotX + barSlotWidth / 2;

                            const incomeHeight = (d.income / maxValue) * plotHeight;
                            const expenseHeight = (d.expense / maxValue) * plotHeight;

                            const barYIncome = paddingTop + plotHeight - incomeHeight;
                            const barYExpense = paddingTop + plotHeight - expenseHeight;

                            const isHovered = hoveredIndex === i;

                            return (
                                <g
                                    key={i}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="cursor-pointer transition-opacity"
                                >
                                    {/* Hover Column Highlight */}
                                    {isHovered && (
                                        <rect
                                            x={slotX + 2}
                                            y={paddingTop}
                                            width={barSlotWidth - 4}
                                            height={plotHeight}
                                            fill="currentColor"
                                            className="text-slate-200/50 dark:text-white/5"
                                            rx="4"
                                        />
                                    )}

                                    {/* Income Bar (Green) */}
                                    <rect
                                        x={centerX - singleBarWidth - 1.5}
                                        y={barYIncome}
                                        width={singleBarWidth}
                                        height={Math.max(2, incomeHeight)}
                                        rx={singleBarWidth > 6 ? 3 : 1}
                                        className="fill-emerald-500 transition-all duration-200 hover:opacity-90"
                                    />

                                    {/* Expense Bar (Rose) */}
                                    <rect
                                        x={centerX + 1.5}
                                        y={barYExpense}
                                        width={singleBarWidth}
                                        height={Math.max(2, expenseHeight)}
                                        rx={singleBarWidth > 6 ? 3 : 1}
                                        className="fill-rose-500 transition-all duration-200 hover:opacity-90"
                                    />
                                </g>
                            );
                        })}

                    {/* Area / Curved Line Mode */}
                    {chartMode === 'area' && (
                        <>
                            {incomeAreaPath && <path d={incomeAreaPath} fill="url(#walletIncomeGrad)" />}
                            {expenseAreaPath && <path d={expenseAreaPath} fill="url(#walletExpenseGrad)" />}

                            {/* Income Line */}
                            {incomePath && (
                                <path
                                    d={incomePath}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            )}

                            {/* Expense Line */}
                            {expensePath && (
                                <path
                                    d={expensePath}
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            )}

                            {/* Hover points */}
                            {chartData.map((d, i) => {
                                const isHovered = hoveredIndex === i;
                                const ptIncome = incomePoints[i];
                                const ptExpense = expensePoints[i];

                                return (
                                    <g
                                        key={i}
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        className="cursor-pointer"
                                    >
                                        {/* Invisible trigger area */}
                                        <rect
                                            x={ptIncome.x - step / 2}
                                            y={paddingTop}
                                            width={step}
                                            height={plotHeight}
                                            fill="transparent"
                                        />

                                        {isHovered && (
                                            <>
                                                {/* Vertical cursor guide */}
                                                <line
                                                    x1={ptIncome.x}
                                                    y1={paddingTop}
                                                    x2={ptIncome.x}
                                                    y2={paddingTop + plotHeight}
                                                    stroke="currentColor"
                                                    className="text-slate-400 dark:text-slate-500"
                                                    strokeDasharray="2 2"
                                                    strokeWidth="1"
                                                />
                                                {/* Income dot */}
                                                <circle
                                                    cx={ptIncome.x}
                                                    cy={ptIncome.y}
                                                    r="5"
                                                    className="fill-emerald-500 stroke-white dark:stroke-slate-900"
                                                    strokeWidth="2"
                                                />
                                                {/* Expense dot */}
                                                <circle
                                                    cx={ptExpense.x}
                                                    cy={ptExpense.y}
                                                    r="5"
                                                    className="fill-rose-500 stroke-white dark:stroke-slate-900"
                                                    strokeWidth="2"
                                                />
                                            </>
                                        )}
                                    </g>
                                );
                            })}
                        </>
                    )}

                    {/* X-Axis Labels */}
                    {chartData.map((d, i) => {
                        const showEvery = Math.ceil(chartData.length / 10);
                        if (i % showEvery !== 0 && i !== chartData.length - 1) return null;

                        const x =
                            chartMode === 'bar'
                                ? paddingLeft + i * barSlotWidth + barSlotWidth / 2
                                : incomePoints[i]?.x || paddingLeft;

                        return (
                            <text
                                key={i}
                                x={x}
                                y={svgHeight - 12}
                                textAnchor="middle"
                                fontSize="10"
                                fill="currentColor"
                                className="text-slate-400 dark:text-slate-500 font-medium"
                            >
                                {d.label}
                            </text>
                        );
                    })}
                </svg>

                {/* Interactive Tooltip Card */}
                {hoveredData && (
                    <div className="absolute top-3 right-3 sm:right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-lg text-xs pointer-events-none transition-all duration-150 min-w-[190px]">
                        <p className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-1.5 mb-2">
                            {hoveredData.full_label || hoveredData.label}
                        </p>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Pemasukan
                                </span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                    {formatRupiah(hoveredData.income)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                    Pengeluaran
                                </span>
                                <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                                    {formatRupiah(hoveredData.expense)}
                                </span>
                            </div>
                            <div className="pt-1.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between font-semibold">
                                <span className="text-slate-500 dark:text-slate-400">Selisih Kas</span>
                                <span
                                    className={`tabular-nums ${
                                        hoveredData.net >= 0
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-rose-600 dark:text-rose-400'
                                    }`}
                                >
                                    {hoveredData.net >= 0 ? '+' : ''}
                                    {formatRupiah(hoveredData.net)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

