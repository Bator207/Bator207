import sqlite3
import requests
from config import MONEDAS,APIKEY
#from . import app   

class APIError(Exception):
    pass

class DBManager():
    def __init__(self, bbdd):
        self.ruta_bbdd = bbdd

    # Funcion que sirve para crear una consulta a la BBDD que devuelta una entrada o varias
    def consultaSQL(self, consulta, params=[]):
        conexion = sqlite3.connect(self.ruta_bbdd)
        cursor = conexion.cursor()
        cursor.execute(consulta, params)
        claves = cursor.description
        resultado = []
        for fila in cursor.fetchall():
            d = {}
            for tclave, valor in zip(claves, fila):
                d[tclave[0]] = valor
            resultado.append(d)
        conexion.close()
        return resultado

    def modificaSQL(self, consulta, params=[]):
        conexion=sqlite3.connect(self.ruta_bbdd)
        cursor=conexion.cursor()

        cursor.execute(consulta,params)

        conexion.commit()
        conexion.close()

class CoinAPI():
    def __init__(self):
        self.cabecera = {"X-CoinAPI-Key":APIKEY}
        self.coinApi_monedas = f"https://rest.coinapi.io/v1/assets/{MONEDAS}"
    
    def obtenerMonedas(self):
        respuesta = requests.get(self.coinApi_monedas,headers=self.cabecera)
        coin = []
        if respuesta.status_code == 200:
            for item in requests.json():
                coin.append(f"{item['asset_id']} - {item['moneda']}")
                return coin
        else:
            print(respuesta.json())
            raise APIError(f"Se ha producido el error {respuesta.status_code} en la petición")

    def cambiarMonedas(self,de,a):
        self.coinApi_exchange = f"https://rest.coinapi.io/v1/exchangerate/{de}/{a}"
        respuesta = requests.get(self.coinApi_exchange,headers=self.cabecera)
        if respuesta.status_code ==200:
            return respuesta.json()['rate']
        else:
            print(respuesta.json())
            raise APIError(f"Se ha producido el error {respuesta.status_code} en la petición")


