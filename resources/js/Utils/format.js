/**
 * Format a number to Indonesian Rupiah (IDR) currency format.
 * Example: 1500000 -> "Rp 1.500.000"
 */
export function formatRupiah(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format date string into Indonesian readable format.
 * Example: "2026-11-09" -> "9 Nov 2026"
 */
export function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

/**
 * Format date string into Indonesian full day and date format.
 * Example: "2026-11-09" -> "Senin, 9 November 2026"
 */
export function formatFullDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

/**
 * Format datetime string into Indonesian readable format with hours and minutes.
 * Example: "2026-11-09T14:30:00" -> "9 Nov 2026, 14.30"
 */
export function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Format today's date into Indonesian full day and date.
 * Example: "Senin, 9 November 2026"
 */
export function formatToday() {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
}

/**
 * Default categories for transactions
 */
export const DEFAULT_CATEGORIES = {
    expense: [
        'Makanan & Minuman',
        'Transportasi',
        'Belanja',
        'Tagihan & Utilitas',
        'Hiburan',
        'Kesehatan',
        'Pendidikan',
        'Keluarga',
        'Lainnya',
    ],
    income: [
        'Gaji Pokok',
        'Bonus & Tunjangan',
        'Investasi & Dividen',
        'Freelance / Proyek',
        'Bisnis',
        'Hadiah & Hibah',
        'Lainnya',
    ],
};


/**
 * Format raw numbers with Indonesian thousand separator (dot).
 * Example: 1500000 -> "1.500.000"
 */
export function formatNumberInput(value) {
    if (value === null || value === undefined || value === '') return '';
    const cleanDigits = String(value).replace(/\D/g, '');
    if (!cleanDigits) return '';
    const num = parseInt(cleanDigits, 10);
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Convert number into human-readable Indonesian words (Terbilang).
 * Example: 1500000 -> "Satu Juta Lima Ratus Ribu Rupiah"
 */
export function terbilangRupiah(number) {
    const num = Math.floor(Math.abs(Number(number) || 0));
    if (num === 0) return '';

    const bilangan = [
        '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
        'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
    ];

    function toWords(n) {
        if (n < 12) return bilangan[n];
        if (n < 20) return toWords(n - 10) + ' Belas';
        if (n < 100) return toWords(Math.floor(n / 10)) + ' Puluh' + (n % 10 > 0 ? ' ' + toWords(n % 10) : '');
        if (n < 200) return 'Seratus' + (n - 100 > 0 ? ' ' + toWords(n - 100) : '');
        if (n < 1000) return toWords(Math.floor(n / 100)) + ' Ratus' + (n % 100 > 0 ? ' ' + toWords(n % 100) : '');
        if (n < 2000) return 'Seribu' + (n - 1000 > 0 ? ' ' + toWords(n - 1000) : '');
        if (n < 1000000) return toWords(Math.floor(n / 1000)) + ' Ribu' + (n % 1000 > 0 ? ' ' + toWords(n % 1000) : '');
        if (n < 1000000000) return toWords(Math.floor(n / 1000000)) + ' Juta' + (n % 1000000 > 0 ? ' ' + toWords(n % 1000000) : '');
        if (n < 1000000000000) return toWords(Math.floor(n / 1000000000)) + ' Miliar' + (n % 1000000000 > 0 ? ' ' + toWords(n % 1000000000) : '');
        return toWords(Math.floor(n / 1000000000000)) + ' Triliun' + (n % 1000000000000 > 0 ? ' ' + toWords(n % 1000000000000) : '');
    }

    return `${toWords(num)} Rupiah`;
}
