<?php

// Check if running on Vercel serverless environment
if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL'])) {
    // Ensure writable temporary storage directories exist
    $storageDirs = [
        '/tmp/storage/framework/views',
        '/tmp/storage/framework/cache/data',
        '/tmp/storage/framework/sessions',
        '/tmp/storage/bootstrap/cache',
        '/tmp/storage/logs',
    ];

    foreach ($storageDirs as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
    }

    putenv('APP_STORAGE=/tmp/storage');
    $_ENV['APP_STORAGE'] = '/tmp/storage';
    $_SERVER['APP_STORAGE'] = '/tmp/storage';

    putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
    $_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
    $_SERVER['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
}

// Forward execution to Laravel's standard front controller
require __DIR__ . '/../public/index.php';
