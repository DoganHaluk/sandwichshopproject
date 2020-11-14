var username;
var user_id;
var user_rol;
var bestellingen =[];
var huidig_product;
var besid;
var user_email;
var user_naam;
var category = [];
var producten = [];
var huidige_pagina=1;
var aantal_paginas;
var pid;


function start() {
   
        read_items();
   
}

function read_items() {
    $.ajax({
        method: 'GET',
        url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=category",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },

    })
        .done(function (response) {

            category = response.data.items
            console.log(category)
            toon_categorie_naam();


            $.ajax({
                method: 'GET',
                url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=producten1",
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                data: {
                    "paging": {
                        "page": huidige_pagina,
                        "items_per_page": 10,
                    }
                   
                }
            })

                .done(function (response) {
                    console.log(response);
                    assets_path = response.data.assets_path;
                    producten = response.data.items
                    aantal_paginas = response.data.paging.page_count;
                    sessionStorage.setItem("token", response.status.token)
                    console.log(producten)
                    vernieuw_producten_tabel()

                })
        })

}

function toon_categorie_naam()
{
    document.getElementById("catid").innerHTML += `<option value="0">select categorie</option>`;
    for(var i=0;i<category.length;i++)
    {
        document.getElementById("catid").innerHTML += `<option value="${category[i].catid}">${category[i].catnaam}</option>`;
    }
}


function vernieuw_producten_tabel() {

    document.getElementById("productendata").innerHTML = "";

    for (var i = 0; i < producten.length; i++) {


        if (producten[i].pid !== null) {
            console.log(producten.beeld)
            var catnaam = haalcatnaam(producten[i].catid);
            //console.log(catnaam);
            var tabledata = "";
            tabledata += "<tr>";
            tabledata += "<td>" + producten[i].pid + "</td>";
            tabledata += "<td>" + producten[i].pnaam + "</td>";
            tabledata += "<td>" + producten[i].pomschrijving + "</td>";

            tabledata += "<td>" + catnaam + "</td>";


            tabledata += "<td>" + "€ " +producten[i].prodprijs + "</td>";
          
           tabledata += "<td>" + '<img src="https:'+assets_path + "/" + producten[i].beeld.name+'" class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image"/>' + "</td>";

            //tabledata += "<td>" + +"</td>";
            tabledata += "<td>" + `<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_verwijderen" onclick="find_product(${producten[i].pid})">Verwijderen</button>` +
                `<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_details" onclick="toon_product('update', ${producten[i].pid})">Bijwerken</button>` +
                "</td>";
            tabledata += "</tr>";

            document.getElementById("productendata").innerHTML += tabledata;
        }
    }


}


function haalcatnaam(catid) {

    for (var i = 0; i < category.length; i++) {
        if (category[i].catid == catid) {
            return category[i].catnaam;

        }

    }

}





function bijwerken_producten() {

    huidig_product.pnaam = document.getElementById("pnaam").value;
    huidig_product.pomschrijving = document.getElementById("pomschrijving").value;
    huidig_product.prodprijs = document.getElementById("prodprijs").value;
    huidig_product.catid = document.getElementById("catid").value;
    huidig_product.beeld = document.getElementById("beeldoriginal").value;
    

    vernieuw_producten_tabel();
    console.log(huidig_product);
    console.log(producten);


}
function controleer_product_toevoegen()
{
    for (var i=0; i<4; i++)
    {
        document.getElementById("product_beheren_warning_"+i).innerHTML= "";
    }
    

    var validate= true;
    var form = $("#producttoevoegenform");
    $('input', form).each(function(i) {
        if ($(this)[0].checkValidity() == false) 
        {
            console.log("valdiatie nodig!")
        document.getElementById("product_beheren_warning_"+i).innerHTML= '<small class="form-text text-muted mb-4">Gelieve hier geldig in te vullen!</small>'
        validate= false; 
        }
    })
    if (validate==true)
    {
        console.log("validatie gelukt!")
        product_toevoegen();
    }
}
function product_toevoegen() {
    var formData = new FormData();
        var values = {
            "pnaam": $("#pnaam").val(),
            "pomschrijving": $("#pomschrijving").val(),
            "catid": $("#catid").val(),
            "prodprijs": $("#prodprijs").val(),
            "beeld": $("#beeld").val(),
            "promid": $("#catid").val()

        };
        formData.set("values", JSON.stringify(values));
        // formData.set("filter", JSON.stringify(["id", "=", huidig_product.id]));
        formData.set("beeld", $("#beeld")[0].files[0]);

        $.ajax({
            url: "https://api.data-web.be/item/create?project=fjgub4eD3ddg&entity=producten1",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "POST",
            processData: false,
            contentType: false,
            data: formData
        }).done(function (response) {
            console.log("create done:");
            console.log(response);
            if (response.status.success == true) {
            console.log("created");
            var pid = response.data.pid;
            console.log(pid);
            $('#modal_details').modal('hide');
            waarschuwing_modal("success");

            }
            else {
                console.log("not created");
                $('#modal_details').modal('hide');
                waarschuwing_modal("formfail");

            }
        }).fail(function (msg) {
            console.log("create fail:");
            console.log(msg);
            waarschuwing_modal("formfail");

                    
        });
}


