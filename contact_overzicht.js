var contactformulier =[];
var huidig_product;
var besid;
var filters=[];
var sorteren=["opgelost", "ASC"];
var huidige_pagina=1;
var aantal_paginas;


function start() 
{    
       read_items();
}


function read_items() 
{
    $.ajax
    ({
        method: 'GET',
        url: "https://api.data-web.be/item/read",
        //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
        data: 
        {
            "project":"fjgub4eD3ddg",
            "paging": 
            {
                "page": huidige_pagina,
                "items_per_page": 10
            },
            "filter": filters,
            "sort": sorteren,
            "entity":"contactformulier",
            "relation": 
                [{"pri_entity":"contactformulier","pri_key":"besid","sec_entity":"bestelling", "sec_key":"besid"}]
        }
    })
    .done(function (response) {
        console.log(response);
        contactformulier = response.data.items;
        console.log(contactformulier);
        aantal_paginas = response.data.paging.page_count;
        vernieuw_contact_tabel();
    })
    .fail(function (msg) {
        console.log("update fail:");
        console.log(msg);
    });
}


function vernieuw_contact_tabel() 
{
    document.getElementById("contactformulierdata").innerHTML = "";
    var opgelost;
    for (var i = 0; i < contactformulier.length; i++) 
    {
        if (contactformulier[i].cfid !== null) 
        {  
            var tabledata = "";
            tabledata += "<tr>";
            tabledata += "<td>" + contactformulier[i].naam + "</td>";
            tabledata += "<td>" + contactformulier[i].email + "</td>";
            tabledata += "<td>" + contactformulier[i].telefoonnummer + "</td>";
            tabledata += "<td>" + contactformulier[i].besid+ "</td>";
            tabledata += "<td>" + contactformulier[i].omschrijving + "</td>";
            var date= contactformulier[i].datum_cf;
            var date_form= date.split("-");
            var date_format= date_form[2]+"/"+date_form[1]+"/"+date_form[0];
            tabledata += "<td>" + date_format + "</td>";
            if (contactformulier[i].opgelost==true)
            {
                opgelost="Ja"
            }
            else
            {
                opgelost="Neen"
            }
            tabledata += "<td>" + opgelost + "</td>";
            tabledata += "<td>" + `<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_verwijderen" onclick="find_contact_data(${contactformulier[i].cfid})">Verwijderen</button>` +
                `<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_details" onclick="get_contact_data(${contactformulier[i].cfid})">Bijwerken</button>` +
                "</td>";
            tabledata += "</tr>";

            document.getElementById("contactformulierdata").innerHTML += tabledata;
        }
    }
}


function get_contact_data(cfid) 
{
    find_contact_data(cfid);
    document.getElementById("naam").value = huidig_product.naam;
    document.getElementById("email").value = huidig_product.email;
    document.getElementById("telefoonnummer").value = huidig_product.telefoonnummer;
    document.getElementById("besid").value = huidig_product.besid;
    document.getElementById("omschrijving").value = huidig_product.omschrijving;
    document.getElementById("datum_cf").value = huidig_product.datum_cf;
    if(huidig_product.opgelost=="1")
    {
        document.getElementById("opgelost").checked=true;
    }
    else
    {
        document.getElementById("opgelost").checked=false;
    } console.log(huidig_product.opgelost);
}


function find_contact_data(cfid) 
{
    for (i = 0; i < contactformulier.length; i++) {
        if (cfid == contactformulier[i].cfid) 
        {
            huidig_product = contactformulier[i];
        }
    }
}


function contacten_opvolgen() 
{
   var opgelost= document.getElementById("opgelost");
   if(opgelost.checked)
   {
       opgelost="1"
   }
   else {
       opgelost="0";
   }

    var formData = new FormData();

    if (huidig_product.besid != "") {
        huidig_product.naam = document.getElementById("naam").value;
        huidig_product.email = document.getElementById("email").value;
        huidig_product.telefoonnummer = document.getElementById("telefoonnummer").value;
        huidig_product.besid = document.getElementById("besid").value;
        huidig_product.omschrijving = document.getElementById("omschrijving").value;
        huidig_product.datum_cf = document.getElementById("datum_cf").value;
        
        console.log(huidig_product);

        var values = 
        {
            "naam": huidig_product.naam,
            "email": huidig_product.email,
            "telefoonnummer": huidig_product.telefoonnummer,
            "besid": huidig_product.besid,
            "omschrijving":  huidig_product.omschrijving,
            "datum_cf": huidig_product.datum_cf,
            "opgelost": opgelost,
        };

        formData.set("values", JSON.stringify(values));
        formData.set("filter", JSON.stringify(["cfid", "=", huidig_product.cfid]));

        $.ajax
        ({
            url: "https://api.data-web.be/item/update?project=fjgub4eD3ddg&entity=contactformulier",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "PUT",
            processData: false,
            contentType: false,
            data: formData
        })
        .done(function (response) 
        {
            console.log("update done:");
            console.log(response);
            start();
        })
        .fail(function (msg) 
        {
            console.log("update fail:");
            console.log(msg);
            waarschuwing_modal("editfail");
        });
    }
}


function bevestig_verwijderen() 
{
    $.ajax
    ({
        url: "https://api.data-web.be/item/delete?project=fjgub4eD3ddg&entity=contactformulier",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
        type: "DELETE",
        data: 
        {
            "filter": [
                ["cfid", "=", huidig_product.cfid]
            ]
        }
    })
    .done(function (response) 
    {
        console.log("delete done:");
        console.log(response);
        start();
    })
    .fail(function (msg) 
    {
        console.log("delete fail:");
        console.log(msg);
        waarschuwing_modal("deletefail")
    });
}


function OnclickofBestellingenOpvolgen()
{
    document.getElementById("naam").value = "";
    document.getElementById("email").value = "" ;
    document.getElementById("telefoonnummer").value = "" ;
    document.getElementById("besid").value = "";
    document.getElementById("omschrijving").value = "" ;
    document.getElementById("datum_cf").value = "" ;
    document.getElementById("opgelost").value = "";
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
    filter[0] = $("#filteremail").val();
    filter[1] = filterdatum;
    filter[2] = $("#filteropgelost").val();

    filters=[];
    if (filter[0]!="") 
    {
        filters.push(["email", "=", filter[0]]);
    };
    if (filter[1]!="")
    {
        filters.push(["datum_cf", "=", filter[1]])
    };
    if (filter[2]!="") 
    {   
        filters.push(["opgelost", "=", filter[2]])
    };
    start();
}


function sortering() 
{
    sorteren[0] = $("#sorteer").val();
    start();
}

// warning
function waarschuwing_modal(warning)
{   
    $("#waarschuwingModal").modal();
    var warning;

    if (warning=="editfail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Bewerking mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw bewerking van dit bericht is om onbekende redenen mislukt. Neem dan contact op met de IT-afdeling.</p>';
    }
    else if (warning=="deletefail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Verwijderen mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Kan dit bericht om onbekende redenen niet verwijderen. Neem dan contact op met de IT-afdeling.</p>';
    }
}
