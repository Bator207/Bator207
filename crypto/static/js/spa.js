const root_host = "http://localhost:5000/api/v1.0/"
const listaMovimientos = new XMLHttpRequest()
const listaMovimiento = new XMLHttpRequest()
const altaMovimientos = new XMLHttpRequest()
const calcularCantidadTo = new XMLHttpRequest()
const mostrarCriptosFrom = new XMLHttpRequest()
const estado = new XMLHttpRequest()

function criptoMonedasFrom() {
    if (this.readyState === 4 && this.status === 200){
        const respuesta = JSON.parse(this.response)
        const monedas = respuesta.monedas
        const opciones = document.querySelector('#from')
        opciones.innerHTML=""
        let innerHTML = `<option disabled selected>Elije una cripto</option>
        <option value="EUR">EUR</option>`
        if (monedas.length > 0){
            for (let i=0; i < monedas.length; i++){
                if (`${monedas[i].moneda_to}` != 'EUR')
                    innerHTML = innerHTML + 
                    `<option value=${monedas[i].moneda_to}>${monedas[i].moneda_to}</option>` 
            }
        }
        opciones.innerHTML = innerHTML
    } else if (this.status === 400) {
        const respuesta = JSON.parse(this.response)
        const transaccion = respuesta.error
        alert (transaccion)
    }
}

function resetear_formulario() {
    if (document.querySelector('#cantidad-from') != null){
        document.querySelector('#cantidad-from').value=0
        document.querySelector('#to').selectedIndex=0
        document.querySelector('#cantidad-to').value=0
        document.querySelector('#precio-uni').value=0
    }else{
        window.location.reload()
    }
}

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
            alert ("No tienes movimientos a mostrar")
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
    if (this.readyState === 4 && this.status === 201){
        const respuesta = JSON.parse(this.response)
        document.querySelector('#cantidad-from').value = respuesta.cantidad_from
        document.querySelector('#cantidad-to').value = respuesta.cantidad_to
        document.querySelector('#precio-uni').value = respuesta.pu
        document.querySelector('#to').value = respuesta.moneda_to
        document.querySelector('#from').value = respuesta.moneda_from
    } else if (this.status === 200) {
        const respuesta = JSON.parse(this.response)
        const transaccion = respuesta.mensaje
        alert (transaccion)
    }else if (this.status === 400) {
        const respuesta = JSON.parse(this.response)
        const transaccion = respuesta.error
        alert (transaccion)
    }
}

function altaMovimiento (ev) {
    ev.preventDefault()
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
    altaMovimientos.onload = respuestaAltaMovimiento
}

function respuestaAltaMovimiento() {
    if (this.readyState === 4 && this.status === 201){
        const artForm = document.querySelector("#formulario-alta")
        artForm.classList.add("inactivo")
        const artTabla = document.querySelector("#tabla-movimientos")
        artTabla.classList.remove("inactivo")

        const url = `${root_host}movimientos`
        listaMovimientos.open("GET", url, true)
        listaMovimientos.onload = muestraMovimientos
        listaMovimientos.send()
        const resultado = JSON.parse(this.response)
            alert (`Se ha creado el registro: ${resultado['id']}\r ${resultado['monedas']}`)
    }else if (this.status === 400) {
        const respuesta = JSON.parse(this.response)
        const transaccion = respuesta.error
        alert (transaccion)
    }
}

function hazVisibleElemento (elemento) {
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
        const url_cripto = `${root_host}mostrarcriptos`
        mostrarCriptosFrom.open("GET", url_cripto, true)
        mostrarCriptosFrom.onload = criptoMonedasFrom
        mostrarCriptosFrom.send()
    }
    else if (elemento == "estado") {
        artEstado.classList.remove("inactivo")
    }
    // else if (elemento == "busca") {
    //     artbusqueda.classList.remove("inactivo")
    // }
}

function estadoInversion() {
    if (this.readyState === 4 && this.status === 200){
        resultado = document.querySelector('#resultado')
        resultado.classList.remove("resultado")
        const respuesta = JSON.parse(this.response)
        document.querySelector('#invertido').value = `${respuesta.invertido}€`
        document.querySelector('#valor').value = `${respuesta.valor}€`
        document.querySelector('#resultado').value = `${respuesta.balance}€`
        let cadena = `${respuesta.balance}€`.charAt(0)
        if (cadena === '-') {
            resultado = document.querySelector('#resultado')
            resultado.classList.add("resultado")
        }
    } else if (this.status === 400) {
        const respuesta = JSON.parse(this.response)
        const transaccion = respuesta.error
        alert (transaccion)
    }
}

// function buscaMovimiento() {
//     const id = document.querySelector("#identificador").value
//     const url_id = `${root_host}movimiento/${id}`
//     json = {'id':id}
//     listaMovimiento.open("POST", url_id, true)
//     listaMovimiento.setRequestHeader("Content-Type", "application/json")
//     listaMovimiento.send(JSON.stringify(json))
//     listaMovimiento.onload = muestraMovimientos
// }

window.onload = function() {
    const btnAceptar = document.querySelector("#aceptar")
    btnAceptar.addEventListener("click", altaMovimiento)

    const btnCalcular = document.querySelector("#calcular")
    btnCalcular.addEventListener("click", calcular)

    // const btnBuscar = document.querySelector("#btn-buscar")
    // btnBuscar.addEventListener("click", buscaMovimiento)

    const btnLista = document.querySelector("#btn-lista")
    btnLista.addEventListener("click", function(ev) {
        ev.preventDefault()
        const url = `${root_host}movimientos`
        listaMovimientos.open("GET", url, true)
        listaMovimientos.onload = muestraMovimientos
        listaMovimientos.send()
        hazVisibleElemento("lista")
    })

    const btnNuevo = document.querySelector("#btn-nuevo")
    btnNuevo.addEventListener("click", function(ev) {
        ev.preventDefault()
        resetear_formulario()
        hazVisibleElemento("nuevo")
    })

    const btnEstado = document.querySelector("#btn-estado")
    btnEstado.addEventListener("click", function(ev) {
        ev.preventDefault()
        hazVisibleElemento("estado")
        const url_estado = `${root_host}estado`
        estado.open('GET',url_estado,true)
        estado.onload = estadoInversion
        estado.send()
    })

    // const btnBusca = document.querySelector("#btn-busca")
    // btnBusca.addEventListener("click", function(ev) {
    //     ev.preventDefault()
    //     hazVisibleElemento("busca")
    // })
}
