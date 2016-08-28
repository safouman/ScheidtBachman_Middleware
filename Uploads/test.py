import argparse
from Logging_Config.Logger import Logger

parser = argparse.ArgumentParser(
    description='THIS SCRIPT SERVES AS A MIDDLEWARE FOR INPUT DATA YOU CAN MODIFY YOUR DATA HERE ')
parser.add_argument('-i', '--input', help='Input data', required=True)
parser.add_argument('-n', '--name', help='Name', required=True)
args = parser.parse_args()

logger = Logger(args.input).get()
try:

    # ADDING ARGUMENT TO THE SCRIPT


    logger.info("%s  ready to start",args.name)
    # HERE YOU CAN DO WHATEVER YOU WANT WITH THE INPUT DATA
    logger.info("Received data: %s ", str(args.input))

    ##############################START CODING FROM HERE###################"


    # YOU NEED TO PRINT YOUR OUTPUT SO THE APP CAN CATCH IT
    print args.input+'555555'

except Exception as e:
    logger.error('ERROR %s', e)
