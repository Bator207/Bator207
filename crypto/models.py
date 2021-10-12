import sqlite3
from sqlite3.dbapi2 import OperationalError
from flask.helpers import flash

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
        pass