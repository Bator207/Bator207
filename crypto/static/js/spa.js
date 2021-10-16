const root_host = "http://localhost:5000/api/v1.0/"
const listaMovimientos = new XMLHttpRequest()
const listaMovimiento = new XMLHttpRequest()
const altaMovimientos = new XMLHttpRequest()
const calcularCantidadTo = new XMLHttpRequest()

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

function altaMovimiento (ev) {
    ev.preventDefault()
    const artForm = document.querySelector("#formulario-alta")
    artForm.classList.add('#inactivo')
    let url_alta = `${root_host}alta/`
    let f = new Date()
    const fecha = f.getFullYear() + '-' + f.getMonth() + '-' + f.getDate()
    const hora = f.getHours() + ':' + f.getMinutes() + ':' + f.getSeconds()
    const from = document.querySelector("#from").value
    const cantFrom = document.querySelector('#cantidad-from').value
    const to = document.querySelector("#to").value
    const cantTo = document.querySelector('#cantidad-to').value

    json = {"data":fecha, "time":hora, "moneda_from":from, "cantidad_from":cantFrom, "moneda_to":to, "cantidad_to":cantTo}

    altaMovimientos.open("POST", url_alta,true)
    altaMovimientos.setRequestHeader("Content-Type", "application/json")
    altaMovimientos.send(JSON.stringify(json))
    altaMovimientos.onload = muestraMovimientos
    // altaMovimientos.send()
}

function calcular (ev) {
    ev.preventDefault()
    let url_calc = `${root_host}calcular/`

    const from = document.querySelector("#from").value
    const cantFrom = document.querySelector('#cantidad-from').value
    const to = document.querySelector("#to").value

    json = {"moneda_from":from, "cantidad_from":cantFrom, "moneda_to":to}

    calcularCantidadTo.open('POST',url_calc, true)
    calcularCantidadTo.setRequestHeader("Content-Type", "application/json")
    calcularCantidadTo.send(JSON.stringify(json))
    calcularCantidadTo.onload = pintarResultado
}

function pintarResultado() {
    const respuesta = JSON.parse(this.response)
    if (this.readyState === 4 && this.status === 200){
        document.querySelector('#cantidad-from').value = respuesta.cantidad_from
        document.querySelector('#cantidad-to').value = respuesta.cantidad_to
        document.querySelector('#precio-uni').value = respuesta.pu
        document.querySelector('#to').value = respuesta.moneda_to
        document.querySelector('#from').value = respuesta.moneda_from
    }else{
        alert('No pinto nada')
    }
}

function hazVisibleElemento (elemento) {
    //inicias los 4 botones. Añades inactivo. if el que quieres ver.
    const artTabla = document.querySelector("#tabla-movimientos")
    const artForm = document.querySelector("#formulario-alta")
    const artEstado = document.querySelector("#estado")
    const artbusqueda = document.querySelector("#busqueda")
    artTabla.classList.add("inactivo")
    artForm.classList.add("inactivo")
    artEstado.classList.add("inactivo")
    artbusqueda.classList.add("inactivo")
    if (elemento == "lista") {
        artTabla.classList.remove("inactivo")
    }
    else if (elemento == "nuevo") {
        artForm.classList.remove("inactivo")
    }
    else if (elemento == "estado") {
        artEstado.classList.remove("inactivo")
    }
    else if (elemento == "busca") {
        artbusqueda.classList.remove("inactivo")
    }
}

window.onload = function() {
    const url = `${root_host}movimientos`
    listaMovimientos.open("GET", url, true)
    listaMovimientos.onload = muestraMovimientos
    listaMovimientos.send()

    // const id = document.querySelector("#identificador").value
    // const url_id = `${root_host}movimiento/${id}`
    // listaMovimiento.open("GET", url_id, true)
    // listaMovimiento.setRequestHeader("Content-Type", "application/json")
    // listaMovimiento.onload = muestraMovimientos
    // listaMovimiento.send()
    const btnAceptar = document.querySelector("#aceptar")
    btnAceptar.addEventListener("click", altaMovimiento)

    const btnCalcular = document.querySelector("#calcular")
    btnCalcular.addEventListener("click", calcular)

    const btnLista = document.querySelector("#btn-lista")
    btnLista.addEventListener("click", function(ev) {
        ev.preventDefault()
        hazVisibleElemento("lista")
    })

    const btnNuevo = document.querySelector("#btn-nuevo")
    btnNuevo.addEventListener("click", function(ev) {
        ev.preventDefault()
        hazVisibleElemento("nuevo")
    })

    const btnEstado = document.querySelector("#btn-estado")
    btnEstado.addEventListener("click", function(ev) {
        ev.preventDefault()
        hazVisibleElemento("estado")
    })

    const btnBusca = document.querySelector("#btn-busca")
    btnBusca.addEventListener("click", function(ev) {
        ev.preventDefault()
        hazVisibleElemento("busca")
    })

}
