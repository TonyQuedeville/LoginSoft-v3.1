# -*- coding: utf-8 -*-
"""
Created on 24/04/2020
@author: Tony Quedeville

"""

import sys
from pathlib import Path
import os # Sert aux fonctions pour le path
import webbrowser # sert à ouvrir le navigateur Chrome

from flask import Flask, jsonify, render_template, request

from DataFichier import *
from Filtre import *
from Statistique import *

class InterfaceWeb():
    # Initialisation ---------------------------------------------------------
    def __init__(self):  # Constructeur
        
        print(os.getlogin()) # mon login
        print(os.getcwd())

        # Fichier source
        # self.path = "Users/mr/PycharmProjects/Login Soft v3.1/data"
        self.path = os.getcwd()+"/data"
        self.fichier_source = ["PEDSoftActivity1.log","PEDSoftActivity2.log", "PEDSoftActivity3.log"]
        self.Fichier_softExclu = "SoftExclu.csv"
        
        if os.path.exists(self.path + "/" + self.fichier_source[0]):
            # Chargement des données
            self.df = DataFichier(self.path, self.fichier_source)
            print(str(self.df))
            #--- 
            
            # Initialisation des filtres
            self.filtre = Filtre(self.df.data_source, self.path + "/" + self.Fichier_softExclu)
            #---""" 
            
            # Données statistiques
            self.stat = Statistique(self.filtre.data)
            #---"""
            
            # IHM Web
            # webbrowser.open("http://localhost:5000/", 1)
            # http://127.0.0.1:5000/
            self.createApp()
            #---"""
        else:
            print("Erreur path : def__init__(self) ")
            # print("Veuillez copier le fichier source " + self.fichier_source + " dans le dossier " + self.path + " Merci !")
            # os.startfile(self.path)
            pass
        #---             
    # ------------------------------------------------------------------------

    # IHM app Web
    def createApp(self):
        app = Flask(__name__)
        
      # Initialisation
        @app.route("/")
        def pageIHM():  
            # ré-initialisation des résultats statistiques à chaque rafraichissement de page.
            self.stat.data_stat = 0
            self.stat.data_stat_soft = 0
            self.stat.data_stat_login = 0
            
            return render_template("loginSoft.html")
        
        @app.route("/initFiltreJson/")
        def initFiltreJson():            
            initFiltre = {
                    'dateDebutFichier' : self.filtre.dateDebutFichier,
                    'dateFinFichier' : self.filtre.dateFinFichier,
                    'debutPeriode' : self.filtre.debutPeriode,
                    'finPeriode' : self.filtre.finPeriode,
                    'logiciels' : sorted(self.filtre.data["Soft"].unique()), # Ordre alphabetique sorted()
                    'logiciel' : self.filtre.logiciel,                    
                    'LogicielsExclus' : self.filtre.softExclu,
                    'versions': self.filtre.listVersions,
                    'version': self.filtre.version,
                    'utilisateurs' : sorted(self.filtre.data["Login"].unique()), # Ordre alphabetique sorted()
                    'utilisateur' : self.filtre.utilisateur,
                    'postes' : self.filtre.listPostes,
                    'poste' : self.filtre.poste
                    }

            return jsonify(initFiltre)
      #---"""
            
      # Update filtres et période
        @app.route("/updateFiltreJson/")
        def updateFiltreJson():  
            if request.args.get('debutPeriode') >= self.filtre.dateDebutFichier and request.args.get('debutPeriode') < self.filtre.dateFinFichier :
                self.filtre.debutPeriode = request.args.get('debutPeriode')
            else:
                sys.exit()
            if request.args.get('finPeriode') <= self.filtre.dateFinFichier and request.args.get('finPeriode') > self.filtre.dateDebutFichier :
                self.filtre.finPeriode = request.args.get('finPeriode') 
            else:
                sys.exit()
                
            self.filtre.logiciel = request.args.get('logiciel')
            self.filtre.version = request.args.get('version')
            self.filtre.utilisateur = request.args.get('utilisateur')
            self.filtre.poste = request.args.get('poste')
            
            self.filtre.update_liste_version()
            self.filtre.update_liste_poste()
            self.filtre.update_filtre()
            
            updateFiltre = {
                    'debutPeriode' : self.filtre.debutPeriode,
                    'finPeriode' : self.filtre.finPeriode,
                    'logiciels' : sorted(self.filtre.data["Soft"].unique()), # sorted() Ordre alphabetique 
                    'logiciel' : self.filtre.logiciel,
                    'versions': self.filtre.listVersions,
                    'version': self.filtre.version,
                    'utilisateurs' : sorted(self.filtre.data["Login"].unique()), # sorted() Ordre alphabetique 
                    'utilisateur' : self.filtre.utilisateur,
                    'postes' : self.filtre.listPostes,
                    'poste' : self.filtre.poste
                    }

            return jsonify(updateFiltre)
      #---"""
      
      # Calcul de stat
        @app.route("/calculStatJson/")
        def calculStatJson():
            self.filtre.debutPeriode = request.args.get('debutPeriode')
            self.filtre.finPeriode = request.args.get('finPeriode')
            self.filtre.logiciel = request.args.get('logiciel')
            self.filtre.version = request.args.get('version')
            self.filtre.utilisateur = request.args.get('utilisateur')
            self.filtre.poste = request.args.get('poste')
            
            self.filtre.update_filtre()
            self.stat.calcul_stat(self.filtre.data)
        
            print(self.stat.data_stat)
            return jsonify(self.stat.data_stat)
      #---"""
      
      # Exportation
        @app.route("/exportCsv/")
        def exportCsv():
            """ Crée un fichiers de resultat.csv """
            if self.df.ecrire_csv(os.getcwd()+"/data/Rapport de statistique soft.csv", self.stat.data_stat_soft):
                pathExport = "Exportation csv réussie !" 
                os.startfile(os.getcwd()+"/data/Rapport de statistique soft.csv")             
            else:
                pathExport = "Echec d'exportation csv soft !"  
            
            if self.df.ecrire_csv(os.getcwd()+"/data/Rapport de statistique login.csv", self.stat.data_stat_login):
                pathExport = "Exportation csv réussie !" 
                os.startfile(os.getcwd()+"/data/Rapport de statistique login.csv")               
            else:
                pathExport = "Echec d'exportation csv login !"  
        
            return jsonify({'path' : pathExport})
        
      
        @app.route("/exportJson/")
        def exportJson():
            """ Crée un fichier de resultat Json .json """
            if self.df.ecrire_json(os.getcwd()+"/data/Rapport de statistique soft.json", self.stat.data_stat_soft):
                pathExport = "Exportation json réussie !" 
                os.startfile(os.getcwd()+"/data/Rapport de statistique soft.json") 
            else:
                pathExport = "Echec d'exportation soft json !" 
                
            if self.df.ecrire_json(os.getcwd()+"/data/Rapport de statistique login.json", self.stat.data_stat_login):
                pathExport = "Exportation json réussie !" 
                os.startfile(os.getcwd()+"/data/Rapport de statistique login.json") 
            else:
                pathExport = "Echec d'exportation login json !" 
                
            return jsonify({'path' : pathExport}) 
        
        
        @app.route("/exportExcel/")
        def exportExcel():
            """ Crée un fichier de resultat Excel .xlsx """
            if self.df.ecrire_excel(os.getcwd()+"/data/Rapport de statistique.xlsx", self.stat.data_stat_soft, self.stat.data_stat_login, 
                                    self.filtre.debutPeriode,
                                    self.filtre.finPeriode
                                    ):
                pathExport = "Exportation Excel réussie !" 
                #os.startfile(os.getcwd()+"/data") 
            else:
                pathExport = "Echec d'exportation Excel !" # (le fichier ne peut-être édité si il est déjà ouvert.)"
            
            return jsonify({'path' : pathExport})
      #---"""
      
      # Exclusion logiciel
        @app.route("/exclureSoftJson/")
        def exclureSoftJson():
            self.filtre.softExclu['soft'] = request.args.get('softExclu')
            #define true = True
            if request.args.get('statutExclu') == "false":
                self.filtre.softExclu['statutExclu'] = 1
            else:
                self.filtre.softExclu['statutExclu'] = 0
                  
            self.filtre.update_ListExclu()
                  
            if self.filtre.ecrire_soft_exclu_csv(self.path + "/" + self.Fichier_softExclu):
                mess = "Logiciel exclus sauvegardée !"
                #os.startfile(self.path + "\\" + self.Fichier_softExclu) 
                sauvegarde = 1
            else:
                mess = "Echec de sauvegarde de la liste des logiciels exclus !" 
                sauvegarde = 0

            return jsonify({'Sauvegarde' : sauvegarde, 'Message' : mess})
        #---"""      
      
        @app.route("/softExcluJson/")
        def softExcluJson():    
            self.filtre.update_ListExclu()
            
            # Json 
            data_softExclu = []
            data_statutExclu = []
            
            dfItem = self.filtre.dflistExclu 
            dfItem = dfItem.reset_index() # l'ancien index est ajouté sous forme de colonne et un nouvel index séquentiel est utilisé.
            dfItem.columns = ['softExclu', 'statutExclu'] 
            dfItem.fillna('', inplace = True)
          
            for index, softExclu in dfItem.iterrows(): 
                data_softExclu.append(softExclu['softExclu'])
                data_statutExclu.append(softExclu['statutExclu'])
            
            return jsonify({'softExclu' : data_softExclu, 'statutExclu' : data_statutExclu})
      #---"""      
      
      # Lancement de l'appli serveur
        app.run()   
    # ------------------------------------------------------------------------ 
    
# ----------------------------------------------------------------------------------------------------------------------------------------------------------    
    
if __name__ =="__main__":	   # --- Programme de test ---
    InterfaceWeb()    
    