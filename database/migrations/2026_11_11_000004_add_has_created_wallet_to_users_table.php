<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('has_created_wallet')->default(false)->after('has_completed_tutorial');
        });

        // Mark existing users who already have multiple wallets or a custom non-cash wallet
        $multiWalletUsers = DB::table('wallets')
            ->select('user_id')
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('user_id');

        $customWalletUsers = DB::table('wallets')
            ->where(function ($query) {
                $query->where('type', '!=', 'cash')
                    ->orWhere('name', '!=', 'Uang Tunai (Cash)');
            })
            ->distinct()
            ->pluck('user_id');

        $existingCreatorIds = $multiWalletUsers
            ->merge($customWalletUsers)
            ->unique()
            ->values()
            ->all();

        if (! empty($existingCreatorIds)) {
            DB::table('users')
                ->whereIn('id', $existingCreatorIds)
                ->update(['has_created_wallet' => true]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('has_created_wallet');
        });
    }
};
