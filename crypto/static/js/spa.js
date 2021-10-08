const root_host = "http://localhost:5000/api/v1.0/"
const listaMovimientos = new XMLHttpRequest()

function muestraMovimientos () {
    if (this.readyState === 4 && this.status === 200){
        const respuesta = JSON.parse(this.response)
        const movimientos = respuesta.movimientos
        const tabla = document.querySelector('#tabla-datos')

        let innerHTML = ""
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
        console.log(innerHTML)
        tabla.innerHTML = innerHTML
    } else {
        alert("Se ha producido un error en la consulta de movimientos")
    }
}

window.onload = function() {
    const url = `${root_host}movimientos`
    listaMovimientos.open("GET", url, true)
    listaMovimientos.onload = muestraMovimientos
    listaMovimientos.send()
}