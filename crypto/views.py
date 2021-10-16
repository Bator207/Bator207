from crypto import app
from flask import render_template, jsonify, request
from crypto.models import CoinAPI, DBManager

ruta_basedatos = app.config.get("RUTA_BASE_DE_DATOS")
bbdd = DBManager(ruta_basedatos)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/v1.0/movimientos/')
@app.route('/api/v1.0/movimiento/<id>/')
def lista_movimientos(id=None):
    if id==None:
        consulta = 'SELECT id, data, time,moneda_from ,cantidad_from, moneda_to, cantidad_to FROM movimientos ORDER BY data'
    else:
        consulta = 'SELECT id, data, time,moneda_from ,cantidad_from, moneda_to, cantidad_to FROM movimientos WHERE id=?;'
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
    maxID = "SELECT MAX(id) FROM movimientos"

    try:
        bbdd.modificaSQL(consulta, request.json)

        resultado={
            'status':'success',
            'id':'maxID',
            'monedas':1
        }
        return jsonify(resultado)
    except:
        print ("salio mal")

@app.route('/api/v1.0/calcular/', methods=['POST'])
def calcular_cantidad_to():
    de = request.json['moneda_from']
    a = request.json['moneda_to']
    cd = request.json['cantidad_from']
    try:
        cant_desde=float(cd)
        if de == "":
            resultado={"status":"fail",
            "mensaje":"La moneda de origen no puede estar vacia"}
        elif a == "":
            resultado={"status":"fail",
            "mensaje":"La moneda de destino no puede estar vacia"}
        elif de == a:
            resultado={"status":"fail",
            "mensaje":"No pueden ser iguales las monedas"}
        elif cant_desde<0 :
            resultado={"status":"fail",
            "mensaje":"La cantidad a invertir no puede ser negativa"}
        else:
            coinApi = CoinAPI()
            pu = coinApi.cambiarMonedas(de,a)
            ca=float(cd)*float(pu)
            resultado = {
                'moneda_from':de,
                'moneda_to':a,
                'cantidad_from':cd,
                'pu':pu,
                'cantidad_to':ca
            }
        return jsonify(resultado),400
    except Exception as error:
        resultados={
            'status':'fail',
            'mensaje': "Tiene que ser un número la cantidad que quieres invertir"
        }
        return jsonify(resultados), 400

@app.route('/api/v1.0/mostrarcriptos')
def mostrar_lista_criptos():
    consulta = "SELECT DISTINCT moneda_to FROM movimientos;"
    try:
        movimientos = bbdd.consultaSQL(consulta)
        print(movimientos)
        resultados={
            'status':'success',
            'monedas': movimientos
        }
        return jsonify(resultados)
    except Exception as error:
        resultados={
            'status':'fail',
            'monedas': str(error)
        }
        return jsonify(resultados), 400







