# -*- coding: utf-8 -*-
"""
Created on Tue Sep  3 18:36:18 2019

@author: tquedeville
"""
import pandas as pd

class Filtre():
    def __init__(self, data_source, path):  # Constructeur        
        self.data_source = data_source
        self.data_periode = self.data_source
        self.data = self.data_periode
        
        self.dateDebutFichier = self.data_source["Date-Time"].min()[0:10]
        self.dateFinFichier = self.data_source["Date-Time"].max()[0:10]
        self.debutPeriode = self.dateDebutFichier
        self.finPeriode = self.dateFinFichier  
        self.dateDebutData = self.dateDebutFichier
        self.dateFinData = self.dateFinFichier 
        
        self.logiciel = ""
        self.listVersions = []
        self.version = ""
        
        self.utilisateur = ""  
        self.listPostes = []
        self.poste = ""
        
        # Initialisation de la liste des logiciels.
        self.softExclu = {'soft' : "" , 'statutExclu' : 1} 
        df = self.data.sort_values(by = 'Soft')
        df1 = pd.DataFrame(1, index = df['Soft'].unique(), columns = ['statutExclu'])
        df1 = df1.reset_index()
        df1.columns = ['softExclu', 'statutDefault']
        
        # Lecture du fichier SoftExclu.csv
        self.path = path
        self.lire_soft_exclu_csv()
        df2 = self.dflistExclu
        df2 = df2.reset_index()
        df2.columns = ['softExclu', 'statutExclu']
       
        # Comparaison de df1 et df2. Ajout des eventuels nouveaux logiciels avec statut = 1 par défault
        self.dflistExclu = pd.merge(df1, df2, how="left")        
        self.dflistExclu = self.dflistExclu.set_index('softExclu')
        self.dflistExclu.drop(columns=['statutDefault'], inplace = True)
        self.dflistExclu.fillna(1, inplace = True)
        
        # Exclusion des logiciels par défaut
        self.exclu_filtre() 
    #---"""
        
# -------------------------------------------------------------------------------------------------------------------    
    def update_filtre(self):
        """ Filtre le data source en fonction de la période """        
        # Periode
         # si la période n'a pas été changée on ne recalcule pas data_periode 
        if self.dateDebutData != self.debutPeriode or self.dateFinData != self.finPeriode : 
            self.data_periode = self.data_source[(self.data_source["Date-Time"] >= self.debutPeriode) & (self.data_source["Date-Time"] <= self.finPeriode)]
            self.dateDebutData = self.debutPeriode
            self.dateFinData = self.finPeriode
        self.data = self.data_periode 
        self.exclu_filtre()
        
        """ Filtre le dataframe en fonction des critères Soft et Login selectionnés. """
        # Critères        
        if self.logiciel != "":
            self.data = self.data[self.data["Soft"] == self.logiciel]
            
        if self.version != "":
            self.data = self.data[self.data["Version"] == self.version]
            
        if self.utilisateur != "":
            self.data = self.data[self.data["Login"] == self.utilisateur]
            
        if self.poste != "":
            self.data = self.data[self.data["Post"] == self.poste]      
    #---"""
    
    
    """ Filtre des logiciels exclus """
    def update_ListExclu(self):
        #df.at[lig,col] : Accéde à une valeur unique pour ligne / colonne
        self.dflistExclu.at[self.softExclu['soft'],'statutExclu'] = self.softExclu['statutExclu']
        
    def exclu_filtre(self):  
        self.data = self.data[self.data["Soft"] != ""] # Suppression des softs sans nom.
        for index, softExclu in self.dflistExclu.iterrows():
            if softExclu['statutExclu'] == 0:                
                self.data = self.data[self.data["Soft"] != index]  
    #---"""
    
    """ Filtres secondaire """
    def update_liste_version(self):
        """ Initialise le combobox "Version" en fonction du logiel selectionné """
        self.listVersions = []
        for version in self.data_periode[self.data_periode["Soft"] == self.logiciel]["Version"].unique():
            self.listVersions.append(version)  
    #---"""
    
    def update_liste_poste(self):
        """ Initialise le combobox "Poste" en fonction de l'utilisateur selectionné """
        self.listPostes = []
        for poste in self.data_periode[self.data_periode["Login"] == self.utilisateur]["Post"].unique():
            self.listPostes.append(poste)  
    #---"""
    
# -------------------------------------------------------------------------------------------------------------------   
    
    # Exclusion Logiciel
    def lire_soft_exclu_csv(self):
        """ Lit le fichier des logiciels exclus SoftExclu.csv """
        try:
            self.dflistExclu = pd.read_csv(self.path, sep=";", index_col = 0, header=None, names=['statutExclu'] )
            #print(self.dflistExclu)
        except:            
            print("Erreur de lecture du fichier SoftExclu.csv !")
            pass
    #---"""      
    
    def ecrire_soft_exclu_csv(self, path):
        """ Ecrit le fichier des logiciels exclus SoftExclu.csv """
        try:
            df = pd.DataFrame(self.dflistExclu)
            df.to_csv(path, sep = ';',header=None)
            return True    
        except:
            print("Erreur d'ecriture du fichier SoftExclu.csv !")
            return False  
    #---"""  