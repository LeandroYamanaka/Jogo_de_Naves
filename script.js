var dirY,dirX,jog,velJ,posX,posY;
var jogo;
var frames; 
var telaWidth, telaHeight;
var velT;
var contBombas, painelContbombas, velB, tempoBomba;
var totalBombas;
var vidaPlaneta, barraPlaneta;
var Iexplosao, Isom;
var telaMsg;

function teclaDw(){
    var tecla = event.keyCode;
    if(tecla == 37){  //Esquerda
        dirX = -2;  
    }else if(tecla == 39){ //Direita
        dirX = 2;
    }else if(tecla == 38){ //Cima
        dirY = -2;
    }else if(tecla == 40){ //Baixo
        dirY = 2;
    }else if(tecla == 32){  //Espaço
        atirar(posX + 17, posY - 5);
    }
}
function teclaUp(){
    var tecla = event.keyCode;
    if((tecla == 38) || (tecla == 40)){
        dirY = 0;
    }
    if((tecla == 37)||(tecla == 39)){
        dirX = 0;
    }
}

document.addEventListener("keydown", teclaDw);
document.addEventListener("keyup", teclaUp);
window.addEventListener("load", inicia);

function gameLoop(){
    if(jogo){
        //Funções de controle
        controlaJogador();
        controlaTiro();
        controlabomba();
        gerenciaGame();
    }
    frames=requestAnimationFrame(gameLoop);
}

function inicia(){
    jogo = false;
    telaHeight = window.innerHeight;
    telaWidth = window.innerWidth;
    dirX = dirY = 0;
    posX = telaWidth/2;
    posY = telaHeight/2;
    velJ = velT = 5;
    jog = document.getElementById("naveJog");
    jog.style.top = posY + "px";
    jog.style.left = posX + "px";

    contBombas = 150;
    velB = 3;    

    vidaPlaneta = 300;
    barraPlaneta = document.getElementById("barraPlaneta");
    barraPlaneta.style.width = vidaPlaneta + "px";

    Iexplosao = 0;
    Isom = 0;

    telaMsg = document.getElementById("telaMsg");
    telaMsg.style.backgroundImage = "url(./img/inicio1.jpg)";
    telaMsg.style.display = "block";
    document.getElementById("btnJogar").addEventListener("click", reinicia);    
}

function reinicia(){
    totalBombas = document.getElementsByClassName("bomba");
    var tam = totalBombas.length;
    for(var i = 0; i < tam; i++){
        if(totalBombas[i]){
            totalBombas[i].remove();
        }
    }
    telaMsg.style.display = "none";
    cancelAnimationFrame(frames);
    vidaPlaneta = 300;
    posX = telaWidth/2;
    posY = telaHeight/2;
    jog.style.top = posY + "px";
    jog.style.left = posX + "px";
    contBombas = 150;
    jogo = true;    
    tempoBomba = setInterval(bombas, 1500);
    gameLoop();
}

function controlaJogador(){
    posY += dirY * velJ;
    posX += dirX * velJ;
    jog.style.top = posY + "px";
    jog.style.left = posX + "px";
}

function atirar(x,y){
    var tiro = document.createElement("div");
    var attr1 = document.createAttribute("class");
    var attr2 = document.createAttribute("style");
    
    attr1.value = "tiroJog";
    attr2.value = "top:" + y + "px; left:" + x + "px";
    tiro.setAttributeNode(attr1);
    tiro.setAttributeNode(attr2);
    document.body.appendChild(tiro);

}

function controlaTiro(){
    var tiros = document.getElementsByClassName("tiroJog");
    var tamanho = tiros.length;
    for(var i = 0; i < tamanho; i++){
        if(tiros[i]){
            var posTiro = tiros[i].offsetTop;
            posTiro -= velT;
            tiros[i].style.top = posTiro + "px";
            colisaoTiro(tiros[i]);
            if(posTiro < 0){
                tiros[i].remove();
            }
        }
    }
}

