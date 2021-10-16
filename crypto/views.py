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
    print(f"resultado: {resultado}")
    return jsonify(resultado)