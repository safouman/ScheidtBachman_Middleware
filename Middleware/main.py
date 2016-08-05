from Logging_Config.Logger import Logger
from Listener_Threads.Serial_listener import Serial_listener
from Listener_Threads.Device_thread import Device_thread
from collections import namedtuple
import json


source_serial="/dev/ttyUSB0"
source="/dev/hidraw0"
destination="/dev/ttyUSB0"
name="IDTECH"


settings = namedtuple('settings', 'Name, IO, Path, Baudrate, Send, VendorID, ProductID, Subsystem')
with open('Device_config.json') as data_file:
    data = json.load(data_file)

params=[settings(**k) for k in data["settings"]]


#create thread for each device
Threads=[Device_thread(idx,val.Name,val.Path,destination,val.Subsystem,val.Send,val.Baudrate) for idx, val in enumerate(params)]

for thread in Threads:
    thread.start()
# for idx, val in enumerate(params):
#
#
#         print(idx,val)
# start threads
#
#
#
#
#
# logger=Logger('Main').get()
#
# if  __name__ == "__main__":
#     logger.info('Main is starting ')
#     # my_serial =Serial_listener(1, name,source_serial,destination,send=True,baudrate=9600)
#     # my_serial.start()
#     my_usbthread=Device_thread(1,'IDTECH',source_serial,destination,"tty")
#     my_usbthread.start()
#     my_usbthread2 = Device_thread(2, 'ELATEC', source, destination, "hid")
#     my_usbthread2.start()
#
