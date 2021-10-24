from crypto import app
from flask import render_template, jsonify, request
from crypto.funciones import balanceMonedas
from crypto.models import CoinAPI, DBManager

ruta_basedatos = app.config.get("RUTA_BASE_DE_DATOS")
bbdd = DBManager(ruta_basedatos)
coinApi = CoinAPI()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/v1.0/movimientos/', methods=['GET'])
def lista_movimientos():
    consulta = 'SELECT id, data, time,moneda_from ,cantidad_from, moneda_to, cantidad_to FROM movimientos ORDER BY data;'
    try:
        movimientos = bbdd.consultaSQL(consulta)
        resultados={
            'status':'success',
            'movimientos': movimientos
        }
        return jsonify(resultados)
    except Exception as error:
        resultados={
            'status':'fail',
            'movimientos': str(error)
        }
        return jsonify(resultados), 400

@app.route('/api/v1.0/alta/', methods=['POST'])
def alta_movimiento():
    consulta = "INSERT INTO movimientos (data, time, moneda_from, cantidad_from, moneda_to, cantidad_to) VALUES (:data, :time, :moneda_from, :cantidad_from, :moneda_to, :cantidad_to)"
    maxID = "SELECT MAX(id) as maxid,moneda_from,moneda_to FROM movimientos"
    mio = balanceMonedas()

    try:
        mf = request.json['moneda_from']
        if mf != 'EUR':
            if request.json['cantidad_from'] > mio[mf]:
                print("mf: ",mf)
                print('cantidad_compra:',request.json['cantidad_from'])
                print('Cantidad tengo: ',mio[mf])
                resultados={
                'status':'fail',
                'mensaje': 'Saldo insuficiente'
                }
                return jsonify(resultados),200
        print("mio: ",mio)
        print("json: ",request.json)
        bbdd.modificaSQL(consulta, request.json)
        id= bbdd.consultaSQL(maxID)
        monedas='Moneda origen: '+id[0]['moneda_from']+' - Moneda destino: '+id[0]['moneda_to']
        resultado={
            'status':'success',
            'id':id[0]['maxid'],
            'monedas':monedas
        }
        return jsonify(resultado),201
    except:
        resultados={
            'status':'fail',
            'error': 'Error en la consulta a la base de datos. Ponte en contacto con tu administrador'
        }
        return jsonify(resultados), 400

@app.route('/api/v1.0/calcular/', methods=['POST'])
def calcular_cantidad_to():
    de = request.json['moneda_from']
    a = request.json['moneda_to']
    cd = request.json['cantidad_from']
    try:
        cant_desde=float(cd)
        if de == "":
            resultado={"status":"fail",
            "error":"La moneda de origen no puede estar vacia"}
        elif a == "":
            resultado={"status":"fail",
            "error":"La moneda de destino no puede estar vacia"}
        elif de == a:
            resultado={"status":"fail",
            "error":"No pueden ser iguales las monedas"}
        elif cant_desde<0 :
            resultado={"status":"fail",
            "error":"La cantidad a invertir no puede ser negativa"}
        else:
            pu = coinApi.cambiarMonedas(de,a)
            ca=float(cd)*float(pu)
            resultado = {
                'moneda_from':de,
                'moneda_to':a,
                'cantidad_from':round(float(cd),2),
                'pu':round(float(pu),2),
                'cantidad_to':round(ca,2)
            }
            return jsonify(resultado)
        return jsonify(resultado),400
    except Exception as error:
        resultados={
            'status':'fail',
            'error': "Tiene que ser un número la cantidad que quieres invertir"
        }
        return jsonify(resultados), 400

@app.route('/api/v1.0/mostrarcriptos')
def mostrar_lista_criptos():
    consulta = "SELECT DISTINCT moneda_to FROM movimientos;"
    try:
        movimientos = bbdd.consultaSQL(consulta)
        resultados={
            'status':'success',
            'monedas': movimientos
        }
        return jsonify(resultados)
    except Exception as error:
        resultados={
            'status':'fail',
            'error': 'No se pueden mostrar las criptomonedas. Ponte en contacto con tu administrador.'
        }
        return jsonify(resultados), 400

@app.route('/api/v1.0/estado')
def estado():
    try:
        valor=0
        monedasCA = coinApi.obtenerMonedas()

        precioUSD = {}
        for monedaCA in monedasCA:
            precioUSD[monedaCA["asset_id"]]=monedaCA['price_usd']

        mio = balanceMonedas()
        precioEUR = round(1/precioUSD['EUR'],2)
        for f in mio:
            if f != 'EUR':
                valor = valor + (mio[f]*precioUSD[f]*precioEUR)
        balance=round(valor - mio['EUR'],2)
        resultado = {
            'invertido':mio['EUR'],
            'valor':round(valor,2),
            'balance':balance
        }
        return jsonify(resultado),200
    except:
        resultados={
            'status':'fail',
            'error': 'Error en la consulta. Ponte en contacto con tu administrador.'
        }
        return jsonify(resultados), 400





