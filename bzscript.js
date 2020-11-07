var producten;
//var category;
var broodsoort=[];
var broodtype=[];
var huidig_product;
//var verwijder_huidig_product;
var date = new Date();
var date1 = date.getDate();
var month1 = date.getMonth() + 1;
var year1 = date.getFullYear();
var huidig_date=date1 + "/" + month1 + "/" + year1;
//var huidig_date2=year1 + "/" + month1 + "/" + date1;
console.log(huidig_date);
var day=date.getDay();
console.log(day);
var broodsoort_gekozen ;
var broodtype_gekozen ;
var broodsoort_gekozen_id;
var broodtype_gekozen_id;
var broodsoort_gekozen_naam;
var broodtype_gekozen_naam;
var broodsoort_gekozen_prijs;
var broodtype_gekozen_prijs;
var smos_gekozen=0;
var smos_gekozen_id;
var smos_gekozen_naam;
var smos_gekozen_prijs;
var aantaal_bestellingen=0;
var total_prijs;
var voor_korting_prijs;
var rowid=1;
var browid=1;
var final_bedrag=0.0;
//var userdata;
var gebruikersnaam;
var user_id;
//var telefoonnummer;
var total_no_of_products;
var besid;
var betaald;
//var afgehaald;
//var opgelost;
var assets_path;


function waarschuwing_modal(warning)
{   
    $("#waarschuwingModal").modal();
    var warning;

    if (warning=="success")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Registratie gelukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>U bent succesvol geregistreerd. U kunt nu inloggen.</p>';
    }
    else if (warning=="email")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">E-mailadres bestaat al?</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Het ingevoerde e-mailadres bestaat al. Voer een ander e-mailadres in!</p>';
    }
    else if (warning=="fail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Registratie mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw registratie is mislukt vanwege onbekende redenen. Neem dan telefonisch contact met ons op.</p>';
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
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Vraag verzonden</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw vraag is succesvol verzonden. Bedankt!</p>';
        
    }
    else if (warning=="formfail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">Vraag mislukt</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Uw vraag is om onbekende redenen niet verzonden. Neem dan telefonisch contact met ons op.</p>';
    }
    else if (warning=="noemail")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">E-mail niet gevonden</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>Dit e-mailadres is niet aanwezig in onze database.</p>';
    }
    else if (warning=="emailsent")
    {
        document.getElementById("waarschuwingModalLabel").innerHTML='<h3 class="modal-title">E-mail verzonden</h3>';
        document.getElementById("waarschuwingModalBody").innerHTML= '<p>E-mail succesvol verzonden.</p>';
    }
}

    
function get_vraag_selectie_value()
{
    var c_option =document.getElementById("contactFormInfo").value;
    if (c_option==2 || c_option == 3)
    {
        document.getElementById("bestellingnummer").innerHTML = `  
            <input type="text" id="ordernummer" class="form-control mt-4" placeholder="Voer uw bestelnummer in" pattern="[0-9]{1,}" required>      
        `;
    }
    else if (c_option==1)
    {
        document.getElementById("bestellingnummer").innerHTML = "";
    }
    contactformulier_validatie();
}


function contactformulier_validatie()
{
    for (var i=0; i<5; i++)
    {
        document.getElementById("formulier_warning_"+i).innerHTML= "";
    }

    var validate= true;
    var form = $("#formulierform");
    $('input', form).each(function(i) {
        if ($(this)[0].checkValidity() == false) 
        {
            document.getElementById("formulier_warning_"+i).innerHTML= '<small class="form-text text-muted mb-4">Gelieve hier geldig in te vullen!</small>'
            validate= false; 
        }
    })
    if (validate==true)
    {
        contactformulier()
    }
}


function contactformulier() 
{
    var formData = new FormData(); 
    //var datum_bestelling = "";
    //var contactuserid = "";
    var contactbestellingid = "";
    var contactnaam = document.getElementById("contactFormName").value;
    var contactemail = document.getElementById("contactFormEmail").value;
    var contacttelefoon = document.getElementById("contactFormTel").value;
        var c_option =document.getElementById("contactFormInfo").value;
    if (c_option==2 || c_option == 3)
    {
        var contactbestellingid = document.getElementById("ordernummer").value;
    }
    var contactomschrijving = document.getElementById("vraag").value;
    var opgelost=0;
    
    var values =  {
        "naam": contactnaam,
        "email" : contactemail,
        "telefoonnummer" :contacttelefoon, 
        "besid" : contactbestellingid,
        "omschrijving" :contactomschrijving, 
        "datum_cf" :date,
        "opgelost" : String(opgelost)    
    }
    formData.set("values", JSON.stringify(values));

    $.ajax
    ({
        method: 'POST',
        url: "https://api.data-web.be/item/create?project=fjgub4eD3ddg&entity=contactformulier&token_required=false",
        processData: false,
        contentType: false,
        data: formData
   })
   .done(function (response) 
   {
        console.log("post done:");
        console.log(response);
        waarschuwing_modal("formsuccess");
        leeg_contactformulier();
    })
    .fail(function (msg) 
    {
        console.log("post fail:");
        console.log(msg);
        waarschuwing_modal("formfail");
    });
}


function leeg_contactformulier()
{
    document.getElementById("contactFormName").value="";
    document.getElementById("contactFormEmail").value="";
    document.getElementById("contactFormTel").value="";
    document.getElementById("contactFormInfo").value="";
    document.getElementById("bestellingnummer").innerHTML = "";
    document.getElementById("vraag").value="";
}


function register_validatie()
{
    for (var i=0; i<7; i++)
    {
        document.getElementById("register_warning_"+i).innerHTML= "";
    }
    var validate= true;
    var form = $("#registerform");
    $('input', form).each(function(index) {
        if ($(this)[0].checkValidity() == false) 
        {
        document.getElementById("register_warning_"+index).innerHTML= '<small class="form-text text-muted mb-4">Gelieve hier geldig in te vullen!</small>'
        validate= false; 
        }
    })
    if (validate==true)
    {
        registreren()
    }
}


