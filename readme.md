# Registro de movimientos de criptomonedas

Vamos a hacer un registro de inversiones y compra/venta de criptos para jugar con los valores a ver si podemos hacer crecer nuestra inversión en euros.

# Instalación
1. Instalar las dependencias con pip
```
pip install -r requirements.txt
```
2. Cambiar variables de entorno. Duplicar el fichero .env_template, informar correctamente y renombrar a .env

3. Cambiar el config. Duplicar el fichero config_template.py, informar correctamente y renombrar a config.py

# Creación de la base de datos
Con sqLite3 crear la base de datos donde te guste.
Ejecutar
```
.read migrations/initial.sql
```

# Ejecución
Ejecutar el mandato `flask run` en el terminal
