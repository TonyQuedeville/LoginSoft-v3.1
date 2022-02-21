// Class      
  class clParam
  {
    constructor(categorie, titre, tableau, legende, chartdiv, numCol, data){
      this.categorie = categorie
      this.titre = titre
      this.tableau = tableau
      this.numCol = numCol
      this.data = data
      this.legende = legende
      this.chartdiv = chartdiv

      this.nomCol = ['Connexion', 'Tps moyen', 'Ecart type', 'Mini', 'Maxi', 'Input']
      this.sumConnexion = data["sumData"][0]
      this.sumInput = data["sumData"][1]
      this.AxisMin = 0
      this.AxisMax = data["maxData"][numCol] + (data["maxData"][numCol]/100)
      this.cesure = "auto"
      this.cesureMinAuto = data["maxData"][numCol]/4
      this.cesureMaxAuto = data["maxData"][numCol] - data["maxData"][numCol]/100
      this.cesureMin = this.cesureMinAuto
      this.cesureMax = this.cesureMaxAuto
    }

    display_legende(){
        $("#" + this.legende).text(this.nomCol[this.numCol])
    }

    display_tab()
    {   
      let i = 0

      // Tableau des resultats
      $("#" + this.tableau).empty()
      $("#" + this.tableau).append('<table id=tab-' + this.tableau + '></table>')
      // entête du tableau
      $("#tab-" + this.tableau).append('<thead id=head-'+ this.tableau +'><tr class=ligTab id=lig-nomCol-'+ this.tableau +'>')
      $("#lig-nomCol-" + this.tableau).append('<th class=colTab>' + this.titre + ' : ' + this.data["chartData"].length + '</th>')
      
      $("#lig-nomCol-" + this.tableau).append('<th class=colTab id=numCol'+ this.titre + 0 + '>' + this.nomCol[0] + " : " + this.sumConnexion + '</th>')
        for(i=1; i<=4; i++){
          $("#lig-nomCol-" + this.tableau).append('<th class=colTab id=numCol'+ this.titre + i + '>' + this.nomCol[i] + '</th>')
        }
      $("#lig-nomCol-" + this.tableau).append('<th class=colTab id=numCol'+ this.titre + 5 + '>' + this.nomCol[5] + " : " + this.sumInput + '</th>')

      this.display_legende()
      $("#tab-" + this.tableau).append('</tr></thead>')
      
      // Corps du tableau
      let lig = 0
      $("#tab-" + this.tableau).append('<tBody id=body-'+ this.tableau +'>')
        for(lig=0; lig<this.data["chartData"].length; lig++){
          $("#body-" + this.tableau).append('<tr class=ligTab id=lig-'+ this.tableau + lig +'>') // ligne
            $("#lig-" + this.tableau + lig).append('<td class=ligTabX id=cel-'+ this.tableau + '-' + lig + '-x>'+ this.data["chartData"][lig]['x'] +'</td>') // colonne x
            
            // colonnes
            for (i=0; i<=5; i++){
              if(this.data["maxData"][i] == this.data["chartData"][lig][this.nomCol[i]]){
				  // affichage de la valeur maxi en rouge (css)
                $("#lig-" + this.tableau + lig).append('<td class=ligTabMax id=cel-'+ this.tableau + '-' + lig + '-'+i+'>'+ this.data["chartData"][lig][this.nomCol[i]] +'</td>') 
              }else{
                $("#lig-" + this.tableau + lig).append('<td class=ligTab id=cel-'+ this.tableau + '-' + lig + '-'+i+'>'+ this.data["chartData"][lig][this.nomCol[i]] +'</td>')
              }
            } 
          $("#body-" + this.tableau).append('</tr>')
        }
      $("#tab-" + this.tableau).append('</tbody>')
    } // end display_tab

    // Parametre graphique
    display_param_graph()
    {
      this.AxisMin = 0
      this.AxisMax = this.data["maxData"][this.numCol] + (this.data["maxData"][this.numCol]/100)

      // Limite graphique
      $('#y-min-' + this.categorie).attr('min',0)
      $('#y-min-' + this.categorie).attr('max',this.data["maxData"][this.numCol])
      $('#y-min-' + this.categorie).val(this.AxisMin)
      
      $('#y-max-' + this.categorie).attr('min',0)
      $('#y-max-' + this.categorie).attr('max',this.data["maxData"][this.numCol])
      $('#y-max-' + this.categorie).val(this.AxisMax)
      //---*/
      // cesure
      this.cesure  = "auto"
      $('#auto-' + this.categorie).prop('checked',true)
      this.cesureMinAuto = this.data["maxData"][this.numCol]/4
      this.cesureMaxAuto = this.data["maxData"][this.numCol] - this.data["maxData"][this.numCol]/100
      this.cesureMin = this.cesureMinAuto
      this.cesureMax = this.cesureMaxAuto
      $('#cesure-min-' + this.categorie).attr('readonly',true)
      $('#cesure-max-' + this.categorie).attr('readonly',true)
      
      $('#cesure-min-' + this.categorie).attr('min',0)
      $('#cesure-min-' + this.categorie).attr('max',this.data["maxData"][this.numCol]-1)
      $('#cesure-min-' + this.categorie).val(this.cesureMin)

      $('#cesure-max-' + this.categorie).attr('min',1)
      $('#cesure-max-' + this.categorie).attr('max',this.data["maxData"][this.numCol])
      $('#cesure-max-' + this.categorie).val(this.cesureMax)
      //---*/
    }
  } // end class clParam

