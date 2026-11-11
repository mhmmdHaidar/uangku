<?php

namespace App\Http\Controllers;

use App\Models\Saran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SaranController extends Controller
{
    /**
     * Fetch authenticated user's submitted feedback/suggestions and saved WhatsApp number.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $items = $user->saran()
            ->latest()
            ->take(20)
            ->get([
                'id',
                'user_id',
                'username',
                'email',
                'no_telp',
                'isi_saran',
                'balasan_otomatis',
                'created_at',
            ])
            ->reverse()
            ->values();

        return response()->json([
            'items' => $items,
            'no_telp' => $user->no_telp,
        ]);
    }

    /**
     * Store a new user suggestion/feedback in the "saran" table and return an automatic thank-you reply.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'no_telp' => ['required', 'string', 'max:25'],
            'whatsapp_confirmed' => ['required', 'accepted'],
            'isi_saran' => ['required', 'string', 'min:5', 'max:2000'],
        ], [
            'no_telp.required' => 'Nomor telepon WhatsApp wajib diisi terlebih dahulu sebelum mengirim saran.',
            'whatsapp_confirmed.required' => 'Centang konfirmasi bahwa nomor tersebut aktif terdaftar di WhatsApp.',
            'whatsapp_confirmed.accepted' => 'Pastikan nomor telepon yang dimasukkan aktif terdaftar di WhatsApp.',
            'isi_saran.required' => 'Isi saran & masukan tidak boleh kosong.',
            'isi_saran.min' => 'Saran & masukan minimal 5 karakter agar pengembang dapat memahaminya.',
            'isi_saran.max' => 'Saran & masukan maksimal 2000 karakter.',
        ]);

        $normalizedPhone = $this->normalizeIndonesianWhatsAppNumber($validated['no_telp']);
        if (! $normalizedPhone) {
            throw ValidationException::withMessages([
                'no_telp' => 'Format nomor WhatsApp Indonesia tidak valid. Gunakan nomor seluler aktif seperti 0838xxxxxxx atau +62838xxxxxxx.',
            ]);
        }

        $user = $request->user();

        if ($user->no_telp !== $normalizedPhone) {
            $user->update(['no_telp' => $normalizedPhone]);
        }

        $autoReply = $this->buildAutomaticThankYouReply($user->name, $user->email, $normalizedPhone);

        $saran = Saran::create([
            'user_id' => $user->id,
            'username' => $user->name,
            'email' => $user->email,
            'no_telp' => $normalizedPhone,
            'isi_saran' => trim($validated['isi_saran']),
            'balasan_otomatis' => $autoReply,
        ]);

        return response()->json([
            'saran' => $saran,
            'no_telp' => $normalizedPhone,
            'reply' => $autoReply,
        ], 201);
    }

    /**
     * Normalize and strictly validate Indonesian cellular numbers eligible for WhatsApp.
     */
    private function normalizeIndonesianWhatsAppNumber(?string $raw): ?string
    {
        $trimmed = trim((string) $raw);
        if ($trimmed === '' || preg_match('/[a-zA-Z]/', $trimmed)) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $trimmed);
        if (! is_string($digits) || $digits === '') {
            return null;
        }

        if (str_starts_with($digits, '08')) {
            $digits = '62' . substr($digits, 1);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62' . $digits;
        }

        // Indonesian mobile prefixes: 081x, 082x, 083x, 085x, 087x, 088x, 089x (10-14 local digits)
        if (! preg_match('/^628(?:1[1-9]|2[1-9]|3[1-8]|5[1-9]|7[7-9]|8[1-9]|9[5-9])[0-9]{6,10}$/', $digits)) {
            return null;
        }

        return $digits;
    }

    /**
     * Generate a warm automatic acknowledgment message for the user.
     */
    private function buildAutomaticThankYouReply(string $fullName, string $email, string $normalizedPhone): string
    {
        $firstName = explode(' ', trim($fullName))[0] ?: 'Teman';
        $localPhone = str_starts_with($normalizedPhone, '62')
            ? '0' . substr($normalizedPhone, 2)
            : $normalizedPhone;

        return "Terima kasih banyak, {$firstName}! Saran & masukanmu sudah berhasil dikirim secara real-time dan tercatat untuk evaluasi pengembangan aplikasi Uangku.\n\nPengembang (Nur Muhammad Haidar) dapat menghubungimu kembali melalui WhatsApp ({$localPhone}) atau email ({$email}) bila memerlukan detail tambahan. Masukanmu sangat berarti bagi kemajuan Uangku!";
    }
}
