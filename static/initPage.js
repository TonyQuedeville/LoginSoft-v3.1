// Variables
var dateDebutFichier = ""
var dateFinFichier = ""
var dateDebut = ""
var dateFin = ""

var listLogiciel = []
var logiciel = ""
var listVersion = []
var version = ""
var listUtilisateur = []
var utilisateur = ""
var listPoste = []
var poste = ""

// Initialisation des cadres
let message1 = 'Selectionnez la période et les filtres. "Logiciel" et "Utilisateur". Puis cliquez sur "Calculer" dans la barre de menu.'

$("#tabdivsoft").empty()
$("#tabdivlogin").empty()
$("#chartdivsoft").empty()
$("#chartdivlogin").empty()
$("#tabdivsoft").append('<h1 class=calcul-en-cours>' + message1 + '</h1>')
$("#tabdivlogin").append('<h1 class=calcul-en-cours>' + message1 + '</h1>')

// Initialisation des DIV principales
$("#div-logiciel").show()
$("#div-utilisateur").hide()
$("#div-logiciel-exclu").hide()


// Requete d'initialisation Filtres
$.ajax({
  url: "/initFiltreJson/",
  success: listeFiltre
});

function listeFiltre(result)
{
  // Initialisation periode
    dateDebutFichier = result["dateDebutFichier"]
    dateFinFichier = result["dateFinFichier"]
    dateDebut = result["debutPeriode"]
    dateFin = result["finPeriode"]
    $("#filtres").append('Période : <input type="date" name="debutPeriode" id="debutPeriode" value="'+ dateDebut +'" min="'+ dateDebutFichier +'" max="'+ dateFinFichier +'"></input>')
    $("#filtres").append(' <input type="date" name="finPeriode" id="finPeriode" value="'+ dateFin +'" min="'+ dateDebutFichier +'" max="'+ dateFinFichier +'"></input>')
    
    // event periode
      $("#debutPeriode").change(function () 
      {
        console.log($("#debutPeriode").val())
        /*isdate($("#debutPeriode").val())
        {
          console.log("!")
        }*/
        if($("#debutPeriode").val()>=$('#finPeriode').val())
        {
          $('#finPeriode').val($("#debutPeriode").val()) 
        }
        
        dateDebut = $("#debutPeriode").val()
		    dateFin = $("#finPeriode").val()
        $.ajax({
          url: "/updateFiltreJson?logiciel="+
                                "&version="+
                                "&utilisateur="+
                                "&poste="+
                                "&debutPeriode="+ dateDebut +
                                "&finPeriode="+ dateFin,
          success: updateFiltre,
          error: function (xhr, ajaxOptions, thrownError) {
            //console.log(thrownError); 
            }
        });
      });
    
      $("#finPeriode").change(function () 
      {
        console.log($("#finPeriode").val())
        if($("#finPeriode").val()<=$('#debutPeriode').val()){
          $('#debutPeriode').val($("#finPeriode").val()) 
        }

		    dateDebut = $("#debutPeriode").val()
        dateFin = $("#finPeriode").val()
        $.ajax({
          url: "/updateFiltreJson?logiciel="+
                                "&version="+
                                "&utilisateur="+
                                "&poste="+
                                "&debutPeriode="+ dateDebut +
                                "&finPeriode="+ dateFin,
          success: updateFiltre,
          error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError); 
            }
        });
      });
    //---*/ 
  //---*/

  // Initialisation du Filtre logiciel
    listLogiciel = result["logiciels"]
    logiciel  = result["logiciel"]
    $("#filtres").append(' Logiciel : <select name="logiciel" id="logiciel"></select>')
    $("#logiciel").append('<option selected="selected"></option>')
    for (logiciels of listLogiciel) 
    {
      if (logiciels == logiciel)
      {
        $("#logiciel").append('<option selected>' + logiciels + '</option>')
      }else{
        $("#logiciel").append('<option>' + logiciels + '</option>')
      }     
    } 

    // Initialisation du Filtre secondaire version
      listVersion = result["versions"]
      version = result["version"]
      $("#filtres").append(' Version : <select name="version" id="version"></select>')
      $("#version").append('<option selected="selected"></option>')

      // event Logiciel  
        $("#logiciel").change(function () 
        {
          logiciel = $("#logiciel").val()
          $.ajax({
            url: "/updateFiltreJson?logiciel=" + logiciel +
                              "&version="+
                              "&utilisateur="+
                              "&poste="+
                              "&debutPeriode="+ dateDebut +
                              "&finPeriode="+ dateFin,
            success: updateVersion,
            error: function (xhr, ajaxOptions, thrownError) {
              console.log(thrownError); 
              }
          }); 

          function updateVersion(result)
          {
            listVersion = result["versions"]
            $("#version").empty()
            $("#version").append('<option selected="selected"></option>')
            for (versions of listVersion) {
              $("#version").append('<option>' + versions + '</option>')  
            }

            listUtilisateur = result["utilisateurs"]
            $("#utilisateur").empty()
            $("#utilisateur").append('<option selected="selected"></option>')
            for (utilisateurs of listUtilisateur) {
              if (utilisateurs == utilisateur){
                $("#utilisateur").append('<option selected>' + utilisateurs + '</option>')
              }else{
                $("#utilisateur").append('<option>' + utilisateurs + '</option>')
              }
            }
          }
        });
      //---*/  
    //---*/
  //---*/

  // Initialisation du Filtre Utilisateur
    listUtilisateur = result["utilisateurs"]
    utilisateur = result["utilisateur"]
    $("#filtres").append(' Utilisateur : <select name="utilisateur" id="utilisateur"></select>')
    $("#utilisateur").append('<option selected="selected"></option>')

    for (utilisateurs of listUtilisateur) {    
      if (utilisateurs == utilisateur){
        $("#utilisateur").append('<option selected>' + utilisateurs + '</option>')
      }else{
        $("#utilisateur").append('<option>' + utilisateurs + '</option>')
      }
    }

    // Initialisation du Filtre secondaire Poste
      listPoste = result["postes"]
      poste = result["poste"]
      $("#filtres").append(' Poste : <select name="poste" id="poste"></select>')
      $("#poste").append('<option selected="selected"></option>')

      // event utilisateur
        $("#utilisateur").change(function () 
        {
          utilisateur = $("#utilisateur").val()
          $.ajax({
            url: "/updateFiltreJson?logiciel="+
                                  "&version="+
                                  "&utilisateur=" + utilisateur +
                                  "&poste="+
                                  "&debutPeriode="+ dateDebut +
                                  "&finPeriode="+ dateFin,
            success: updatePoste,
            error: function (xhr, ajaxOptions, thrownError) {
              console.log(thrownError); 
              }
          }); 

          function updatePoste(result)
          {
            listPoste = result["postes"]
            $("#poste").empty()
            $("#poste").append('<option selected="selected"></option>')
            for (postes of listPoste) {
              $("#poste").append('<option>' + postes + '</option>')  
            }

            listLogiciel = result["logiciels"]
            $("#logiciel").empty()
            $("#logiciel").append('<option selected="selected"></option>')
            for (logiciels of listLogiciel) {
              if (logiciels == logiciel){
                $("#logiciel").append('<option selected>' + logiciels + '</option>')
              }else{
                $("#logiciel").append('<option>' + logiciels + '</option>')
              }   
            }
          }
        });
      //---*/  
    //---*/
  //---*/   
}

