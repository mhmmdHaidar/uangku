<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'no_telp',
        'password',
        'has_completed_tutorial',
        'has_created_wallet',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'avatar',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * Relative endpoint URL for the user's profile avatar with cache-busting hash.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        return route('profile.avatar.show', [
            'user' => $this->id,
            'v' => substr(md5($this->avatar), 0, 12),
        ], false);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'has_completed_tutorial' => 'boolean',
            'has_created_wallet' => 'boolean',
        ];
    }

    public function seedDefaultCashWallet(): void
    {
        if ($this->wallets()->count() > 0) {
            return;
        }

        $this->wallets()->create([
            'name' => 'Uang Tunai (Cash)',
            'type' => 'cash',
            'account_number' => 'Dompet Fisik',
            'initial_balance' => 0,
            'color' => 'amber',
        ]);
    }

    public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function wallets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Wallet::class);
    }

    public function categories(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function saran(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Saran::class);
    }

    public function budgets(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Budget::class);
    }

    public function seedDefaultCategories(): void
    {
        $defaultExpenses = [
            'Makanan & Minuman',
            'Transportasi',
            'Belanja',
            'Tagihan',
            'Kesehatan',
        ];

        $defaultIncomes = [
            'Gaji',
            'Bonus',
            'Investasi',
            'Bisnis',
            'Lainnya',
        ];

        foreach ($defaultExpenses as $name) {
            $this->categories()->firstOrCreate([
                'name' => $name,
                'type' => 'expense',
            ]);
        }

        foreach ($defaultIncomes as $name) {
            $this->categories()->firstOrCreate([
                'name' => $name,
                'type' => 'income',
            ]);
        }
    }
}
