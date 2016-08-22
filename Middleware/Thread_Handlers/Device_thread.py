import  threading
from Logging_Config.Logger import Logger
import time
import serial
class Device_thread (threading.Thread):

    def __init__(self, threadID, name, source, destination, Subsystem ,send=True,baudrate=9600):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.source = source
        self.logger = Logger(name).get()
        self.transaction = Logger('TRANSACTION_'+name).get()
        self.destination = destination
        self.send = send
        self.Subsystem=Subsystem

        self.baudrate = baudrate
    def middleware(self,input_data):
        self.logger.debug("inside middleware")

        #execute code
        try:
            if self.send:
                #process data then return output
                output=input_data
                self.logger.info("returning output data")
                return output
            else:
                #execute process which will send data automatically
                self.logger.info("output sent by middleware")
        except Exception as e:
            self.logger.error("Error executing middleware "+str(e))


    def read_data_Serial(self,buffer):
        try:
            self.logger.info("waiting for data...")
            input_data = buffer.read(99)
            self.logger.info('reading data')

            self.logger.info("Sleeping 2 seconds")
            time.sleep(2)
            buffer.flushInput()  # ignore errors, no data
            return input_data
        except Exception as e:
            self.logger.error("Error reading data "+str(e))
            raise


    def read_data_HID(self,buffer):
        hid = {4: 'a', 5: 'b', 6: 'c', 7: 'd', 8: 'e', 9: 'f', 10: 'g', 11: 'h', 12: 'i', 13: 'j', 14: 'k', 15: 'l',
                   16: 'm', 17: 'n', 18: 'o', 19: 'p', 20: 'q', 21: 'r', 22: 's', 23: 't', 24: 'u', 25: 'v', 26: 'w',
                   27: 'x',
                   28: 'y', 29: 'z', 30: '1', 31: '2', 32: '3', 33: '4', 34: '5', 35: '6', 36: '7', 37: '8', 38: '9',
                   39: '0',
                   44: ' ', 45: '-', 46: '=', 47: '[', 48: ']', 49: '\\', 51: ';', 52: '\'', 53: '~', 54: ',', 55: '.',
                   56: '/'}
        hid2 = {4: 'A', 5: 'B', 6: 'C', 7: 'D', 8: 'E', 9: 'F', 10: 'G', 11: 'H', 12: 'I', 13: 'J', 14: 'K',
                15: 'L',
                16: 'M', 17: 'N', 18: 'O', 19: 'P', 20: 'Q', 21: 'R', 22: 'S', 23: 'T', 24: 'U', 25: 'V', 26: 'W',
                27: 'X',
                28: 'Y', 29: 'Z', 30: '!', 31: '@', 32: '#', 33: '$', 34: '%', 35: '^', 36: '&', 37: '*', 38: '(',
                39: ')',
                44: ' ', 45: '_', 46: '+', 47: '{', 48: '}', 49: '|', 51: ':', 52: '"', 53: '~', 54: '<', 55: '>',
                56: '?'}
        input_data = ""
        shift = False
        done = False

        # READ DATA UNTIL END OF STRING MET
        self.logger.info("Waiting for input data...")
        try:
            while not done:
                try:
                    ## Get the character from the HID
                    read = buffer.read(8)

                    for c in read:

                        if ord(c) > 0:

                            ##  40 is carriage return which signifies
                            ##  we are done looking for characters
                            if int(ord(c)) == 40:
                                done = True
                                break;

                            ##  If we are shifted then we have to
                            ##  use the hid2 characters.
                            if shift:

                                ## If it is a '2' then it is the shift key
                                if int(ord(c)) == 2:
                                    shift = True

                                ## if not a 2 then lookup the mapping
                                else:
                                    input_data += hid2[int(ord(c))]
                                    shift = False

                            ##  If we are not shifted then use
                            ##  the hid characters

                            else:

                                ## If it is a '2' then it is the shift key
                                if int(ord(c)) == 2:
                                    shift = True

                                ## if not a 2 then lookup the mapping
                                else:
                                    input_data += hid[int(ord(c))]

                except Exception as e:
                    self.logger.error("Error reading data " + str(e))
                    raise

            return input_data
        except Exception as e:
            self.logger.error("Error reading data"+str(e))
            raise
    def send_output(self, output):

        # Send output to destination
        # initialization and port opening
        ser = serial.Serial()
        ser.port = self.dest5ination
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
                self.logger.info("writing data to output device:" + output)
                time.sleep(5)  # give the serial port sometime to receive the data

                response = ser.read(99)
                self.logger.info('response data:"' + response + '"')
                ser.close()

            except Exception as e1:
                self.logger.error("error communicating...: " + str(e1))


        else:
            self.logger.error("cannot open serial port ")

    def initialize_device(self):
        if self.Subsystem == "tty":
            try:
                self.logger.info("initializing serial device " + self.name + " ...")
                ser = serial.Serial(self.source, timeout=None)
                self.logger.info('source port set to ' + self.source)
                return ser
            except Exception as e:
                self.logger.error("Error initializing serial device " + self.name +" "+ str(e))
                raise
        elif self.Subsystem == "hid":
            try:

                self.logger.info("initializing HID device " + self.name + " ...")
                buffer = open(self.source, 'rb')
                self.logger.info('source port set to ' + self.source)
                return buffer
            except Exception as e:

                self.logger.error("Error initializing HID device " + self.name+" "+ str(e))
                raise


    def run(self):

        try:
            self.logger.info('Thread ' + self.name + ' is starting...')
            self.logger.debug("initializing device " + self.source)
            try:
                buffer=self.initialize_device()
            except Exception as e:
                self.logger.error("Error in initialization"+ str(e))
                raise  SystemExit("Error in initialization"+ str(e))


            while True:

                    try:
                        #READ DATA FROM DEVICE
                        if self.Subsystem =="hid":
                            input_data=self.read_data_HID(buffer)
                        elif self.Subsystem =="tty":
                            input_data=self.read_data_Serial(buffer)

                        self.logger.info("read_data"+"'"+input_data+"'")
                        self.transaction.info("INPUT = "+input_data)
                        time.sleep(2)
                        #EXECUTE MIDDLEWARE AND SEND DATA TO OUTPUT
                        #MIDDLEWARE WILL SEND DATA IF SEND ARGUMENT IS FALSE
                        #THREAD WILL SEND DATA IF SEND IS TRUE
                        if self.send:
                            self.logger.info("Executing middlware")
                            output_data=self.middleware(input_data)
                            # self.logger.info("Sending data: "+output_data)
                            # self.send_output(output_data)
                            # self.transaction.info("OUTPUT: {0}".format(output_data.decode(encoding='utf-8')))
                        else:
                            self.logger.info("Executing middleware.. will handle sending data ")
                            self.middleware(input_data)


                    except Exception as e :
                        self.logger.error ("Error "+str(e))
                        break


        except Exception as e:

            self.logger.error("Error in thread"+str(e))
            exit(1)




