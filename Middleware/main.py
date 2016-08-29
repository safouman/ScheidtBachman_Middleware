from Logging_Config.Logger import Logger
from Thread_Handlers.Serial_listener import Serial_listener
from Thread_Handlers.Device_thread import Device_thread
from collections import namedtuple
import json



destination="/dev/ttyUSB0"



#
logger=Logger('Main').get()

if  __name__ == "__main__":
    logger.info('Main is starting ')
    try:

        settings = namedtuple('settings', 'Name, Output, Path, Baudrate, Send, VendorID, ProductID, Subsystem, Process,confirmed,ID')
        logger.info("Loading Settings...")
        with open('Device_config.json') as data_file:
            data = json.load(data_file)




        logger.info('creating params..')

        params = [settings(**k) for k in data["settings"]]

        # for i in params:
        #         if i[1]==True:
        #             destination= i[2]
        #             params.pop(params.index(i))
        # if not destination.startswith('/dev/tty'):
        #        raise Exception("Destination path is not a serial device !")
        #





        logger.info("Creating Threads...")
        Threads = [Device_thread(idx, val.Name, val.Path, destination, val.Subsystem,val.Process, val.Send, val.Baudrate) for idx, val
                   in enumerate(params)]
        logger.info("Starting Threads")
        for thread in Threads:
            thread.start()
    except Exception as e:
        logger.error("Error in Main %s",e)