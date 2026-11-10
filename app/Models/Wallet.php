<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'account_number',
        'initial_balance',
        'color',
    ];

    protected $casts = [
        'initial_balance' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'current_balance',
    ];

    /**
     * Runtime cache for wallet balances to prevent N+1 queries during request lifecycle.
     * @var array<int, float>
     */
    public static array $balanceCache = [];

    protected static function booted(): void
    {
        static::saved(function ($wallet) {
            unset(self::$balanceCache[$wallet->id]);
        });

        static::deleted(function ($wallet) {
            unset(self::$balanceCache[$wallet->id]);
        });
    }

    public function refresh(): static
    {
        unset(self::$balanceCache[$this->id]);
        return parent::refresh();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Preload balances for a given user's wallets in ONE aggregate query.
     */
    public static function preloadBalances(int $userId): void
    {
        $wallets = self::where('user_id', $userId)->get(['id', 'initial_balance']);
        if ($wallets->isEmpty()) {
            return;
        }

        $totals = DB::table('transactions')
            ->where('user_id', $userId)
            ->whereNotNull('wallet_id')
            ->selectRaw("wallet_id, SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income, SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense")
            ->groupBy('wallet_id')
            ->get()
            ->keyBy('wallet_id');

        foreach ($wallets as $wallet) {
            $row = $totals->get($wallet->id);
            $inc = $row ? (float) $row->total_income : 0.0;
            $exp = $row ? (float) $row->total_expense : 0.0;
            self::$balanceCache[$wallet->id] = (float) $wallet->initial_balance + $inc - $exp;
        }
    }

    /**
     * Compute current balance based on initial balance plus transactions,
     * utilizing static cache if available to prevent N+1 query storms.
     */
    public function getCurrentBalanceAttribute(): float
    {
        if (isset(self::$balanceCache[$this->id])) {
            return (float) self::$balanceCache[$this->id];
        }

        if (array_key_exists('calculated_balance', $this->attributes)) {
            return self::$balanceCache[$this->id] = (float) $this->attributes['calculated_balance'];
        }

        $income = (float) $this->transactions()->where('type', 'income')->sum('amount');
        $expense = (float) $this->transactions()->where('type', 'expense')->sum('amount');

        return self::$balanceCache[$this->id] = (float) $this->initial_balance + $income - $expense;
    }
}
