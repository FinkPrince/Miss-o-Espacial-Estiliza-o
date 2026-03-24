function mostrarFinalidades(){
    const lista = document.getElementById("finalidades");
    
    if (lista.style.display === "none"){
        lista.style.display = "block";
    } else {
        lista.style.display = "none";
    }
}
function atualizarFoguete(){
    const nome = document.getElementById("nomeFoguete").value;
    const status = document.getElementById("statusFoguete").value;
    const combustivel = document.getElementById("combustivel").value;
    const carga = document.getElementById("carga").value;

    document.getElementById("resFoguete").innerHTML =
       `Nome: ${nome} <br>
         Status: ${status} <br>
         Combustível: ${combustivel} <br>
         Carga: ${carga}`;
}
function atualizarSatelite(){
    const nome = document.getElementById("nomeSatelite").value;
    const orbita = document.getElementById("orbita").value;
    const energia = document.getElementById("energia").value;

    const checkboxes = document.querySelectorAll('#finalidades input:checked');

    let finalidades = [];
    checkboxes.forEach (cb => {
        finalidades.push (cb.value);

    });
    document.getElementById("resSatelite").innerHTML =
        `Nome: ${nome} <br>
         Orbita: ${orbita} <br>
         Energia: ${energia} <br>
         Finalidades: ${finalidades.join(", ")}`;
}

