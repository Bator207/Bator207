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
            consulta_cantidad_from = f"SELECT IFNULL(SUM(cantidad_from),0) as cantidad_from FROM movimientos WHERE moneda_from=\"{i['moneda_from']}\""
            cantidad_from = bbdd.consultaSQL(consulta_cantidad_from)
            mfrom[i['moneda_from']]=cantidad_from[0]['cantidad_from']

        monedas_to = bbdd.consultaSQL(consulta_monedas_to)
        for i in monedas_to:
            consulta_cantidad_to = f"SELECT IFNULL(SUM(cantidad_to),0) as cantidad_to FROM movimientos WHERE moneda_to=\"{i['moneda_to']}\""
            cantidad_to = bbdd.consultaSQL(consulta_cantidad_to)
            mto[i['moneda_to']]=cantidad_to[0]['cantidad_to']

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
                print("valorf: ",valorf[item])
                if valort[item] == 'null':
                    valort.update({item:0})
                print("valort: ",valort[item])
                valor.update({item:valorf[item]-valort[item]})
            else:
                print("valorf: ",valorf[item])
                print("valort: ",valort[item])
                if valorf[item] == 'null':
                    valorf.update({item:0})
                    valor.update({item:valort[item]-valorf[item]})
        print(valor)
        return(valor)
    except Exception as error:
        print("mal balance", error)