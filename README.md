# Lista de actividades

Esta aplicación permite agregar actividades a una lista, editarlas, marcarlas como realizadas y borrarlas. El archivo `javascript/app.js` controla lo que ocurre en la página; `javascript/persistencia.js` guarda y recupera información en el navegador.

## Cómo se conectan los archivos

`contacto.html` carga `app.js` como módulo de JavaScript. Por eso, `app.js` puede importar las funciones `guardar` y `obtener` desde `persistencia.js`. Al abrir la página, la aplicación busca la lista y el número de actividad que ya se guardaron en el navegador.

## `javascript/persistencia.js`: guardar y recuperar

| Código o idea | Explicación sencilla |
|---|---|
| `export function` | Hace que una función pueda usarse desde otro archivo. |
| `guardar(clave, valor)` | Recibe un nombre (`clave`) y la información que se quiere conservar (`valor`). |
| `localStorage.setItem(clave, valor)` | Guarda esa información en el navegador, asociada a su nombre. Sigue disponible si se cierra y se vuelve a abrir la página en el mismo navegador. |
| `return "Se guardó todo"` | Devuelve ese mensaje a quien llamó a la función. En el código actual no se muestra en la página. |
| `obtener(clave)` | Busca en el navegador la información guardada con ese nombre y la devuelve. Si todavía no existe, el navegador devuelve `null` (es decir, no hay un valor guardado). |

## `javascript/app.js`: controlar la lista

### Al preparar la página

| Código o idea | Explicación sencilla |
|---|---|
| `import { guardar, obtener } ...` | Trae las dos funciones del otro archivo para poder guardar y recuperar datos. |
| `document.querySelector("form")` | Busca en la página el primer formulario. `querySelector` encuentra un elemento usando una descripción: por ejemplo, `"form"` busca un formulario y `"#listado-actividades"` busca el elemento cuyo identificador es `listado-actividades`. |
| `[HTMLElement].querySelector(...)` | Un elemento de la página también puede buscar dentro de sí mismo. Por ejemplo, `evento.target.querySelector(...)` busca el campo de actividad dentro del formulario que se envió, en vez de buscarlo por toda la página. |
| `const` y `let` | Dan un nombre a un dato. Se usa `const` cuando ese nombre seguirá apuntando al mismo elemento o valor; se usa `let` cuando el valor podrá cambiar, como el número de actividad. |
| `if (...) { ... } else { ... }` | Permite elegir qué hacer según una condición: por ejemplo, actualizar una actividad si el botón está en ese modo, o crear una nueva en caso contrario. |
| `===` y `==` | Comparan dos valores. `===` exige que sean del mismo tipo y tengan el mismo contenido; `==` también compara, pero puede tratar como iguales valores de tipos distintos. |
| `obtener("nro-actividad")` y `parseInt(...)` | Recuperan el número guardado y lo convierten de texto a número para poder sumarle uno. |
| `?? 1` | Si todavía no hay un número guardado (`null`), usa `1` como valor inicial. |
| `` `...${actividad}...` `` | Las comillas inclinadas permiten preparar texto con espacios de varias líneas e insertar dentro el valor de `actividad`. Aquí se usan para armar el HTML de una actividad. |
| `listado.innerHTML = obtener("actividades")` | Coloca dentro de la lista el contenido que se había guardado. `innerHTML` representa el contenido que hay entre las etiquetas de un elemento. |
| `addEventListener("submit", ...)` | Le indica al formulario qué hacer cuando alguien lo envía; por ejemplo, al pulsar el botón. |

### Cuando se agrega o se actualiza una actividad

1. **`evento.preventDefault()`** evita que el formulario haga su acción normal. En este caso, evita que el navegador recargue la página y añada los datos a la dirección web.
2. **`evento.target`** señala qué elemento inició el evento. Aquí es el formulario que se envió. Desde ahí se lee el texto escrito en el campo `actividad`.
3. **`formulario.reset()`** deja el campo vacío después de leer su contenido.
4. **`botonDeAccion.dataset.accion`** lee el valor de `data-accion` del botón. Ese valor indica si el botón está en modo de guardar una actividad nueva o actualizar una existente.
5. **Al actualizar**, se busca la actividad seleccionada con `document.querySelector(...)`. Luego, `itemBuscado.querySelector("label")` busca su etiqueta dentro de esa actividad y `textContent` cambia el texto que se ve. El botón vuelve al modo de guardar.
6. **Al agregar**, se aumenta el número de actividad y se prepara un bloque de HTML con el texto, una casilla para marcarla y los botones Editar y Borrar.
7. **`listado.insertAdjacentHTML("beforeend", item)`** añade ese bloque al final de la lista que ya existe, sin reemplazar las otras actividades. `"beforeend"` significa «antes del cierre de este elemento».
8. **`guardar(...)`** conserva el contenido actual de la lista y el número de actividad en el navegador.

### Cuando se pulsa algo dentro de la lista

La lista escucha los clics con `addEventListener("click", ...)`. Así no necesita configurar una escucha nueva para cada actividad que se agrega.

| Código o idea | Explicación sencilla |
|---|---|
| `evento.target` | Indica exactamente qué elemento recibió el clic, como el botón, la casilla o el texto de una actividad. |
| `elemento.tagName` | Permite comprobar qué tipo de elemento recibió el clic, por ejemplo, un botón (`BUTTON`), una etiqueta (`LABEL`) o una casilla (`INPUT`). |
| `elemento.classList.contains("borrar")` | Comprueba si el botón tiene la clase `borrar`. `contains()` aquí significa «¿incluye esta clase?». Junto con `tagName`, permite distinguir el botón Borrar del botón Editar. |
| `elemento.closest("li")` | Desde el elemento pulsado, sube por los elementos que lo contienen hasta encontrar la actividad completa (`li`). Es útil porque el clic ocurre en un botón que está dentro de esa actividad. |
| `elemento.closest("li").remove()` | Encuentra la actividad que contiene el botón pulsado y la quita de la página. |
| `elemento.closest("li").querySelector("label")` | Primero encuentra la actividad completa y luego, dentro de ella, busca su texto. Así se prepara la edición de la actividad correcta. |
| `getAttribute(...)` y `setAttribute(...)` | Leen o cambian un atributo del elemento. Se usan para recordar qué actividad se va a editar y para cambiar el modo del botón. |
| `ingresarActividad.value = texto` | Coloca el texto de la actividad elegida en el campo del formulario para poder modificarlo. |
| `alert(...)` y `console.log(...)` | `alert` muestra un aviso en una ventana; `console.log` escribe información en las herramientas de desarrollo del navegador, útil para revisar qué está pasando. En este código, esos mensajes sirven para observar el evento y el texto ingresado. |
| `item.querySelector("label").className = "line-through"` | Cambia la clase del texto para mostrar una línea encima, como señal de que está realizado. |
| `item.querySelector("input").setAttribute("disabled", true)` | Desactiva la casilla para que no se pueda marcar otra vez. |

Al hacer clic en el texto o en la casilla, la aplicación marca la actividad como realizada. Al hacer clic en Editar, copia su texto al formulario; al enviarlo, reemplaza el texto de esa actividad. Al hacer clic en Borrar, la quita de la lista.

## Qué queda guardado

La lista y el número de actividad se guardan cuando se envía el formulario para agregar o actualizar. En el código actual, borrar una actividad o marcarla como realizada cambia la página, pero esos cambios no se guardan de inmediato; podrían perderse al recargarla.
