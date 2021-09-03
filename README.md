# Instalación # 
## Archivos ##
Se incluyen los archivos para iniciar el servidor, instalar las dependencias y la instalación de la base de datos.
Debes descomprimir el archivo nombre.zip que incluye estos archivos (.js, .env, .sql y .json).


## Base de datos ##
Para crear la estructura de la base de datos, debes 
ejecutar el script "install_delilah.sql" en la base de datos

### Datos conexión a la Base de Datos ###

En el archivo .env debes ingresar los datos de conexión de la base de datos.
Se incluye un archivo ".env.example" con los parametros necesarios. 
Cuando lo tengas listo debes borrar .example en el nombre de este archivo.

## Servidor ##
Instalar los paquetes del proyecto incluidos en package.json

``` $ npm install ```

## Datos de ejemplo ##

**Productos**

Para obtener un set de datos de productos, ejecutar el script 
"platos_ejemplos.sql" en la base de datos

**Usuario**

El archivo userexample.js crea usuarios de ejemplo en la tabla 'users' automaticamente en la base de datos conectada. 
Se incluye un usuario Admin por defecto.
Puedes configuar la contraseña del usuario Admin en el archivo .env
Para crear estos usuarios debes ejecutar el archivo desde consola:

``` $ node userexample.js```
