export function guardar(clave, valor) {
    localStorage.setItem(clave, valor)
    return "Se guardó todo"   
}

export function obtener(clave) {
    return localStorage.getItem(clave)
}