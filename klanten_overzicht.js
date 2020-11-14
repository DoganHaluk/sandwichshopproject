var klanten=[];
var filters=[];
var sorteren=["user_id", "ASC"];
var num;
var huidige_pagina=1;
var aantal_paginas;

// client/read
function starten() {
    console.log(sessionStorage.getItem("token"));        
    $.ajax
    ({
        url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=user",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
        data: 
        {
            "paging": {
                "page": huidige_pagina,
                "items_per_page": 10
            },
            "filter": filters,
            "sort": sorteren,
        }
    })
    .done(function(response) {
        console.log("read klanten done:");
        console.log(response);
        klanten = response.data.items;
        aantal_paginas = response.data.paging.page_count;
        toon_klanten_tabel();
    })
    .fail(function (msg) {
        console.log("read fail:");
        console.log(msg);
    });
}

// client/table
function toon_klanten_tabel() 
{
    document.getElementById('tabel').innerHTML = "";
    for (i=0; i<klanten.length; i++) 
    {
        if (klanten[i].suggesties==true){
            suggesties="Ja"
        }else{
            suggesties="Neen"
        }
        if (klanten[i].actief==true){
            actief="Ja"
        }else{
            actief="Neen"
        }
        document.getElementById("tabel").innerHTML += '<tr>'
        +'<td>'+klanten[i].user_id+'</td> <td>'+klanten[i].naam+'</td> <td>'+klanten[i].email+'</td> <td>'+klanten[i].telefoonnummer+'</td> <td>'+klanten[i].adres+'</td> <td>'+klanten[i].postcode+'</td> <td>'+suggesties+'</td> <td>'+actief+'</td>'
        +'<td> <span class="text-left"><a class="btn btn-primary btn-sm my-0" id="verwijderen'+i+'" onclick="verwijderen('+i+')" data-toggle="modal" data-target="#verwijderen">Verwijderen</a></span>'
        +'<span class="text-left"><a class="btn btn-primary btn-sm my-0" id="bewerken'+i+'" onclick="bewerken('+i+')" data-toggle="modal" data-target="#klant">Bewerken</a></span>'
        +'</td> </tr>';
    }
}

// popup/create
function toevoegen() 
{
    legen();
    document.getElementById("modalHeader").innerHTML = '<h4 class="modal-title w-100 font-weight-bold">Klant toevoegen</h4>';
    document.getElementById("invoerWachtwoord").style.display = "block"; 
    document.getElementById("modalFooter").innerHTML = '<button class="btn btn-primary" onclick="toevoegen_validatie()">BEWAREN</button> <button class="btn btn-primary" data-dismiss="modal">ANNULEREN</button>';
}

// popup/validation
function toevoegen_validatie()
{
    for (var i=0; i<6; i++)
    {
        document.getElementById("warning_"+i).innerHTML= "";
    }
    var validate= true;
    var form = $("#klantForm");
    $('input', form).each(function(index) {
        if ($(this)[0].checkValidity() == false) 
        {
        document.getElementById("warning_"+index).innerHTML= '<small class="form-text text-muted mb-4">Gelieve hier geldig in te vullen!</small>'
        validate= false; 
        }
    })
    if (validate==true)
    {
        bewaren_toevoegen()
    }
}

// client/create
function bewaren_toevoegen() 
{
    var suggesties= document.getElementById("suggesties");
    if(suggesties.checked)
    {
        suggesties="1"
    }
    else {
        suggesties="0";
    }
    var actief= document.getElementById("actief");
    if(actief.checked)
    {
        actief="1"
    }
    else 
    {
        actief="0";
    }
    var formData = new FormData();
    var values = 
    {
        "naam": $("#naam").val(), 
        "email": $("#email").val(),
        "password" : $("#wachtwoord").val(),
        "telefoonnummer": $("#telefoonnummer").val(),
        "adres": $("#adres").val(), 
        "postcode": $("#postcode").val(),
        "suggesties": suggesties,
        "actief": actief,
        "rol" : "klant"
    };
    formData.set("values", JSON.stringify(values));         
    
    $.ajax
    ({
        url: "https://api.data-web.be/item/create?project=fjgub4eD3ddg&entity=user",
        type: "POST",
        headers: {"Authorization": "Bearer " + sessionStorage.getItem("token")},
        processData: false,
        contentType: false,
        data: formData
    })
    .done(function(response) {
        console.log("create done:");
        console.log(response);
        $('#klant').modal('hide');
        starten();
    })
    .fail(function (msg) {
        console.log("create fail:");
        console.log(msg);
        waarschuwing_modal("editfail");
    });
}

// popup/empty
function legen() 
{
    document.getElementById("naam").value = "";
    document.getElementById("email").value = "";
    document.getElementById("wachtwoord").value = "";
    document.getElementById("telefoonnummer").value = "";
    document.getElementById("adres").value = "";
    document.getElementById("postcode").value = "";
    document.getElementById("suggesties").checked=false;
    document.getElementById("actief").checked=false;
}