//------------------------------------------------------------------------------------------------------------------------- 

  // Requete Json
    $("#calculer").click(function () {
      // Initialisation des DIV principales
      $("#div-logiciel").show()
      $("#div-utilisateur").show()
      $("#div-logiciel-exclu").hide()
      // Ré-initialisation
      $("#tabdivsoft").empty()
      $("#titredivsoft").empty()      
      $("#tabdivlogin").empty()
      $("#titredivlogin").empty()  
      $("#chartdivsoft").empty()
      $("#chartdivlogin").empty()
      $("#legende-logiciel").text("")
      $("#legende-utilisateur").text("")
      $("#tabdivsoft").append('<h1 class=calcul-en-cours>Calcul de statistique en cours !</h1>')
      $("#tabdivlogin").append('<h1 class=calcul-en-cours>Calcul de statistique en cours !</h1>')

      // Requete  
      $.ajax({
        url: "/calculStatJson?logiciel="+ $("#logiciel").val() +
                        "&version="+ $("#version").val() +
                        "&utilisateur="+ $("#utilisateur").val() +
                        "&poste="+ $("#poste").val() +
                        "&debutPeriode="+ $("#debutPeriode").val() +
                        "&finPeriode="+ $("#finPeriode").val(),	
			
      success: display_tabs_charts,
      error: function (err) {
        $("#tabdivsoft").empty()
        $("#tabdivlogin").empty()
        $("#tabdivsoft").append('<h1 class=calcul-en-cours>"Erreur Calcul Statistique !"</h1>')
        $("#tabdivlogin").append('<h1 class=calcul-en-cours>"Erreur Calcul Statistique !"</h1>')
        console.log(err); 			
		    alert(err.responseText)
        }
    }); 

  });

  function display_tabs_charts(result)
  {
    // instance Logiciel
    let soft = new clParam("soft", "Logiciels", "tabdivsoft", "legende-logiciel", "chartdivsoft", 0, result["resultSoft"]);

    // Titre
      $("#titredivsoft").text($("#logiciel").val())
      soft.display_tab()

    // Nom de colonne tableau cliquable
      $("#numCol" + soft.titre + 0).click(function(){
        soft.numCol = 0
        soft.display_param_graph()
        soft.display_legende()
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMinAuto, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#numCol" + soft.titre + 1).click(function(){
        soft.numCol = 1
        soft.display_param_graph()
        soft.display_legende()
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#numCol" + soft.titre + 2).click(function(){
        soft.numCol = 2
        soft.display_param_graph()
        soft.display_legende()
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#numCol" + soft.titre + 3).click(function(){
        soft.numCol = 3
        soft.display_param_graph()
        soft.display_legende()
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#numCol" + soft.titre + 4).click(function(){
        soft.numCol = 4
        soft.display_param_graph()
        soft.display_legende()
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#numCol" + soft.titre + 5).click(function(){
        soft.numCol = 5
        soft.display_param_graph()
        soft.display_legende()
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      //---*/

      // Parametre graphique
      soft.display_param_graph()      
      // Limites axe
      $("#y-min-" + soft.categorie).change(function () {
        soft.AxisMin = parseFloat($('#y-min-' + soft.categorie).val()) 
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#y-max-" + soft.categorie).change(function () {
        soft.AxisMax = parseFloat($('#y-max-' + soft.categorie).val())
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      //---*/        
      // césure
      $("#auto-" + soft.categorie).change(function () {
        soft.cesure = "auto"
        $('#cesure-min-' + soft.categorie).attr('readonly',true)
        $('#cesure-max-' + soft.categorie).attr('readonly',true)
        $('#cesure-min-' + soft.categorie).val(soft.cesureMinAuto)
        $('#cesure-max-' + soft.categorie).val(soft.cesureMaxAuto)
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMinAuto, soft.cesureMaxAuto, soft.nomCol[soft.numCol], soft.data)
      });
      $("#perso-" + soft.categorie).change(function () {
        soft.cesure = "perso"
        $('#cesure-min-' + soft.categorie).attr('readonly',false)
        $('#cesure-max-' + soft.categorie).attr('readonly',false)
        $('#cesure-min-' + soft.categorie).val(soft.cesureMin)
        $('#cesure-max-' + soft.categorie).val(soft.cesureMax)
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#aucune-" + soft.categorie).change(function () {
        soft.cesure = "aucune"
        $('#cesure-min-' + soft.categorie).attr('readonly',true)
        $('#cesure-max-' + soft.categorie).attr('readonly',true)
        $('#cesure-min-' + soft.categorie).val("")
        $('#cesure-max-' + soft.categorie).val("")
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      
      $("#cesure-min-" + soft.categorie).change(function () {
        soft.cesureMin = parseFloat($('#cesure-min-' + soft.categorie).val()) 
        if (soft.cesureMin >= soft.cesureMax){
          soft.cesureMax = soft.cesureMin + 1
          $('#cesure-max-' + soft.categorie).val(soft.cesureMax)
        }
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      $("#cesure-max-" + soft.categorie).change(function () {
        soft.cesureMax = parseFloat($('#cesure-max-' + soft.categorie).val())
        if (soft.cesureMax <= soft.cesureMin){
          soft.cesureMin = soft.cesureMax - 1
          $('#cesure-min-' + soft.categorie).val(soft.cesureMin)
        }
        display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
      });
      //---*/

      display_chart(soft.chartdiv, soft.AxisMin, soft.AxisMax, soft.cesure, soft.cesureMin, soft.cesureMax, soft.nomCol[soft.numCol], soft.data)
    //---*/  

    // instance Utilisateur
    let login = new clParam("login", "Utilisateurs", "tabdivlogin", "legende-utilisateur", "chartdivlogin", 0, result["resultLogin"]);

    $("#titredivlogin").text($("#utilisateur").val())
    login.display_tab()

    // Nom de colonne tableau cliquable
    $("#numCol" + login.titre + 0).click(function(){
      login.numCol = 0
      login.display_param_graph()
      login.display_legende()
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#numCol" + login.titre + 1).click(function(){
      login.numCol = 1
      login.display_param_graph()
      login.display_legende()
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#numCol" + login.titre + 2).click(function(){
      login.numCol = 2
      login.display_param_graph()
      login.display_legende()
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#numCol" + login.titre + 3).click(function(){
      login.numCol = 3
      login.display_param_graph()
      login.display_legende()
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#numCol" + login.titre + 4).click(function(){
      login.numCol = 4
      login.display_param_graph()
      login.display_legende()
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#numCol" + login.titre + 5).click(function(){
      login.numCol = 5
      login.display_param_graph()
      login.display_legende()
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    //---*/

    // Parametres graphique
    login.display_param_graph()
    // Limites axe
    $("#y-min-" + login.categorie).change(function () {
      login.AxisMin = parseFloat($('#y-min-' + login.categorie).val()) 
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#y-max-" + login.categorie).change(function () {
      login.AxisMax = parseFloat($('#y-max-' + login.categorie).val())
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    //---*/        
    // césure
    $("#auto-" + login.categorie).change(function () {
      login.cesure = "auto"
      $('#cesure-min-' + login.categorie).attr('readonly',true)
      $('#cesure-max-' + login.categorie).attr('readonly',true)
      $('#cesure-min-' + login.categorie).val(login.cesureMinAuto)
      $('#cesure-max-' + login.categorie).val(login.cesureMaxAuto)
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMinAuto, login.cesureMaxAuto, login.nomCol[login.numCol], login.data)
    });
    $("#perso-" + login.categorie).change(function () {
      login.cesure = "perso"
      $('#cesure-min-' + login.categorie).attr('readonly',false)
      $('#cesure-max-' + login.categorie).attr('readonly',false)
      $('#cesure-min-' + login.categorie).val(login.cesureMin)
      $('#cesure-max-' + login.categorie).val(login.cesureMax)
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#aucune-" + login.categorie).change(function () {
      login.cesure = "aucune"
      $('#cesure-min-' + login.categorie).attr('readonly',true)
      $('#cesure-max-' + login.categorie).attr('readonly',true)
      $('#cesure-min-' + login.categorie).val("")
      $('#cesure-max-' + login.categorie).val("")
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });

    $("#cesure-min-" + login.categorie).change(function () {
      login.cesureMin = parseFloat($('#cesure-min-' + login.categorie).val()) 
      if (login.cesureMin >= login.cesureMax){
        login.cesureMax = login.cesureMin + 1
        $('#cesure-max-' + login.categorie).val(login.cesureMax)
      }
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    $("#cesure-max-" + login.categorie).change(function () {
      login.cesureMax = parseFloat($('#cesure-max-' + login.categorie).val())
      if (login.cesureMax <= login.cesureMin){
        login.cesureMin = login.cesureMax - 1
        $('#cesure-min-' + login.categorie).val(login.cesureMin)
      }
      display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
    });
    //---*/

    display_chart(login.chartdiv, login.AxisMin, login.AxisMax, login.cesure, login.cesureMin, login.cesureMax, login.nomCol[login.numCol], login.data)
  }


//--------------------------------------------------------------------------------------------------------------------------------------------  

  function display_chart(chartdiv, AxisMin, AxisMax, cesure, cesureMin, cesureMax, Col, data)
  {
    am4core.ready(function() 
    { 
      // Themes begin
      am4core.useTheme(am4themes_dark);
      am4core.useTheme(am4themes_animated);

      // Themes end        
      var chart = am4core.create(chartdiv, am4charts.XYChart);
      chart.data = data["chartData"]
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "x";
      categoryAxis.renderer.minGridDistance = 40;
      categoryAxis.fontSize = 9;
      
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.min = AxisMin;
      valueAxis.max = AxisMax;
      valueAxis.strictMinMax = true;
      valueAxis.renderer.minGridDistance = 30;

      // axis break        
      if(cesure != "aucune"){
        var axisBreak = valueAxis.axisBreaks.create();
        axisBreak.startValue = cesureMin;
        axisBreak.endValue = cesureMax;

        var d = (axisBreak.endValue - axisBreak.startValue) / (valueAxis.max - valueAxis.min);
        axisBreak.breakSize = 0.05 * (1 - d) / d; //0.05 means that the break will take 5% of the total value axis height
        //*/
        // make break expand on hover
        var hoverState = axisBreak.states.create("hover");
        hoverState.properties.breakSize = 1;
        hoverState.properties.opacity = 0.1;
        hoverState.transitionDuration = 700;        
        axisBreak.defaultState.transitionDuration = 700;
      }
      
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "x";
      series.dataFields.valueY = Col;
      series.columns.template.tooltipText = "{categoryX}" + " : " + "{valueY.value}";
      series.columns.template.tooltipY = 0;
      series.columns.template.strokeOpacity = 0;
      
      // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
      series.columns.template.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });          
    }); // end am4core.ready()  
  }
        
//------------------------------------------------------------------------------------------------------------------------- 