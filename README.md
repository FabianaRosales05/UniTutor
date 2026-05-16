# UniTutor - Sistema Integrado de Tutorias
Aplicacion web academica para gestionar tutorias universitarias entre estudiantes y tutores. El proyecto esta construido con HTML5, CSS3, JavaScript vanilla y Firebase Authentication + Cloud Firestore, manteniendo datos locales de respaldo para pruebas sin conexion.

## Funcionalidades implementadas
- Inicio de sesion con validacion profesional de correo institucional y contraseña.
- Consentimiento Habeas Data obligatorio antes del acceso.
- Registro local y en Firestore de la aceptacion de tratamiento de datos.
- Solicitud, cancelacion y gestion de tutorias.
- Postulacion como tutor con materias, modalidad, biografia y disponibilidad.
- Perfil editable con validaciones de nombre, carrera, semestre y promedio.
- Notificaciones, resenas, calendario y disponibilidad.
- Reporte de tutorias con estadisticas, tabla, filtro por materia y exportacion CSV.
- Reporte de usuarios con roles, actividad reciente, tabla, filtro por rol y exportacion CSV.
- Servidor local automatizado para Windows mediante `iniciar_unitutor.bat`.

## Estructura recomendada

```text
proyecto-tutorias/
  index.html              Interfaz principal del sistema
  style.css               Estilos responsive, formularios, modales y reportes
  script.js               Logica de la app, validaciones, Firebase y reportes
  setup-firebase.html     Creador de usuarios y datos iniciales de prueba
  firebase-check.html     Verificacion auxiliar de Firebase
  firestore.rules         Reglas sugeridas para Cloud Firestore
  iniciar_unitutor.bat    Arranque local automatico en Windows
  docs/
    FIREBASE_GUIA.md      Guia complementaria de configuracion Firebase
```

## Requisitos
- Windows 10 o superior.
- Visual Studio Code.
- Navegador moderno: Chrome, Edge o Firefox.
- Python 3 instalado y agregado al PATH para usar el archivo `.bat`.
- Proyecto Firebase con Authentication y Cloud Firestore habilitados.

## Ejecucion local en Windows
Opcion recomendada:

1. Abre la carpeta `proyecto-tutorias` en Visual Studio Code.
2. Ejecuta doble clic sobre `iniciar_unitutor.bat`, o desde CMD:

```bat
cd C:\Users\fabis\Desktop\proyecto-tutorias
iniciar_unitutor.bat
```

3. El script abre automaticamente:

```text
http://localhost:5500/index.html
```

4. Para detener el servidor, presiona `CTRL + C` en la consola.

Opcion alternativa en VS Code:

1. Instala la extension Live Server.
2. Clic derecho en `index.html`.
3. Selecciona `Open with Live Server`.

No se recomienda abrir `index.html` directamente con doble clic porque los imports remotos de Firebase funcionan mejor desde `localhost`.

## Configuracion Firebase
1. Entra a [Firebase Console](https://console.firebase.google.com/).
2. Crea o abre el proyecto `unitutor-3fccf`.
3. Habilita Authentication con proveedor `Email/Password`.
4. Crea una base Cloud Firestore.
5. Publica el contenido de `firestore.rules` en la seccion Rules de Firestore.
6. Verifica que `script.js` y `setup-firebase.html` tengan el objeto `FIREBASE_CONFIG` de tu proyecto.
7. Inicia el servidor local y abre:

```text
http://localhost:5500/setup-firebase.html
```

8. Pulsa `Crear base de datos de prueba`.

Usuarios de prueba:

```text
Estudiante: estudiante@unisabaneta.edu.co / Unitutor2026
Tutor: tutor@unisabaneta.edu.co / Tutor2026
```

## Colecciones Firestore usadas

```text
users/{uid}
  name, email, role, career, semester, avg, rating
  subjects, modality, availability, bio
  habeasDataAccepted, habeasDataAcceptedAt, habeasDataVersion

habeasDataConsents/{uid}
  userId, email, accepted, version, source, acceptedAt

tutoringRequests/{requestId}
  studentId, studentName, tutorId, tutorName, subject
  date, time, modality, notes, status, createdAt, updatedAt

tutoringSessions/{sessionId}
  requestId, studentId, student, tutorId, subject
  date, time, modality, status, createdAt, updatedAt

notifications/{notificationId}
  userId, type, icon, color, title, message, read, createdAt

availabilitySlots/{slotId}
  tutorId, studentId, requestId, date, time, modality, status

reviews/{reviewId}
  tutoringId, studentId, tutorId, rating, comment, createdAt
```

## Validaciones
Las validaciones estan centralizadas en `script.js` mediante `VALIDATION_RULES` y atributos `data-validate` en HTML. Incluyen:

- Campos obligatorios.
- Correo institucional `@unisabaneta.edu.co`.
- Contrasenas de 8 a 32 caracteres con mayuscula, minuscula y numero.
- Fechas futuras.
- Numeros con rangos academicos.
- Texto sin espacios vacios ni caracteres HTML peligrosos.
- Checkbox obligatorio para Habeas Data.
- Validacion en tiempo real y antes de enviar formularios.

## Reportes
La seccion `Reportes` esta disponible desde el menu lateral para estudiantes y tutores.

- Reporte de tutorias: cantidad total, tutor mas solicitado, estudiantes registrados, materias frecuentes, tabla dinamica, filtro por materia y CSV.
- Reporte de usuarios: usuarios registrados, roles, cantidad de tutores, cantidad de estudiantes, actividad reciente, filtro por rol y CSV.

El boton `Actualizar` intenta sincronizar desde Firebase. Si Firestore no esta disponible, el sistema usa los datos locales sincronizados.

## Habeas Data
Antes de iniciar sesion el usuario debe aceptar la politica de tratamiento de datos. La aplicacion:

- Muestra una politica en modal.
- Impide el ingreso sin aceptacion.
- Guarda la aceptacion localmente.
- Guarda en Firebase la coleccion `habeasDataConsents`.
- Actualiza el documento del usuario con fecha y version de aceptacion.

## Notas academicas
Este proyecto esta preparado para presentacion local. Para produccion se recomienda:

- Revisar reglas de lectura global de reportes segun el rol administrativo requerido.
- Crear roles administrativos reales si los reportes deben ser restringidos.
- Mover configuraciones sensibles a variables de entorno o Firebase Hosting config.
- Agregar pruebas automatizadas end-to-end.
