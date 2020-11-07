var promotie_cat;
var producten1;
var category;
var broodsoort=[];
var broodtype=[];
var huidig_product;
var verwijder_huidig_product;
var date = new Date();
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
var final_bedrag=0.0;


function admin_login()
{

var admin_email = document.getElementById("admin_email").value;
var admin_password = document.getElementById("admin_password").value;

$.ajax({
       
    url: "https://api.data-web.be/user/login?project=fjgub4eD3ddg",
   
    type: "POST",
    data: {
       
            "email": admin_email,
            "password": admin_password,
           
        },

})
    .done(function (response) {
        console.log(response);
        //var token_value = response.status.token
        //console.log(token_value)

        sessionStorage.setItem("token", response.status.token);
         //console.log(sessionStorage);
         document.location = "bzstartpagina1.html";
       
   
       
       
    })
    .fail(function (msg) {
        
        console.log("read fail:");
        console.log(msg);
        alert("ENTERED Email ID or PASSWORD IS WRONG. Please Re-Enter Values");
    });




}

function begint()
{   
    const urlParams = new URLSearchParams(window.location.search);
    //const catid = urlParams.get("catid");  //"" or 1 or 2 or 3 or 4
    const promid = urlParams.get("promid");
    console.log(promid);
    //If catid!="" go to either of klassieke or speciale or koudeschotels or drankjes
    if(promid!="")
    {
        /*filter_producten_category(catid); */
        promotie_categorie();
    }
    
    promotie_categorie();

}

function ga_naar_category(catid)
{

    document.location="producten1.html?catid=" + catid;

}



   
function promotie_categorie() {
    $.ajax({
        url: "https://api.data-web.be/item/read?project=fjgub4eD3ddg&entity=promoties",
        type: "GET"

    }).done(function (json) {
        console.log("read done:");
        console.log(json);
        promotie_cat = json.data.items;
        //console.log(promotie_cat);
       if(promotie_cat=="")
            {

                document.getElementById("promotie_categorie").innerHTML = "<br>" + "<br>" + "<center>" + "<b>" + "Geen Records gevonden" + "</b>" + "</center>";

            }
            else 
            {
                promoties_tonen_cupons(promotie_cat);
                }
    }).fail(function (msg) {
        
        console.log("read fail:");
        console.log(msg);
        
    });
}


function promoties_tonen_cupons(promotie_cat) {
    document.getElementById("promotie_categorie").innerHTML="";
    for (var i = 0; i < promotie_cat.length; i++){
        var prom_cat=""
        prom_cat+= 
                    '<div class="coupon" class="img-fluid z-depth-1 rounded">' +
                        '<div class="container3 text-center">' +
                            '<h3 class:"text-center">'+promotie_cat[i].dag + '</h3>' +
                        '</div>' +
                        '<img src="promotie foto/korting-supermarkt.jpg" alt="Avatar" style="width:100%;">' +
                        '<div class="container3 p-2" style="background-color:white">' +
                        '<h2><b>' + promotie_cat[i].dagen + '</b></h2> ' +
                        '</div>' +
                                    '<div class="container3 text-center">' +
                                    '<p>' +
                                        '<a href="javascript:" type="button" class="btn btn-white btn-outline-default waves-effect btn-lg z-depth-5" onclick="ga_naar_category('+promotie_cat[i].catid+')">'+promotie_cat[i].catnaam+'</a>'+
                                    '</p>' +
                                    '<p class="expire text-center">' + promotie_cat[i].dag + '</p>' +
                                    '</div>' +
                    '</div>';
                    
        console.log(promotie_cat);
        document.getElementById("promotie_categorie").innerHTML += prom_cat;
    }
    /*if(promid == 1){
        document.getElementById("promotie_categorie").innerHTML=
        `
        <div class="coupon" class="img-fluid z-depth-1 rounded">
            <div class="container3">
                 <h3>Klassieke Broodjes</h3>
            </div>
             <img src="klassieke.jpg" alt="Avatar" style="width:100%;">
            <div class="container3" style="background-color:white">
            <h2><b>20% OFF YOUR PURCHASE</b></h2> 
              <p>Lorem ipsum dolor sit amet, et nam pertinax gloriatur. Sea te minim soleat senserit, ex quo luptatum tacimates voluptatum, salutandi delicatissimi eam ea. In sed nullam laboramus appellantur, mei ei omnis dolorem mnesarchum.</p>
            </div>
                        <div class="container3">
                          <p>
                            <a href="javascript:" type="button" id="klassieke" class="btn btn-white btn-outline-default waves-effect btn-lg z-depth-5" onclick="ga_naar_category('1','klassieke')"><i class="fas fa-bread-slice fa-sm pr-2"aria-hidden="true"></i>KLASSIEKE BROODJES</a>
                          </p>
                          <p class="expire">Expires: Donderdag</p>
                        </div>
        </div>
        `
    }
    if(promid == 2){
        document.getElementById("promotie_categorie").innerHTML=
        `
        <div class="mb-1 pics animation all 2" data-toggle="modal" data-target="#basicExampleModal">
            <div class="mb-3 pics all 1 animation" data-toggle="modal" data-target="#basicExampleModal">
                <div class="coupon" class="img-fluid z-depth-1 rounded">
                    <div class="container3">
                    <h3>Speciale Broodjes</h3>
                    </div>
                    <img src="speciale.jpg" alt="Avatar" style="width:100%;">
                    <div class="container3" style="background-color:white">
                    <h2><b>20% OFF YOUR PURCHASE</b></h2> 
                    <p>Lorem ipsum dolor sit amet, et nam pertinax gloriatur. Sea te minim soleat senserit, ex quo luptatum tacimates voluptatum, salutandi delicatissimi eam ea. In sed nullam laboramus appellantur, mei ei omnis dolorem mnesarchum.</p>
                    </div>
                    <div class="container3">
                    <p>
                        <a href="javascript:" type="button" id="speciale" class="btn btn-white btn-outline-default waves-effect btn-lg z-depth-5" onclick="ga_naar_category('2','speciale')"><i class="fas fa-hamburger fa-sm pr-2"aria-hidden="true"></i>SPECIALE BROODJES</a>
                    </p>
                    <p class="expire">Expires: Dinsdag</p>
                    </div>
                </div>
            </div>  
        </div>          
        `
    }
    if(promid == 3){
        document.getElementById("promotie_categorie").innerHTML=

        `
        <div class="mb-2 pics all 2 animation" data-toggle="modal" data-target="#basicExampleModal">
            <div class="coupon" class="img-fluid z-depth-1 rounded">
            <div class="container3">
                <h3>Koude Schotels</h3>
            </div>
            <img src="koudeschotel.jpg" alt="Avatar" style="width:100%;">
            <div class="container3" style="background-color:white">
                <h2><b>20% OFF YOUR PURCHASE</b></h2> 
                <p>Lorem ipsum dolor sit amet, et nam pertinax gloriatur. Sea te minim soleat senserit, ex quo luptatum tacimates voluptatum, salutandi delicatissimi eam ea. In sed nullam laboramus appellantur, mei ei omnis dolorem mnesarchum.</p>
            </div>
            <div class="container3">
                <p>
                <a href="javascript:" type="button" id="schotel" class="btn btn-white btn-outline-default waves-effect btn-lg z-depth-5" onclick="ga_naar_category('3','koudeschotel')"><i class="fas fa-utensils fa-sm pr-2"aria-hidden="true"></i>KOUDE SCHOTELS</a>
                </p>
                <p class="expire">Expires: Woensdag</p>
            </div>
            </div>
        </div>
        `
    }*/
}