function bombas(){
    if(jogo){
        var y = 0;
        var x = Math.random()*telaWidth;
        var bomba = document.createElement("div");
        var attr1 = document.createAttribute("class");
        var attr2 = document.createAttribute("style");
        attr1.value = "bomba";
        attr2.value = "top:" + y + "px; left:" + x + "px";
        bomba.setAttributeNode(attr1);
        bomba.setAttributeNode(attr2);
        document.body.appendChild(bomba);
        contBombas--;
    }
}

function controlabomba(){
    totalBombas = document.getElementsByClassName("bomba");
    var tam = totalBombas.length;
    for(var i = 0; i < tam; i++){
        if(totalBombas[i]){
            var posBomba = totalBombas[i].offsetTop;
            posBomba += velB;
            totalBombas[i].style.top = posBomba + "px";
            if(posBomba > telaHeight){
                vidaPlaneta -= 10;
                criaExplosao(2, totalBombas[i].offsetLeft, null );
                totalBombas[i].remove();
            }
        }
    }
}

function colisaoTiro(tiro){
    var tamanho = totalBombas.length;
    for(var i = 0; i < tamanho; i++){
        if(totalBombas[i]){
            if((
                (tiro.offsetTop <= (totalBombas[i].offsetTop + 40)) && // cima tiro com baixo bomba
                ((tiro.offsetTop + 20) >= (totalBombas[i].offsetTop))  // baixo tiro com cima bomba
            )&&
            (
                (tiro.offsetLeft <= (totalBombas[i].offsetLeft + 24))&& //esquerda tiro com direita bomba
                ((tiro.offsetLeft + 5) >= totalBombas[i].offsetLeft)    //direita tiro com esquerda bomba
            )
            ){
                criaExplosao(1, totalBombas[i].offsetLeft - 25, totalBombas[i].offsetTop );
                totalBombas[i].remove();
                tiro.remove();
            }
        }
    }
}

function criaExplosao(tipo,x,y){ //tipo 1=AR tipo 2=Chao
    if(document.getElementById("explosao" + (Iexplosao - 4))){
        document.getElementById("explosao" + (Iexplosao - 4)).remove();
    }
    var explosao = document.createElement("div");
    var img = document.createElement("img");
    var som = document.createElement("audio");
    //attr div
    var attr1 = document.createAttribute("class");
    var attr2 = document.createAttribute("style");
    var attr3 = document.createAttribute("id");
    //attr imagem
    var attr4 = document.createAttribute("src");
    //attr audio
    var attr5 = document.createAttribute("src");
    var attr6 = document.createAttribute("id");
    attr3.value = "explosao" + Iexplosao;
    
    if(tipo == 1) {
        attr1.value = "explosaoAr";
        attr2.value = "top:" + y + "px; left:" + x + "px";
        attr4.value = "./img/explosao_ar.gif?" + new Date();
    }else {
        attr1.value = "explosaoChao";
        attr2.value = "top:" + (telaHeight - 57) + "px; left:" + (x - 17) + "px";
        attr4.value = "./img/explosao_chao.gif?" + new Date();
    }
    attr5.value = "./som/exp1.mp3?" + new Date();
    attr6.value = "som" + Isom;
    explosao.setAttributeNode(attr1);
    explosao.setAttributeNode(attr2);
    explosao.setAttributeNode(attr3);
    img.setAttributeNode(attr4);
    som.setAttributeNode(attr5);
    som.setAttributeNode(attr6);
    explosao.appendChild(img);
    explosao.appendChild(som);
    document.body.appendChild(explosao);
    document.getElementById("som" + Isom).play();

    Iexplosao++;
    Isom++;
}

function gerenciaGame(){
    barraPlaneta.style.width = vidaPlaneta + "px";
    if(contBombas <= 0){
        jogo = false;
        clearInterval(tempoBomba);
        telaMsg.style.backgroundImage = "url(./img/win1.jpg)";
        telaMsg.style.display = "block";
    }
    if(vidaPlaneta <= 0){
        jogo = false;
        clearInterval(tempoBomba);
        telaMsg.style.backgroundImage = "url(./img/lose1.jpg)";
        telaMsg.style.display = "block";
    }
}

