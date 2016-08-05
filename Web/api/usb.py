import subprocess
import json
import re
import pyudev
import serial
import time
import multiprocessing


#List available Devices
def list_usb():

    # usb_list=filter(None, re.split('\n',subprocess.check_output('lsusb')))
    #
    #
    # temp_list=[]
    # data={}
    # for list in usb_list:
    #     temp_list.append(filter(None,re.split(':',list)))
    # for sub in temp_list:
    #
    #
    #
    #      data[sub[2]]=sub[1]
    #
    # finaldata= { "result": [{'VendorID': key, "ProductID": value} for key, value in data.items()]}
    # print finaldata

    context = pyudev.Context()
    finaldata = {"result": []}
    i = 0
    for device in context.list_devices(ID_BUS='usb' ):
        if(device.get('DEVNAME')!=None) and ((device.get('SUBSYSTEM')=='hidraw') or (device.get('SUBSYSTEM')=='tty')):
            Name = device.get('ID_SERIAL')

            VendorID = device.get('ID_VENDOR_ID')
            Prod_ID = device.get('ID_MODEL_ID')
            Subsystem = device.get('SUBSYSTEM')
            path = device.get('DEVNAME')

            finaldata["result"].append(
                {'id': i, 'Name': Name, 'VendorID': VendorID, 'ProductID': Prod_ID, 'Subsystem': Subsystem, 'Path': path})
            i = i + 1
    return (finaldata)
#Handles reading from HID and Serial Devices
def read_device(q,path,Subsystem):

    if(Subsystem=="tty"):
        try:
            ser = serial.Serial(path,timeout=30)
            read_result = ser.read(99)
            print("Read card {0}".format(read_result.decode(encoding='utf-8')))
            ser.flushInput()  # ignore errors, no data
            q.put(read_result)
        except (serial.SerialException):
            print(serial.SerialException)
    elif(Subsystem=="hidraw"):

        hid = {4: 'a', 5: 'b', 6: 'c', 7: 'd', 8: 'e', 9: 'f', 10: 'g', 11: 'h', 12: 'i', 13: 'j', 14: 'k', 15: 'l',
               16: 'm', 17: 'n', 18: 'o', 19: 'p', 20: 'q', 21: 'r', 22: 's', 23: 't', 24: 'u', 25: 'v', 26: 'w',
               27: 'x',
               28: 'y', 29: 'z', 30: '1', 31: '2', 32: '3', 33: '4', 34: '5', 35: '6', 36: '7', 37: '8', 38: '9',
               39: '0',
               44: ' ', 45: '-', 46: '=', 47: '[', 48: ']', 49: '\\', 51: ';', 52: '\'', 53: '~', 54: ',', 55: '.',
               56: '/'}

        hid2 = {4: 'A', 5: 'B', 6: 'C', 7: 'D', 8: 'E', 9: 'F', 10: 'G', 11: 'H', 12: 'I', 13: 'J', 14: 'K', 15: 'L',
                16: 'M', 17: 'N', 18: 'O', 19: 'P', 20: 'Q', 21: 'R', 22: 'S', 23: 'T', 24: 'U', 25: 'V', 26: 'W',
                27: 'X',
                28: 'Y', 29: 'Z', 30: '!', 31: '@', 32: '#', 33: '$', 34: '%', 35: '^', 36: '&', 37: '*', 38: '(',
                39: ')',
                44: ' ', 45: '_', 46: '+', 47: '{', 48: '}', 49: '|', 51: ':', 52: '"', 53: '~', 54: '<', 55: '>',
                56: '?'}
        try:


                fp = open(path, 'rb')

                ss = ""
                shift = False

                done = False

                while not done:

                    ## Get the character from the HID
                    buffer = fp.read(8)

                    for c in buffer:

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
                                    ss += hid2[int(ord(c))]
                                    shift = False

                            ##  If we are not shifted then use
                            ##  the hid characters

                            else:

                                ## If it is a '2' then it is the shift key
                                if int(ord(c)) == 2:
                                    shift = True

                                ## if not a 2 then lookup the mapping
                                else:
                                    ss += hid[int(ord(c))]
                q.put(ss)

        except Exception:
            print ("Request Timeout")

#thread to read form devices
def read_thread(path,Subsystem):
    #Create a thread so the reading doesn't hang ...
    q = multiprocessing.Queue()
    p = multiprocessing.Process(target=read_device, name="read_device", args=(q,path,Subsystem))
    try:
        p.start()

        result=q.get(True, 10)

        return result

    except Exception:
        print "request timeout"
        p.terminate()
        p.join()
        return "request timeout"
#send acknowledgement to output device (serial device)
def send_ack(path,baudrate=9600,Subsystem="tty",ack="AT+CSQ=?x0D"):
    if (Subsystem == "tty"):
        #TO DO: SEND AC K TO DEVICE
        # initialization and open the port
        ser = serial.Serial()
        ser.port =path
        ser.baudrate =baudrate
        ser.bytesize = serial.EIGHTBITS  # number of bits per bytes
        ser.timeout = 0  # non-block read
        try:
            ser.open()
        except Exception, e:
            print "error open serial port: " + str(e)

        if ser.isOpen():
            try:
                ser.flushInput()  # flush input buffer, discarding all its contents
                ser.flushOutput()  # flush output buffer, aborting current output
            # and discard all that is in buffer
            # write data
                ser.write(ack.encode())
                print("write data:"+ack)
                time.sleep(5)  #give the serial port sometime to receive the data
                response = ser.readline()
                print("read data: " + response)
                ser.close()
                return response
            except Exception, e1:
                print "error communicating...: " + str(e1)
                return "error communicating...: " + str(e1)

        else:
            print "cannot open serial port "
            return  "cannot open serial port "

    else:
        return "device not serial device"

def save_config(config):
    try:
        print config
        jsondata = json.dumps(config, indent=4, skipkeys=True, sort_keys=True)
        fd = open("/home/safwen/PycharmProjects/react-flask /app/api/config.json", 'w')
        fd.write(jsondata)
        fd.close()
        return "saved"
    except:
        print 'ERROR writing', "config.json"
        return 'ERROR writing', "config.json"