function registreren() {
    var voornaam = document.getElementById("voornaam").value;
    var achternaam = document.getElementById("achternaam").value;
    var naam = voornaam +" "+ achternaam;
    var email = document.getElementById("email").value;
    var password = document.getElementById("wachtwoord").value;
    var telefoonnummer = document.getElementById("telefoonnummer").value;
    var adres  = document.getElementById("adres").value;
    var postcode =  document.getElementById("postcode").value;
    var rol = "klant";
    var suggesties= document.getElementById("suggesties");
    if(suggesties.checked)
    {
        suggesties="1"
    }
    else 
    {
        suggesties="0";
    }

    $.ajax
    ({
        url: "https://api.data-web.be/user/register?project=fjgub4eD3ddg", 
        method: "POST",
        data: {
            "values":{
                "naam" : naam,
                "email": email,
                "password": password,
                "telefoonnummer" : telefoonnummer,
                "adres" : adres,
                "postcode" : postcode,
                "suggesties" : suggesties,
                "rol" : rol,
            }
        }
    })
    .done(function (response) {
        console.log("registiration done:");
        console.log(response);
        waarschuwing_modal("success");
    })
    .fail(function (msg) {
        console.log("registiration fail:");
        console.log(msg);
        var email_bestaat=msg.responseJSON.status.message;
        
        if (email_bestaat=="400: User with this email already exists.")
        {
            waarschuwing_modal("email");
        }
        else
        {
            waarschuwing_modal("fail");
        }
    });
}


function login_validatie()
{
    document.getElementById("login_warning_0").innerHTML= "";
    document.getElementById("login_warning_1").innerHTML= "";
    var validate= true;
    var form = $("#loginform");
    $('input', form).each(function(index) {
        if ($(this)[0].checkValidity() == false) 
        {
        document.getElementById("login_warning_"+index).innerHTML= '<small class="form-text text-muted mb-4">Gelieve hier geldig in te vullen!</small>'
        validate= false; 
        }
    })
    if (validate==true)
    {
        inloggen()
    }
}


function inloggen() {
    var email = document.getElementById("login_email").value;
    var password = document.getElementById("login_wachtwoord").value;
    var remember = document.getElementById("loginFormRemember");
    
    const urlParams1 = new URLSearchParams(window.location.search);
    const directed_from = urlParams1.get("directed_from");
    
    $.ajax
    ({
        url: "https://api.data-web.be/user/login?project=fjgub4eD3ddg", 
        method: "POST",
        data: {
            "email": email,
            "password": password,
        }
    })
    .done(function (response) {
        console.log("log in done:");
        console.log(response);
        sessionStorage.setItem("token", response.status.token);
        sessionStorage.setItem("useremail", email);
        console.log(sessionStorage);
        if (remember.checked)
        {
            localStorage.remember_email = email; 
            localStorage.remember_password = password; 
            localStorage.checkbox = "remember";
        }
        else 
        {
            localStorage.email = ""; 
            localStorage.password = ""; 
            localStorage.checkbox = "";
        }
        
        if(directed_from=="wagentje")
        {
            document.location = "wagentje.html";
        }
        else
        {
            document.location = "producten.html?catid=";
        }
    })
    .fail(function (msg) {
        console.log("log in fail:");
        console.log(msg);
        var wachtwoord_unjuist=msg.responseJSON.status.message;
        
        if (wachtwoord_unjuist=="User with this e-mail/password not found.")
        {
            waarschuwing_modal("password");
        }
        else
        {
            waarschuwing_modal("unsuccessful");
        }
    });
}


function vergetenWachtwoord()
{   
    useremail = document.getElementById("vergetenWachtwoord").value;
    $.ajax
    ({
        method: 'GET',
        url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=user&token_required=false",
        data:
        {
            "filter": ["email", "like", "%" + useremail + "%"]
        }
    })
    .done(function (response) {
        console.log(response);
        userdata=response.data.items;

        if (userdata=="")
        {
            waarschuwing_modal("noemail");
        }
        else
        {
            Email.send({
            Host: "smtp.gmail.com",
            Username : "hbhbroodjeszaak@gmail.com",
            Password : "Broodjeszaak.1",
            To : useremail,
            From : "hbhbroodjeszaak@gmail.com",
            Subject : "Uw wachtwoord vergeten",
            Body : "Uw nieuwe wachtwoord: Abcd1234.<br>Vernieuw het als u inlogt.",
            }).then(
                waarschuwing_modal("emailsent")
            );
            console.log(Email.send);
        }
    })
    .fail(function (msg) {
        console.log("read fail:");
        console.log(msg);
    });
}


function krijg_naam()
{
    var useremail= sessionStorage.getItem("useremail");
    $.ajax
    ({
        method: 'GET',
        url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=user",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
        data:
        {
            "filter": ["email", "like", "%" + useremail + "%"]
        }
    })
    .done(function (response) {
        console.log(response);
        gebruikersnaam=response.data.items[0].naam;
        user_id=response.data.items[0].user_id;
        console.log(user_id);
        sessionStorage.setItem("username",gebruikersnaam);
        document.getElementById("login").style.display = 'none';
        toon_gebruiker_naam(); 
    })
    .fail(function (msg) {
        console.log("read fail:");
        console.log(msg);
    });
}


function toon_gebruiker_naam()
{
    var token_check= sessionStorage.getItem("token");
    console.log(gebruikersnaam);
    console.log(sessionStorage);
    if(token_check!=null)
    {
        document.getElementById("gebruikersnaam").style.display = "block";
        document.getElementById("gebruikersnaam").innerHTML= `<a class="nav-link dropdown-toggle" href="#" role="button" value= ""  data-toggle="dropdown">${gebruikersnaam}</a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
        <button class="btn btn-link" id="logout" onclick="afmelden()" style="color: black;">Log Out</button>
        </div>`;
    }
    else
    {
        document.getElementById("gebruikersnaam").innerHTML="";
    }
}


