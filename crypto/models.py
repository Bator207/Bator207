import sqlite3
from sqlite3.dbapi2 import OperationalError
from flask.helpers import flash

class DBManager():
    def __init__(self, bbdd):
        self.ruta_bbdd = bbdd

    # Funcion que sirve para crear una consulta a la BBDD que devuelta una entrada o varias
    def consultaSQL(self, consulta, params=[]):
        # posible error de conexion BBDD
        try:
            conexion = sqlite3.connect(self.ruta_bbdd)
        except Exception as e:
            print(f'Error al abrir la BBDD. {e}')
            # print(error)
            # fichero = open('log/error.log','w')
            # fichero.write(error)
            # fichero.close()
            # ('Error en la base de datos')

        cursor = conexion.cursor()
        # posible error al ejecutar consulta
        cursor.execute(consulta, params)
        # comprobar si la tabla tiene valores
        claves = cursor.description
        resultado = []
        for fila in cursor.fetchall():
            d = {}
            for tclave, valor in zip(claves, fila):
                d[tclave[0]] = valor
            resultado.append(d)
        conexion.close()
        return resultado