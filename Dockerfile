# Usa una imagen de Node.js como base
FROM node:latest

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia todos los archivos del proyecto al directorio de trabajo en el contenedor
COPY . .

# Instala las dependencias del proyecto
RUN npm install

# Expone el puerto 5173 para que la aplicación sea accesible desde el exterior
EXPOSE 5173

# Comando para iniciar la aplicación en modo de desarrollo, exponiendo en 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
