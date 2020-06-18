SET mypath=%~dp0
copy %mypath%..\platform\syncthing-win %mypath%..\helpers\syncthing\syncthing
%mypath%..\node_modules\.bin\pkg -t win -o %mypath%..\output\hkubectl-win.exe %mypath%..\