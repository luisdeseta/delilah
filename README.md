# Instalación # 
## Archivos ##
Se incluyen los archivos para iniciar el servidor, instalar las dependencias y la instalación de la base de datos.
Debes descomprimir el archivo delilah_resto_v1.zip que incluye estos archivos (.js, .env, .sql y .json).


## Base de datos ##
Para crear la estructura de la base de datos, debes 
ejecutar el script "install_delilah.sql" que se encuentra en la carpeta **/SQL**

### Datos conexión a la Base de Datos ###

En el archivo .env debes ingresar los datos de conexión de la base de datos.
Se incluye un archivo ".env.example" con los parametros necesarios. 
Cuando lo tengas listo debes borrar .example en el nombre de este archivo.

## Servidor ##
Instalar los paquetes del proyecto incluidos en package.json

``` $ npm install ```
## Ejecución del servidor ##
Para inicializar el servidor debes ejecutar este comando en la terminal

``` $ nodemon index ```
## Datos de ejemplo ##


Para obtener un set de datos de ejemplo, ejecutar el script 
"install_delilah_datos_ejemplos.sql" en la base de datos.
Este script incluye usuarios (con role Admin y role user), pedidos, platos y favoritos para poder probar todos los endpoint del proyecto

**Usuario**

Importante para tener en cuenta en el login de los usuarios:

El password del usuario "admin" de ejemplo es "admin123".
El password del usuario con role "user" es "123123"

## Uso de Endpoins ##

En el archivo Delilah_docV1.yaml se encuentra la descripcion y detalles de uso de cada endpoint del proyecto.
