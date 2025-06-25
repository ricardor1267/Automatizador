# Módulo Automatizador de Prompts

## Descripción General

El Módulo Automatizador de Prompts es una aplicación desarrollada en Next.js que permite crear, gestionar y optimizar prompts para inteligencia artificial. El módulo facilita la generación de instrucciones específicas para tareas automatizadas mediante un flujo de trabajo guiado de 4 pasos.

## Características Principales

- **Flujo de trabajo estructurado**: Proceso de 4 pasos para crear prompts optimizados
- **Múltiples proveedores de IA**: Integración con OpenAI, Anthropic Claude y Google Gemini
- **Sistema de fallback automático**: Si un proveedor falla, el sistema intenta con otros
- **Consulta de esquemas de Strapi**: Integración con el backend para obtener estructuras de datos
- **Biblioteca de prompts**: Almacenamiento y gestión de prompts generados
- **Interfaz en español**: Diseñada para usuarios hispanohablantes

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, Reactstrap
- **Backend**: Strapi API REST
- **Proveedores de IA**: OpenAI (GPT-4o-mini), Anthropic Claude (claude-3-haiku), Google Gemini (gemini-2.0-flash)
- **Autenticación**: JWT a través de localStorage

## Estructura del Módulo

El módulo está organizado siguiendo buenas prácticas de desarrollo, separando la lógica de negocio de la presentación:

```
automatizador/
├── components/             # Componentes de React para la interfaz
│   ├── DescripcionProyecto.js   # Paso 1: Descripción del proyecto
│   ├── EstructuraDatos.js       # Paso 2: Estructura de datos
│   ├── GeneracionPreguntas.js   # Paso 3: Preguntas generadas por IA
│   ├── ProgressSteps.js         # Navegación entre pasos
│   ├── PromptFinal.js           # Paso 4: Prompt final generado
│   ├── PromptsGuardados.js      # Gestión de prompts almacenados
│   └── ProveedorSelector.js     # Selector de proveedor de IA
├── hooks/                  # Hooks personalizados para la lógica
│   ├── useAutomatizador.js      # Hook principal de estado global
│   └── useEsquemaBusqueda.js    # Hook para búsqueda de esquemas
├── services/               # Servicios para comunicación con APIs
│   ├── api.js                   # Servicios para Strapi API
│   ├── iaProviders.js           # Servicios para proveedores de IA
│   └── promptService.js         # Servicios para prompts
├── automatizador.css       # Estilos específicos del módulo
├── page.js                 # Componente principal del módulo
└── README.md               # Documentación del módulo
```

## Flujo de Trabajo

### Paso 1: Descripción del Proyecto
- El usuario proporciona una descripción detallada del proyecto
- Esta descripción es la base para la generación de preguntas y el prompt final

### Paso 2: Estructura de Datos
- El usuario puede consultar esquemas de tablas en Strapi
- Se pueden incluir estructuras de datos JSON para contextualizar el prompt
- Los esquemas se formatean automáticamente

### Paso 3: Generación de Preguntas
- El sistema utiliza IA para generar preguntas relevantes
- El usuario puede seleccionar el proveedor de IA preferido
- Si un proveedor falla, el sistema intenta con otros automáticamente
- El usuario responde a las preguntas para refinar el prompt

### Paso 4: Prompt Final
- El sistema genera un prompt optimizado basado en toda la información
- El usuario puede editar el prompt final
- El prompt se puede guardar con un nombre personalizado
- Los prompts guardados aparecen en el panel lateral

## Integración con Strapi

El módulo se integra con un backend Strapi mediante:

- Autenticación JWT para acceso seguro
- Consulta de esquemas de tablas
- Almacenamiento de prompts generados
- Relaciones entre prompts, tipos y permisos

## Sistema de Fallback entre Proveedores de IA

Una característica destacada es el sistema de fallback entre diferentes proveedores:

1. **Intento inicial**: Se utiliza el proveedor seleccionado por el usuario
2. **Fallback automático**: Si falla, se intenta con los demás proveedores
3. **Notificación**: El usuario es informado sobre el proveedor utilizado
4. **Reintentos**: Cada proveedor tiene un sistema de reintentos con espera exponencial

## Consideraciones para Despliegue

Para desplegar este módulo en producción:

1. Copiar la carpeta completa `automatizador/` a la ruta correspondiente
2. Configurar las variables de entorno necesarias
3. Verificar la correcta autenticación con Strapi
4. Actualizar las claves API de los proveedores de IA si es necesario

## Variables de Entorno Requeridas

- `NEXT_PUBLIC_API_URL`: URL base de la API de Strapi
- Claves API para los proveedores (gestionadas dentro del módulo)
