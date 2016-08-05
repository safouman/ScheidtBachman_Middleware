class calypsoValidator:
    def __init__(self):
        # VARIABLES CARTE CALYPSO*******************************
        self.EnvNetworkId = None
        self.EnvApplicationIssuerId = None
        EventDateStamp = None
        EventTimeStamp = None

        self.codeCarte = None
    def Validate(self, Trame):
            # remove spaces from string
            self.codeCarte = Trame

            self.codeCarte.replace(" ", "")
            # length of the code


            codeCarteLength = len(self.codeCarte)

            # remove ; and M
            if self.codeCarte.startswith(';') or self.codeCarte.startswith('M'):
                self.codeCarte = self.codeCarte[1:]

            if (codeCarteLength > 40 and codeCarteLength <= 80):
                try:
                   # # Recup  #  EnvNetworkId   #  et  #  conversion
                    self.EnvNetworkId = self.codeCarte[:24]
                    i=int(self.EnvNetworkId)


                    self.EnvNetworkId = hex(i)
                     if ("250920"== self.EnvNetworkId):
                         # // EnvApplication IssuerId et conversion
                         self.EnvApplicationIssuerId = (self.codeCarte[25:32])

                         i2 = int(self.EnvApplicationIssuerId)
                         self.EnvApplicationIssuerId = hex(i2)
                         #DEUXIEME  CONDITION
                         if ("4"== self.EnvApplicationIssuerId):

                             # // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
                             # // Recup
                             # EventDateStamp
                             # // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
                             #
                             # // Date
                             # et
                             # heure
                             # de
                             # depart

                             day = 1

                             month = 0

                             year = 1997

                             hour = 0

                             minute = 0

                             second = 0

                             # // Recup
                             # date
                             # depuis
                             # la
                             # trame

                             self.EventDateStamp = (self.codeCarte[32, 46]

                             # Conversion

                             i3 = int(self.EventDateStamp)


                             # // Creation
                             # Instance
                             # Calandrier
                             # avec
                             # la
                             # Date
                             # et
                             # Heure
                             # par
                             # default
                             # Calendar
                             cal = Calendar.getInstance();
                             DateFormat
                             df = new
                             SimpleDateFormat("dd/MM/yyyy hh:mm aaa");
                             cal.set(annee, mois, jour, heure, minute, seconde);
                             String
                             d1 = df.format(cal.getTime());
                             // Affichage
                             Date
                             et
                             HEure
                             de
                             base \
                             // jLabel35.setText(d1);

                             // Ajout
                             a
                             la
                             date
                             de
                             base
                             les
                             jours
                             extrait
                             depuis
                             la
                             trame
                             cal.add(Calendar.DAY_OF_MONTH, i3);
                             String
                             d2 = df.format(cal.getTime());
                             // Affichage \
                                // jLabel36.setText(d2);

                             // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
                             // Recup
                             EventTimeStamp
                             // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **

                             // REcup
                             heure
                             depuis
                             la
                             trame
                             EventTimeStamp = (CodeCarte.substring(46, 57));
                             // jLabel38.setText(EventTimeStamp);
                             // Conversion
                             et
                             Affichage
                             valuer
                             en
                             Minutes
                             int
                             i4 = Integer.parseInt(EventTimeStamp, 2);
                             // jLabel39.setText(String.valueOf(i4));

                             // PArtage
                             des
                             Minutes
                             en
                             Heure - Minute
                             heure = i4 / 60;
                             minute = i4 % 60;
                             // jLabel41.setText(heure + ":" + minute + ":00");

                             // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *
                             // Ajout
                             des
                             minutes
                             a
                             la
                             date
                             CAL
                             cal.add(Calendar.MINUTE, i4);
                             d2 = df.format(cal.getTime());
                             // jLabel36.setText(d2);

                             // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
                             // EVALUATION
                             TRAITEMENT
                             // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **

                             Calendar
                             CalNow = Calendar.getInstance();
                             d3 = df.format(CalNow.getTime());
                             // jLabel66.setText(d3);

                             long
                             DifferencielLong = (CalNow.getTimeInMillis() - cal.getTimeInMillis());
                             int
                             DifferencielInt = Math.round((DifferencielLong / (60 * 1000)));
                             // jLabel67.setText(String.valueOf(DifferencielInt));

                             if (DifferencielInt >= 0 & DifferencielInt <= TempsDepuisDerniereValidation){

                             Status = "OK-12345-STATUS OK--TICKET VALIDE";
                             }
                             // ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
                             }

                             }
