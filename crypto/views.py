from crypto import app
from flask import render_template, jsonify, request
from crypto.models import DBManager

ruta_basedatos = app.config.get("RUTA_BASE_DE_DATOS")
bbdd = DBManager(ruta_basedatos)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/v1.0/movimientos')
def lista_movimientos():
    consulta = 'SELECT id, data, time,moneda_from ,cantidad_from, moneda_to, cantidad_to FROM movimientos ORDER BY data'
    try:
        movimientos = bbdd.consultaSQL(consulta)
        resultados={
            'status':'success',
            'movimientos': movimientos
        }

    except Exception as error:
        resultados={
            'status':'fail',
            'movimientos': str(error)
        }
        return jsonify(resultados), 400
        
    return jsonify(resultados)

@app.route('/api/v1.0/alta', methods=['POST'])
def alta_movimiento():
    consulta = "INSERT INTO movimientos (data, time, moneda_from, cantidad_from, moneda_to, cantidad_to) VALUES (:data, :time, :moneda_from, :cantidad_from, :moneda_to, :cantidad_to)"
    maxID = "SELECT MAX(id) FROM movimientos"
    try:
        bbdd.modificaSQL(consulta, request.json)
        resultado={
            'status':'success',
            'id':'id',
            'monedas':1
        }
    except:
        pass