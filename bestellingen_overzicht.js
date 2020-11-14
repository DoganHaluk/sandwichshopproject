var username;
var user_id;
var user_rol;
var bestellingen =[];
var huidig_product;
var besid;
var user_email;
var user_naam;
var filters=[];
var sorteren=["besid", "ASC"];
var huidige_pagina=1;
var aantal_paginas;
//"filter": filters,

function start() {

    
       read_items();
   

}
function read_items() {
   
    //select * from User where user.user_id=bestelling,user_id;
                $.ajax({
                            method: 'GET',
                            url: "https://api.data-web.be/item/read",
                                headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                        data: {
                                    "project":"fjgub4eD3ddg",
                                     "entity":"bestelling",
                                     "paging": {
                                        "page": huidige_pagina,
                                        "items_per_page": 10},
                                        "filter": filters,
                                        "sort": sorteren,
                                     "relation": 
                                        [{"pri_entity":"bestelling","pri_key":"user_id","sec_entity":"user", "sec_key":"user_id"}]
                                 }

                        })
                .done(function (response) {
                                                    console.log(response);
                                                    bestellingen = response.data.items;
                                                    console.log(bestellingen);

                                                    if(response.data.item_count==0)
                                                    {
                                                        $("#waarschuwingModal").modal();
                                                        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Sorry</h3>';
                                                        document.getElementById("waarschuwingModalBody").innerHTML= '<p> geen records gevonden!</p>';
                                                        document.getElementById("sluit").onclick = function () { location.reload(); };
                                                        //location.reload();
                                                        //document.getElementById("sluit").onclick = function () { read_items(); };
                                                    }


                                                    aantal_paginas = response.data.paging.page_count;
                                                    vernieuw_bestelling_tabel();
                     })
                .fail(function (msg) {
                                            console.log("update fail:");
                                            console.log(msg);
                     });
    
    

}
function vernieuw_bestelling_tabel() {

    document.getElementById("bestellingdata").innerHTML = "";

    for (var i = 0; i < bestellingen.length; i++) {


        if (bestellingen[i].besid !== null) {

            
           
            //console.log(user_naam);
            //console.log(user_email);
            var tabledata = "";
            tabledata += "<tr>";
            tabledata += "<td>" + bestellingen[i].besid + "</td>";
            tabledata += "<td>" + bestellingen[i].user_id + "</td>";
            tabledata += "<td>" + bestellingen[i].user.items[0].naam + "</td>";
            tabledata += "<td>" + bestellingen[i].user.items[0].email + "</td>";

             var date= bestellingen[i].datum;
             var date_form= date.split("-");
             console.log(date_form);
             var date_format= date_form[2]+"/"+date_form[1]+"/"+date_form[0];
             console.log(date_format);

            //tabledata += "<td>" + bestellingen[i].datum + "</td>";
            tabledata += "<td>" + date_format+ "</td>";
            tabledata += "<td>" + bestellingen[i].totaal_stuks + "</td>";
            tabledata += "<td>" +"€ " +bestellingen[i].totaal_bedrag+ "</td>";
            if(bestellingen[i].betaald==0)
            {
                //tabledata += "<td>" + bestellingen[i].betaald + "</td>";
                tabledata += "<td>" + "Nee" + "</td>";
            }
            else if(bestellingen[i].betaald==1)
            {
                tabledata += "<td>" + "Ja" + "</td>";
            }
            if(bestellingen[i].afgehaald==0)
            {
                //tabledata += "<td>" + bestellingen[i].afgehaald + "</td>";
                tabledata += "<td>" + "Nee" + "</td>";
            }
            else if(bestellingen[i].afgehaald==1)
            {
                tabledata += "<td>" + "Ja" + "</td>";
            }
            
            //if(bestellingen[i].betaald=="0")
            //{

            tabledata += "<td>" + 
                `<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_details" onclick="get_bestelling_data(${bestellingen[i].besid},${user_naam},${user_email})">Bijwerken</button>` +
                "</td>";
           // }
            tabledata += "</tr>";

            document.getElementById("bestellingdata").innerHTML += tabledata;
        }
    }


}



function get_bestelling_data(besid,user_naam,user_email) 
{

    find_bestelling_data(besid);
    console.log("line 304 huidig_product",huidig_product);
    document.getElementById("user_id").value = huidig_product.user_id;
    document.getElementById("datum").value = huidig_product.datum;
    document.getElementById("totaal_stuks").value = huidig_product.totaal_stuks;
    document.getElementById("totaal_bedrag").value = huidig_product.totaal_bedrag;
    document.getElementById("betaald").value = huidig_product.betaald;
    if(huidig_product.betaald=="1")
    {
        document.getElementById("betaald").checked=true;
    }
    else
    {
        document.getElementById("betaald").checked=false;
    }



    document.getElementById("afgehaald").value = huidig_product.afgehaald;
    
    console.log("line 304 huidig_product",huidig_product);
}

