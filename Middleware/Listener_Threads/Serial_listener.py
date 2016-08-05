import  threading
from Logging_Config.Logger import Logger
import serial
import time



class Serial_listener (threading.Thread):
    def __init__(self, threadID, name,source,destination,send=True,baudrate=9600):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.source=source
        self.logger = Logger(name).get()
        self.transaction=Logger('TRANSACTION_'+name).get()
        self.destination=destination
        self.baudrate=baudrate
        self.send=send
    #middleware will execute whatever process for the input
    def middleware(self,input_data):
        self.logger.debug("inside middleware")
        #execute the jar or script
        #return an output if send is true
        try:
            if self.send:
                #code to execute process file
                 output=input_data
                 self.logger.info("output returned to thread")

                 return output
            else:
                self.logger.info("output sent by middleware")
                #code to execute middleware file that handles sending to output will use the destination path

        except Exception as e:
            self.logger.error("Error executing middleware "+str(e))
    #send_output will send the output data to output device
    def send_output(self, output):

        # Send output to destination
        # initialization and port opening
        ser = serial.Serial()
        ser.port = self.destination
        ser.baudrate = self.baudrate
        ser.bytesize = serial.EIGHTBITS  # number of bits per bytes
        ser.timeout = 0  # non-block read
        try:
            ser.open()
        except Exception as e:
            self.logger.error("error open serial port: " + str(e))

        if ser.isOpen():
            try:
                ser.flushInput()  # flush input buffer, discarding all its contents
                ser.flushOutput()  # flush output buffer, aborting current output
                # and discard all that is in buffer
                # write data
                ser.write(output.encode())
                self.logger.info("writing data..")
                time.sleep(1)  # give the serial port sometime to receive the data

                response = ser.readline()
                self.logger.info('response data:"' + response + '"')
                ser.close()

            except Exception as e1:
                self.logger.error("error communicating...: " + str(e1))


        else:
            self.logger.error("cannot open serial port ")
    def run(self):



        try:
            self.logger.info('serial thread:' + self.name + 'is starting')
            #serial port will be imported from file
            ser  = serial.Serial(self.source,timeout = None)
            self.logger.info('source port set to '+self.source)

            while True:
                # read data
                # wait until the port has been properly opened

                #if ser.inWaiting() > 0:
                    self.logger.info("waiting for data...")
                    input_data = ser.read(99)
                    self.logger.info('reading data')
                    self.transaction.info("INPUT: {0}".format(input_data.decode(encoding='utf-8')))
                    self.logger.info("Sleeping 2 seconds")
                    time.sleep(2)
                    ser.flushInput()  # ignore errors, no data
                #

                #Execute middleware
                    # if send is true thread will handle sending to destination else it's the middleware
                    if self.send:
                            self.logger.info("Executing middleware")
                            output=self.middleware(input_data)
                            self.logger.debug("ouput from middleware:" + output)
                        #sending data to output
                            self.send_output(output)
                            self.transaction.info("OUTPUT: {0}".format(output.decode(encoding='utf-8')))

                    else:

                            #else middleware is sending output
                            self.logger.info("Executing middleware ")
                            self.middleware(input_data)

        except Exception as e :
            self.logger.error('Error  '+str(e))









