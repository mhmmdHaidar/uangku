<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Saran extends Model
{
    use HasFactory;

    protected $table = 'saran';

    protected $fillable = [
        'user_id',
        'username',
        'email',
        'no_telp',
        'isi_saran',
        'balasan_otomatis',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