function find_bestelling_data(besid) 
{
    for (i = 0; i < bestellingen.length; i++) {
        if (besid == bestellingen[i].besid) {

            huidig_product = bestellingen[i];
            console.log("in find_bestelling_data function, consoling huidig_product",huidig_product);
            //return;
        }
    }

}
function bijwerken_bestellingen() {

    huidig_product.user_id = document.getElementById("user_id").value;
    huidig_product.datum = document.getElementById("datum").value;
    huidig_product.totaal_stuks = document.getElementById("totaal_stuks").value;
    huidig_product.totaal_bedrag = document.getElementById("totaal_bedrag").value;
    huidig_product.betaald = document.getElementById("betaald").value;
    huidig_product.afgehaald = document.getElementById("afgehaald").value;
    

    vernieuw_bestelling_tabel();
    console.log(huidig_product);
    console.log(producten);


}


 function set_betaald_value()
 {
     var betaald= document.getElementById("betaald");
     if(betaald.checked)
     {
        document.getElementById("betaald").value="1"
        document.getElementById("afgehaald").value="1";
     }
     else if(!betaald.checked){
        document.getElementById("betaald").value="0"
        document.getElementById("afgehaald").value="0";
     }
 }


function BestellingenRaadplegen() {

   console.log("reaches bestellingenraadplegen function");

    var formData = new FormData();
    var id = document.getElementById("id").value;
    console.log(id);

    if (huidig_product.besid !== "") {

        console.log("reached after id not empty condition");

        huidig_product.user_id = document.getElementById("user_id").value;
        huidig_product.datum = document.getElementById("datum").value;
        huidig_product.totaal_stuks = document.getElementById("totaal_stuks").value;
        huidig_product.totaal_bedrag = document.getElementById("totaal_bedrag").value;
        huidig_product.betaald = document.getElementById("betaald").value;
        huidig_product.afgehaald=document.getElementById("afgehaald").value;
        
        
        console.log(huidig_product);
        

        var values = {
            "user_id": huidig_product.user_id,
            "datum": huidig_product.datum,
            "totaal_stuks": huidig_product.totaal_stuks,
            "totaal_bedrag": huidig_product.totaal_bedrag,
            "betaald": huidig_product.betaald,
            "afgehaald": huidig_product.afgehaald,

        };
        console.log("new values after changing in bewerken",values)
        formData.set("values", JSON.stringify(values));
        formData.set("filter", JSON.stringify(["besid", "=", huidig_product.besid]));

        //formData.set("beeld", $("#beeld")[0].files[0]);
        console.log(formData);
        $.ajax({
            url: "https://api.data-web.be/item/update?project=fjgub4eD3ddg&entity=bestelling",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "PUT",
            processData: false,
            contentType: false,
            data: formData
        }).done(function (response) {
            console.log("update done:");
            console.log(response);
            if (response.status.success == true) {
                console.log("updated");
                $("#waarschuwingModal").modal();
                document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Update Succesvol</h3>';
                document.getElementById("waarschuwingModalBody").innerHTML= '<p> Record is bijgewerkt!</p>';
                //read_items();
                vernieuw_bestelling_tabel();
                $('#modal_details').modal('hide');
            }
        }).fail(function (msg) {
            console.log("update fail:");
            console.log(msg);
        });
    }

   
        

    }

    function OnclickofBestellingenOpvolgen()
    {
        document.getElementById("user_id").value="";
        document.getElementById("datum").value="";
        document.getElementById("totaal_stuks").value="";
        document.getElementById("totaal_bedrag").value="";
        document.getElementById("betaald").value="";
        document.getElementById("geleverd").value="";
        
    }

    function paginas(dir) 
{
    if (huidige_pagina>=1 && huidige_pagina<aantal_paginas && dir=="volgende") 
    {
        huidige_pagina++;
    } 
    else if (huidige_pagina>1 && huidige_pagina<=aantal_paginas && dir=="vorige")
    {
        huidige_pagina--;
    }
    start();
}


function sortering() 
{
    sorteren[0] = $("#sorteer").val();
    start();
} 

