# Client Gateway

## Dev

1. Clonar el repositorio
2. Instalar las dependencias

   ```bash
   $ npm install
   ```

3. Crear un archivo `.env` basado en el archivo `.env.template`
4. Tener levantados los servicios que se van a consumir
5. Ejecutar `npm run start:dev` para ejecutar en modo watch

### Nats Server

```bash
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```
