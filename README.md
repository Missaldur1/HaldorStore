# 🛍️ HaldorStore

**HaldorStore** es una aplicación web desarrollada con **React** como parte de un proyecto estudiantil del **Duoc UC** para el ramo **Ingeniería de Requisitos**.  
El sistema busca simular una tienda en línea que permita la gestión integral de productos, ventas e inventario, aplicando buenas prácticas de análisis, diseño y documentación de requisitos.

---

## 🚀 Características principales

- 🧩 **Gestión de productos**: Crear, editar y eliminar productos con sus respectivas categorías, precios y descripciones.  
- 📦 **Control de inventario**: Registro automático del stock disponible y alertas por baja existencia.  
- 💳 **Simulación de ventas**: Carrito de compras funcional y registro de transacciones.  
- 👤 **Gestión de usuarios (básica)**: Acceso diferenciado para administrador y cliente.  
- 📊 **Interfaz intuitiva**: Diseño limpio, adaptable y fácil de usar.

---

## 🧠 Objetivo del proyecto

El propósito de este sistema es **aplicar los principios de la Ingeniería de Requisitos** mediante el desarrollo de un prototipo funcional, reflejando el proceso completo desde la elicitación hasta la validación de los requisitos.

---

## 🛠️ Tecnologías utilizadas

- **React.js** – Framework principal de desarrollo  
- **Vite / Create React App** – Entorno de desarrollo rápido  
- **HTML5 / CSS3 / JavaScript (ES6+)** – Tecnologías base  
- **Node.js & npm** – Gestión de dependencias  
- **Git / GitHub** – Control de versiones  
- *(Opcional)* **Firebase / JSON Server** – Simulación de base de datos

---
 
## 🖥️ Guía de Inicio Rápido del Frontend (React)

Esta guía te explica cómo configurar, instalar las dependencias y ejecutar el proyecto de React en tu entorno de desarrollo local.

> **Requisito:** Asegúrate de tener instalado **Node.js** y **npm** (Node Package Manager).

    
    https://nodejs.org/en/download
    

---

### 📦 Paso 1: Apertura y Ubicación

1.  **Abre la Carpeta:** Navega hasta la carpeta raíz del proyecto de **Frontend**.
2.  **Abre la Terminal:** Abre una nueva terminal o línea de comandos **dentro de esta carpeta**.
    * *Sugerencia:* Si usas Visual Studio Code, puedes abrir la terminal con `Ctrl + \``.

---

### 🛠️ Paso 2: Instalación de Dependencias

Es necesario descargar y enlazar todas las librerías que el proyecto de React necesita para funcionar, las cuales están listadas en el archivo `package.json`.

* **Comando de Instalación:**

    ```bash
    npm install
    ```

    * **Resultado:** Este comando descarga las librerías y las guarda en una carpeta llamada `node_modules`.

---

### 🟢 Paso 3: Ejecución del Proyecto

Una vez que todas las dependencias están listas, puedes iniciar el servidor de desarrollo local.

1.  **Comando para Iniciar el Servidor:**

    ```bash
    npm run dev
    ```

2.  **Acceso a la Aplicación:**
    El comando compilará el proyecto y, por lo general, abrirá automáticamente la aplicación en tu navegador.
    * **Dirección Local:** La aplicación se ejecutará en una dirección similar a `http://localhost:3000`.

---

### 🛑 Para Detener la Ejecución

Cuando termines de trabajar, vuelve a la terminal donde se está ejecutando el servidor y presiona **`Ctrl + C`**.