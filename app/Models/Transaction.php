<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'wallet_id',
        'title',
        'type',
        'wallet',
        'amount',
        'category',
        'transaction_date',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saved(function ($tx) {
            if ($tx->wallet_id) {
                unset(Wallet::$balanceCache[$tx->wallet_id]);
            }
        });

        static::deleted(function ($tx) {
            if ($tx->wallet_id) {
                unset(Wallet::$balanceCache[$tx->wallet_id]);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function walletAccount(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'wallet_id');
    }

    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }

    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }

    public function scopeCash($query)
    {
        return $query->where('wallet', 'cash');
    }

    public function scopeSaldo($query)
    {
        return $query->where('wallet', 'saldo');
    }
}
