# Aplicación de actividades y laboratorio de eventos

Este proyecto reúne dos páginas de práctica: una lista de actividades que conserva los datos en el navegador y una demo visual de escuchadores de eventos en JavaScript.

## Abrir el proyecto

Sirve la carpeta del proyecto con Apache/XAMPP y visita estas páginas:

| Página | Dirección local | Para qué sirve |
|---|---|---|
| `index.html` | `http://localhost/fs-4-tt-23/index.html` | Agregar, editar, completar y borrar actividades. |
| `escuchador.html` | `http://localhost/fs-4-tt-23/escuchador.html` | Probar eventos de doble clic y teclado. |

Usa un servidor web local en lugar de abrir los archivos directamente: las páginas cargan módulos JavaScript y la lista usa `localStorage`.

## Lista de actividades

La página `index.html` presenta un formulario y una lista vacía que JavaScript completa con las actividades guardadas. `javascript/app.js` importa las funciones de `javascript/persistencia.js` y controla el formulario y la lista.

| Acción | Qué sucede |
|---|---|
| Agregar | El formulario evita la recarga de la página, crea una actividad y guarda la lista y el contador. |
| Editar | El botón Editar copia el texto al formulario; al enviarlo, reemplaza el texto de esa actividad. |
| Completar | Al seleccionar la casilla o su etiqueta, el texto recibe la clase `line-through` y la casilla se desactiva. |
| Borrar | El botón Borrar quita la actividad de la lista. |

La lista usa escuchadores delegados: un único `click` en el elemento `ul#listado-actividades` identifica si el clic corresponde a Editar, Borrar o completar una actividad. Así también se gestionan las actividades agregadas después de cargar la página.

### Guardado en el navegador

`javascript/persistencia.js` proporciona dos funciones:

- `guardar(clave, valor)` guarda un valor con `localStorage.setItem`.
- `obtener(clave)` recupera un valor con `localStorage.getItem`; si no existe, devuelve `null`.

`app.js` recupera las claves `actividades` y `nro-actividad` al iniciar. Las vuelve a guardar después de agregar o actualizar, borrar y completar actividades. Los datos permanecen en el mismo navegador y origen; no se sincronizan entre dispositivos.

## Demo de escuchadores

`escuchador.html` carga `javascript/escuchar.js` como módulo. La página contiene varios títulos de ejemplo y un monitor que muestra el último evento.

1. Haz doble clic en un título para que el monitor indique qué se detectó y cambie el título de la pestaña.
2. También puedes enfocar un título y activarlo con **Enter** o **Espacio**.
3. Pulsa **Reiniciar demo** para restaurar el título de la pestaña y el estado inicial del monitor.

El módulo registra los escuchadores en el contenedor de ejemplos, no en cada título. `getDemoHeading` comprueba que el evento provenga de uno de los títulos de la demo y `reportEvent` actualiza la interfaz. El estado se comunica mediante una región `aria-live`.

## Conceptos de JavaScript usados

| Concepto | Uso en el proyecto |
|---|---|
| `import` / `export` | Compartir las funciones de persistencia con `app.js`. |
| `querySelector` | Encontrar elementos del formulario, la lista y la demo. |
| `addEventListener` | Responder al envío del formulario, los clics y la activación con teclado. |
| Delegación de eventos | Gestionar interacciones en elementos dentro de la lista y los ejemplos desde un contenedor común. |
| `event.target` y `closest()` | Identificar el elemento que recibió el evento y el elemento de actividad o título asociado. |
| `dataset` | Cambiar entre los modos de guardar y actualizar, y señalar la actividad en edición. |
| `localStorage` | Conservar actividades y contador entre visitas desde el mismo navegador. |