function bewarenproducten() {
    var product_actie = $("#product_actie").val();
    console.log(product_actie)

    if (product_actie == "update") {

        var formData = new FormData();
        var pid = huidig_product.pid;
        huidig_product.pnaam = document.getElementById("pnaam").value;
        huidig_product.pomschrijving = document.getElementById("pomschrijving").value;
        huidig_product.catid = document.getElementById("catid").value;
        huidig_product.prodprijs = document.getElementById("prodprijs").value;
        //huidig_product.beeld = document.getElementById("beeld").value;
        huidig_product.beeldoriginal = document.getElementById("beeldoriginal").value;

        console.log(huidig_product.beeld);
        console.log(huidig_product);
        var values = {
            "pnaam": huidig_product.pnaam,
            "pomschrijving": huidig_product.pomschrijving,
            "catid": huidig_product.catid,
            "prodprijs": huidig_product.prodprijs,
            "beeld": huidig_product.beeldoriginal,
            //"beeld": huidig_product.beeld,

        };
        formData.set("values", JSON.stringify(values));
        formData.set("filter", JSON.stringify(["pid", "=", huidig_product.pid]));

        formData.set("beeld", $("#beeld")[0].files[0]);

        $.ajax({
            url: "https://api.data-web.be/item/update?project=fjgub4eD3ddg&entity=producten1"  ,
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
                $('#modal_details').modal('hide');
                waarschuwing_modal("success");

            }
            else {
                console.log("not updated");
                $('#modal_details').modal('hide');
                waarschuwing_modal("formfail");

            }
        }).fail(function (msg) {
            console.log("update fail:");
            console.log(msg);
            waarschuwing_modal("formfail");

        });
    
    }


    if(product_actie == "insert") {
       
        controleer_product_toevoegen();
    }
            
    read_items();
    $('#modal_details').modal('hide');
                
 
}
   
function toon_product(actie, prod_id) {
    $("#product_actie").val(actie);
    console.log(actie, $("#product_actie").val())
    if(actie == "insert"){
        document.getElementById("pnaam").value = "";
        document.getElementById("pomschrijving").value = "";
        document.getElementById("prodprijs").value = "";
        document.getElementById("catid").value = 0;
        document.getElementById("originaalbeeld").innerHTML = "";
        document.getElementById("product_modal_titel").innerHTML = "Product toeveogen";
        //document.getElementById("beeld").value = huidig_product.beeld;
        //json stringify

        document.getElementById("beeldoriginal").value = "";
    }

    if(actie == "update"){
        find_product(prod_id);
        console.log(prod_id);
        //document.getElementById("pid").value = huidig_product.pid;
        document.getElementById("pnaam").value = huidig_product.pnaam;
        document.getElementById("pomschrijving").value = huidig_product.pomschrijving;
        document.getElementById("prodprijs").value = huidig_product.prodprijs;
        document.getElementById("catid").value = huidig_product.catid;
        document.getElementById("originaalbeeld").innerHTML ='<label class="custom-file-label" for="beeld2" data-browse="Bladeren">' + huidig_product.beeld.name + '</label>';
        console.log(huidig_product.beeld.name);
        document.getElementById("product_modal_titel").innerHTML = "Product wijzigen";

        //document.getElementById("beeld").value = huidig_product.beeld;
        //json stringify
       // $("#product_modal_titel").html("Product wijzigen");

        document.getElementById("beeldoriginal").value = JSON.stringify(huidig_product.beeld);

        //console.log(image);
        console.log(huidig_product);
    }
    

}



function OnclickofProductToevoegen() {
    document.getElementById("pid").value = "";
    document.getElementById("pnaam").value = "";
    document.getElementById("pomschrijving").value = "";
    document.getElementById("prodprijs").value = "";
    document.getElementById("catid").value = "";
    document.getElementById("beeld").value = "";
    //document.getElementById("beeldoriginal").value = "";
}




function find_product(prod_id) {
    for (i = 0; i < producten.length; i++) {
        if (prod_id == producten[i].pid) {

            huidig_product = producten[i];
            console.log(huidig_product);
        }
        
    }
    
}


function bevestig_verwijderen() {


    $.ajax({
        url: "https://api.data-web.be/item/delete?project=fjgub4eD3ddg&entity=producten1",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
        type: "DELETE",
        data: {
            "filter": [
                ["pid", "=", huidig_product.pid]
            ]
        }
    }).done(function (response) {
        console.log("delete done:");
        console.log(response);
        if (response.status.success == true) {
            console.log("deleted");
            waarschuwing_modal("formsuccess");

        }
        else {
            console.log("not deleted");

        }
    }).fail(function (msg) {
        console.log("delete fail:");
        console.log(msg);
        waarschuwing_modal("formfail");

    });
    read_items();
}






