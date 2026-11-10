<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Store a newly created category for the authenticated user.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'type' => 'required|in:expense,income',
        ]);

        $category = $request->user()->categories()->firstOrCreate([
            'name' => trim($validated['name']),
            'type' => $validated['type'],
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'category' => $category,
            ]);
        }

        return back()->with('success', "Kategori '{$category->name}' berhasil ditambahkan.");
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Request $request, Category $category): JsonResponse|RedirectResponse
    {
        if ($category->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $categoryName = $category->name;
        $category->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Kategori '{$categoryName}' berhasil dihapus.",
            ]);
        }

        return back()->with('success', "Kategori '{$categoryName}' berhasil dihapus.");
    }
}

