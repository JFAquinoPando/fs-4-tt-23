// Guarda el título original para poder restaurarlo cuando se reinicie la demo.
const initialTitle = document.title;
// Obtiene el contenedor común de los títulos; aquí se registran los escuchadores delegados.
const examples = document.querySelector("#examples");
// Obtiene el botón que restablece el estado inicial de la demo.
const resetButton = document.querySelector("#reset-demo");
// Obtiene el botón que quita o vuelve a registrar los escuchadores.
const toggleListenersButton = document.querySelector("#toggle-listeners");
// Obtiene el elemento donde se muestra el estado breve del último evento.
const eventStatus = document.querySelector("#event-status");
// Obtiene el texto descriptivo del monitor, marcado como región aria-live en el HTML.
const eventDescription = document.querySelector("#event-description");
// Indica si los escuchadores están registrados actualmente en el contenedor.
let listenersAttached = true;

// Busca si el elemento que originó un evento es uno de los títulos interactivos de la demo.
function getDemoHeading(target) {
    // Comprueba que el valor recibido sea un elemento HTML antes de usar métodos del DOM.
    if (!(target instanceof Element)) {
        // Devuelve null para indicar que no se encontró un título válido.
        return null;
    }

    // Encuentra el título interactivo más cercano al elemento que originó el evento.
    const heading = target.closest("[data-listen-target]");
    // Devuelve el título solo si existe y pertenece al contenedor de esta demo.
    return heading && examples.contains(heading) ? heading : null;
}

// Actualiza el título de la pestaña y el monitor para describir el evento detectado.
function reportEvent(heading, inputMethod) {
    // Cambia el título de la pestaña para confirmar visualmente que se detectó el evento.
    document.title = "¡Evento detectado! | Escuchador";
    // Cambia el indicador de estado del monitor a una confirmación.
    eventStatus.textContent = "¡Escuchado!";
    // Muestra el método de activación y el texto del título que recibió el evento.
    eventDescription.textContent = `${inputMethod}: «${heading.textContent.trim()}». El título de la pestaña ha cambiado.`;
}

// Maneja los dobles clics en cualquier parte del contenedor de ejemplos.
function handleDoubleClick(event) {
    // Identifica si el doble clic ocurrió sobre uno de los títulos interactivos.
    const heading = getDemoHeading(event.target);
    // Continúa solo cuando el evento corresponde a un título de la demo.
    if (heading) {
        // Informa que el título se activó mediante doble clic.
        reportEvent(heading, "Doble clic detectado");
    }
}

// Maneja las pulsaciones de teclado dentro del contenedor de ejemplos.
function handleKeydown(event) {
    // Ignora todas las teclas salvo Enter y Espacio, que activan el título enfocado.
    if (event.key !== "Enter" && event.key !== " ") {
        // Termina el manejador sin cambiar la interfaz si la tecla no es válida.
        return;
    }

    // Comprueba que el elemento enfocado que recibió la tecla sea un título interactivo.
    const heading = getDemoHeading(event.target);
    // Continúa solo cuando la activación por teclado ocurrió en un título de la demo.
    if (heading) {
        // Evita que Espacio desplace la página al activar el título.
        event.preventDefault();
        // Informa que el título se activó con el teclado.
        reportEvent(heading, "Activado con el teclado");
    }
}

// Registra ambos manejadores al iniciar la demo.
examples.addEventListener("dblclick", handleDoubleClick);
examples.addEventListener("keydown", handleKeydown);

// Escucha clics en el botón de reinicio.
resetButton.addEventListener("click", () => {
    // Restaura el título de pestaña guardado al cargar la página.
    document.title = initialTitle;
    // Devuelve el indicador del monitor a su estado inicial.
    eventStatus.textContent = "A la escucha";
    // Restablece la instrucción inicial, que invita a probar un doble clic.
    eventDescription.textContent = "Todavía no hay actividad. Haz doble clic en cualquiera de los títulos.";
});

// Permite quitar los escuchadores o registrarlos de nuevo con el mismo manejador.
toggleListenersButton.addEventListener("click", () => {
    if (listenersAttached) {
        // Quita los manejadores registrados al iniciar; se pasa la misma referencia de función.
        examples.removeEventListener("dblclick", handleDoubleClick);
        examples.removeEventListener("keydown", handleKeydown);
        listenersAttached = false;
        toggleListenersButton.textContent = "Agregar escuchadores";
        toggleListenersButton.setAttribute("aria-pressed", "false");
        eventStatus.textContent = "En pausa";
        eventDescription.textContent = "Los escuchadores se quitaron. Pulsa «Agregar escuchadores» para volver a probar.";
        return;
    }

    // Vuelve a registrar los mismos manejadores para reactivar la demo.
    examples.addEventListener("dblclick", handleDoubleClick);
    examples.addEventListener("keydown", handleKeydown);
    listenersAttached = true;
    toggleListenersButton.textContent = "Quitar escuchadores";
    toggleListenersButton.setAttribute("aria-pressed", "true");
    eventStatus.textContent = "A la escucha";
    eventDescription.textContent = "Los escuchadores están activos. Haz doble clic en cualquiera de los títulos.";
});
