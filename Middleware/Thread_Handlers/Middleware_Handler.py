
UPLOAD_FOLDER = '../Uploads/'
from Logging_Config.Logger import Logger
import os

import subprocess

# os.chdir(UPLOAD_FOLDER)
def Middleware_handler(filename="java_sample.jar",data='99999'):
    logger = Logger('Middleware_handler').get()

    logger = Logger(filename).get()
    #check if file exist
    try:

        if(os.path.isfile(UPLOAD_FOLDER+filename)):
            logger.info("file exists")
            if(filename.endswith('py')):
                #execute python
                logger.info("Middleware is a python file")
                out = subprocess.check_output(["python", UPLOAD_FOLDER+"test.py","-i "+data, "-n "+filename])
                logger.info("%s returned: "+out,filename)
                return out
            elif(filename.endswith('jar')):
                #execute java
                logger.info("Middleware is jar file")
                out=subprocess.check_output(["java","-jar",UPLOAD_FOLDER+filename,data])
                logger.info('%s returned: '+out,filename)
                return out
            elif(filename.endswith('bash')):
                #run shell
                pass
        else:
            raise Exception('FILE NOT FOUND')

    except Exception as e:
        logger.error("Error, %s",e)