function afmelden() 
{
    var token_check=sessionStorage.getItem("token");
    console.log(token_check);

    $.ajax
    ({
        url: "https://api.data-web.be/user/logout?project=fjgub4eD3ddg",
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
        type: "Get",
    })
    .done(function (response) {
        console.log(response);
        gebruikersnaam = "";    
        document.getElementById("gebruikersnaam").innerHTML="";
        sessionStorage.clear();
        console.log(sessionStorage);
        document.location = "aanmelden.html";
    })
    .fail(function (msg) {
        console.log("read fail:");
        console.log(msg);
    });
}


function onthouden(){
    if (localStorage.checkbox == "remember") 
    {
        document.getElementById("login_email").value= localStorage.remember_email; 
        document.getElementById("login_wachtwoord").value= localStorage.remember_password; 
    }
}


function start()
{   
    const urlParams = new URLSearchParams(window.location.search);
    const catid = urlParams.get("catid");

    console.log(gebruikersnaam);
    console.log(sessionStorage);
    
    /*if(catid!="")
    {
        filter_producten_category(catid); 
    }*/

    if (catid==1)
    {
        document.getElementById("klassieke").innerHTML=`<a class="btn btn-white btn-outline-default btn-lg z-depth-5"><h4><strong>KLASSIEKE BROODJES</strong></h4></a>`;
    }
    else if(catid==2)
    {
        document.getElementById("speciale").innerHTML=`<a class="btn btn-white btn-outline-default btn-lg z-depth-5"><h4><strong>SPECIALE BROODJES</strong></h4></a>`;
    }
    else if(catid==3)
    {
        document.getElementById("schotel").innerHTML=`<a class="btn btn-white btn-outline-default btn-lg z-depth-5"><h4><strong>KOUDE SCHOTELS</strong></h4></a>`;
    }
    else if(catid==4)
    {
        document.getElementById("drankjes").innerHTML=`<a class="btn btn-white btn-outline-default btn-lg z-depth-5"><h4><strong>DRANKJES</strong></h4></a>`;
    }

    filter_producten_category(catid); //else got to alle producten
    haalWinkelwagentjeOp();
}


function ga_naar_category(catid)
{
    document.location="producten.html?catid=" + catid;
}


function filter_producten_category(catid)
{
    $.ajax
    ({
        method: 'GET',
        url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=broodsoort",
        //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
    })
    .done(function (response) 
    {
        console.log(response);
        broodsoort = response.data.items
        console.log(broodsoort);
        
        $.ajax
        ({
            method: 'GET',
            url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=broodtype",
            //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
        })
        .done(function (response) 
        {
            console.log(response);
            broodtype = response.data.items
            console.log(broodtype);
                
            $.ajax
            ({
                url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=producten1",
                //headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                type: "GET",
                data: {
                    "filter": ["catid", "like", "%" + catid + "%"]
                }
            })
            .done(function (json) 
            {
                console.log("read done:");
                console.log(json);

                assets_path = json.data.assets_path;
                producten=json.data.items;

                console.log(producten);

                if(producten=="")
                {
                    document.getElementById("productendata").innerHTML = "<br>" + "<br>" + "<center>" + "<b>" + "Geen Records gevonden" + "</b>" + "</center>";
                }
                else 
                {
                    maak_tabel(producten/*,broodsoort*/);
                }                
            })
    
        })
    })
    .fail(function (msg) 
    {
        console.log("read fail:");
        console.log(msg); 
    });
}


function zoek_product() 
{
    var input = document.getElementById("input_product");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("productendata");
    var tr = table.getElementsByTagName("tr");
    for (var i = 0; i < tr.length; i++) 
    {
        var vergelijknaam = tr[i].getElementsByTagName("td")[0];
        if (vergelijknaam) 
        {
            var txtValue = vergelijknaam.textContent || vergelijknaam.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) 
            {
                tr[i].style.display = "";
            } 
            else 
            {
                tr[i].style.display = "none";
            }
        }  
    }
}


function maak_tabel(producten) 
{
    console.log(producten);
    document.getElementById("productendata").innerHTML = "";
  
    for (var i = 0; i < producten.length; i++) 
    {
        var tabledata ="";
        var catid= producten[i].catid;

        tabledata += "<tr>";
    
        tabledata += "<td>" + producten[i].pnaam + "</td>";
        
        if(catid==1 || catid==2)
        {
            var p1= Number(producten[i].prodprijs) + Number(broodsoort[0].bsprijs);
            p1=p1.toFixed(2);
            var p2= Number(producten[i].prodprijs) + Number(broodsoort[1].bsprijs);
            p2=p2.toFixed(2);
            tabledata += "<td>" + "Piccolo : " + "€ " + p1 +  
                        "<br>" + "Halve Baguette : " + "€ " + p2 + 
                        "</td>";
        }
        else if(catid!=1 || catid!=2)
        {
            tabledata += "<td>" + "---" + "</td>";
        }
        
        tabledata += "<td>" + producten[i].pomschrijving + "</td>";
        
        tabledata += "<td>" + '<img /*src="https:'+assets_path + "/" + producten[i].beeld.name+'"*/ class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image" />' + "</td>";
        
        tabledata += "<td>" + `<button type="button" class="btn btn-cyan btn-sm" data-toggle="modal" data-target="#broodjesZaak_details" onclick="toon_producten_popup('${producten[i].pid}','${producten[i].catid}','${producten[i].prodprijs}')">Keuze</button>` +"</td>";
        
        tabledata += "</tr>";

        document.getElementById("productendata").innerHTML += tabledata;
    }     
}


