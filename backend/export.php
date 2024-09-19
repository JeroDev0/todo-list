<?php
require 'db.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=tareas.csv');

// Abrir el archivo de salida como CSV
$output = fopen('php://output', 'w');

// Escribir el encabezado: Nombre de la tarea y Estado
fputcsv($output, ['Nombre', 'Estado'], ',');

// Consultar todas las tareas con su estado
$stmt = $pdo->query("SELECT tasks.name, statuses.name AS status 
                     FROM tasks 
                     JOIN statuses ON tasks.status_id = statuses.id");

// Escribir cada fila en el archivo CSV: Nombre y Estado
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    fputcsv($output, [$row['name'], $row['status']], ',');
}

fclose($output);
exit();
?>
