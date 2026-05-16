@echo off
setlocal
title UniTutor - Servidor local

set "PORT=5500"
set "URL=http://localhost:%PORT%/index.html"

echo ================================================
echo   UniTutor - Sistema Integrado de Tutorias
echo ================================================
echo.
echo Carpeta del proyecto:
echo %~dp0
echo.
echo Verificando Python para iniciar servidor local...

where py >nul 2>nul
if %errorlevel%==0 (
  echo Python encontrado con launcher py.
  echo Abriendo navegador en %URL%
  start "" "%URL%"
  echo.
  echo Servidor activo en %URL%
  echo Presiona CTRL + C para detenerlo.
  echo.
  py -m http.server %PORT% --bind localhost
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  echo Python encontrado.
  echo Abriendo navegador en %URL%
  start "" "%URL%"
  echo.
  echo Servidor activo en %URL%
  echo Presiona CTRL + C para detenerlo.
  echo.
  python -m http.server %PORT% --bind localhost
  goto :end
)

echo.
echo No se encontro Python instalado.
echo Instala Python 3 desde https://www.python.org/downloads/
echo y marca la opcion "Add python.exe to PATH".
echo.
echo Alternativa en Visual Studio Code:
echo 1. Instala la extension Live Server.
echo 2. Clic derecho sobre index.html.
echo 3. Selecciona "Open with Live Server".
echo.
pause

:end
endlocal
