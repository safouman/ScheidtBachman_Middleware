import os
import logging
import settings   # alternativly from whereever import settings
from logging.handlers import RotatingFileHandler
from logging.handlers import TimedRotatingFileHandler
import datetime
import json_log_formatter

class Logger(object):

    def __init__(self, name):
        name = name.replace('.log','')
        logger = logging.getLogger(name)    # log_namespace can be replaced with your namespace
        logger.setLevel(logging.DEBUG)
        if not logger.handlers:

            # create console handler with a higher log level
            console = logging.StreamHandler()
            file_name = os.path.join(settings.LOGGING_DIR, '%s.log' % name)

            # if(type =='tansaction'):
            #     file_name = os.path.join(settings.LOGGING_DIR, 'transaction.log' )
            #
            #     # handler=TimedRotatingFileHandler(file_name,
            #     #                        when="m",
            #     #                        interval=1,
            #     #                        backupCount=5)



            handler = RotatingFileHandler(file_name,maxBytes=50*1024*1024,
                                  backupCount=1)
            formatter = CustomisedJSONFormatter()
                #logging.Formatter('%(asctime)s %(levelname)s:%(name)s %(message)s Module: %(module)s Line:%(lineno)s Function: %(funcName)s')
            handler.setFormatter(formatter)
            console.setFormatter(formatter)
            handler.setLevel(logging.DEBUG)
            console.setLevel(logging.DEBUG)
            logger.addHandler(handler)
            logger.addHandler(console)
        self._logger = logger

    def get(self):
        return self._logger


class CustomisedJSONFormatter(json_log_formatter.JSONFormatter):
    def json_record(self, message, extra, record):
        extra['TimeStamp'] = datetime.datetime.now()
        extra['Message'] = message,
        extra['LevelName'] = record.__dict__['levelname'],
        extra['Source'] = record.__dict__['threadName'],
        extra['Function Name']=record.__dict__['funcName'],

        return extra