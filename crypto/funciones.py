from crypto.models import CoinAPI, DBManager
from crypto import app

ruta_basedatos = app.config.get("RUTA_BASE_DE_DATOS")
bbdd = DBManager(ruta_basedatos)

def balanceMonedas():
    consulta_monedas_from = "SELECT DISTINCT moneda_from FROM movimientos;"
    consulta_monedas_to = "SELECT DISTINCT moneda_to FROM movimientos;"
    mfrom = {}
    mto = {}
    monedas=[]

    try:
        monedas_from = bbdd.consultaSQL(consulta_monedas_from)
        monedas_to = bbdd.consultaSQL(consulta_monedas_to)
        for i in monedas_from:
            if not i['moneda_from'] in monedas:
                monedas.append(i['moneda_from'])
        for i in monedas_to:
            if not i['moneda_to'] in monedas:
                monedas.append(i['moneda_to'])

        for i in monedas:
            consulta_cantidad_from = f"SELECT SUM(cantidad_from) as cantidadFrom FROM movimientos WHERE moneda_from=\"{i}\""
            cantidad_from = bbdd.consultaSQL(consulta_cantidad_from)
            mfrom[i]=cantidad_from[0]['cantidadFrom']

        for i in monedas:
            consulta_cantidad_to = f"SELECT SUM(cantidad_to) as cantidadTo FROM movimientos WHERE moneda_to=\"{i}\""
            cantidad_to = bbdd.consultaSQL(consulta_cantidad_to)
            mto[i]=cantidad_to[0]['cantidadTo']

        valorf={}
        valort={}
        valor={}

        for f in mfrom:
            if mfrom[f] == None:
                valorf[f] = 0
            else:
                valorf[f]=round(mfrom[f],3)
        for t in mto:
            if mto[t] == None:
                valort[t] = 0
            else:
                valort[t]=round(mto[t],3)
        valor = valort
        for item in valorf:
            if item == 'EUR':
                valor.update({item:valorf[item]-valort[item]})
            else:
                valor.update({item:valort[item]-valorf[item]})

        return(valor)
    except:
        pass