function toon_producten_popup(pid,catid,prodprijs)
{
    product_gevonden(pid);
    create_modal(catid,pid,prodprijs);

    if(huidig_product.catid==1 || huidig_product.catid==2)
    {
        document.getElementById("naam").value = huidig_product.pnaam;
        broodsoort_gekozen = broodsoort[0].bsprijs;
        broodtype_gekozen  = broodtype[0].btprijs;
        voorberekening(catid);        
    }
    else if(huidig_product.catid!=1 || huidig_product.catid!=2)
    {
        document.getElementById("naam").value = huidig_product.pnaam;
        voorberekening(catid);
    }
}     
         

function product_gevonden(pid)
{
    for (i = 0; i < producten.length; i++) 
    {
        if (pid == producten[i].pid) 
        {
            huidig_product = producten[i];
        }
    }
}    


function create_modal(catid,pid,prodprijs)
{
    

    if(catid==1 || catid==2)
    {
        console.log(broodsoort)
        
        document.getElementById("modal_data").innerHTML=
        ` 
        <div class="modal fade" id="broodjesZaak_details" tabindex="-1" role="dialog" aria-labelledby="modalform" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalform">Broodjes Selectie <br> 
                        (U kunt het aantal stuks wijzigen en op de knop Bestellen  klikken)</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <!-- CREATION OF FORM ELEMENT WHEN KEUZE BUTTON IS CLICKED-->
                        <form>
                            <div class="form-group">
                                <label for="naam"> Keuze Beleg</label>
                                <input type="text" class="form-control" id="naam" placeholder="" disabled>
                            </div>

                            <div class="form-group">
                                <label> Broodsoort </label><br>
                                <img src="${broodsoort[0].bsbeeld}" class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image">
                                <label>
                                <input type="radio" id="${broodsoort[0].bsid}" name="BroodSoort" value="${broodsoort[0].bsprijs}"  onclick="get_radio_button_value('${broodsoort[0].bsprijs}','broodsoort','${catid}','${broodsoort[0].bsid}','${broodsoort[0].bsnaam}')" checked>Piccolo
                                </label><br>
                                <img src="${broodsoort[1].bsbeeld}" class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image">
                                <label>
                                <input type="radio" id="${broodsoort[1].bsid}" name="BroodSoort" value="${broodsoort[1].bsprijs}" onclick="get_radio_button_value('${broodsoort[1].bsprijs}','broodsoort','${catid}','${broodsoort[1].bsid}','${broodsoort[1].bsnaam}')">Halve baguette 
                                </label><br>
                                </div>
                            <hr>
                            <div class="form-group" >
                                <label>Broodtype</label><br>
                                <img src="${broodtype[0].btbeeld}" class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image">
                                <label>
                                <input type="radio" id="${broodtype[0].btid}" name="BroodType" value="${broodtype[0].btprijs}" onclick="get_radio_button_value('${broodtype[0].btprijs}','broodtype','${catid}','${broodtype[0].btid}','${broodtype[0].btnaam}')" checked>Wit
                                </label><br>
                                <img src="${broodtype[1].btbeeld}" class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image">
                                <label>
                                <input type="radio" id="${broodtype[1].btid}" name="BroodType" value="${broodtype[1].btprijs}" onclick="get_radio_button_value('${broodtype[1].btprijs}','broodtype','${catid}','${broodtype[1].btid}','${broodtype[1].btnaam}')">Bruin 
                                </label><br>
                                <img src="${broodtype[2].btbeeld}" class="figure-img img-fluid z-depth-1" style="max-width: 100px" alt="Responsive image">
                                <label>
                                <input type="radio" id="${broodtype[2].btid}" name="BroodType" value="${broodtype[2].btprijs}" onclick="get_radio_button_value('${broodtype[2].btprijs}','broodtype','${catid}','${broodtype[2].btid}','${broodtype[2].btnaam}')">Meergranen 
                                </label><br>
                                </div>
                            <hr>
                            <div class="form-group">
                                <label>Smos?</label><br>
                                <label>
                                <input type="radio" id="1" name="smosselected" value="0" onclick="get_radio_button_value('0','smos','${catid}','1','Geen Smos')" checked>Neen 
                                </label><br>
                                <label>
                                <input type="radio" id="2" name="smosselected" value="0.70" onclick="get_radio_button_value('0.70','smos','${catid}','2','+smos')">Ja 
                                </label><br>
                                </div>  

                                <div class="form-group">
                                <label for="promotieid">Promotie</label>
                                <input type="textbox" class="form-control" id="promotieid"  disabled>
                            </div>

                            <div class="form-group">
                                <label for="quantity">Aantal Stuks</label>
                                <input type="number" min="1" value =1 class="form-control" id="quantity" placeholder="" onchange="aantal_kiezen(${pid},'${catid}');">
                            </div>

                            <span id="totaalprijsspan"></span><br>
                            <label for="prijs">Totaal Prijs</label><br>
                            
                            <div class="input-group mb-3">
                                <span class="input-group-text">€</span>
                                <input type="text" class="form-control" id="prijs"  aria-label="Prijs in Euro" disabled/>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" id="confirm" onclick="bevestig_bestelling(${pid},'${catid}');">Bestellen</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" id="Annuleren" onclick="">Annuleren</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `
    }
    else if(catid!=1 || catid!=2)
    {
        document.getElementById("modal_data").innerHTML=
        `
        <div class="modal fade" id="broodjesZaak_details" tabindex="-1" role="dialog" aria-labelledby="modalform" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalform">Koude Schotel / Drankjes Selectie /Andere Selectie <br> 
                        (U kunt het aantal stuks wijzigen en op de knop Bestellen klikken)</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <!-- CREATION OF FORM ELEMENT WHEN KEUZE BUTTON IS CLICKED-->
                        <form>
                            <div class="form-group">
                                <label for="naam"> Keuze Beleg </label>
                                <input type="text" class="form-control" id="naam" placeholder="" disabled>
                            </div>

                            <div class="form-group">
                                <label for="promotieid">Promotie</label>
                                <input type="textbox" class="form-control" id="promotieid"  disabled>
                            </div>

                            <div class="form-group">
                                <label for="quantity">Aantal Stuks</label>
                                <input type="number" min="1" value =1 class="form-control" id="quantity" placeholder="" onchange="aantal_kiezen(${pid},'${catid}');">
                            </div>

                            <span id="totaalprijsspan"></span><br>
                            <label for="prijs">Totaal Prijs</label><br>
                        
                            <div class="input-group mb-3">
                                <span class="input-group-text">€</span>
                                <input type="text" class="form-control" id="prijs"  aria-label="Prijs in Euro" disabled/>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" id="confirm" onclick="bevestig_bestelling(${pid},'${catid}');">Bestellen</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal" id="Annuleren" onclick="">Annuleren</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}


function voorberekening(catid)
{   
    broodsoort_gekozen_id=broodsoort[0].bsid;
    broodtype_gekozen_id=broodtype[0].btid;
    smos_gekozen_id=smos_gekozen;
    broodsoort_gekozen_naam=broodsoort[0].bsnaam;
    broodtype_gekozen_naam=broodtype[0].btnaam;
    smos_gekozen_naam="Geen Smos";
    
    berekening(catid);
    update_modal(catid);     
}


function berekening(catid)
{
    if(catid==1 || catid==2)
    {   
        total_prijs= Number(broodsoort_gekozen) + Number(broodtype_gekozen) + Number(smos_gekozen)+Number(huidig_product.prodprijs);
        
        var aantalstukjes = Number(document.getElementById("quantity").value);
        
        total_prijs = aantalstukjes * total_prijs;
        voor_korting_prijs=total_prijs.toFixed(2);

        /* sunday=0, monday=1, tuesday=2, wednesday=3, thursday=4, friday=5, saturday=6 */
        if(catid==1 && day===5)
        {
            total_prijs=total_prijs - ((total_prijs*5)/100);
            total_prijs=total_prijs.toFixed(2);
        }
        else if(catid==2 && day===2)
        {
            total_prijs=total_prijs - ((total_prijs*10)/100);
            total_prijs=total_prijs.toFixed(2);
        }
    }
    else if(catid!=1 || catid!=2)
    {
        var aantalstukjes = Number(document.getElementById("quantity").value);
        total_prijs = aantalstukjes * huidig_product.prodprijs;
        voor_korting_prijs=total_prijs.toFixed(2);

        if(catid==3 && day==1)
        {
            total_prijs=total_prijs - ((total_prijs*20)/100);
            total_prijs=total_prijs.toFixed(2);
        }
    }
}


function update_modal(catid)
{
    if(catid==1 || catid==2)
    {
        /* sunday=0, monday=1, tuesday=2, wednesday=3, thursday=4, friday=5, saturday=6 */
        if(day===5 && catid==1)
        {
            document.getElementById("promotieid").value="5% korting op alle Klassieke Broodjes vandaag (vrijdag)";
            document.getElementById("totaalprijsspan").innerHTML= "&nbsp" + "<b>"+"Total Prijs voor Korting:"+ "&nbsp" +"€"+ voor_korting_prijs+ "</b>";

            console.log("total_prijs after discount", total_prijs);
        }
        else if(catid==1 && day!=5)
        {
            document.getElementById("promotieid").value="5% korting op alle Klassieke Broodjes elke vrijdag";
        }
        else if(day===2 && catid==2)
        {
            document.getElementById("promotieid").value="10% korting op alle Speciale Broodjes vandaag (dinsdag)";
            document.getElementById("totaalprijsspan").innerHTML= "&nbsp" + "<b>"+"Total Prijs voor Korting:"+ "&nbsp" +"€"+ voor_korting_prijs+ "</b>";
       
            console.log("total_prijs after discount", total_prijs);
        }
        else if(day!=2 && catid==2)
        {
            document.getElementById("promotieid").value="10% korting op alle Speciale Broodjes elke dinsdag";
        }
        document.getElementById("prijs").value = total_prijs;
    }
    else if(catid!=1 || catid!=2)
    {
        if(catid==3 && day==1)
        {
            document.getElementById("promotieid").value="20% korting op alle koude schotels vandaag (maandag)";
            document.getElementById("totaalprijsspan").innerHTML= "&nbsp" + "<b>"+"Total Prijs voor Korting:"+ "&nbsp" +"€"+ voor_korting_prijs+ "</b>";

            console.log("total_prijs after discount", total_prijs);
        }
        else if(catid==3 && day!=1)
        {
            document.getElementById("promotieid").value="20% korting op alle koude schotels elke maandag";
        }
        //else if(catid==4)
        else if(catid!=3)
        {
            document.getElementById("promotieid").value="Geen korting";
        }
        document.getElementById("prijs").value = total_prijs;
    }
   
}


function aantal_kiezen(pid, catid) 
{
    if(catid==1 || catid==2)
    {
        berekening(catid);
        update_modal(catid);
    }
    else
    {
        berekening(catid);
        update_modal(catid);
    }
}               


function get_radio_button_value(price, bst, catid, id, naam)
{
    if(bst=="broodsoort")
    {
        broodsoort_gekozen=price;
        broodsoort_gekozen_id=id;
        broodsoort_gekozen_naam=naam;
        console.log("broodsoort_gekozen_id via radio button:",broodsoort_gekozen_id);
        console.log("broodsoort_gekozen_naam via radio button:",broodsoort_gekozen_naam);
    }
    else if(bst=="broodtype")
    {
        broodtype_gekozen=price;
        broodtype_gekozen_id=id;
        broodtype_gekozen_naam=naam;
        console.log("broodtype_gekozen_id via radio button:",broodtype_gekozen_id);
        console.log("broodtype_gekozen_naam via radio button:",broodtype_gekozen_naam);
    }
    else if(bst=="smos")
    {
        smos_gekozen=price;
        smos_gekozen_id=id;
        smos_gekozen_naam=naam;
        console.log(smos_gekozen_naam);
        console.log("smos_gekozen_id via radio button:",smos_gekozen_id);
    }
    berekening(catid);
    update_modal(catid);
}


function haalWinkelwagentjeOp() 
{   
    toon_aantal_bestellingen();            
    
    var winkelwagentje = JSON.parse(sessionStorage.getItem("winkelwagentje"));    
    
    if (winkelwagentje == null) 
    {
        winkelwagentje =[];
    }
    console.log(winkelwagentje);
    
    return winkelwagentje;
} 


function toon_aantal_bestellingen()
{
    rowid=sessionStorage.getItem('rowid');
    aantaal_bestellingen=sessionStorage.getItem('aantaal_bestellingen');
    document.getElementById("antaal_producten").innerHTML=aantaal_bestellingen;
}


function bevestig_bestelling(pid,catid)
{ 
    var winkelwagentje=haalWinkelwagentjeOp();
    console.log(catid);
    var product_id=pid;
    var product_naam=huidig_product.pnaam;
    var product_gekozen_prijs=huidig_product.prodprijs;
    console.log("product_id:",product_id);
    var aantal_quantity=document.getElementById("quantity").value;
    var bedrag=document.getElementById("prijs").value;
    var cid=huidig_product.catid;
    var korting_day=day;

    if(catid==1 || catid==2)
    {
        var winkel_data={
            "rowid": rowid,
            "pid" : product_id, 
            "catid": cid,
            "pnaam": product_naam,
            "pprijs":product_gekozen_prijs,
            "bsid": broodsoort_gekozen_id, 
            "bsnaam": broodsoort_gekozen_naam,
            "bsprijs": broodsoort_gekozen,
            "btid": broodtype_gekozen_id, 
            "btnaam": broodtype_gekozen_naam,
            "btprijs": broodtype_gekozen,
            "snaam": smos_gekozen_naam,
            "smprice": smos_gekozen,
            "dag": korting_day,
            "totaal_stuks": aantal_quantity, 
            "totaal_bedrag":  bedrag 
        };
        console.log(winkel_data);
    }
    else 
    {
        var winkel_data={
            "rowid": rowid,
            "pid" : product_id, 
            "catid": cid,
            "pnaam": product_naam,
            "pprijs":product_gekozen_prijs,
            "bsid": null, 
            "bsnaam": null,
            "bsprijs": null,
            "btid": null, 
            "btnaam": null,
            "btprijs": null,
            "snaam": null,
            "smprice": null,
            "dag": korting_day,
            "totaal_stuks": aantal_quantity, 
            "totaal_bedrag":  bedrag  
        };
        console.log(winkel_data);
    }
    winkelwagentje.push(winkel_data);
    
    console.log(winkelwagentje);

    rowid++;

    aantaal_bestellingen++;

    sessionStorage.setItem('rowid', JSON.stringify(rowid));
    sessionStorage.setItem('aantaal_bestellingen', JSON.stringify(aantaal_bestellingen));
    sessionStorage.setItem('winkelwagentje', JSON.stringify(winkelwagentje));
    toon_aantal_bestellingen();
    $('#broodjesZaak_details').modal('hide');
}


function toon_winkel_wagentje()
{

    document.getElementById("uw_bestelling").style.background="cyan";
    document.getElementById("uw_betaling").style.background="";

    var winkelwagentje=haalWinkelwagentjeOp();
    
    final_bedrag=0.0;
    total_no_of_products=0;

    document.getElementById("winkeltablebody").innerHTML="";
    
    for(var i=0; i<winkelwagentje.length; i++)
    {
        var tabledata ="";
        var tabledata1=""
        tabledata += "<tr>";

        if(winkelwagentje[i].snaam!=null)
        {  
            tabledata += "<td>" + winkelwagentje[i].pnaam + "<br>"+ winkelwagentje[i].snaam + "</td>";
        }
        else
        {
            tabledata += "<td>" + winkelwagentje[i].pnaam + "</td>";
        }
       
        if(winkelwagentje[i].bsnaam!=null)
        {
           tabledata += "<td>" + winkelwagentje[i].bsnaam + "</td>";
        }
        else
        {
            tabledata += "<td>" + "---" + "</td>";
        }

        if(winkelwagentje[i].btnaam!=null)
        {
            tabledata += "<td>" + winkelwagentje[i].btnaam + "</td>";
        }
        else
        {
            tabledata += "<td>"+ "---" + "</td>";
        }

        //tabledata += "<td>" + winkelwagentje[i].totaal_stuks + "</td>";

        tabledata += `<td>
                     <input type="number" id= "wquantity${winkelwagentje[i].rowid}" min="1" value= ${winkelwagentje[i].totaal_stuks} aria-label="Search" class="form-control" style="width: 100px" onchange="aantal_prijs_wijzigen(${winkelwagentje[i].rowid});">
                     </td>`;

        tabledata += "<td>" +"€ " + winkelwagentje[i].totaal_bedrag + "</td>";
        tabledata += "<td>" + `<button type="button" class="btn btn-sm btn-cyan" data-toggle="tooltip" data-placement="top" title="Verwijder item" onclick="verwijder_bestelling(${winkelwagentje[i].rowid})">Verwijder</button>`
                    "</td>";
        tabledata += "</tr>";
       
        document.getElementById("winkeltablebody").innerHTML += tabledata;

        final_bedrag = Number(final_bedrag) + Number(winkelwagentje[i].totaal_bedrag);
        final_bedrag = final_bedrag.toFixed(2);
        total_no_of_products = total_no_of_products + Number(winkelwagentje[i].totaal_stuks);
        console.log(total_no_of_products);
    }
   
    tabledata1 += ` <tr>
         <td> </td>
        <td> </td>
        
        <td>
            <h5 class="mt-2"><strong>Totaal</strong></h5>
        </td>
        <td class="text-right" colspan="2">
            <h5 class="mt-2" id="final_bedrag"><strong> € ${final_bedrag} </strong></h5>
        </td>

        <td class="text-right">
        <a type="button" id="ga_naar_betaling" href="#tabCheckoutPayment" data-toggle="tab" class="btn btn-cyan" onclick="sessioncontrol()">Bevestig Bestelling<i class="fas fa-angle-right right"></i></a>
        </td>
    </tr>`; 
    document.getElementById("winkeltablebody").innerHTML += tabledata1;
}


function aantal_prijs_wijzigen(rowid)
{
    var winkelwagentje=haalWinkelwagentjeOp();
    var totaal_bedrag=0;
   
    for(var i=0; i<winkelwagentje.length; i++)
    {
        if(winkelwagentje[i].rowid==rowid)
        {
            var count=document.getElementById("wquantity"+winkelwagentje[i].rowid).value;
           
            console.log(count);
            winkelwagentje[i].totaal_stuks=count;
            totaal_bedrag = (Number(winkelwagentje[i].pprijs) + Number(winkelwagentje[i].bsprijs) + Number(winkelwagentje[i].btprijs) + Number(winkelwagentje[i].smprice))  * count;
            
            if(winkelwagentje[i].catid==1 && winkelwagentje[i].dag==5 )
            {
                totaal_bedrag = totaal_bedrag - ((totaal_bedrag * 5)/100);
                totaal_bedrag = totaal_bedrag.toFixed(2);
            }
            else if(winkelwagentje[i].catid==2 && winkelwagentje[i].dag==2)
            {
                totaal_bedrag = totaal_bedrag - ((totaal_bedrag * 10)/100);
                totaal_bedrag = totaal_bedrag.toFixed(2);
            }
            else if(winkelwagentje[i].catid==3 && winkelwagentje[i].dag==1)
            {
                totaal_bedrag = totaal_bedrag - ((totaal_bedrag * 20)/100);
                totaal_bedrag = totaal_bedrag.toFixed(2);
            }

            winkelwagentje[i].totaal_bedrag =totaal_bedrag;
            console.log(winkelwagentje[i].totaal_bedrag);
            console.log(winkelwagentje[i].totaal_stuks);
        }
    }
    sessionStorage.setItem('winkelwagentje', JSON.stringify(winkelwagentje));
    toon_winkel_wagentje();
}


function verwijder_bestelling(rowid)
{
    var winkelwagentje=haalWinkelwagentjeOp();
    console.log(winkelwagentje);
    
    for(var i=0; i<winkelwagentje.length; i++)
    {
        if(winkelwagentje[i].rowid==rowid)
        {
            final_bedrag=Number(final_bedrag)-Number(winkelwagentje[i].totaal_bedrag);
            winkelwagentje.splice(i,1);
        }
    }
    console.log("final bedrag in verwijderen:", final_bedrag);
    console.log(winkelwagentje);
    aantaal_bestellingen--;
    sessionStorage.setItem('aantaal_bestellingen', JSON.stringify(aantaal_bestellingen));
    sessionStorage.setItem('winkelwagentje', JSON.stringify(winkelwagentje));
    toon_winkel_wagentje();
}


function sessioncontrol()
{
    document.getElementById("uw_bestelling").style.background="cyan";
    document.getElementById("uw_betaling").style.background="";

    var token_check=sessionStorage.getItem("token");
    console.log(token_check);
    var formData = new FormData();

    if(token_check==null)
    {
        waarschuwing_modal1("login");
    }
    else
    {
        document.getElementById("winkelsamenvatting").innerHTML="";
        document.getElementById("ga_naar_betaling").disabled=false;
        var formData = new FormData();
        console.log(date);
       
        betaald=0;
        afgehaald=0;

        var  values= 
        {
            "user_id": user_id,
            "datum": date,
            "totaal_stuks": total_no_of_products,
            "totaal_bedrag": final_bedrag,  
            "betaald": String(betaald),
            "afgehaald": String(afgehaald),   
        };
        console.log("values to be set in form data in session control function",values);
        formData.set("values", JSON.stringify(values));
        console.log("form data in session control function", formData);
        $.ajax
        ({
            method: 'POST',
            url: "https://api.data-web.be/item/create?project=fjgub4eD3ddg&entity=bestelling",
            headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
           
            processData: false,
            contentType: false,
            data: formData  
        })
        .done(function (response) 
        {
            console.log("create done:");
            console.log(response);
            if (response.status.success == true) 
            {
                console.log("created");
                besid = response.data.item_id;
                console.log(besid);
               
                samenvattingdata(besid);
            }
            else 
            {
                console.log("not created");
            }
        })
        .fail(function (msg) 
        {
            console.log("read fail:");
            console.log(msg);
        });       
    }
}


function waarschuwing_modal1(warning)
{   
    $("#waarschuwingModal1").modal();
    var warning;

    if (warning=="login")
    {
        document.getElementById("waarschuwingModalLabel1").innerHTML='<h3 class="modal-title" id="waarschuwingModalLabel">Nog niet ingelogd?</h3>';
        document.getElementById("waarschuwingModalBody1").innerHTML= '<p>Log in om verder te gaan, aub!</p>';   
    }
}


function ga_naar_login()
{
    document.location = "aanmelden.html?directed_from=wagentje";
}


function samenvattingdata(besid)
{
    document.getElementById("uw_bestelling").style.background="";
    document.getElementById("uw_betaling").style.background="cyan";
    var winkelwagentje=haalWinkelwagentjeOp();

    var samenvattingdata2 ="";
    samenvattingdata2 += "<td>" + "Bestellingnummer :  " + besid + 
                            "<br>" + "Klantnummer :   " + user_id +  
                            "<br>" + "Datum :   " + huidig_date + "</td>";
    document.getElementById("winkelsamenvatting").innerHTML += samenvattingdata2;

    for(var i=0; i<winkelwagentje.length; i++)
    {
        var samenvattingdata ="";
        var samenvattingdata1=""
        samenvattingdata += "<tr>";

        if(winkelwagentje[i].snaam!=null)
        {  
            samenvattingdata += "<td>" + winkelwagentje[i].pnaam + "<br>"+ winkelwagentje[i].snaam + "</td>";
        }
        else
        {
            samenvattingdata += "<td>" + winkelwagentje[i].pnaam + "</td>";
        }
        samenvattingdata += "<td>" +"€ " +winkelwagentje[i].totaal_bedrag + "</td>";
        samenvattingdata += "</tr>";

        document.getElementById("winkelsamenvatting").innerHTML += samenvattingdata;
    }
    samenvattingdata1 += ` <tr>
        <td>
            <strong>Totaal</strong>
        </td>
        <td>
            <strong> € ${final_bedrag} </strong>
        </td>
                        </tr>`;
    
    document.getElementById("winkelsamenvatting").innerHTML +=  samenvattingdata1;
}


function post_in_producten_bestelling_tabel()
{
    document.getElementById("uw_bestelling").style.background="";
    document.getElementById("uw_betaling").style.background="cyan";

    if(document.getElementById("radioPaypal").checked)
    {
        console.log(besid);
        console.log("betaald in post_in_producten_bestelling_tabel", betaald);
   
        var winkelwagentje=haalWinkelwagentjeOp(); 
        var formData = new FormData();  
        for(var i=0;i<winkelwagentje.length;i++)
        {
            if(winkelwagentje[i].catid==1 || winkelwagentje[i].catid==2)
            {
                var  values= 
                {
                    "pid":  winkelwagentje[i].pid,
                    "besid":besid,
                    "bsid": winkelwagentje[i].bsid,
                    "btid": winkelwagentje[i].btid,
                    "totaal_prijs": winkelwagentje[i].totaal_bedrag,
                    "user_id": user_id,
                    "catid":winkelwagentje[i].catid,
                    "datum":date,
                };
            }
            else
            {
                var  values= 
                {
                    "pid":  winkelwagentje[i].pid,
                    "besid":besid,
                    "bsid": "0",
                    "btid": "0",
                    "totaal_prijs": winkelwagentje[i].totaal_bedrag,
                    "user_id": user_id,
                    "catid":winkelwagentje[i].catid,
                    "datum":date,
                };
            }
            formData.set("values", JSON.stringify(values));

            $.ajax
            ({
                method: 'POST',
                url: "https://api.data-web.be/item/create?project=fjgub4eD3ddg&entity=product_bestelling",
                headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                //"filter": ["email", "like", "%" + useremail + "%"]
                processData: false,
                contentType: false,
                data: formData
            })
            .done(function (response) 
            {
                console.log("create done:");
                console.log(response);
                if (response.status.success == true) 
                {
                    console.log("created");
                    var pbid = response.data.pbid;
                    var formData = new FormData(); 
                    var  values= 
                        {
                            "betaald":1, 
                            "afgehaald":1
                        };
                    formData.set("values", JSON.stringify(values));

                    $.ajax
                    ({
                        method: 'PUT',
                        url: `https://api.data-web.be/item/single_update?project=fjgub4eD3ddg&entity=bestelling&id=${besid}`,
                        headers: { "Authorization": "Bearer " + sessionStorage.getItem("token") },
                        processData: false,
                        contentType: false,
                        data: formData
                    })
                    .done(function (response) 
                    {
                        console.log("create done:");
                        console.log(response);
                    })
                    .fail(function (msg) 
                    {
                        console.log("read fail:");
                        console.log(msg);
                    });
                        waarschuwing_modal2("betaald");
                        document.getElementById("plaats_bestelling").disabled=true;
                        //document.location="index.html";
                }
                else 
                {
                    console.log("not created");
                }  
            })
            .fail(function (msg) 
            {
                console.log("read fail:");
                console.log(msg);
            });
        }
    }
    else
    {
        waarschuwing_modal2("niet_betaald");
    }
}


