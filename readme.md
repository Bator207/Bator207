# Registro de ingresos y gastos domésticos

Haremos una web que hace lo que dice el título

# Instalación
1. Instalar las dependencias con pip
```
pip install -r requirements.txt
```
2. Cambiar variables de entorno. Duplicar el fichero .env_template, informar correctamente y renombrar a .env

3. Agregar config

# Ejecución
Ejecutar el mandato `flask run` en el terminal

# Creación de la base de datos
Con sqLite3 crear la base de datos donde te guste.
Ejecutar
```
.read migrations/initial.sql
```
Poner la ruta de la base de datos en la clave RUTA_BASE_DE_DATOS del fichero config.py