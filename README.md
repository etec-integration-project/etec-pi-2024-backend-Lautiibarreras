Lautaro Barreras

En la consola de tu editor de codigo realiza los siguientes pasos:

1. **Clona el repositorio:**

    ```
    git clone https://github.com/etec-integration-project/etec-pi-2024-backend-Lautiibarreras.git
    ```
2. **Navega al directorio del proyecto:**

    ```
    cd etec-pi-2024-backend-Lautiibarreras
    ```
3. **Inicia los contenedores:**

    ```
    docker-compose up --build
    ```
4. **Accede a la aplicación:**

    Una vez que los contenedores estén en funcionamiento (tienen que mostrarun mensaje en la consola que diga "ready for connection"), abre tu navegador y visita `http://localhost:3000/ping` para ver la aplicación.

## **Detener los contenedores**

Para detener los contenedores en ejecución, simplemente presiona `Ctrl + C` en la terminal donde ejecutaste `docker-compose up`. Esto detendrá los contenedores y liberará los puertos utilizados.
