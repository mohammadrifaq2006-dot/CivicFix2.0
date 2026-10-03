@echo off
setlocal
set "IDEA_MAVEN=C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.3\plugins\maven\lib\maven3\bin\mvn.cmd"
where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
) else if exist "%IDEA_MAVEN%" (
    "%IDEA_MAVEN%" %*
) else (
    echo [ERROR] Maven not found.
    exit /b 1
)
