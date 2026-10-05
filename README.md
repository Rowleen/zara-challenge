# Zara Challenge

Una pequeña tienda de móviles desarrollada con React. El catálogo de productos se obtiene de una API externa y se utiliza un servidor Express como BFF (*Backend for Frontend*) para mantener la `API_KEY` fuera del navegador.

La idea es mantener el cliente lo más sencillo posible y centralizar en el BFF la comunicación con la API externa y la gestión de la clave de autenticación.

## Requisitos

- Node.js `20` o superior.
- npm

Se ha elegido node 20 porque playwright y vitest 4 aceptan node 20, 22 o 24.

## Puesta en marcha

Primero, crea el archivo de variables de entorno:

```bash
cp .env.example .env.local
```

Después, edita `.env.local` y sustituye `API_KEY` por la clave real. El resto de valores incluidos en el ejemplo están preparados para trabajar en local.

Instala las dependencias y arranca el proyecto:

```bash
npm install
npm run dev
```

Una vez iniciado, puedes acceder a la aplicación en:

`http://localhost:5173`

Durante el desarrollo, Vite sirve el frontend y hace proxy de las peticiones `/api` hacia el BFF de Express, que corre en el puerto `3000`.

## Variables de entorno

El servidor carga `.env.local` y, si existe, `.env`. Vite utiliza estos mismos archivos para sus variables.

| Variable | La utiliza | Descripción |
| --- | --- | --- |
| `API_KEY` | BFF | Clave que se envía en la cabecera `x-api-key` para autenticar las peticiones contra la API externa. |
| `API_BASE_URL` | BFF | URL base del catálogo. Si termina en `/products`, el servidor elimina ese sufijo para construir las rutas correctamente. |
| `PORT` | BFF | Puerto en el que escucha Express. Por defecto es `3000`. |
| `VITE_API_BASE_URL` | Cliente | Prefijo utilizado para las peticiones del frontend. Si está vacío, se utiliza el mismo origen (`/api/...`). Solo sería necesario indicar una URL absoluta si el SPA y el BFF estuvieran desplegados en orígenes diferentes. |
| `VITE_DEV_BFF_URL` | Vite | URL del BFF utilizada por el proxy durante el desarrollo. Si no se indica, Vite utiliza `http://127.0.0.1:$PORT`. |

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Arranca Vite y el BFF al mismo tiempo. Si uno de los procesos termina, el otro también se detiene. |
| `npm run dev:server` | Arranca únicamente el BFF (`node server/index.mjs`). |
| `npm run dev:client` | Arranca únicamente Vite. |
| `npm run build` | Comprueba los tipos de TypeScript y genera la build en `dist/`. |
| `npm start` | Sirve la build de `dist/` junto con el proxy del catálogo desde `PORT`. |
| `npm run preview` | Sirve una vista previa de la build de Vite. No incluye el BFF, por lo que para probar el flujo completo es necesario utilizar `build` seguido de `start`. |
| `npm run lint` | Ejecuta ESLint sobre el proyecto. |
| `npm test` | Ejecuta Vitest en modo watch. |
| `npm run test:run` | Ejecuta los tests una sola vez. |
| `npm run test:e2e` | Ejecuta los tests end-to-end con Playwright usando Chromium. |
| `npm run test:e2e:ui` | Ejecuta Playwright utilizando su interfaz gráfica. |

Además, Husky tiene configurado un hook de pre-commit que ejecuta ESLint sobre los archivos JavaScript/TypeScript preparados mediante `lint-staged`.

## Producción

Para generar y servir la aplicación en producción:

```bash
npm run build
npm start
```

En este caso Express se encarga tanto de servir los archivos estáticos de `dist/` como de actuar como BFF.

Por defecto estará disponible en:

`http://localhost:3000`

También se puede cambiar el puerto mediante la variable `PORT`.

Las rutas del cliente se resuelven devolviendo `index.html`, mientras que las peticiones a `/api/products` siguen pasando por el BFF antes de llegar a la API externa.

Si no existe `dist/index.html`, el servidor informa de que todavía no se ha generado una build del frontend.

## Arquitectura

La aplicación utiliza una arquitectura sencilla, separando el frontend de la comunicación con la API externa.

