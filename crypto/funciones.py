from crypto.models import CoinAPI, DBManager
from crypto import app

ruta_basedatos = app.config.get("RUTA_BASE_DE_DATOS")
bbdd = DBManager(ruta_basedatos)

def balanceMonedas():
    consulta_monedas_from = "SELECT DISTINCT moneda_from FROM movimientos;"
    consulta_monedas_to = "SELECT DISTINCT moneda_to FROM movimientos;"
    mfrom = {}
    mto = {}

    try:
        monedas_from = bbdd.consultaSQL(consulta_monedas_from)
        for i in monedas_from:
            consulta_cantidad_from = f"SELECT SUM(cantidad_from) as cantidadFrom FROM movimientos WHERE moneda_from=\"{i['moneda_from']}\""
            cantidad_from = bbdd.consultaSQL(consulta_cantidad_from)
            mfrom[i['moneda_from']]=cantidad_from[0]['cantidadFrom']

        monedas_to = bbdd.consultaSQL(consulta_monedas_to)
        for i in monedas_to:
            consulta_cantidad_to = f"SELECT SUM(cantidad_to) as cantidadTo FROM movimientos WHERE moneda_to=\"{i['moneda_to']}\""
            cantidad_to = bbdd.consultaSQL(consulta_cantidad_to)
            mto[i['moneda_to']]=cantidad_to[0]['cantidadTo']
        valorf={}
        valort={}
        valor={}

        for f in mfrom:
            valorf[f]=round(mfrom[f],3)
        for t in mto:
            valort[t]=round(mto[t],3)
        valor = valort
        for item in valorf:
            if item == 'EUR':
                valor.update({item:float(valorf[item])-float(valort[item])})
            else:
                valor.update({item:valort[item]-valorf[item]})

        return(valor)
    except Exception as error:
        print("mal balance", error)