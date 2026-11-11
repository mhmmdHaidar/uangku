import { formatRupiah } from '@/Utils/format';
import { useState, useMemo } from 'react';
import { BarChart3, LineChart, TrendingUp, TrendingDown, Calendar } from '@/Components/Icons/PhosphorDuotone';

export default function ReportChart({
    chartData = [],
    timeframe = '1m',
    onTimeframeChange,
    dateRangeFormatted = '',
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
        // Add 15% headroom or fallback
        return max > 0 ? max * 1.15 : 1000000;
    }, [chartData]);

    // Format Y-axis tick values (e.g. 1jt, 5jt, 10jt or Rp 1jt)
    const formatYTick = (val) => {
        if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}M`;
        if (val >= 1000000) return `${(val / 1000000).toFixed(0)}jt`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}rb`;
        return val.toString();
    };

    const yTicks = [1, 0.75, 0.5, 0.25, 0].map((ratio) => maxValue * ratio);

    // Calculate totals in the chart
    const totalIncome = useMemo(() => chartData.reduce((acc, curr) => acc + curr.income, 0), [chartData]);
    const totalExpense = useMemo(() => chartData.reduce((acc, curr) => acc + curr.expense, 0), [chartData]);
    const netDifference = totalIncome - totalExpense;

    // SVG Canvas Dimensions
    const svgWidth = 800;
    const svgHeight = 280;
    const paddingLeft = 45;
    const paddingRight = 15;
    const paddingTop = 20;
    const paddingBottom = 40;

    const plotWidth = svgWidth - paddingLeft - paddingRight;
    const plotHeight = svgHeight - paddingTop - paddingBottom;

    // Compute points for lines/areas
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

    // Helper to generate smooth SVG path from points using Catmull-Rom / Bezier
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

    const groundY = paddingTop + plotHeight;
    const incomeAreaPath = incomePoints.length > 1
        ? `${incomePath} L ${incomePoints[incomePoints.length - 1].x} ${groundY} L ${incomePoints[0].x} ${groundY} Z`
        : '';
    const expenseAreaPath = expensePoints.length > 1
        ? `${expensePath} L ${expensePoints[expensePoints.length - 1].x} ${groundY} L ${expensePoints[0].x} ${groundY} Z`
        : '';

    // Active hovered item
    const activeItem = hoveredIndex !== null && chartData[hoveredIndex] ? chartData[hoveredIndex] : null;

    // Filter label steps to prevent overlapping text on X axis
    const labelInterval = Math.max(1, Math.ceil(chartData.length / 8));

    return (
        <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-6 border border-slate-200/90 dark:border-white/[0.08]">
            {/* Top Bar: Title, Date Range, Filter Switchers */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            Tren Arus Kas (Pemasukan vs Pengeluaran)
                        </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Periode: {dateRangeFormatted}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Timeframe Switcher Tabs */}
                    <div className="flex items-center p-1 bg-slate-200/60 dark:bg-[#161619] rounded-xl border border-slate-300/80 dark:border-[#2C2C32]">
                        {[
                            { key: '1w', label: '1 Minggu' },
                            { key: '1m', label: '1 Bulan' },
                            { key: '6m', label: '6 Bulan' },
                            { key: '1y', label: '1 Tahun' },
                        ].map((item) => (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => onTimeframeChange(item.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                                    timeframe === item.key
                                        ? 'bg-white dark:bg-[#2A2A32] text-slate-900 dark:text-white shadow-xs border border-slate-300/80 dark:border-[#3E3E46]'
                                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Chart Mode Toggle */}
                    <div className="flex items-center p-1 bg-slate-200/60 dark:bg-[#161619] rounded-xl border border-slate-300/80 dark:border-[#2C2C32]">
                        <button
                            type="button"
                            onClick={() => setChartMode('bar')}
                            title="Diagram Batang"
                            className={`p-1.5 rounded-lg transition-all ${
                                chartMode === 'bar'
                                    ? 'bg-white dark:bg-[#2A2A32] text-blue-700 dark:text-white shadow-xs border border-slate-300/80 dark:border-[#3E3E46]'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartMode('area')}
                            title="Grafik Garis Area"
                            className={`p-1.5 rounded-lg transition-all ${
                                chartMode === 'area'
                                    ? 'bg-white dark:bg-[#2A2A32] text-blue-700 dark:text-white shadow-xs border border-slate-300/80 dark:border-[#3E3E46]'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                            }`}
                        >
                            <LineChart className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Chart Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-y border-slate-200 dark:border-white/5 py-2.5">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Pemasukan</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {formatRupiah(totalIncome)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Pengeluaran</span>
                        <span className="font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                            {formatRupiah(totalExpense)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06]">
                    <span className="text-slate-500 dark:text-slate-400">Selisih Bersih:</span>
                    <span className={`font-bold tabular-nums ${netDifference >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                        {netDifference >= 0 ? '+' : ''}{formatRupiah(netDifference)}
                    </span>
                </div>
            </div>

            {/* Interactive SVG Chart Canvas */}
            <div className="relative w-full overflow-hidden select-none">
                <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto overflow-visible font-sans"
                    preserveAspectRatio="none"
                >
                    <defs>
                        {/* Gradient for Income Area */}
                        <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>

                        {/* Gradient for Expense Area */}
                        <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                        </linearGradient>

                        {/* Bar linear gradients */}
                        <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#e11d48" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines & Y-ticks */}
                    {yTicks.map((tickVal, idx) => {
                        const y = paddingTop + (idx / (yTicks.length - 1)) * plotHeight;
                        return (
                            <g key={idx}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={svgWidth - paddingRight}
                                    y2={y}
                                    stroke="currentColor"
                                    className="text-slate-200 dark:text-white/[0.06]"
                                    strokeDasharray={idx === yTicks.length - 1 ? 'none' : '3 3'}
                                    strokeWidth="1"
                                />
                                <text
                                    x={paddingLeft - 8}
                                    y={y + 3}
                                    textAnchor="end"
                                    className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono"
                                >
                                    {formatYTick(tickVal)}
                                </text>
                            </g>
                        );
                    })}

                    {/* 1. Bar Chart Mode */}
                    {chartMode === 'bar' && (
                        <g>
                            {chartData.map((d, i) => {
                                const slotWidth = plotWidth / chartData.length;
                                const barWidth = Math.max(3, Math.min(16, (slotWidth - 8) / 2));
                                const slotCenterX = paddingLeft + i * slotWidth + slotWidth / 2;

                                const incomeH = (d.income / maxValue) * plotHeight;
                                const expenseH = (d.expense / maxValue) * plotHeight;

                                const incomeX = slotCenterX - barWidth - 1;
                                const expenseX = slotCenterX + 1;

                                const incomeY = groundY - incomeH;
                                const expenseY = groundY - expenseH;

                                const isHovered = hoveredIndex === i;

                                return (
                                    <g key={i} className="transition-opacity duration-150">
                                        {/* Hover Detection Area */}
                                        <rect
                                            x={paddingLeft + i * slotWidth}
                                            y={paddingTop}
                                            width={slotWidth}
                                            height={plotHeight}
                                            fill="transparent"
                                            className="cursor-pointer"
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        />

                                        {/* Background column highlight on hover */}
                                        {isHovered && (
                                            <rect
                                                x={paddingLeft + i * slotWidth + 2}
                                                y={paddingTop}
                                                width={slotWidth - 4}
                                                height={plotHeight}
                                                className="fill-slate-100 dark:fill-white/[0.04] rounded-lg"
                                                rx="6"
                                            />
                                        )}

                                        {/* Income Bar */}
                                        {incomeH > 0 && (
                                            <rect
                                                x={incomeX}
                                                y={incomeY}
                                                width={barWidth}
                                                height={incomeH}
                                                fill="url(#incomeBarGrad)"
                                                rx={barWidth > 4 ? 3 : 1}
                                                className={`transition-all duration-150 ${isHovered ? 'filter drop-shadow(0 2px 6px rgba(16,185,129,0.4))' : 'opacity-90'}`}
                                            />
                                        )}

                                        {/* Expense Bar */}
                                        {expenseH > 0 && (
                                            <rect
                                                x={expenseX}
                                                y={expenseY}
                                                width={barWidth}
                                                height={expenseH}
                                                fill="url(#expenseBarGrad)"
                                                rx={barWidth > 4 ? 3 : 1}
                                                className={`transition-all duration-150 ${isHovered ? 'filter drop-shadow(0 2px 6px rgba(244,63,94,0.4))' : 'opacity-90'}`}
                                            />
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    )}

                    {/* 2. Area Chart Mode */}
                    {chartMode === 'area' && (
                        <g>
                            {/* Income Area Fill */}
                            {incomeAreaPath && (
                                <path d={incomeAreaPath} fill="url(#incomeAreaGrad)" />
                            )}
                            {/* Expense Area Fill */}
                            {expenseAreaPath && (
                                <path d={expenseAreaPath} fill="url(#expenseAreaGrad)" />
                            )}

                            {/* Income Curve Stroke */}
                            {incomePath && (
                                <path
                                    d={incomePath}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            )}

                            {/* Expense Curve Stroke */}
                            {expensePath && (
                                <path
                                    d={expensePath}
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            )}

                            {/* Pointer Dots & Interactive Areas */}
                            {chartData.map((d, i) => {
                                const ptIncome = incomePoints[i];
                                const ptExpense = expensePoints[i];
                                const isHovered = hoveredIndex === i;

                                return (
                                    <g key={i}>
                                        {/* Invisible hover trigger strip */}
                                        <rect
                                            x={ptIncome.x - step / 2}
                                            y={paddingTop}
                                            width={step}
                                            height={plotHeight}
                                            fill="transparent"
                                            className="cursor-pointer"
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        />

                                        {isHovered && (
                                            <g>
                                                {/* Vertical guideline */}
                                                <line
                                                    x1={ptIncome.x}
                                                    y1={paddingTop}
                                                    x2={ptIncome.x}
                                                    y2={groundY}
                                                    stroke="currentColor"
                                                    className="text-slate-300 dark:text-slate-600"
                                                    strokeDasharray="2 2"
                                                    strokeWidth="1.5"
                                                />

                                                {/* Income dot */}
                                                <circle
                                                    cx={ptIncome.x}
                                                    cy={ptIncome.y}
                                                    r="5"
                                                    className="fill-emerald-500 stroke-white dark:stroke-[#1C1C20]"
                                                    strokeWidth="2"
                                                />

                                                {/* Expense dot */}
                                                <circle
                                                    cx={ptExpense.x}
                                                    cy={ptExpense.y}
                                                    r="5"
                                                    className="fill-rose-500 stroke-white dark:stroke-[#1C1C20]"
                                                    strokeWidth="2"
                                                />
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    )}

                    {/* X-Axis Labels */}
                    {chartData.map((d, i) => {
                        const slotWidth = plotWidth / chartData.length;
                        const x = chartMode === 'bar'
                            ? paddingLeft + i * slotWidth + slotWidth / 2
                            : incomePoints[i]?.x || 0;

                        // Only render some labels if there are many data points to prevent crowding
                        const shouldShow = i % labelInterval === 0 || i === chartData.length - 1;
                        if (!shouldShow) return null;

                        return (
                            <text
                                key={i}
                                x={x}
                                y={groundY + 18}
                                textAnchor="middle"
                                className={`text-[10px] font-medium ${
                                    hoveredIndex === i
                                        ? 'fill-slate-900 dark:fill-white font-bold'
                                        : 'fill-slate-400 dark:fill-slate-500'
                                }`}
                            >
                                {d.label}
                            </text>
                        );
                    })}
                </svg>

                {/* Floating Glassmorphic Tooltip on Hover */}
                {activeItem && (
                    <div
                        className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 sm:top-5 sm:right-6 sm:left-auto sm:translate-x-0 z-30 p-3 rounded-2xl glass-card border border-slate-200/90 dark:border-white/10 shadow-xl text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
                    >
                        <p className="font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-white/5 pb-1">
                            {activeItem.full_label || activeItem.label}
                        </p>
                        <div className="flex items-center justify-between gap-6">
                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Pemasukan:
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                + {formatRupiah(activeItem.income)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                Pengeluaran:
                            </span>
                            <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                                - {formatRupiah(activeItem.expense)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-6 pt-1 border-t border-slate-100 dark:border-white/5 font-semibold">
                            <span className="text-slate-600 dark:text-slate-300">Selisih:</span>
                            <span className={`tabular-nums ${activeItem.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {activeItem.net >= 0 ? '+' : ''}{formatRupiah(activeItem.net)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

