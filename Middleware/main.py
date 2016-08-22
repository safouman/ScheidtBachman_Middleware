from Logging_Config.Logger import Logger
from Thread_Handlers.Serial_listener import Serial_listener
from Thread_Handlers.Device_thread import Device_thread
from collections import namedtuple
import json


source_serial="/dev/ttyUSB0"
source="/dev/hidraw0"
destination="/dev/ttyUSB0"
name="IDTECH"



#
logger=Logger('Main').get()

if  __name__ == "__main__":
    logger.info('Main is starting ')
    try:

        settings = namedtuple('settings', 'Name, IO, Path, Baudrate, Send, VendorID, ProductID, Subsystem')
        logger.info("Loading Settings...")
        with open('Device_config.json') as data_file:
            data = json.load(data_file)

        params = [settings(**k) for k in data["settings"]]


        logger.info("Creating Threads...")
        Threads = [Device_thread(idx, val.Name, val.Path, destination, val.Subsystem, val.Send, val.Baudrate) for idx, val
                   in enumerate(params)]
        logger.info("Starting Threads")
        for thread in Threads:
            thread.start()
    except Exception as e:
        logger.error("Error in Main",e)