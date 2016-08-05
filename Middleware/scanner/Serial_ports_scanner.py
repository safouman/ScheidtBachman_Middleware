# import pyudev
# context = pyudev.Context()
# finaldata={"result":[]}
# i=0
# for device in context.list_devices(ID_BUS='usb'):
#          Name = device.get('ID_SERIAL')
#
#          VendorID=device.get('ID_VENDOR_ID')
#          Prod_ID = device.get('ID_MODEL_ID')
#          Subsystem = device.get('SUBSYSTEM')
#          path=device.get('DEVNAME')
#
#          finaldata["result"].append(
#              {'id':i,'Name':Name,'VendorID': VendorID, 'ProductID': Prod_ID,'Subsystem':Subsystem,'Path':path} )
#          i=i+1
#
import logging
import time

from logging.handlers import RotatingFileHandler

#----------------------------------------------------------------------
def create_rotating_log(path):
    """
    Creates a rotating log
    """
    logger = logging.getLogger("Rotating Log")
    logger.setLevel(logging.INFO)

    # add a rotating handler
    handler = RotatingFileHandler(path, maxBytes=5*1024*1024,
                                  backupCount=1)
    logger.addHandler(handler)

    for i in range(4):
        logger.info("This is test log line %s" % i)


#----------------------------------------------------------------------
if __name__ == "__main__":
    log_file = "test.log"
    create_rotating_log(log_file)