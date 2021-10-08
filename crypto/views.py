from crypto import app
from flask import render_template, jsonify
from crypto.models import DBManager

ruta_basedatos = app.config.get("RUTA_BASE_DE_DATOS")
bbdd = DBManager(ruta_basedatos)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/v1.0/movimientos')
def lista_movimientos():
    consulta = 'SELECT id, data, time,moneda_from ,cantidad_from, moneda_to, cantidad_to FROM movimientos ORDER BY data'
    movimientos = bbdd.consultaSQL(consulta)
    resultados={
        'status':'success',
        'movimientos': movimientos
    }
    
    return jsonify(resultados)