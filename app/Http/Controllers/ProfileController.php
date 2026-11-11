<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Upload and store a compressed circular-ready user avatar in the database.
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'avatar' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ], [
            'avatar.required' => 'Silakan pilih file gambar terlebih dahulu.',
            'avatar.image' => 'File yang diunggah harus berupa gambar yang valid.',
            'avatar.mimes' => 'Format gambar harus berupa JPG, JPEG, PNG, atau WebP.',
            'avatar.max' => 'Ukuran file gambar maksimal 5 MB.',
        ]);

        $dataUri = $this->encodeAvatarDataUri($validated['avatar']);

        if (! $dataUri) {
            throw ValidationException::withMessages([
                'avatar' => 'Gambar tidak dapat diproses. Pastikan file gambar tidak rusak.',
            ]);
        }

        $user = $request->user();
        $user->avatar = $dataUri;
        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Foto profil berhasil diperbarui.');
    }

    /**
     * Remove the authenticated user's custom avatar.
     */
    public function destroyAvatar(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->avatar = null;
        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Foto profil berhasil dihapus.');
    }

    /**
     * Stream the user's stored avatar binary safely (serverless-safe, multi-tenant isolated).
     */
    public function showAvatar(Request $request, User $user): HttpResponse
    {
        if ((int) $request->user()->id !== (int) $user->id) {
            abort(403);
        }

        if (! $user->avatar || ! preg_match('/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s', $user->avatar, $matches)) {
            abort(404);
        }

        $binary = base64_decode($matches[2], true);

        if ($binary === false) {
            abort(404);
        }

        return response($binary, 200, [
            'Content-Type' => $matches[1],
            'Cache-Control' => 'private, max-age=31536000, immutable',
        ]);
    }

    /**
     * Center-crop & resize uploaded image to max 320x320 as compact base64 Data URI.
     */
    private function encodeAvatarDataUri(UploadedFile $file): ?string
    {
        $path = $file->getRealPath();
        if (! $path) {
            return null;
        }

        $raw = @file_get_contents($path);
        if (! is_string($raw) || $raw === '') {
            return null;
        }

        if (! function_exists('imagecreatefromstring')) {
            $info = @getimagesizefromstring($raw);
            $mime = $info['mime'] ?? null;
            if (! in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
                return null;
            }

            return 'data:' . $mime . ';base64,' . base64_encode($raw);
        }

        $source = @imagecreatefromstring($raw);
        if (! $source) {
            return null;
        }

        $width = imagesx($source);
        $height = imagesy($source);

        if ($width <= 0 || $height <= 0) {
            imagedestroy($source);
            return null;
        }

        $cropSize = min($width, $height);
        $srcX = (int) floor(($width - $cropSize) / 2);
        $srcY = (int) floor(($height - $cropSize) / 2);
        $targetSize = min($cropSize, 320);

        $canvas = imagecreatetruecolor($targetSize, $targetSize);
        if (! $canvas) {
            imagedestroy($source);
            return null;
        }

        $sourceMime = strtolower((string) $file->getMimeType());
        $preserveAlpha = in_array($sourceMime, ['image/png', 'image/webp'], true);

        if ($preserveAlpha) {
            imagealphablending($canvas, false);
            imagesavealpha($canvas, true);
            $transparent = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
            imagefilledrectangle($canvas, 0, 0, $targetSize, $targetSize, $transparent);
        } else {
            $white = imagecolorallocate($canvas, 255, 255, 255);
            imagefilledrectangle($canvas, 0, 0, $targetSize, $targetSize, $white);
        }

        imagecopyresampled($canvas, $source, 0, 0, $srcX, $srcY, $targetSize, $targetSize, $cropSize, $cropSize);

        ob_start();
        if ($preserveAlpha) {
            imagepng($canvas, null, 7);
            $outputMime = 'image/png';
        } else {
            imagejpeg($canvas, null, 85);
            $outputMime = 'image/jpeg';
        }
        $encoded = ob_get_clean();

        imagedestroy($source);
        imagedestroy($canvas);

        if (! is_string($encoded) || $encoded === '') {
            return null;
        }

        return 'data:' . $outputMime . ';base64,' . base64_encode($encoded);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
