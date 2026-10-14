var elemento1 = document.querySelector("title");
var elemento2 = document.querySelector("header");
var elemento3 = document.querySelector("button");

console.log(elemento1, elemento2);


function cambiar(evento) {
    console.log(evento);

    if (
        ["H1", "H2", "H3", "H4"].includes(evento.target.tagName)
        /* evento.target.tagName === "H1" || 
        evento.target.tagName === "H2" || 
        evento.target.tagName === "H3" */
    ) {
        elemento1.textContent = "Esto ha cambiado"
        alert("Cierra esto")
    }

    
}


elemento2.addEventListener("dblclick", cambiar)
elemento2.removeEventListener("click", cambiar, true)