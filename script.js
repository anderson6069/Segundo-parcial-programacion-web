// Inicializar el gráfico
let myChart;

document.getElementById("areaForm").onsubmit = function (event) {
    event.preventDefault();

    // Obtener los valores de X
    const xInicial = parseFloat(document.getElementById("xInicial").value);
    const xFinal = parseFloat(document.getElementById("xFinal").value);

    // Coeficientes de la ecuación polinómica
    const coefA = 0.1;
    const coefB = 0.6;
    const coefC = -0.7;
    const coefD = -5.7;
    const coefE = 2;
    const coefF = 4;

    // Función que representa la ecuación polinómica
    function ecuacion(x) {
        return coefA * Math.pow(x, 5) + coefB * Math.pow(x, 4) + coefC * Math.pow(x, 3) + coefD * Math.pow(x, 2) + coefE * x + coefF;
    }

    // Regla del trapecio para calcular el área
    function reglaTrapecio(xini, xfin, intervalos) {
        const longitudIntervalo = (xfin - xini) / intervalos;
        let acumulador = 0.5 * (ecuacion(xini) + ecuacion(xfin));

        for (let i = 1; i < intervalos; i++) {
            const valX = xini + i * longitudIntervalo;
            acumulador += ecuacion(valX);
        }

        return acumulador * longitudIntervalo;
    }

    const intervalos = 10000; // Definir el número de intervalos

    // Calcular área con JavaScript y medir el tiempo
    const startJS = performance.now();
    const areaJS = reglaTrapecio(xInicial, xFinal, intervalos);
    const endJS = performance.now();
    const timeJS = endJS - startJS;

    // Crear tabla de resultados
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Punto de Corte 1</th>
            <th>Punto de Corte 2</th>
            <th>Área calculada por JavaScript</th>
            <th>Tiempo tomado en milisegundos por JavaScript</th>
            <th>Área calculada por PHP</th>
            <th>Tiempo tomado en milisegundos por PHP</th>
        </tr>
    `;

    // Calcular áreas en intervalos
    const puntosDeCorte = [xInicial, xFinal];
    const areasJS = [];
    let totalAreaJS = 0;

    for (let i = 0; i < puntosDeCorte.length - 1; i++) {
        const areaIntervaloJS = reglaTrapecio(puntosDeCorte[i], puntosDeCorte[i + 1], intervalos);
        areasJS.push(areaIntervaloJS);
        totalAreaJS += areaIntervaloJS;

        const row = table.insertRow();
        row.insertCell(0).innerText = puntosDeCorte[i].toFixed(2);
        row.insertCell(1).innerText = puntosDeCorte[i + 1].toFixed(2);
        row.insertCell(2).innerText = areaIntervaloJS.toFixed(4);
        row.insertCell(3).innerText = (timeJS).toFixed(2) + 'ms';
        row.insertCell(4).innerText = ''; // Se llenará después con PHP
        row.insertCell(5).innerText = ''; // Se llenará después con PHP
    }

    const totalRow = table.insertRow();
    totalRow.insertCell(0).innerText = 'Total';
    totalRow.insertCell(1).innerText = '';
    totalRow.insertCell(2).innerText = totalAreaJS.toFixed(4);
    totalRow.insertCell(3).innerText = (timeJS).toFixed(2) + 'ms';
    totalRow.insertCell(4).innerText = ''; // Se llenará después con PHP
    totalRow.insertCell(5).innerText = ''; // Se llenará después con PHP

    document.getElementById("result").innerHTML = '';
    document.getElementById("result").appendChild(table);

    // Mostrar gráfico de la ecuación
    const ctx = document.getElementById('chart').getContext('2d');

    // Destruir el gráfico anterior si existe
    if (myChart) {
        myChart.destroy();
    }

    const labels = [];
    const values = [];
    const step = (xFinal - xInicial) / 100;

    for (let x = xInicial; x <= xFinal; x += step) {
        labels.push(x.toFixed(2));
        values.push(ecuacion(x));
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'f(x) = 0.1x^5 + 0.6x^4 - 0.7x^3 - 5.7x^2 + 2x + 4',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });

    // Llamada AJAX para obtener el área calculada por PHP
    fetch('calculo_area.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'xInicial': xInicial,
            'xFinal': xFinal
        })
    })
        .then(response => response.json())
        .then(data => {
            // Llenar la tabla con los resultados de PHP
            const rows = document.querySelectorAll("table tr");
            for (let i = 1; i < rows.length; i++) {
                rows[i].cells[4].innerText = data.areaPHP.toFixed(4);
                rows[i].cells[5].innerText = data.timePHP.toFixed(2) + 'ms';
            }
        })
        .catch(error => console.error('Error:', error));
};