//-------------------------------------------------------------------*/

function updateFiltre(result){
  // Hors periode
  $('#debutPeriode').val(result["debutPeriode"])
  $('#finPeriode').val(result["finPeriode"])

  // Initialisation du Filtre logiciel
  listLogiciel = result["logiciels"]
  logiciel  = result["logiciel"]

  $("#logiciel").empty()
  $("#logiciel").append('<option selected></option>')
  for (logiciels of listLogiciel) {
      $("#logiciel").append('<option>' + logiciels + '</option>')     
  } 

    // Initialisation du Filtre secondaire version
    listVersion = result["versions"]
    version = result["version"]
    $("#version").empty()
    $("#version").append('<option selected="selected"></option>')
  //---*/

  // Initialisation du Filtre Utilisateur
  listUtilisateur = result["utilisateurs"]
  utilisateur = result["utilisateur"]
  
  $("#utilisateur").empty()
  $("#utilisateur").append('<option selected></option>')
  for (utilisateurs of listUtilisateur) {    
      $("#utilisateur").append('<option>' + utilisateurs + '</option>')
  }

    // Initialisation du Filtre secondaire Poste
    listPoste = result["postes"]
    poste = result["poste"]
    $("#poste").empty()
    $("#poste").append('<option selected="selected"></option>')
  //---*/  
}

//-----------------------------------------------------------------------------------------------------------------------------*/

// Initialisation des Exportations
$("#exportation").change(function(){
  if($("#exportation").val() == "Exporter dans un fichier CSV"){
    $.ajax({
      url: "/exportCsv/",
      success: ExportCsv
    });
    $("#exportation").val("")

    function ExportCsv(result){
      $("#result-export").text(result["path"])
    } 
  }

  if($("#exportation").val() == "Exporter dans un fichier Excel"){
    $.ajax({
      url: "/exportExcel/",
      success: ExportExcel
    });
    $("#exportation").val("")

    function ExportExcel(result){
      $("#result-export").text(result["path"]) 
    } 
  }

  if($("#exportation").val() == "Exporter dans un fichier JSON"){
    $.ajax({
      url: "/exportJson/",
      success: ExportJson
    });
    $("#exportation").val("")

    function ExportJson(result){
      $("#result-export").text(result["path"]) 
    } 
  }

  // Temps d'affichage du message result exportation
  setTimeout(function() {
    $("#result-export").text("")
  }, 3000);
});
//---*/

/* Initialisation parametre graphique */
  $('#y-min-soft').attr('min',0)
  $('#y-min-soft').attr('max',0)
  $('#y-min-soft').val(0)
  $('#y-max-soft').attr('min',0)
  $('#y-max-soft').attr('max',0)
  $('#y-max-soft').val(0)

  $('#cesure-min-soft').attr('min',0)
  $('#cesure-min-soft').attr('max',0)
  $('#cesure-min-soft').val(0)
  $('#cesure-max-soft').attr('min',0)
  $('#cesure-max-soft').attr('max',0)
  $('#cesure-max-soft').val(0)

  $('#y-min-login').attr('min',0)
  $('#y-min-login').attr('max',0)
  $('#y-min-login').val(0)
  $('#y-max-login').attr('min',0)
  $('#y-max-login').attr('max',0)
  $('#y-max-login').val(0)

  $('#cesure-min-login').attr('min',0)
  $('#cesure-min-login').attr('max',0)
  $('#cesure-min-login').val(0)
  $('#cesure-max-login').attr('min',0)
  $('#cesure-max-login').attr('max',0)
  $('#cesure-max-login').val(0)
//---*/




