
UPLOAD_FOLDER = '../../Uploads/'
from Logging_Config.Logger import Logger
import os

import subprocess
logger=Logger('Middleware_handler').get()
# os.chdir(UPLOAD_FOLDER)
def Middleware_handler(filename="test.py"):
    logger.info('Middleware starting')
    #check if file exist
    try:
        if(os.path.isfile(UPLOAD_FOLDER+filename)):
            logger.info("file exists")
            if(filename.endswith('py')):
                #execute python
                out = subprocess.check_output(["python", UPLOAD_FOLDER+"test.py"])
                return out
            elif(filename.endswith('jar')):
                #execute java
                pass
            elif(filename.endswith('bash')):
                #run shell
                pass

    except Exception as e:
        logger.error("Error",e)


print Middleware_handler()