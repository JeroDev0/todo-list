<?php
require 'db.php';

$action = $_POST['action'];

if ($action === 'create') {
    $name = $_POST['name'];
    $status_id = 1; // Estado inicial "Pendiente"
    
    $stmt = $pdo->prepare("INSERT INTO tasks (name, status_id) VALUES (?, ?)");
    $stmt->execute([$name, $status_id]);
    echo json_encode(['status' => 'success']);
}

if ($action === 'read') {
    $stmt = $pdo->query("SELECT tasks.id, tasks.name, tasks.created_at, statuses.name AS status 
                         FROM tasks 
                         JOIN statuses ON tasks.status_id = statuses.id 
                         ORDER BY tasks.created_at DESC");
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tasks);
}

if ($action === 'update') {
    $id = $_POST['id'];
    $status_id = $_POST['status_id'];

    $stmt = $pdo->prepare("UPDATE tasks SET status_id = ? WHERE id = ?");
    $stmt->execute([$status_id, $id]);
    echo json_encode(['status' => 'success']);
}

if ($action === 'delete') {
    $id = $_POST['id'];
    
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['status' => 'success']);
}
?>
