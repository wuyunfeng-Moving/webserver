@echo off
setlocal enabledelayedexpansion

:: 设置日志文件
set LOGFILE=deploy_log.txt
set TIMESTAMP=%date:~0,4%-%date:~5,2%-%date:~8,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set LOGFILE=deploy_log_%TIMESTAMP%.txt

:: 开始记录日志
echo [%date% %time%] Starting deployment... >> %LOGFILE%

:: 切换到项目目录
cd client/my-app
if %ERRORLEVEL% NEQ 0 (
    echo [%date% %time%] Failed to change directory >> %LOGFILE%
    echo Failed to change directory
    pause
    exit /b 1
)

echo test

:: 执行部署命令
echo [%date% %time%] Running npm run deploy... >> %LOGFILE%
call npm run deploy:linux >> %LOGFILE% 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [%date% %time%] Deployment successful! >> %LOGFILE%
    echo Deployment successful!
) else (
    echo [%date% %time%] Deployment failed! >> %LOGFILE%
    echo Deployment failed! Check %LOGFILE% for details
    pause
    exit /b 1
)

cd ../../server
call npm run deploy >> %LOGFILE% 2>&1

echo [%date% %time%] Deployment process completed >> %LOGFILE%
echo Deployment process completed. Check %LOGFILE% for details
pause 