function filteren() 
{
   
    var date=  $("#filterdatum").val();;
   
    console.log(date);
    var filterdatum= "";
    if (date != "") {
        var date_form= date.split("/");
        filterdatum = date_form[2]+"-"+date_form[1]+"-"+date_form[0] 
    }
    //console.log(filterdatum);

    var filter = [];
    filter[0] = $("#fbesid").val();
    filter[1] = filterdatum;
    filter[2] = $("#filterbetaald").val();

    filters=[];
    if (filter[0]!="") 
    {
        filters.push(["besid", "=", filter[0]]);
    };
    if (filter[1]!="")
    {
        filters.push(["datum", "=", filter[1]])
    };
    if (filter[2]!="") 
    {   
        filters.push(["betaald", "=", filter[2]])
    };
    start();
}




/*function filteren() {
    //filters = "besid";
    var fbesid= $("#fbesid").val();
    var filterdatum = $("#filterdatum").val();
    var filterbetaald= $("#filterbetaald").val()

    var date= filterdatum;
    var date_form= date.split("/");
    console.log(date_form);
    filterdatum= date_form[2]+"-"+date_form[1]+"-"+date_form[0];
    console.log("filter datum in filteren function after converting into database date format:",filterdatum);

    console.log("filterbetaald in filteren", filterbetaald);

    Call_filter_ajax(fbesid, filterdatum, filterbetaald);

}

function Call_filter_ajax(fbesid, filterdatum, filterbetaald)
{
  console.log("fbesid in call ajax update", fbesid);
   console.log("datum in call ajax update", filterdatum);
   console.log("betaald in call ajax update", filterbetaald);
    


    if(fbesid!=null && filterdatum == "" && filterbetaald == "")
    {
        var filter= ["besid", "=", fbesid];
        console.log("only besid", filter);
        
    }
    else if(filterdatum != null && fbesid == "" && filterbetaald == "")
    {
        var filter= ["datum", "LIKE", "%" + filterdatum + "%"];
        console.log("only date", filter);
        
    }
    else if(filterbetaald != null && fbesid == "" && filterdatum == "")
    {
        var filter = ["betaald", "=",  filterbetaald];
        console.log("only betaald", filter);
        
    }
    else if(fbesid!= null && filterdatum != null && filterbetaald == "")
    {
        var filter= [["besid", "=", fbesid],["datum", "LIKE", "%" + filterdatum + "%"]];
        console.log("besid and date", filter);
       
    }
    else if(fbesid!= null && filterbetaald != null && filterdatum =="")
    {
        var filter= [["besid", "=", fbesid],["betaald", "=",  filterbetaald]];
        console.log("besid and betaald", filter);
        
    }
    else if(filterdatum != null && filterbetaald != null && fbesid == "")
    {
        var filter= [["datum", "LIKE", "%" + filterdatum + "%"],["betaald", "=",  filterbetaald]];
        console.log("date and betaald", filter);
        
    }
    else if(fbesid!= null && filterdatum != null && filterbetaald != null)
    {
        var filter=[["besid", "=", fbesid],["datum", "LIKE", "%" + filterdatum + "%"], ["betaald", "=",  filterbetaald]];
        console.log("besid, date, betaald", filter);
        
    }
    


     $.ajax({
            url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=bestelling",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "GET",
            data: {
               "filter" : filter,
              
                "relation": 
                         [{"pri_entity":"bestelling","pri_key":"user_id","sec_entity":"user", "sec_key":"user_id"}]

            }
        })
            .done(function (json) {
            
                console.log("read done:");
                console.log(json);
                bestellingen = json.data.items;
                console.log(bestellingen);
                if (bestellingen == "") {

                    document.getElementById("bestellingdata").innerHTML = "<br>" + "<br>" + "<center>" + "<b>" + "Geen Records gevonden" + "</b>" + "</center>";

                }
                else {
                    

                    vernieuw_bestelling_tabel();
                 
                }

            })
            .fail(function (msg) {
                console.log("read fail:");
                console.log(msg);
            });

    }*/


 function sortering() 
{
    sorteren[0] = $("#sorteer").val();
    start();
} 

 //$("#filterbetaald").val()

    /* if(filterbetaald=="Ja" || filterbetaald=="ja"||filterbetaald=="JA")
    {
        filterbetaald=1;
    }
    else if(filterbetaald=="Nee"||filterbetaald=="nee"||filterbetaald=="NEe"||filterbetaald=="NeE"||
            filterbetaald=="NEE"||filterbetaald=="nee"||filterbetaald=="nEe"||filterbetaald=="neE")
    {
        filterbetaald=0;
    } */