const root_host = "http://localhost:5000/api/v1.0/"
const listaMovimientos = new XMLHttpRequest()

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

window.onload = function() {
    const url = `${root_host}movimientos`
    listaMovimientos.open("GET", url, true)
    listaMovimientos.onload = muestraMovimientos
    listaMovimientos.send()
}