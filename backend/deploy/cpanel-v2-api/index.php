<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../../../simola_backend_v2/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../../../simola_backend_v2/vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../../../simola_backend_v2/bootstrap/app.php';

$app->handleRequest(Request::capture());