<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SaranController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TupiChatController;
use App\Http\Controllers\TutorialController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome');
})->name('home');

Route::get('/tentang', function () {
    return Inertia::render('About');
})->name('about');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard & Transactions
    Route::get('/dashboard', [TransactionController::class, 'index'])->name('dashboard');
    Route::get('/transactions', [TransactionController::class, 'history'])->name('transactions.index');
    Route::get('/transactions/export', [TransactionController::class, 'exportCsv'])->name('transactions.export');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    // Wallets & Accounts
    Route::get('/wallets', [WalletController::class, 'index'])->name('wallets.index');
    Route::get('/wallets/{wallet}', [WalletController::class, 'show'])->name('wallets.show');
    Route::post('/wallets', [WalletController::class, 'store'])->name('wallets.store');
    Route::put('/wallets/{wallet}', [WalletController::class, 'update'])->name('wallets.update');
    Route::delete('/wallets/{wallet}', [WalletController::class, 'destroy'])->name('wallets.destroy');

    // Reports & Analytics
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'exportCsv'])->name('reports.export');

    // User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'destroyAvatar'])->name('profile.avatar.destroy');
    Route::get('/profile/avatar/{user}', [ProfileController::class, 'showAvatar'])->name('profile.avatar.show');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Custom Categories
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Tupi Onboarding Tutorial
    Route::post('/tutorial/complete', [TutorialController::class, 'complete'])->name('tutorial.complete');
    Route::post('/tutorial/reset', [TutorialController::class, 'reset'])->name('tutorial.reset');

    // Tanya Tupi AI Customer Service Chat
    Route::post('/tanya-tupi', [TupiChatController::class, 'chat'])
        ->middleware('throttle:30,1')
        ->name('tanya-tupi.chat');

    // Saran & Masukan Pengembang
    Route::get('/saran', [SaranController::class, 'index'])->name('saran.index');
    Route::post('/saran', [SaranController::class, 'store'])
        ->middleware('throttle:15,1')
        ->name('saran.store');
});

require __DIR__.'/auth.php';