function filter_sort_display() {

    document.getElementById("productendata").innerHTML = "";

    for (i = 0; i < items.length; i++) {
        var catnaam = haalcatnaam(items[i].catid);
        console.log(catnaam);
        var tabledata = "";
        tabledata += "<tr>";
        tabledata += "<td>" + items[i].pid + "</td>";
        tabledata += "<td>" + items[i].pnaam + "</td>";
        tabledata += "<td>" + items[i].pomschrijving + "</td>";

        tabledata += "<td>" + catnaam + "</td>";


        tabledata += "<td>" + "€ " +items[i].prodprijs + "</td>";
        tabledata += "<td>" + '<img src="https:'+assets_path + "/" + items[i].beeld.name+'" class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image"/>' + "</td>";

        tabledata += "<td>" + `<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_verwijderen" onclick="find_product(${items[i].pid})">Verwijderen</button>` +
        `<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modal_details" onclick=""toon_product('update', ${items[i].pid})">Bijwerken</button>` +
       "</td>";

        tabledata += "</tr>";

        document.getElementById("productendata").innerHTML += tabledata;

    }
}



function filter_producten() {
    items = "";
    var fnaam = document.getElementById("filter_naam").value;
    var fomschrijving = document.getElementById("filter_omschrijving").value;
    var fprijs = document.getElementById("filter_prijs").value;

    if (fnaam != null || fomschrijving != null || fprijs != null) {
        $.ajax({
            url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=producten1",
            //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "GET",
            data: {

                "filter": [["pnaam", "LIKE", fnaam + "%"], ["pomschrijving", "LIKE", "%" + fomschrijving + "%"], ["prodprijs", ">=", fprijs]],

            }
        })
            .done(function (json) {
                console.log("read done:");
                console.log(json);
                items = json.data.items;
                console.log(items);
                if (items == "") {

                    document.getElementById("productendata").innerHTML = "<br>" + "<br>" + "<center>" + "<b>" + "Geen Records gevonden" + "</b>" + "</center>";

                }
                else {
                    filter_sort_display();
                }

            })
            .fail(function (msg) {
                console.log("read fail:");
                console.log(msg);
            });

    }


}

function sorteer_producten() {
    items = "";
    var sorteer = document.getElementById("sorteer").value;
    console.log(sorteer);
    if (sorteer == "spid") {
        $.ajax({
            url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=producten1",
            //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "GET",
            data: {

                "sort": [["pid", "ASC"]],

            }
        })
            .done(function (json) {
                console.log("read done:");
                console.log(json);
                items = json.data.items;
                console.log(items);

                filter_sort_display();

            })
            .fail(function (msg) {
                console.log("read fail:");
                console.log(msg);
            });


    }
    if (sorteer == "snaam") {
        $.ajax({
            url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=producten1",
            //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "GET",
            data: {

                "sort": [["pnaam", "ASC"]],

            }
        })
            .done(function (json) {
                console.log("read done:");
                console.log(json);
                items = json.data.items;
                console.log(items);

                filter_sort_display();

            })
            .fail(function (msg) {
                console.log("read fail:");
                console.log(msg);
            });


    }
    else if (sorteer == "somschrijving") {
        $.ajax({
            url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=producten1",
            //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "GET",
            data: {

                "sort": [["pomschrijving", "ASC"]],

            }
        })
            .done(function (json) {
                console.log("read done:");
                console.log(json);
                items = json.data.items;
                console.log(items);

                filter_sort_display();

            })
            .fail(function (msg) {
                console.log("read fail:");
                console.log(msg);
            });
    }
    else if (sorteer == "sprijs") {
        $.ajax({
            url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=producten1",
            //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
            type: "GET",
            data: {

                "sort": [["prodprijs", "ASC"]],

            }
        })
            .done(function (json) {
                console.log("read done:");
                console.log(json);
                items = json.data.items;
                console.log(items);

                filter_sort_display();

            })
            .fail(function (msg) {
                console.log("read fail:");
                console.log(msg);
            });
    }

   /* else {
        alert("Kies een optie");
    }*/
}
function waarschuwing_modal(warning)
{   
    $("#waarschuwingModal").modal();
    var warning;

    if (warning=="success")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Product toevoegen gelukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>U bent succesvol product toevoegen.</p>';
    }
    else if (warning=="email")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">E-mailadres bestaat al?</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Het ingevoerde e-mailadres bestaat al. Voer een ander e-mailadres in!</p>';
    }
    else if (warning=="fail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Product toevoegen mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw registratie is mislukt vanwege onbekende redenen.</p>';
    }
    
    else if (warning=="password")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Wachtwoord of e-mail onjuist?</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Het ngevoerd e-mailadres of wachtwoord is onjuist. Voer de waarden opnieuw in!</p>';
    }
    else if (warning=="unsuccessful")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Aanmelden mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw aanmelden is mislukt vanwege onbekende redenen. Neem dan telefonisch contact met ons op.</p>';
    }
    else if (warning=="formsuccess")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">De product werd verwijderd.</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw verwijderen is succesvol. Bedankt!</p>';
        
    }
    else if (warning=="formfail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Vraag mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw vraag is om onbekende redenen niet verzonden. Neem dan telefonisch contact met ons op.</p>';
    }
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
    
    read_items();
}

