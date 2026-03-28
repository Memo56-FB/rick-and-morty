# Rick and Morty

Puntos destacados:
- Búsqueda de personajes con `debounce`
- Enfoque en `accesibilidad` de los componentes
- 60% de coverage en los test para las funciones
- Estructura del proyecto separada por responsabilidades

## Producción

La versión desplegada está disponible en:

```bash
https://rick-and-morty.memofb.dev/
```
## Nota sobre favoritos en producción

Los favoritos SOLO funcionan correctamente en local porque están soportados por `json-server`.

En producción esta función esta deshabilitada.

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Redux Toolkit`
- `json-server`
- `Vitest`
- `Testing Library`

## Cómo levantar el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar el servidor fake de favoritos

Para la parte de favoritos usé `json-server`, así que primero hay que levantar ese servicio:

```bash
npm run server
```

Eso deja disponible el recurso:

```bash
http://localhost:3001/favorites
```

### 3. Levantar la aplicación

En otra terminal, arranca la app:

```bash
npm run dev
```

Después puedes abrir:

```bash
http://localhost:3000
```

## Cómo correr las pruebas unitarias

### Ejecutar toda la suite

```bash
npm run test
```

### Ejecutar pruebas en modo watch

```bash
npm run test:watch
```

### Ejecutar pruebas con coverage

```bash
npm run test:coverage
```

### Ejecutar UI de vitest
```bash
npx vitest --ui --coverage.enabled
```

Si quieres revisar el coverage en HTML, se genera en:

```bash
coverage/index.html
```

## Arquitectura resumida

Intenté mantener una separación de responsabilidades clara para que el proyecto no se volviera difícil de mover conforme fue creciendo:

- `app/components`
  Componentes de UI y contenedores por feature.
- `app/hooks`
  Hooks compartidos como `useDebouncedValue`.
- `lib/http`
  Cliente HTTP reutilizable.
- `lib/rick-and-morty`
  Cliente, servicio y mapeos para la API externa.
- `lib/favorites`
  Servicio para favoritos persistidos con `json-server`.
- `lib/store`
  Estado global con `Redux Toolkit`.
- `types`
  Tipos compartidos en archivos `.d.ts`.

## Qué fue lo que más me gustó del desarrollo

Lo que más disfruté fue poder cuidar tanto la parte visual como la parte interna del proyecto. Me interesaba que no se quedara solo en “verse bien”, sino que también tuviera atención a detalles de interacción, accesibilidad, estados visuales y pequeños comportamientos que hacen que la experiencia se sienta más pulida.

También disfruté darle una estructura mantenible. Fui separando componentes presentacionales, contenedores, hooks, servicios, store y tipos compartidos para que cada pieza tuviera una responsabilidad concreta. Eso ayudó a que el proyecto quedara más claro, más escalable y más cómodo de mantener.

## Si hubiera tenido más tiempo

Si hubiera tenido un poco más de tiempo, me habría gustado profundizar en estas áreas:

- Aumentar la cobertura de pruebas en hooks y contenedores grandes.
- Reemplazar `json-server` en producción por una solución persistente compatible con serverless, por ejemplo Supabase o Neon.
- Añadir estados de loading, empty state y error más ricos visualmente.
- Mejorar accesibilidad en algunas interacciones visuales, con validaciones más profundas de foco y navegación por teclado.
- Añadir pruebas E2E para validar el flujo completo de favoritos, búsqueda y cambio de páginas.

## Reto de implementación y cómo lo resolví

Más que un bug puntual, el reto principal fue el tiempo. No tuve tanto margen para hacer una planeación tan detallada como me habría gustado desde el arranque, así que empecé con una base mínima funcional y, conforme el proyecto fue creciendo, fui refinando la arquitectura al mismo tiempo que avanzaba con la implementación.

Eso me obligó a ir tomando decisiones de estructura sobre la marcha: separar responsabilidades, extraer hooks compartidos, desacoplar servicios de la UI, dividir contenedores y componentes presentacionales, y reorganizar partes del código cuando empezaban a asumir demasiadas tareas. En vez de dejar que la complejidad creciera sin control, traté de usar cada nueva funcionalidad como oportunidad para ordenar mejor el proyecto.

Al final, ese proceso ayudó a que el proyecto no solo cumpliera con la funcionalidad pedida, sino que también terminara con una base más limpia, entendible y lista para seguir creciendo.