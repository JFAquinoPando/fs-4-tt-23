const initialTitle = document.title;
const examples = document.querySelector("#examples");
const resetButton = document.querySelector("#reset-demo");
const eventStatus = document.querySelector("#event-status");
const eventDescription = document.querySelector("#event-description");

function getDemoHeading(target) {
    if (!(target instanceof Element)) {
        return null;
    }

    const heading = target.closest("[data-listen-target]");
    return heading && examples.contains(heading) ? heading : null;
}

function reportEvent(heading, inputMethod) {
    document.title = "¡Evento detectado! | Escuchador";
    eventStatus.textContent = "¡Escuchado!";
    eventDescription.textContent = `${inputMethod}: «${heading.textContent.trim()}». El título de la pestaña ha cambiado.`;
}

examples.addEventListener("dblclick", (event) => {
    const heading = getDemoHeading(event.target);
    if (heading) {
        reportEvent(heading, "Doble clic detectado");
    }
});

examples.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    const heading = getDemoHeading(event.target);
    if (heading) {
        event.preventDefault();
        reportEvent(heading, "Activado con el teclado");
    }
});

resetButton.addEventListener("click", () => {
    document.title = initialTitle;
    eventStatus.textContent = "A la escucha";
    eventDescription.textContent = "Todavía no hay actividad. Haz doble clic en cualquiera de los títulos.";
});
