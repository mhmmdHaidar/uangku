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
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('to_wallet_id')
                ->nullable()
                ->after('wallet_id')
                ->constrained('wallets')
                ->nullOnDelete();

            $table->index(['user_id', 'to_wallet_id']);
        });

        // Expand `type` allowed values to include `transfer` across PostgreSQL and SQLite
        if (DB::getDriverName() === 'pgsql') {
            $constraints = DB::select("
                SELECT c.conname
                FROM pg_constraint c
                JOIN pg_class t ON c.conrelid = t.oid
                WHERE t.relname = 'transactions'
                  AND c.contype = 'c'
                  AND pg_get_constraintdef(c.oid) LIKE '%type%'
            ");

            foreach ($constraints as $constraint) {
                DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS \"{$constraint->conname}\"");
            }

            DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check CHECK (type IN ('income', 'expense', 'transfer'))");
        } else {
            Schema::table('transactions', function (Blueprint $table) {
                $table->string('type', 20)->change();
            });
        }

        // Backfill legacy rows with NULL wallet_id so all records uniformly relate via wallet_id
        $legacyRows = DB::table('transactions')
            ->whereNull('wallet_id')
            ->get(['id', 'user_id', 'wallet']);

        if ($legacyRows->isNotEmpty()) {
            $walletsByUser = DB::table('wallets')
                ->orderBy('id')
                ->get(['id', 'user_id', 'type'])
                ->groupBy('user_id');

            foreach ($legacyRows as $row) {
                $userWallets = $walletsByUser->get($row->user_id);
                if (! $userWallets || $userWallets->isEmpty()) {
                    continue;
                }

                $preferred = $row->wallet === 'cash'
                    ? ($userWallets->firstWhere('type', 'cash') ?? $userWallets->first())
                    : ($userWallets->firstWhere('type', '!=', 'cash') ?? $userWallets->first());

                if ($preferred) {
                    DB::table('transactions')
                        ->where('id', $row->id)
                        ->update(['wallet_id' => $preferred->id]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('transactions')->where('type', 'transfer')->delete();

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check');
            DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check CHECK (type IN ('income', 'expense'))");
        } else {
            Schema::table('transactions', function (Blueprint $table) {
                $table->enum('type', ['income', 'expense'])->change();
            });
        }

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'to_wallet_id']);
            $table->dropForeign(['to_wallet_id']);
            $table->dropColumn('to_wallet_id');
        });
    }
};
