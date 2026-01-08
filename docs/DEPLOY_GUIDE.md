# Guía de Despliegue a GitHub y Vercel
## Última actualización: 7 de Enero, 2026

---

## ✅ ESTADO DEL PROYECTO

El proyecto **Cielo Abierto** está completamente optimizado y listo para producción:

- ✅ Dependencias instaladas correctamente
- ✅ Compilación de producción exitosa
- ✅ Navegación funcionando al 100%
- ✅ Botón de inicio reparado
- ✅ Proyecto organizado profesionalmente
- ✅ Variables de entorno configuradas
- ✅ Optimizado para Vercel

---

## 📋 PASOS PARA SUBIR A GITHUB

### Paso 1: Instalar Git (si no lo tienes)

1. Descarga Git desde: https://git-scm.com/download/win
2. Instala con las opciones por defecto
3. Reinicia tu terminal/PowerShell

### Paso 2: Configurar Git (primera vez)

Abre PowerShell y ejecuta:

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### Paso 3: Crear Repositorio en GitHub

1. Ve a https://github.com
2. Inicia sesión o crea una cuenta
3. Haz clic en el botón verde **"New"** (nuevo repositorio)
4. Nombre del repositorio: `cielo-abierto`
5. Descripción: "Plataforma de expediciones astronómicas"
6. Marca como **Público** o **Privado** según prefieras
7. **NO marques** "Add a README file"
8. Haz clic en **"Create repository"**

### Paso 4: Subir el Proyecto

En PowerShell, navega a tu proyecto y ejecuta:

```powershell
cd "c:\Users\alvag\OneDrive\Escritorio\Pagina web astronomia"

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Proyecto Cielo Abierto optimizado"

# Conectar con GitHub (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/cielo-abierto.git

# Renombrar rama a main
git branch -M main

# Subir a GitHub
git push -u origin main
```

**IMPORTANTE**: Cuando te pida credenciales, usa un **Personal Access Token** (no tu contraseña).

### Cómo crear un Personal Access Token:

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. Dale un nombre: "Cielo Abierto Deploy"
4. Marca el scope: **repo** (completo)
5. Genera el token y **guárdalo en un lugar seguro**
6. Úsalo como contraseña cuando Git te lo pida

---

## 🚀 PASOS PARA DESPLEGAR EN VERCEL

### Método Recomendado: Deploy desde GitHub

1. **Crea una cuenta en Vercel**:
   - Ve a https://vercel.com
   - Haz clic en "Sign Up"
   - Usa tu cuenta de GitHub para registrarte

2. **Importa el Proyecto**:
   - En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
   - Vercel detectará tu repositorio de GitHub
   - Selecciona `cielo-abierto`
   - Haz clic en **"Import"**

3. **Configura las Variables de Entorno**:
   - En la sección "Environment Variables", agrega:
     - **Name**: `VITE_GEMINI_API_KEY`
     - **Value**: `AIzaSyBDOuHFE8hWILbwnzgsHKoUpcIeLeSwnXU` (o tu API key actualizada)
   - Haz clic en **"Add"**

4. **Deploy**:
   - Vercel detectará automáticamente que es un proyecto Vite
   - Haz clic en **"Deploy"**
   - Espera 2-3 minutos mientras se construye

5. **¡Listo!**:
   - Tu sitio estará disponible en: `https://cielo-abierto.vercel.app` (o similar)
   - Cada vez que hagas un push a GitHub, Vercel se actualizará automáticamente

---

## 🔄 FLUJO DE TRABAJO FUTURO

Cuando quieras hacer cambios:

```powershell
# 1. Navega al proyecto
cd "c:\Users\alvag\OneDrive\Escritorio\Pagina web astronomia"

# 2. Haz tus cambios en el código

# 3. Prueba localmente
npm run dev

# 4. Si todo funciona, sube los cambios
git add .
git commit -m "Descripción de tus cambios"
git push

# 5. Vercel desplegará automáticamente en ~2min
```

---

## ⚠️ NOTAS IMPORTANTES

### Seguridad
- ✅ El archivo `.env` está en `.gitignore` (NO se subirá a GitHub)
- ✅ Nunca subas API keys al repositorio
- ✅ Configura las API keys directamente en Vercel

### Variables de Entorno en Vercel
Para agregar o modificar variables después del deploy:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega/edita las variables
4. Redeploy manualmente si es necesario

### Dominios Personalizados
Si quieres usar un dominio propio:
1. En Vercel: Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de configuración DNS

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "git: command not found"
- Instala Git y reinicia PowerShell

### Error al hacer push
- Verifica que usaste el Personal Access Token correcto
- Asegúrate de que el remote URL es correcto: `git remote -v`

### Build falla en Vercel
- Verifica que configuraste `VITE_GEMINI_API_KEY`
- Revisa los logs en Vercel para más detalles

### Página en blanco después del deploy
- Verifica que las rutas en `vercel.json` están correctas
- Revisa la consola del navegador para errores

---

## 📞 CONTACTO Y SOPORTE

Si encuentras problemas, revisa:
1. Los logs de build en Vercel
2. La consola del navegador (F12)
3. El archivo `README.md` para instrucciones adicionales

---

**¡Tu proyecto está listo para brillar en producción! 🌌✨**
