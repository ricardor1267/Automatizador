# Módulo Automatizador de Prompts

Este módulo permite la creación y gestión de prompts optimizados para inteligencia artificial, facilitando la generación de instrucciones específicas para tareas automatizadas.

## Características principales

- Creación de prompts mediante un flujo de trabajo guiado de 4 pasos
- Consulta automática de esquemas de tablas de Strapi
- Generación de preguntas inteligentes para refinar el prompt
- Almacenamiento y gestión de prompts generados
- Integración con la API de Strapi para acceso a datos

## Estructura del módulo

```
automatizador/
├── components/             # Componentes de React para la interfaz de usuario
│   ├── DescripcionProyecto.js   # Paso 1: Descripción del proyecto
│   ├── EstructuraDatos.js       # Paso 2: Estructura de datos
│   ├── GeneracionPreguntas.js   # Paso 3: Preguntas generadas por IA
│   ├── ProgressSteps.js         # Navegación entre pasos
│   ├── PromptFinal.js           # Paso 4: Prompt final generado
│   └── PromptsGuardados.js      # Gestión de prompts almacenados
├── hooks/                  # Hooks personalizados para la lógica de negocio
│   ├── useAutomatizador.js      # Hook principal para el estado global
│   └── useEsquemaBusqueda.js    # Hook para la búsqueda de esquemas
├── services/               # Servicios para comunicación con APIs
│   ├── api.js                   # Servicios para interactuar con Strapi
│   └── openai.js                # Servicios para interactuar con OpenAI
├── automatizador.css       # Estilos específicos del módulo
├── page.js                 # Componente principal del módulo
└── README.md               # Documentación del módulo
```

## Guía de uso

### Paso 1: Descripción del proyecto

1. Ingresa una descripción clara y detallada del proyecto o tarea para la que necesitas generar un prompt.
2. Esta descripción ayudará a la IA a entender el contexto y propósito.

### Paso 2: Estructura de datos

1. Consulta automática de esquemas:
   - Ingresa el nombre de la tabla en Strapi (ej: "prompts", "prompt-types")
   - Especifica la cantidad de registros de ejemplo a incluir
   - Haz clic en "Consultar Esquema" para obtener la estructura

2. Edición manual:
   - Puedes editar la estructura generada o ingresar tu propia información
   - El editor permite expandirse para trabajar con estructuras grandes
   - Utiliza el formato JSON para mejor compatibilidad

### Paso 3: Generación de preguntas

1. El sistema generará automáticamente preguntas relevantes basadas en la descripción y estructura proporcionadas.
2. Estas preguntas están diseñadas para refinar y mejorar el prompt final.
3. Responde a cada pregunta de forma clara y concisa.
4. Puedes regenerar las preguntas si necesitas un enfoque diferente.

### Paso 4: Prompt final

1. El sistema generará un prompt optimizado basado en toda la información proporcionada.
2. Puedes editar directamente el prompt generado para realizar ajustes finales.
3. Asigna un nombre descriptivo al prompt antes de guardarlo.
4. El prompt guardado estará disponible para su uso posterior.

## Panel de prompts guardados

- En el panel lateral se muestran todos los prompts guardados.
- Puedes cargar cualquier prompt guardado para su edición o reutilización.
- La función de eliminación permite mantener organizada tu biblioteca de prompts.

## Integración con esquemas de bases de datos

Este módulo se integra directamente con la funcionalidad de consulta de esquemas, permitiendo:

1. Consultar la estructura de cualquier tabla en la base de datos Strapi
2. Obtener automáticamente las relaciones entre tablas
3. Incluir datos de ejemplo para una mejor comprensión
4. Formatear todo en JSON para su uso directo en los prompts

## Consideraciones técnicas

- **Autenticación**: El módulo utiliza el token JWT almacenado en localStorage para autenticar las peticiones a la API.
- **Variables de entorno**: La URL base de la API se configura mediante la variable de entorno `NEXT_PUBLIC_API_URL`.
- **Separación de responsabilidades**: El módulo sigue una arquitectura que separa la lógica de negocio (hooks) de la presentación (componentes).
- **Reutilización de código**: Se aprovecha la funcionalidad existente del módulo de esquemas para evitar duplicación.

## Instrucciones para desarrolladores

Para extender o modificar este módulo:

1. Las modificaciones deben seguir la estructura existente separando lógica y presentación.
2. Cada cambio debe documentarse en un archivo de versión (ej: `changes_v18.txt`).
3. El versionado debe incrementarse secuencialmente (v1, v2, v3...).
4. Los estilos deben ajustarse a los definidos en `/styles` del proyecto principal.

## Migración a producción

Para implementar este módulo en producción:

1. Copiar la carpeta completa `automatizador/` a la ruta correspondiente en el servidor de producción.
2. Verificar que las variables de entorno estén correctamente configuradas.
3. Comprobar que el token JWT se esté gestionando correctamente en el entorno de producción.
