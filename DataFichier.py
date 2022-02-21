# -*- coding: utf-8 -*-
"""
Created on Fri Aug 23 15:21:28 2019

@author: tquedeville

Liens utiles Excel :
Tuto Excel Pandas: https://xlsxwriter.readthedocs.io/working_with_pandas.html
Exemples chart Excel : https://pandas-xlsxwriter-charts.readthedocs.io/chart_examples.html
docs tutos : https://xlsxwriter.readthedocs.io/index.html
docs macro vba : https://xlsxwriter.readthedocs.io/worksheet.html#insert_chart
Format de mise en forme : https://xlsxwriter.readthedocs.io/format.html

"""

import numpy as np
import pandas as pd
import os

# import win32com.client as win32
from tkinter.messagebox import *


class DataFichier():
    def __init__(self, path, fichier_source):  # Constructeur 
        self.path = path 
        self.fichier_source = fichier_source
        self.data_source = pd.DataFrame()
        self.df = pd.DataFrame()

        for i in range(len(self.fichier_source)):
            dfConcat = self.data_source
            self.lire_csv(i, False)
            self.data_source = pd.concat([dfConcat, self.df], ignore_index=True)
            
        self.data_source = self.data_source.drop_duplicates()
        #---"""        
    # ----------------------------------------------------------------------------    
    
    # Lecture du fichier source.
    def lire_csv(self, i, header=False):
        """ Lit un fichier.csv et stock les données dans le dataframe pandas"""
        try:
            self.df = pd.read_csv(self.path + "/" + self.fichier_source[i], sep=";",header=None,
                                   names=['Date-Time','CRC','Soft','Version','Post','Login','Activity','Comment']) 
            self.extract_tps_connect_input_user()            
            self.df = self.df.fillna(value='') 
            
            # conversion de type string en int
            self.df["Connect"] = pd.to_numeric(self.df["Connect"])
            self.df["Input"] = pd.to_numeric(self.df["Input"])        
        except Exception as error:  
            print(str(error))
            pass
    #---"""  
    
    # Extraction du temps de connexion et input utilisateur
    def extract_tps_connect_input_user(self):    
        """ Extrait de la colonne "Comment" les temps de connection et les inputs utilisateur, 
        les met dans 2 nouvelles colonnes et supprime la colonne "Comment". """
        # Ajoute 2 colonnes "temps de connection" et "input utilisateur" puis supprime la colonne "Comment"         
        self.df.insert(len(self.df.columns), "Connect", 
                    self.df["Comment"][self.df['Comment'].str.contains("Server connected in ", na=True)].str.replace("Server connected in ",'', case=False))
        self.df["Connect"] = self.df["Connect"].str.replace(" ms.",'', case=False)
        self.df["Connect"] = self.df["Connect"].fillna(value='')
        
        self.df.insert(len(self.df.columns), "Input", 
                    self.df["Comment"][self.df['Comment'].str.contains(" user input events.", na=True)].str.replace(" user input events.",'', case=False))
        self.df["Input"] = self.df["Input"].fillna(value='')
        
        del self.df['Comment']
    #---------------------------------------------------------------------------
    
    
    def lister_fichier(): # pour test
        print(os.listdir('.'))
    # ------------------------------------------------------------------------
    
    
    # Exportation des données statistiques en fichiers .csv, .json, .excel
    
    def ecrire_csv(self, fichier, data):
        """ Ecrit un fichier.csv (fonction lancée dans la barre menu) """
        try:
            if os.path.exists(fichier):
                print("ecrire_csv if !")
                #print("le fichier existe déjà !")
                #if askyesno("Ecriture du fichier", "le fichier"  + fichier + " existe déjà ! voulez vous l'écraser ?"):
                data.to_csv(fichier, sep = ';',header=None)
                    #print ("ecriture fichier : " + fichier)
                    #print(str(os.path.getsize(fichier)) + ' octets')
                return True    
                #else :
                    #print("le fichier non enregistré !")
                    #return False               
            else:
                print("ecrire_csv else !")
                data.to_csv(fichier, sep = ';',header=None)
                return True            
        except:
            print("ecrire_csv except !")
            return False  
    #---"""  
    
    def ecrire_json(self, fichier, data):
        """ Ecrit un fichier.csv (fonction lancée dans la barre menu) """
        try:
            if os.path.exists(fichier):
                print("ecrire_json if !")
                #print("le fichier existe déjà !")
                #if askyesno("Ecriture du fichier", "le fichier"  + fichier + " existe déjà ! voulez vous l'écraser ?"):
                data.to_json(fichier) 
                """ Exemples de format Json avec le paramètre "orient"
                df.to_json(Fichier , orient='split') Mode split par défaut
                    {"columns":["col 1","col 2"],"index":["row 1","row 2"],"data":[["a","b"],["c","d"]]}'
                    
                df.to_json(Fichier , orient='records')
                    '[{"col 1":"a","col 2":"b"},{"col 1":"c","col 2":"d"}]'
                    
                df.to_json(Fichier , orient='index')
                    '{"row 1":{"col 1":"a","col 2":"b"},"row 2":{"col 1":"c","col 2":"d"}}' 
                    
                df.to_json(Fichier , orient='columns')
                    '{"col 1":{"row 1":"a","row 2":"c"},"col 2":{"row 1":"b","row 2":"d"}}'
                    
                df.to_json(Fichier , orient='values')
                    '[["a","b"],["c","d"]]'
                    
                df.to_json(Fichier , orient='table')
                    '{"schema": {"fields": [{"name": "index", "type": "string"},
                                            {"name": "col 1", "type": "string"},
                                            {"name": "col 2", "type": "string"}],
                                 "primaryKey": "index",
                                 "pandas_version": "0.20.0"},
                      "data": [{"index": "row 1", "col 1": "a", "col 2": "b"},
                               {"index": "row 2", "col 1": "c", "col 2": "d"}]}'   
                      
                #---"""
                return True    
                #else :
                    #print("le fichier non enregistré !")
                    #return False               
            else:
                print("ecrire_json else !")
                data.to_json(fichier)
                return True            
        except:
            print("ecrire_json except !")
            return False
    #---"""  
    
    def ecrire_excel(self, path, data_soft, data_login, date_deb, date_fin):
        """ Edite un Rapport de statistique dans Excel : 
            une feuille pour les résultats de calcul par Soft, 
            une autre pour les résultats de calcul par Login.
        """
            
        # création du fichier Excel
        try:
            with pd.ExcelWriter(path, engine='xlsxwriter') as writer: # objet ExcelWriter            
                workbook = writer.book # créé les objet Classeur            
                self.ecrire_feuille(workbook, writer, data_soft, "Soft", date_deb, date_fin)
                self.ecrire_feuille(workbook, writer, data_login, "Login", date_deb, date_fin)            
            writer.save() # sauvegarde
            os.startfile(path)
            return True
        except:
           return False
    #---"""        
    
    def ecrire_feuille(self, workbook, writer, data, feuille, date_deb, date_fin):
        """ Edite une feuille Excel : Tableau de donnée stat et 3 Graphiques. """
        format_orange = workbook.add_format({
                'bold': 1,
                'border': 1,
                'bg_color': '#F8E5A1',
                'align': 'center',
                'valign': 'vcenter'})                    
                                           
        format_bleu = workbook.add_format({
                'bold': 1,
                'border': 1,
                'bg_color': '#C4D9E8',
                'align': 'center',
                'valign': 'vcenter'})
                                   
        format_rouge = workbook.add_format({
                'bold': 1,
                'border': 1,
                'bg_color': '#E8C4C4',
                'align': 'center',
                'valign': 'vcenter'})
    
        format_vert = workbook.add_format({
                'bold': 1,
                'border': 1,
                'bg_color': '#C4E8C6',
                'align': 'center',
                'valign': 'vcenter'})

        format_date = workbook.add_format({
                'num_format': 'dd/mm/yy',
                'fg_color': '#FFFFFF',
                'align': 'center',
                'valign': 'vcenter',
                'border': 1})
        
        # Tableau
        colonne = 0
        ligne_debut = 2
        nb_ligne = len(data)
        ligne_fin = nb_ligne-1
        data.to_excel(writer, index=True, sheet_name='Statistique_'+feuille, startcol=colonne, startrow=ligne_debut) # Dataframe dans le fichier Excel sans les n° d'index, avec nommage de la feuille        
        worksheet = writer.sheets['Statistique_'+feuille] # créé les objets Feuille
        worksheet.hide_gridlines(2) # masquer le quadrillage de la feuille
        worksheet.freeze_panes(ligne_debut+1, colonne+8) # figer les volets
        
        # Largeur des colonnes # set_column(first_col, last_col, width, cell_format, options)
        worksheet.set_column(colonne+7, colonne+7, 1) # inter col tableau/graph
        worksheet.set_column(colonne+11, colonne+11, 8) # periode
        worksheet.set_column(colonne+12, colonne+12, 3) # du
        worksheet.set_column(colonne+13, colonne+13, 8) # date debut
        worksheet.set_column(colonne+14, colonne+14, 3) # au
        worksheet.set_column(colonne+15, colonne+15, 8) # date fin
        
        worksheet.set_column(colonne, colonne, 20) # tableau col 1
        worksheet.set_column(colonne+1, colonne+1, 11) # tableau col 2
        worksheet.set_column(colonne+2, colonne+2, 10) # tableau col 3
        worksheet.set_column(colonne+3, colonne+3, 9) # tableau col 4
        worksheet.set_column(colonne+4, colonne+5, 5.5) # tableau col 5
        worksheet.set_column(colonne+6, colonne+6, 9) # tableau col 6        
        
        for col_num, value in enumerate(data.columns.values): # mise en forme de la ligne d'entête
            worksheet.write(ligne_debut, col_num + 1 + colonne, value, format_rouge)
        worksheet.merge_range(ligne_debut-1, colonne,ligne_debut, colonne, feuille, format_orange)  # Ajout du titre de colonne index
        worksheet.merge_range(ligne_debut-1, colonne+1,ligne_debut, colonne+1, data.columns[0], format_bleu)  
        worksheet.merge_range(ligne_debut-1, colonne+2,ligne_debut-1, colonne+5, 'Temps de connexion', format_rouge)
        worksheet.merge_range(ligne_debut-1, colonne+6,ligne_debut, colonne+6, data.columns[5], format_vert)          
        #---"""
        
        sytle_graph = 27
        largeur_graph = nb_ligne/14
        if largeur_graph < 1.5:
            largeur_graph = 1.5
            
        # Graphique Nb de soft  
        if nb_ligne > 1 :
            chart = workbook.add_chart({'type': 'column'}) # Crée un objet graphique. 
            chart.add_series({'name':       ['Statistique_'+feuille, ligne_debut, colonne+1],
                              'categories': ['Statistique_'+feuille, ligne_debut + 1, colonne, ligne_debut + 1 + ligne_fin, colonne],
                              'values':     ['Statistique_'+feuille, ligne_debut + 1, colonne+1, ligne_debut + 1 + ligne_fin, colonne+1],
                              'gap': 200, # espace entre series
                              'data_labels': {'value':True, 'font':{'color':'white', 'name':'Calibri', 'size':7, 'rotation':45}},
                             })
    
            chart.set_y_axis({'name': 'Nombre de connexion', 'name_font': {'color':'white', 'size': 9, 'bold': True},
                              'major_gridlines': {'visible': True}, 
                              'num_font':  {'color':'white', 'name': 'Calibri', 'size': 8}}) 
            chart.set_x_axis({'num_font':  {'color':'white', 'rotation': 45, 'name': 'Calibri', 'size': 8}})
            chart.set_legend({'none': True}) # masquage de la légende
            chart.set_title({'name': 'Nombre de connexion', 'name_font': {'color':'white', 'name': 'Calibri', 'size':9}})
            
            chart.set_chartarea({'border': {'none': True},
                             'gradient': {'colors': ['#103067', '#000113'], 'type': 'rectangular'}
                             })
            chart.set_plotarea({'fill': {'color': 'white', 'transparency': 90}})
            """chart.set_table({'horizontal': True,   # Display vertical lines in the table.
                            'vertical':   True,   # Display horizontal lines in the table.
                            'outline':    True,   # Display an outline in the table.
                            'show_keys':  False,  # Show the legend keys with the table data.
                            'font': {'color':'white', 'name': 'Calibri', 'size':7, 'bold':True}})     # Standard chart font properties.
            """
            chart.set_style(sytle_graph)
            worksheet.insert_chart('I5', chart, {'x_scale': largeur_graph, 'y_scale': 1.5, 'object_position': 2}) # Insert le graph dans la feuille
        #---"""
        
        # Graphique Temps de connexion (moyenne et ecartype)
        if nb_ligne > 0 :
            chart = workbook.add_chart({'type': 'column'}) # Crée un objet graphique. 
            for col_tps_connect in range(2,4):
                chart.add_series({'name':   ['Statistique_'+feuille, ligne_debut, colonne+col_tps_connect],
                              'categories': ['Statistique_'+feuille, ligne_debut + 1, colonne, ligne_debut + 1 + ligne_fin, colonne],
                              'values':     ['Statistique_'+feuille, ligne_debut + 1, colonne+col_tps_connect, ligne_debut + 1 + ligne_fin, colonne+col_tps_connect],
                              'gap': 200,
                             })
    
            chart.set_y_axis({'name': 'Temps de connexion', 'name_font': {'color':'white', 'size': 9, 'bold': True},
                              'major_gridlines': {'visible': True}, 
                              'num_font':  {'color':'white', 'name':'Calibri', 'size':8}}) 
            chart.set_x_axis({'num_font':  {'color':'white', 'rotation': 45, 'name': 'Calibri', 'size': 8}})
            chart.set_legend({'position': 'top', 'font': {'color':'white', 'size': 9, 'bold': True}})
            chart.set_title({'none': True})
            chart.set_chartarea({'border': {'none': True},
                                 'gradient': {'colors': ['#5D0E0E', '#1C0000'], 'type': 'rectangular'}
                                 })
            chart.set_plotarea({'fill': {'color': 'white', 'transparency': 90}})
            chart.set_table({'horizontal': True,   # Display vertical lines in the table.
                             'vertical':   True,   # Display horizontal lines in the table.
                             'outline':    True,   # Display an outline in the table.
                             'show_keys':  False,  # Show the legend keys with the table data.
                             'font': {'color':'white', 'name': 'Calibri', 'size':7, 'bold':True}})     # Standard chart font properties.
        
            chart.set_style(sytle_graph+1)
            worksheet.insert_chart('I27', chart, {'x_scale': largeur_graph, 'y_scale': 1.5, 'object_position': 2}) # Insert le graph dans la feuille
        #---"""
        
        # Graphique Nb d'input  
        if nb_ligne > 1 :
            chart = workbook.add_chart({'type': 'column'}) # Crée un objet graphique. 
            chart.add_series({'name':       ['Statistique_'+feuille, ligne_debut, colonne+6],
                              'categories': ['Statistique_'+feuille, ligne_debut + 1, colonne, ligne_debut + 1 + ligne_fin, colonne],
                              'values':     ['Statistique_'+feuille, ligne_debut + 1, colonne+6, ligne_debut + 1 + ligne_fin, colonne+6],
                              'gap': 200,
                              'data_labels': {'value': True, 'font': {'color':'white', 'name': 'Calibri', 'size':7, 'rotation': 60}},
                             })
            chart.set_y_axis({'name': 'Nombre d\'input', 'name_font': {'color':'white', 'size': 9, 'bold':True},
                              'major_gridlines': {'visible':True}, 'num_font': {'color':'white', 'name':'Calibri', 'size':8}}) 
            chart.set_x_axis({'num_font':  {'color':'white', 'rotation': 45, 'name': 'Calibri', 'size': 8}})
            chart.set_legend({'none': True}) # masquage de la légende
            chart.set_title({'name': 'Nombre d\'entrée effectuée', 'name_font': {'color':'white', 'name': 'Calibri', 'size':9}})
            chart.set_chartarea({'border': {'none': True},
                             'gradient': {'colors': ['#085310', '#021300'], 'type': 'rectangular'}
                             })
            chart.set_plotarea({'fill': {'color': 'white', 'transparency': 90}})
            """chart.set_table({'horizontal': True,   # Display vertical lines in the table.
                            'vertical':   True,   # Display horizontal lines in the table.
                            'outline':    True,   # Display an outline in the table.
                            'show_keys':  False,  # Show the legend keys with the table data.
                            'font': {'color':'white', 'name': 'Calibri', 'size':7, 'bold':True}})     # Standard chart font properties.
            """
            chart.set_style(sytle_graph+2)
            worksheet.insert_chart('I49', chart, {'x_scale': largeur_graph, 'y_scale': 1.5, 'object_position': 2}) # Insert le graph dans la feuille 
        #---"""
        
        # Tableau Période        
        worksheet.write(1, colonne+11, 'Période:' , format_orange) 
        worksheet.write(1, colonne+12, 'du' , format_orange) 
        worksheet.write(1, colonne+13, date_deb, format_date) 
        worksheet.write(1, colonne+14, 'au' , format_orange) 
        worksheet.write(1, colonne+15, date_fin, format_date)
    #---  """ 
  
# --------------------------------------------------------------------------------------------------------------------------------------------------------------        

    