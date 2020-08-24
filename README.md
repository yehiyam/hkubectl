# hkubectl  
  
## Install  
```shell  
curl -Lo hkubectl https://github.com/kube-HPC/hkubectl/releases/download/$(curl -s https://api.github.com/repos/kube-HPC/hkubectl/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')/hkubectl-linux \
&& chmod +x hkubectl \
&& sudo mv hkubectl /usr/local/bin/  
```  
## Usage  
## hkubectl  
---  
```shell  
$ hkubectl [ command ]  
```  
    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|--version|Show version number|boolean|||  
|--rejectUnauthorized|set to false to ignore certificate signing errors. Useful for self signed TLS certificate|boolean|||  
|--endpoint|url of hkube api endpoint|string|||  
|--verbose|verbose logging|boolean|||  
|--json, -j|output json to stdout|boolean|||  
|--help|Show help|boolean|||  
### exec  
---  
```shell  
$ hkubectl exec < command >  
```  
Execution pipelines as raw or stored    
#### get  
  
```shell  
$ hkubectl exec get < jobId >  
```  
Returns the executed pipeline data    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
#### raw  
  
```shell  
$ hkubectl exec raw   
```  
execute raw pipeline from file    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|--file, -f|file path/name for running pipeline. use - to read from stdin|string|true||  
|--noWait|if true, does not wait for the execution to finish  |boolean||false|  
|--noResult|if true, does not show the result of the execution  |boolean||false|  
#### stored  
  
```shell  
$ hkubectl exec stored [ name ]  
```  
execute pipeline by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
|--file, -f|file path/name for running pipeline|string|||  
|--noWait|if true, does not wait for the execution to finish  |boolean||false|  
|--noResult|if true, does not show the result of the execution  |boolean||false|  
#### stop  
  
```shell  
$ hkubectl exec stop   
```  
call to stop pipeline execution    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
|reason|Reason for stopping the pipeline|string|||  
#### status  
  
```shell  
$ hkubectl exec status < jobId >  
```  
Returns a status for the current pipeline    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
#### result  
  
```shell  
$ hkubectl exec result < jobId >  
```  
returns result for the execution of a specific pipeline run    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|jobId|The jobId to get the result|string|true||  
#### algorithm  
  
```shell  
$ hkubectl exec algorithm [ name ]  
```  
execute algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
|--file, -f|file path/name for extra data|string|||  
|--noWait|if true, does not wait for the execution to finish  |boolean||false|  
|--noResult|if true, does not show the result of the execution  |boolean||false|  
### algorithm  
---  
```shell  
$ hkubectl algorithm < command >  
```  
Manage loaded algorithms    
#### apply  
  
```shell  
$ hkubectl algorithm apply [ name ]  
```  
apply an algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
|--file, -f|the algorithm file|string|||  
|--env|the algorithm env  [choices: "python", "nodejs", "java"]|string|||  
|--codePath|the code path for the algorithm|string|||  
|--codeEntryPoint, --entryPoint|the code entry point for the algorithm|string|||  
|--image, --algorithmImage|set algorithm image|string|||  
|--cpu|CPU requirements of the algorithm in cores |number|||  
|--gpu|GPU requirements of the algorithm in cores |number|||  
|--mem|memory requirements of the algorithm. Possible units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi|string|||  
|--noWait|if true, does not wait for the build to finish  |boolean||false|  
|--setCurrent|if true, sets the new version as the current version|boolean||false|  
#### list  
  
```shell  
$ hkubectl algorithm list   
```  
Lists all registered algorithms    
#### get  
  
```shell  
$ hkubectl algorithm get < name >  
```  
Gets an algorithm by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|true||  
#### delete  
  
```shell  
$ hkubectl algorithm delete < name >  
```  
Deletes an algorithm by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|true||  
#### version  
  
```shell  
$ hkubectl algorithm version < name >  
```  
Gets versions of algorithm    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|true||  
|--setCurrent, --set|Sets the current version|string|||  
|--force|If true forces the change of the version (might stop running pipelines)|boolean|||  
### pipeline  
---  
```shell  
$ hkubectl pipeline < command >  
```  
Manage loaded algorithms    
#### get  
  
```shell  
$ hkubectl pipeline get [ name ]  
```  
Gets an pipeline by name    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|name|The name of the algorithm|string|||  
#### store  
  
```shell  
$ hkubectl pipeline store   
```  
Store pipeline    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|--file, -f|path for descriptor file|string|true||  
|--readmeFile|path for readme file. example: --readmeFile="./readme.md |string|||  
### sync  
---  
```shell  
$ hkubectl sync < command >  
```  
sync local source folder into algorithm container in the cluster    
#### watch  
  
```shell  
$ hkubectl sync watch   
```  
watch a local folder    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|--algorithmName, -a|The name of the algorithm to sync data into  [required]|string|true||  
|--folder, -f|local folder to sync.|string||./|  
|--bidirectional, --bidi|Sync files in both ways|boolean||false|  
#### create  
  
```shell  
$ hkubectl sync create   
```  
creates the algorithm for development.    
Options:    

  
|option|description|type|required|default|  
|---|---|---|---|---|  
|--algorithmName, -a|The name of the algorithm|string|true||  
|--folder, -f|local folder to build from.|string||./|  
|--env|algorithm runtime environment  [choices: "python", "nodejs"]|string|||  
|--entryPoint, -e|the main file of the algorithm|string|||  
|--baseImage|base image for the algorithm|string|||  
### config  
---  
```shell  
$ hkubectl config [ command ]  
```  
Set configuration options for hkubectl    
#### set  
  
```shell  
$ hkubectl config set   
```  
Sets configuration options.    
#### get  
  
```shell  
$ hkubectl config get   
```  
Gets the current configuration.  