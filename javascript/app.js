const formulario = document.querySelector("form")
let listado = document.querySelector("#listado-actividades")
const ingresarActividad = document.querySelector("input[name='actividad']")
const botonDeAccion = document.querySelector("button#accion")


let actividadNro = 1
formulario.addEventListener(
    "submit", function (evento) {
        evento.preventDefault()
        console.log("Evento: ", evento);
        console.log("Valor: ", evento.target[0].value);
        const actividad =
            evento.target.querySelector("input[name='actividad']").value
        formulario.reset()
        console.log("actividad: ", actividad);
        if (botonDeAccion.dataset.accion === "actualizar") {
            alert("Ahora vamos a actualizar el texto!")
            botonDeAccion.dataset.accion = "guardar"
        } else {
            actividadNro = actividadNro + 1
            const item = `<li class="flex justify-between actividad-${actividadNro}">
                    <div>
                        <input type="checkbox" id="actividad-${actividadNro}">
                        <label for="actividad-${actividadNro}">${actividad}</label>
                    </div>
                    <div class="acciones">
                        <button class="editar border rounded-md border-white p-2 bg-slate-100 text-gray-900">Editar</button>
                        <button class="borrar border rounded-md border-white p-2 bg-red-600">Borrar</button>
                    </div>
                </li>`
            listado.insertAdjacentHTML("beforeend", item)
        }


    }
)

listado.addEventListener(
    "click", function (evento) {
        const elemento = evento.target
        if (elemento.tagName == "BUTTON" && elemento.classList.contains("borrar")) {
            /* alert("Voy a borrar esta actividad") */
            console.log(elemento.closest("li"), "¿viste?");
            elemento.closest("li").remove()
        }

        if (elemento.tagName == "BUTTON" && elemento.classList.contains("editar")) {
            /* alert("Voy a editar esta actividad") */
            let texto = elemento.closest("li").querySelector("label").textContent
            /*  alert(texto) */
            ingresarActividad.value = texto
            botonDeAccion.setAttribute("data-accion", "actualizar")
        }
    }
)