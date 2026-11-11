<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category',
        'limit_amount',
    ];

    protected $casts = [
        'limit_amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Compute monthly category budget progress for a user cleanly in 2 queries.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function progressForUser(User $user, ?Carbon $referenceDate = null): array
    {
        $ref = ($referenceDate ?? Carbon::today())->copy();
        $startOfMonth = $ref->copy()->startOfMonth()->toDateString();
        $endOfMonth = $ref->copy()->endOfMonth()->toDateString();

        $budgets = $user->budgets()
            ->orderBy('category')
            ->get();

        if ($budgets->isEmpty()) {
            return [];
        }

        $spentByCategory = $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startOfMonth, $endOfMonth])
            ->whereNotNull('category')
            ->selectRaw('category, SUM(amount) as total_spent')
            ->groupBy('category')
            ->pluck('total_spent', 'category');

        return $budgets->map(function (self $budget) use ($spentByCategory) {
            $limit = (float) $budget->limit_amount;
            $spent = (float) ($spentByCategory->get($budget->category) ?? 0.0);
            $remaining = $limit - $spent;
            $percentage = $limit > 0 ? round(($spent / $limit) * 100, 1) : 0.0;

            $status = 'safe';
            if ($percentage >= 100) {
                $status = 'exceeded';
            } elseif ($percentage >= 80) {
                $status = 'warning';
            }

            return [
                'id' => $budget->id,
                'category' => $budget->category,
                'limit_amount' => $limit,
                'spent_amount' => $spent,
                'remaining_amount' => $remaining,
                'percentage' => $percentage,
                'status' => $status,
            ];
        })->values()->all();
    }
}
