@echo off
setlocal
cd /d %~dp0\..

py -3 tools\run_smoke_tests.py
if errorlevel 1 exit /b 1
exit /b 0