### Desarrollo

Durante el desarrollo hay dos procesos:

1. **BFF — Express** (`server/index.mjs`, puerto `3000`)

   Se encarga de comunicarse con la API externa, añadir la `x-api-key` y exponer al frontend únicamente las rutas que necesita. También reenvía los parámetros `search`, `limit` y `offset` cuando están presentes.

2. **Frontend — Vite** (puerto `5173`)

   Vite compila y sirve la aplicación React y actúa como proxy de `/api` hacia el BFF.

De esta forma, la `API_KEY` nunca forma parte del bundle del frontend ni se expone al navegador.

### Producción

En producción los dos roles se unifican en un único proceso Express:

- Sirve los archivos estáticos generados por Vite;
- Resuelve las rutas del SPA;
- Actúa como BFF para las peticiones al catálogo.

El cliente construye las URLs HTTP desde `src/lib/http/config.ts`.

Cuando `VITE_API_BASE_URL` está vacío, el frontend utiliza rutas relativas como `/api/products`, por lo que las peticiones se realizan contra el mismo origen desde el que se sirve la aplicación.

## Aplicación

La aplicación está construida con:

- React 19
- TypeScript
- React Router 7
- Sass

Los estilos están colocados junto a los componentes a los que pertenecen, mientras que los estilos globales se mantienen en `src/styles`.

### Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Catálogo, búsqueda y número de resultados. |
| `/products/:id` | Detalle del producto, incluyendo almacenamiento, color, especificaciones y productos similares. |
| `/cart` | Carrito de compra, con total y posibilidad de eliminar líneas. |

La búsqueda incorpora un debounce de `300 ms` para evitar realizar una petición por cada tecla pulsada. Además, cuando llega una búsqueda nueva, la petición anterior se cancela para evitar condiciones de carrera y respuestas obsoletas.

El carrito se mantiene en memoria y también se persiste en `localStorage` utilizando la clave:

`zara-challenge-cart`

## BFF / API

El BFF expone únicamente las operaciones que necesita el frontend:

| Método | Ruta | API externa |
| --- | --- | --- |
| `GET` | `/api/products?search&limit&offset` | `{API_BASE_URL}/products` |
| `GET` | `/api/products/:id` | `{API_BASE_URL}/products/:id` |

La `API_KEY` se añade en el servidor mediante la cabecera `x-api-key`, evitando que esta información llegue al cliente.

En caso de configuración incorrecta:

- si faltan `API_KEY` o `API_BASE_URL`, el BFF responde con `500`;
- si la API externa no responde correctamente, el BFF responde con `502`.

## Estructura del proyecto

```text
server/index.mjs          BFF y servidor de producción

src/
  main.tsx                Router, carrito y toasts
  App.tsx                 Definición de rutas
  pages/                  Páginas de catálogo, detalle y carrito
  components/             Componentes de UI, cada uno con su .sass
  hooks/                  Hooks de búsqueda, detalle y debounce
  services/products.ts    Comunicación con el catálogo
  context/                Estado global del carrito
  lib/
    http/                 Cliente fetch, configuración de URLs y ApiError
    types/                Tipos de producto y carrito
    format/price.ts       Formateo de precios
  styles/                 Reset y variables globales
  assets/                 Logo e iconos
  test/                   Configuración de Vitest y fixtures

e2e/                      Tests end-to-end con Playwright
```

Para evitar imports relativos demasiado largos, el proyecto tiene definidos los siguientes alias tanto en Vite como en TypeScript:

`@`, `@components`, `@hooks`, `@context`, `@services`, `@lib`, `@pages`, `@styles`, `@assets` y `@test`.

## Tests

Los tests unitarios utilizan Vitest y Testing Library. No necesitan tener levantada la API externa ni el BFF:

```bash
npm run test:run
```

Los tests end-to-end utilizan Playwright y mockean las peticiones a `/api/products`, por lo que tampoco necesitan `API_KEY` ni acceso a la API real.

La primera vez es necesario instalar Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

Si se quiere ejecutar el flujo paso a paso y visualizar lo que hacen los tes de Playwright:

```bash
npm run test:e2e:ui
```

Playwright se encarga de arrancar Vite automáticamente en:

`http://127.0.0.1:5173`
