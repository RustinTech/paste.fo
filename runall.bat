@echo off
setlocal enabledelayedexpansion
set base_name=rename-files

echo Running %base_name%.bat...
call "%base_name%.bat"

for /l %%i in (1,1,100) do (
    set "current_file=%base_name% (%%i).bat"
    if exist "!current_file!" (
        echo Running !current_file!...
        call "!current_file!"
    ) else (
        echo File !current_file! not found, skipping...
    )
)

echo All batch files executed.