// popup/update
function bewerken(num) 
{
    document.getElementById("modalHeader").innerHTML = '<h4 class="modal-title w-100 font-weight-bold">Klant bijwerken</h4>';
    document.getElementById("invoerWachtwoord").style.display = "none";
    document.getElementById("modalFooter").innerHTML = '<button class="btn btn-primary" onclick="bewaren_bewerken('+num+')" data-dismiss="modal">BEWAREN</button> <button class="btn btn-primary" data-dismiss="modal">ANNULEREN</button>';
    document.getElementById("naam").value = klanten[num].naam;
    document.getElementById("email").value = klanten[num].email;
    document.getElementById("telefoonnummer").value = klanten[num].telefoonnummer;
    document.getElementById("adres").value = klanten[num].adres;
    document.getElementById("postcode").value = klanten[num].postcode;
    
    if(klanten[num].suggesties=="1")
    {
        document.getElementById("suggesties").checked=true;
    }
    else
    {
        document.getElementById("suggesties").checked=false;
    }
    if(klanten[num].actief=="1")
    {
        document.getElementById("actief").checked=true;
    }
    else
    {
        document.getElementById("actief").checked=false;
    }
}

// client/update
function bewaren_bewerken(num) 
{
    var suggesties= document.getElementById("suggesties");
    if(suggesties.checked)
    {
        suggesties="1"
    }
    else {
        suggesties="0";
    }
    var actief= document.getElementById("actief");
    if(actief.checked)
    {
        actief="1"
    }
    else 
    {
        actief="0";
    }

    var formData = new FormData();
    var values = 
    {
        "naam": $("#naam").val(), 
        "email": $("#email").val(),
        "telefoonnummer": $("#telefoonnummer").val(),
        "adres": $("#adres").val(), 
        "postcode": $("#postcode").val(),
        "suggesties": suggesties,
        "actief": actief,
    };
    formData.set("values", JSON.stringify(values));         
    formData.set("filter", JSON.stringify([{"field": "user_id", "operator": "=", "value": klanten[num].user_id}]));

    $.ajax
    ({
        url: "https://api.data-web.be/item/update?project=fjgub4eD3ddg&entity=user",
        type: "PUT",
        headers: {"Authorization": "Bearer " + sessionStorage.getItem("token")},
        processData: false,
        contentType: false,
        data: formData
    })
    .done(function(response) {
        console.log("update done:");
        console.log(response);
        starten();
    })
    .fail(function (msg) {
        console.log("update fail:");
        console.log(msg);
        waarschuwing_modal("editfail");
    });
}

// popup/delete
function verwijderen(num) 
{
    document.getElementById("verwijderWaarschuwing").innerHTML = "";
    document.getElementById("modalVerwijder").innerHTML = "";
    if (klanten[num].actief=="1")
    {
        document.getElementById("verwijderWaarschuwing").innerHTML = '<p>U verwijdert een actieve klant. Om het te verwijderen, moet u het deactiveren.</p>';
    }
    else{
        document.getElementById("verwijderWaarschuwing").innerHTML = '<p>Wilt u deze klant verwijderen?</p>';
        document.getElementById("modalVerwijder").innerHTML = '<button class="btn btn-primary" onclick="verwijderen_ja('+num+')" data-dismiss="modal">JA</button> <button class="btn btn-primary" data-dismiss="modal">NEEN</button>';
    }
}

// client/delete
function verwijderen_ja(num) 
{
    $.ajax
    ({
        url: "https://api.data-web.be/item/delete?project=fjgub4eD3ddg&entity=user",
        type: "DELETE",
        headers: {"Authorization": "Bearer " + sessionStorage.getItem("token")},
        data: {                
            "filter": [
                {"field": "user_id", "operator": "=", "value": klanten[num].user_id}
            ]
        }
    })
    .done(function(response) {
        console.log("delete done:");
        console.log(response);
        starten();
    })
    .fail(function (msg) {
        console.log("delete fail:");
        console.log(msg);
        var verbinding_bestaat=msg.responseJSON.status.message;
        
        if (verbinding_bestaat=="SQLSTATE[23000]: Integrity constraint violation: 1451 Cannot delete or update a parent row: a foreign key constraint fails (`ID130696_vsabroodjes`.`bestelling`, CONSTRAINT `bestelling_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`))")
        {
            waarschuwing_modal("relation");
        }
        else
        {
            waarschuwing_modal("deletefail");
        }
    });
}

// pagination
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
    starten();
}

// filtration
function filteren() 
{
    var filter = [];
    filter[0] = $("#filternaam").val();
    filter[1] = $("#filteremail").val();
    filter[2] = $("#filterpostcode").val();
    filter[3] = $("#filteractief").val();

    filters=[];
    if (filter[0]!="") 
    {
        filters.push(["naam", "=", filter[0]])
    };
    if (filter[1]!="")
    {
        filters.push(["email", "=", filter[1]])
    };
    if (filter[2]!="") 
    {
        filters.push(["postcode", "=", filter[2]])
    };
    if (filter[3]!="") 
    {
        filters.push(["actief", "=", filter[3]])
    };
    starten();
}

// sortation
function sortering() 
{
    sorteren[0] = $("#sorteer").val();
    starten();
}

// warning
function waarschuwing_modal(warning)
{   
    $("#waarschuwingModal").modal();
    var warning;

    if (warning=="relation")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Bestelling bestaat al?</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Er is een bestelling van deze klant. U kunt het niet verwijderen!</p>';
    }
    else if (warning=="editfail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Registratie mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw registratie van deze klant is om onbekende redenen mislukt.Neem dan contact op met de IT-afdeling.</p>';
    }
    else if (warning=="deletefail"){
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Verwijderen mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Verwijderen van deze klant is om onbekende redenen niet gelukt.Neem dan contact op met de IT-afdeling.</p>';
    }
}
