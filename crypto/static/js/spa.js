const root_host = "http://localhost:5000/api/v1.0/"
const listaMovimientos = new XMLHttpRequest()
const altaMovimientos = new XMLHttpRequest()

function muestraMovimientos () {
    if (this.readyState === 4 && this.status === 200){
        const respuesta = JSON.parse(this.response)
        const movimientos = respuesta.movimientos
        const tabla = document.querySelector('#tabla-datos')
        let innerHTML = ""
        if (movimientos.length > 0) {
            for (let i=0; i < movimientos.length; i++){
                innerHTML = innerHTML + 
                                `<tr>
                                    <td>${movimientos[i].data}</td>
                                    <td>${movimientos[i].time}</td>
                                    <td>${movimientos[i].moneda_from}</td>
                                    <td>${movimientos[i].cantidad_from}</td>
                                    <td>${movimientos[i].moneda_to}</td>
                                    <td>${movimientos[i].cantidad_to}</td>
                                </tr>`
                            }
                            tabla.innerHTML = innerHTML
        } else {
            tabla.innerHTML=""
            let innerHTML = ""
            innerHTML = innerHTML + 
                        `<p class="content is-large">
                            No tienes movimientos a mostrar
                        </p>`
            tabla.innerHTML = innerHTML
        }
    } else if (this.status === 400) {
        const respuesta = JSON.parse(this.response)
        const transaccion = respuesta.movimientos
        const tabla = document.querySelector('#tabla-movimientos')
        tabla.innerHTML = ""
        let innerHTML = ""
        innerHTML = innerHTML + 
                        `<p class="content is-large" id="error">
                            ${transaccion}
                        </p>`
        tabla.innerHTML = innerHTML
    }
}

function altaMovimiento () {
    ev.preventDefault()
    let f = new Date()
    const fecha = f.getFullYear() + '-' + f.getMonth() + '-' + f.getDate()
    const hora = f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds()
    const from = document.querySelector("#from").value
    const cantFrom = document.querySelector('#cantidad-from').value

    
}

function calcular () {
    ev.preventDefault()
    
}

// Preguntar para hacer solo una funcion
// Preguntar en la tabla SQL, por el campo cantidad_to
function hazVisibleTabla (ev) {
    ev.preventDefault()
    const artTabla = document.querySelector("#tabla-movimientos")
    const artForm = document.querySelector("#formulario-alta")
    const artEstado = document.querySelector("#estado")
    artTabla.classList.remove("inactivo")
    artForm.classList.add("inactivo")
    artEstado.classList.add("inactivo")
}

function hazVisibleForm (ev) {
    ev.preventDefault()
    const artTabla = document.querySelector("#tabla-movimientos")
    const artForm = document.querySelector("#formulario-alta")
    const artEstado = document.querySelector("#estado")
    artTabla.classList.add("inactivo")
    artForm.classList.remove("inactivo")
    artEstado.classList.add("inactivo")
}

function hazVisibleEstado (ev) {
    ev.preventDefault()
    const artTabla = document.querySelector("#tabla-movimientos")
    const artForm = document.querySelector("#formulario-alta")
    const artEstado = document.querySelector("#estado")
    artTabla.classList.add("inactivo")
    artForm.classList.add("inactivo")
    artEstado.classList.remove("inactivo")
}

window.onload = function() {
    const url = `${root_host}movimientos`
    listaMovimientos.open("GET", url, true)
    listaMovimientos.onload = muestraMovimientos
    listaMovimientos.send()

    const btnLista = document.querySelector("#btn-lista")
    btnLista.addEventListener("click", hazVisibleTabla)

    const btnNuevo = document.querySelector("#btn-nuevo")
    btnNuevo.addEventListener("click", hazVisibleForm)

    const btnEstado = document.querySelector("#btn-estado")
    btnEstado.addEventListener("click", hazVisibleEstado)

}