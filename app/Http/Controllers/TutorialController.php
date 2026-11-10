<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TutorialController extends Controller
{
    /**
     * Mark the onboarding tutorial as completed for the authenticated user.
     */
    public function complete(Request $request): JsonResponse|RedirectResponse
    {
        $request->user()->update([
            'has_completed_tutorial' => true,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        $redirectTo = $request->input('redirect_to');
        if (is_string($redirectTo) && str_starts_with($redirectTo, '/')) {
            return redirect($redirectTo);
        }

        return back();
    }

    /**
     * Reset tutorial state so the user can replay the Tupi tour anytime.
     */
    public function reset(Request $request): RedirectResponse
    {
        $request->user()->update([
            'has_completed_tutorial' => false,
        ]);

        return redirect()->route('dashboard');
    }
}