function waarschuwing_modal2(warning)
{   
    $("#waarschuwingModal2").modal();
    var warning;

     if(warning=="niet_betaald")
    {
        document.getElementById("waarschuwingModalLabel2").innerHTML='<h3 class="modal-title" id="waarschuwingModalLabel">Nog niet betalen?</h3>';
        document.getElementById("waarschuwingModalBody2").innerHTML= '<p>Voer de betaling uit om de bestelling te ontvangen aub!</p>';
    }
    else if(warning=="betaald")
    {
        sessionStorage.removeItem('aantaal_bestellingen');
        sessionStorage.removeItem('winkelwagentje');
        document.getElementById("waarschuwingModalLabel2").innerHTML='<h3 class="modal-title" id="waarschuwingModalLabel">Bedankt voor de betaling.</h3>';
        document.getElementById("waarschuwingModalBody2").innerHTML= '<p>We zullen uw bestelling binnenkort bezorgen. aub!</p>';
        document.getElementById("warning_button2").onclick = function () { document.location="index.html"; };
    }
}


function show_password(id) {
    if (id==1)
    {
        var input = document.getElementById("login_wachtwoord");
    } 
    else if (id==2)
    {
        var input = document.getElementById("wachtwoord");
    }
    
    if (input.type === "password") {
        input.type = "text";
        document.getElementById("eye"+id).className = "far fa-eye";
    } else {
        input.type = "password";
        document.getElementById("eye"+id).className = "far fa-eye-slash";
    }
}
