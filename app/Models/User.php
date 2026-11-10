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
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

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
        ];
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
