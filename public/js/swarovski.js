/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */

function toggleTopMenu() {
    console.log(`LLEGO AQUI`);
    var topMenu = document.getElementsByClassName('topMenu-ul')[0];


/*     var list= document.getElementsByClassName('topMenu-ul');
    for (var i = 0; i < list.length; i++) {
        console.log(list[i]); //second console output
    } */
    
    console.log(`topMenu-ul--> ${topMenu.className}`);
    
    if (topMenu.className === "topMenu-ul") {
        topMenu.className += " collapsed";
    } else {
        topMenu.className = "topMenu-ul";
    }
}

function setFavorite(){
        let favorite = document.getElementById('favorite')[0];

        if (favorite.className === "fa fa-star hidden") {
            favorite.className === "fa fa-star";
            favorite.className += " favorite";
        } else {
            favorite.className = "topMenu-ul hidden";
        }
        
}

/* function toggleTopMenu() {
    console.log(`LLEGO AQUI`);
  var hamburguerExists = document.getElementsByClassName('topMenu-hamburguer');
  var x = document.getElementByClassName('topMenu-ul');

  if (hamburguerExists) {
    console.log(`EXISTO`);
    if (x.className === "topMenu-ul") {
      x.className += " collapse";
    } else {
      x.className = "topMenu-ul";
    }

  } else {
    console.log(`no existo`);
  }

} */
