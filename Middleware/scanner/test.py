#!/usr/bin/env python

import functools
import os.path
import pyudev
import logging
import subprocess


def main():
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger("Device event monitoring")

    #log handler
    handler = logging.FileHandler('monitor.log')
    handler.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)

    logger.addHandler(handler)
    BASE_PATH = os.path.abspath(os.path.dirname(__file__))
    path = functools.partial(os.path.join, BASE_PATH)
    #call = lambda x, *args: subprocess.call([path(x)] + list(args))

    context = pyudev.Context()
    monitor = pyudev.Monitor.from_netlink(context)
    monitor.filter_by(subsystem='usb')  # Remove this line to listen for all devices.
    logger.info('starting monitor')
    monitor.start()

    for device in iter(monitor.poll, None):
        # I can add more logic here, to run only certain kinds of devices are plugged.
        #if 'usb_device' in device.get('DEVTYPE'):
            print('action: {2} {1} ({0}) '.format(device.get('ID_MODEL'), device.get('DEVTYPE'),device.action))
            logger.debug(' Device model: %s Device type: %s Device action: %s',device.get('ID_MODEL'), device.get('DEVTYPE'),device.action)
            print device
if __name__ == '__main__':
    main()