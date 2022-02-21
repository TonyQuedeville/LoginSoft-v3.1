// Services.msc
// Variable
let data

// Class
    class clLogicielExclu
    {
        constructor(listLogicielExclu, logicielExclu, statutExclu){
            this.data = listLogicielExclu
            this.logicielExclu = logicielExclu
            this.statutExclu = statutExclu
            this.titre = "Logiciels exclus"
            this.tableau = "tabdivexclu"
        }
    }
// end class

// Requete Json
    afficheExclure()
    function afficheExclure()
    {
        $("#exclure").click(function () {
            // Masquage Div principales
            $("#div-logiciel").hide()
            $("#div-utilisateur").hide()
            $("#div-logiciel-exclu").show()
            // Ré-initialisation
            $("#tabdivsoft").empty()
            $("#tabdivlogin").empty()
            $("#chartdivsoft").empty()
            $("#chartdivlogin").empty()
            $("#legende-logiciel").text("")
            $("#legende-utilisateur").text("")

            // Requete 
            $.ajax({
                url: "/softExcluJson/",
                success: display_tab_exclu,
                error: function (err, xhr, ajaxOptions, thrownError) {
                $("#tabdivexclu").append('<h1 class=calcul-en-cours>"Erreur Logiciels exclus !"</h1>')
                console.log(err); 
                //alert(err)
                }
            });
        });
    }    

    function exclure(e)
    {
        var tr = e.currentTarget.parentElement;
        let id = e.currentTarget.id
        let st = e.currentTarget.checked

        $.ajax({
            url: "/exclureSoftJson?softExclu=" + data["softExclu"][id] + "&statutExclu=" + st,
            success: save_exclu,
            error: function (err, xhr, ajaxOptions, thrownError) {
            $("#tabdivexclu").append('<h1 class=calcul-en-cours>"Erreur Logiciels exclus !"</h1>')
            console.log(err); 
            //alert(err)
            }
        });

        // changer la classe du label "id=cel-softExclu-' + lig" pour changer la couleur du nom logiciel
        if($("#" + id).is(':checked') === true){
            $("#cel-softExclu-" + id).removeClass("ligTabNonExclu")
            $("#cel-softExclu-" + id).addClass("ligTabExclu")
        }
        else{
            $("#cel-softExclu-" + id).removeClass("ligTabExclu")
            $("#cel-softExclu-" + id).addClass("ligTabNonExclu")
        }

        function save_exclu(result)
        {
            //console.log(result)
            // Requete update filtre
            dateDebut = $("#debutPeriode").val()
            dateFin = $("#finPeriode").val()
            $.ajax({
            url: "/updateFiltreJson?logiciel="+
                                    "&version="+
                                    "&utilisateur="+
                                    "&poste="+
                                    "&debutPeriode="+ dateDebut +
                                    "&finPeriode="+ dateFin,
            success: update_Filtre,
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError); 
                }
            });

            function update_Filtre(result){
                updateFiltre(result)
            }              
        }
    }
    
    function display_tab_exclu(result)
    {  
        let softExclu = new clLogicielExclu(result, "", true)
        data = result

        // Tableau des resultats
        $("#" + softExclu.tableau).empty()
        $("#" + softExclu.tableau).append('<table id=tab-' + softExclu.tableau + '></table>')

        // Corps du tableau
        let corpTab = $("#tab-" + softExclu.tableau).append('<tBody id=body-'+ softExclu.tableau +'>')

            //for (i in result)
            for(lig = 0; lig < softExclu.data["softExclu"].length; lig++)
            {
                // ligne
                let ligne = $("<tr></tr>").attr("id", "lig-softExclu-" + lig);

                // nom du logiciel
                if(softExclu.data["statutExclu"][lig] == 0)
                    couleurExclu = "ligTabExclu"
                else
                    couleurExclu = "ligTabNonExclu"
                let nomLogiciel = $("<td></td>")
                                .attr("id", "cel-softExclu-" + lig)
                                .text(softExclu.data["softExclu"][lig])
                                .attr("class", couleurExclu);

                // case à cocher 
                let action = $("<td></td>");
                if(softExclu.data["statutExclu"][lig] == 0)
                    st = true
                else
                    st = false
                let statut = $("<input></input>")
                                .attr("id", lig)
                                .attr("type", "checkbox")
                                .attr("checked" , st)
                                .change(exclure);

                // ajout de éléments de chaque ligne
                action.append(statut);
                ligne.append(nomLogiciel);
                ligne.append(statut);
                corpTab.append(ligne);
            }
        $("#tab-" + softExclu.tableau).append('</tbody>')
        //---*/
    }  

    