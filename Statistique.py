# -*- coding: utf-8 -*-
"""
Created on Sun May  3 14:37:46 2020

@author: user
"""

import time
import math
import numpy as np
import pandas as pd


class Statistique():
    def __init__(self, data):  # Constructeur
        self.data = data
        self.data_stat = 0
        self.data_stat_soft = 0
        self.data_stat_login = 0
    # ----------------------------------------------------------------------------    

    # Statistiques          
    def calcul_stat(self, data):  
        """ Calcul le nombre de connection, moyenne, ecart type, mini et maxi des temps de connection et nombre d'input utilisateur
        en fonction des periode et filtres par Soft et Login selectionnés dans les comboboxs. 
        Fonction lancée par le bouton "Calculer statistique"
        """    
        start_time = time.time() # Temps d'execution start
        
        self.data = data
        print(self.data)
           
        data_result_soft, self.data_stat_soft = self.parcours_data_unique("Soft")
        if len(self.data_stat_soft) == 1:
            data_result_soft, self.data_stat_soft = self.parcours_data_unique("Version") # Filtre secondaire Soft
        
        data_result_login, self.data_stat_login = self.parcours_data_unique("Login")
        if len(self.data_stat_login) == 1:
            data_result_login, self.data_stat_login = self.parcours_data_unique("Post") # Filtre secondaire Login
            
        self.data_stat = {
                  'resultSoft' : data_result_soft,
                  'resultLogin' : data_result_login
                 }  
        
        print("Temps d execution : %s secondes ---" % (time.time() - start_time)) # Temps d'execution end
    #---"""
    
    def parcours_data_unique(self, nomCol):  
        data_json = []

        try:
            df = self.data.groupby([nomCol])["CRC"].agg({'Connexion': 'nunique'})
            connexionMax = df.max().item() # .item() converti le type numpy.int64 en int
            connexionSum = df.sum().item()
            
            df['Tps moyen'] = round(self.data.groupby([nomCol])["Connect"].agg({'Tps moyen': 'mean'}),2).fillna(0)
            tpsMoyenMax = df['Tps moyen'].max().item() # .item() converti le type numpy.float64 en float
            
            df['Ecart type'] = (round(self.data.groupby([nomCol])["Connect"].agg({'Ecart type': 'std'}),2)).fillna(0)     
            ecartTypeMax = df['Ecart type'].max().item() 
            
            df['Mini'] = self.data.groupby([nomCol])["Connect"].agg({'Mini': 'min'}).fillna(0)
            miniMax = df['Mini'].max().item()
            
            df['Maxi'] = self.data.groupby([nomCol])["Connect"].agg({'Maxi': 'max'}).fillna(0)
            maxiMax = df['Maxi'].max().item()
            
            df['Nb_Input'] = self.data.groupby([nomCol])["Input"].agg({'Nb_Input': 'sum'}).fillna(0)
            inputMax = df['Nb_Input'].max().item()
            inputSum = df['Nb_Input'].sum().item()
            #print(inputSum)

            # Construction de la liste Json
            dfItem = df
            dfItem = dfItem.reset_index() # l'ancien index est ajouté sous forme de colonne et un nouvel index séquentiel est utilisé.
            dfItem.columns = ['x', 'Connexion', 'Tps moyen', 'Ecart type', 'Mini', 'Maxi', 'Input']
            trs_df = dfItem.T
            liste_Json = trs_df.to_dict()        
            for idJson in liste_Json:
                data_json.append(liste_Json[idJson])
            #---"""
            
            sumData = [connexionSum, inputSum] # Somme des nombres de connexion et input 
            maxData = [connexionMax, tpsMoyenMax, ecartTypeMax, miniMax, maxiMax, inputMax] # Valeur maxi de chaque colonne pour le calcul de la cesure graphique
        
        except ValueError:
            print("Pas de statistique possible pour ces critères !")
            
            # création de données vides pour éviter l'erreur coté client
            dfItem = pd.DataFrame(columns = ['x', 'Connexion', 'Tps moyen', 'Ecart type', 'Mini', 'Maxi', 'Input'])
            trs_df = dfItem.T
            liste_Json = trs_df.to_dict()        
            for idJson in liste_Json:
                data_json.append(liste_Json[idJson])
            
            sumData = [0, 0]
            maxData = [0, 0, 0, 0, 0, 0]
            
        except:
            print("Erreur Calcul Stat !")
            df = None
            sumData = [0, 0]
            maxData = [0, 0, 0, 0, 0, 0]
            pass

        return {'chartData' : data_json,'maxData' : maxData, 'sumData' : sumData}, df
        #---"""
        
    # -------------------------------------------------------------------------