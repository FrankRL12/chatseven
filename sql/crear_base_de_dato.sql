-- Crear el rol (usuario) "pruebauser"
CREATE ROLE pruebauser WITH
  LOGIN
  SUPERUSER
  PASSWORD 'prueba';

-- Crear la base de datos "DBprueba" con el usuario "pruebauser" como propietario
CREATE DATABASE DBprueba
  WITH
  OWNER = pruebauser
  ENCODING = 'UTF8'
  LC_COLLATE = 'Spanish_Mexico.1252'
  LC_CTYPE = 'Spanish_Mexico.1252'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1
  IS_TEMPLATE = False;

-- Conectar a la base de datos "DBprueba" (asegúrate de estar conectado antes de ejecutar este script)

-- Crear el esquema "prueba" con el usuario "pruebauser" como propietario
CREATE SCHEMA prueba
  AUTHORIZATION pruebauser;

-- Otorgar permisos sobre el esquema al rol
GRANT ALL ON SCHEMA prueba TO pruebauser;

-- Otorgar permisos adicionales si es necesario
GRANT CONNECT ON DATABASE DBprueba TO pruebauser;
