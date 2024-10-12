<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los valores desde el formulario
    $xInicial = floatval($_POST['xInicial']);
    $xFinal = floatval($_POST['xFinal']);

    // Coeficientes de la ecuación polinómica
    $coefA = 0.1;
    $coefB = 0.6;
    $coefC = -0.7;
    $coefD = -5.7;
    $coefE = 2;
    $coefF = 4;

    // Función que representa la ecuación polinómica
    function ecuacion($x) {
        global $coefA, $coefB, $coefC, $coefD, $coefE, $coefF;
        return $coefA * pow($x, 5) + $coefB * pow($x, 4) + $coefC * pow($x, 3) + $coefD * pow($x, 2) + $coefE * $x + $coefF;
    }

    // Regla del trapecio para calcular el área
    function reglaTrapecio($xini, $xfin, $intervalos) {
        $longitudIntervalo = ($xfin - $xini) / $intervalos;
        $acumulador = 0.5 * (ecuacion($xini) + ecuacion($xfin));

        for ($i = 1; $i < $intervalos; $i++) {
            $valX = $xini + $i * $longitudIntervalo;
            $acumulador += ecuacion($valX);
        }

        return $acumulador * $longitudIntervalo;
    }

    $intervalos = 10000; // Definir el número de intervalos

    // Calcular área con PHP y medir el tiempo
    $startPHP = microtime(true);
    $areaPHP = reglaTrapecio($xInicial, $xFinal, $intervalos);
    $endPHP = microtime(true);
    $timePHP = ($endPHP - $startPHP) * 1000; // Convertir a milisegundos

    // Devolver los resultados como JSON
    echo json_encode([
        'areaPHP' => $areaPHP,
        'timePHP' => $timePHP
    ]);
}
?>
