<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    /**
     * Create or update a monthly spending budget for a category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'limit_amount' => 'required|numeric|min:1',
        ], [
            'category.required' => 'Kategori anggaran wajib dipilih.',
            'limit_amount.required' => 'Batas nominal anggaran wajib diisi.',
            'limit_amount.min' => 'Batas nominal anggaran minimal Rp 1.',
        ]);

        $categoryName = trim($validated['category']);

        $request->user()->budgets()->updateOrCreate(
            ['category' => $categoryName],
            ['limit_amount' => $validated['limit_amount']]
        );

        return back()->with('success', "Anggaran bulanan untuk '{$categoryName}' berhasil disimpan.");
    }

    /**
     * Update an existing monthly budget.
     */
    public function update(Request $request, Budget $budget): RedirectResponse
    {
        if ($budget->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $validated = $request->validate([
            'category' => 'sometimes|required|string|max:100',
            'limit_amount' => 'required|numeric|min:1',
        ]);

        $updateData = ['limit_amount' => $validated['limit_amount']];
        if (! empty($validated['category'])) {
            $updateData['category'] = trim($validated['category']);
        }

        $budget->update($updateData);

        return back()->with('success', 'Anggaran bulanan berhasil diperbarui.');
    }

    /**
     * Remove a monthly budget.
     */
    public function destroy(Request $request, Budget $budget): RedirectResponse
    {
        if ($budget->user_id !== $request->user()->id) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $budget->delete();

        return back()->with('success', 'Anggaran bulanan berhasil dihapus.');
    }
}
