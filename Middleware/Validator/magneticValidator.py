import datetime
import time

class magneticValidator :

    def __init__(self):



             #DECLARATION VARIABLES MAGNETIQUE**********************************
         self.CodeAppli = None #/Code for the City Toulon,  ex. 712

         self.TypeOfCard = None #Type of Card, ex. 02

         self.LMinObli = 0 #Variable Horodate d obliteration

         self.DeltaMin2 = 0#Variable Delta Minutes

         self.TotalTimeTicket = None #total time on magnetic ticket  = TotalTimeTicket=LMinObli + DeltaMin2

         self.TempsDepuisDerniereValidation = 60# TEMPS definit depuis derniere validation

         self.TotalTimeNow = None

         self.codeCarte=None



         self.dayOfYear = datetime.date.today().strftime("%j")

         self.DayNow = datetime.date.today().strftime("%d")

         self.MonthNow = datetime.date.today().strftime("%B")

         self.YearNow = datetime.date.today().strftime("%Y")

         self.TimeHHNow = datetime.datetime.now().hour

         self.TimeMiNow = datetime.datetime.now().min

         #DECLARATION VARIABLES CARTE CALYPSO*******************************
         EnvNetworkId = None
         EnvApplicationIssuerId = None
         EventDateStamp = None
         EventTimeStamp= None






       #DECLARATION GLOBAL VARS

    Status = "KO-99999--STATUS KO"# Resultat de evaluation


      #CALCUL DayNow// MOIS// ANNEE// HEURE// MINUTES actuel



    def Validate(self,Trame):


        #remove spaces from string
            self.codeCarte=Trame


            self.codeCarte.replace(" ", "")
        #length of the code


            codeCarteLength=len(self.codeCarte)


        # remove ; and M
            if self.codeCarte.startswith(';') or self.codeCarte.startswith('M'):
                self.codeCarte=self.codeCarte[1:]



            if(codeCarteLength >0 and codeCarteLength<40 ):
                try:
                    self.CodeAppli=self.codeCarte[:3]

                    self.TypeOfCard = self.codeCarte[3:5]

                    if self.CodeAppli == 712 :
                        if(self.TypeOfCard in [35,36,37,93,94,95]):

                            self.LMinObli = self.codeCarte[11:17]
                            self.DeltaMin2=self.codeCarte[17:20]

                        elif (self.TypeOfCard in [2,5,11,12,13,14,19,90,91,92,73]):

                            self.LMinObli = self.codeCarte[15:21]
                            self.DeltaMin2=self.codeCarte[21:24]

                        if self.LMinObli < 600000 :

                            self.TotalTimeTicket = self.LMinObli + self.DeltaMin2
                            self.TotalTimeNow = (self.dayOfYear *1440) + (self.TimeHHNow *60) + self.TimeMiNow

                            if (self.TotalTimeNow-self.TotalTimeTicket) <= self.TempsDepuisDerniereValidation:
                                self.Status = "OK-12345-STATUS OK--voir ??? DeltaMin2 <= 60"
                            elif self.DeltaMin2 <= self.TempsDepuisDerniereValidation:
                                self.Status = "OK-12345-STATUS OK--voir ??? DeltaMin2 <= 60"




                except (RuntimeError, TypeError, NameError):

                    print("Error", NameError)
            return self.Status

v=Validator()
print (v.Validate("712352272031105480000001000100"))




