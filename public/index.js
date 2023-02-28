const imagesURLS = ["a_m","a_r","a","am_a","am_r","am","b_a","b_am","b_m","b_r","m_am","m","r_v","r","v_a","v_m","v"];
function px(x ) {
    return (innerWidth / 100) * x; 
}
function py(y) {
    return (innerHeight / 100) * y; 
}

function Colors(c1,c2) {
    this.c_1 = c1;
    this.c_2 = c2;
}


let game;
function Canvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    document.querySelector("body").appendChild(this.canvas);
}
const canvas = new Canvas();

function Pelota(x = 0,y = 0,w = 100,h = 100,r = 10,sx = 0,sy = 0,colors = []) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = r;
    this.sx = sx;
    this.sy = sy;
    this.colors = colors;
}
Pelota.prototype.draw = function() {
  
    canvas.ctx.drawImage(
        game.images[this.colors.c1+"_"+this.colors.c2],
        60,
        60,
        307,
        307,
        this.x-this.w/2.6,
        this.y-this.w/2.6,
        this.w,
        this.w
    );
    canvas.ctx.beginPath();
    canvas.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    canvas.ctx.stroke();
}
Pelota.prototype.update = function() {
    this.x += this.sx;
    this.y += this.sy;
    if(this.x + this.r >= innerWidth)this.sx = this.sx *-1;
    if(this.x-this.r <= 0) this.sx = Math.abs(this.sx);
    if(this.y + this.r >= innerHeight)this.sy = this.sy *-1;
    if(this.y-this.r <= 0) this.sy = Math.abs(this.sy);
}

function Neshan(pelota) {
    this.pelota = pelota;
    this.display = false;
    this.x = -100;
    this.y = -100;
    this.r = 2;
    this.x2 = -100;
    this.y2 = -100;
    this.r2 = 2;
    this.x3 = 0;
    this.y3 = 0;

    window.addEventListener("mousemove",(e)=> {
        
        if(this.display)this.move(e.pageX,e.pageY);

    })
    window.addEventListener("mouseup",(e)=> {
        this.up(e.pageX,e.pageY);
    })

}
Neshan.prototype.draw = function() {
    if(this.display && this.x > 0) {
        canvas.ctx.strokeStyle = "#e11717";
        canvas.ctx.moveTo(this.pelota.x,this.pelota.y);
        canvas.ctx.lineTo(this.x,this.y);
        canvas.ctx.stroke();
        canvas.ctx.beginPath();
        canvas.ctx.fillStyle = "#e11717";
        canvas.ctx.arc(this.x,this.y, px(this.r), 0, 2 * Math.PI);
        canvas.ctx.fill();
        canvas.ctx.stroke();
        canvas.ctx.moveTo(this.pelota.x,this.pelota.y);
        canvas.ctx.lineTo(this.x2,this.y2);
        canvas.ctx.lineTo(this.x2+this.x3,this.y2+this.y3);
        canvas.ctx.stroke();
        canvas.ctx.beginPath();
        canvas.ctx.strokeStyle = "#e11717";
        canvas.ctx.arc(this.x2,this.y2, px(this.r2), 0, 2 * Math.PI);
        canvas.ctx.stroke();
    }
}
Neshan.prototype.move = function(x,y) {
    
    this.x = x;
    this.y = y;

    this.x2 = this.pelota.x + (this.pelota.x - x)*10;
    this.y2 = this.pelota.y + (this.pelota.y - y)*10;

    if(this.x2 >= innerWidth)this.x2 = innerWidth-px(this.r2*3);
    if(this.x2 <= 0)this.x2 = px(this.r2);
    if(this.y2 >= innerHeight)this.y2 = innerHeight-px(this.r2*3);
    if(this.y2 <= 0)this.y2 = px(this.r2);

    game.pelotas.forEach((p) => {
        let distancia = Math.sqrt((this.x2-p.x)**2 + (this.y2-p.y)**2);
        if(distancia < px(p.r)) {
            this.x3 = (p.x - this.x2)*10;
            this.y3 = (p.y - this.y2)*10;
            
        }
        if(distancia >= px(p.r*3)) {
            this.x3 = 0;
            this.y3 = 0;
        }
    })

}
Neshan.prototype.up = function(px,py) {
    this.display = false;
    let sx = (this.pelota.x - px)/10;
    let sy = (this.pelota.y - py)/10;
    this.pelota.sx = sx;
    this.pelota.sy = sy;
}




function Game(niveles = [],images = [],nivel) {
    this.nivel = nivel;
    this.niveles = niveles;
    this.images = images;
    this.pelotas = [];
    this.neshan = new Neshan(this.pelotas[0]);

    window.addEventListener("mousedown",(e)=> {
        this.pelotas.forEach((p)=> {
            let distancia = Math.sqrt((e.pageX-p.x)**2 + (e.pageY-p.y)**2);
            if(distancia <= p.r) {
                this.neshan.pelota = p;
                this.neshan.display = true;
            }
        })
    })
} 
Game.prototype.playGame = function() {
    this.pelotas = [];
    this.niveles[this.nivel-1].forEach(n => {
        this.pelotas.push(new Pelota(px(n.x),py(n.y),px(n.w),py(n.h),px(2.5),0,0,n.colors))
    });
   
}
Game.prototype.draw = function() {
    this.neshan.draw();
    this.pelotas.forEach(p => {
        p.draw();
    })
    
}
Game.prototype.update = function() {
    this.pelotas.forEach(p => {
        p.update();
    })

    for (let index1 = 0; index1 < this.pelotas.length; index1++) {
        let p1 = this.pelotas[index1];
        for (let index2 = 0; index2 < this.pelotas.length; index2++) {
            let p2 = this.pelotas[index2];
            let distancia = Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
            if(index1 !== index2 && distancia <= p2.r*2) {
                let sx = (p2.x - p1.x) / 10;
                let sy = (p2.y - p1.y) / 10;
                p2.sx = sx;
                p2.sy = sy;
            }
            
        }
        
    }
}

function anim() {
    requestAnimationFrame(anim);
    canvas.ctx.clearRect(0,0,innerWidth,innerHeight);
    game.draw();
    game.update();
}

function downloadNiveles() {
    let http = new XMLHttpRequest();
    http.open("POST","/niveles",true);
    http.onreadystatechange = function() {
        if(http.status == 200 && http.readyState == 4) {
            let images = {};
            let n = 0;
            imagesURLS.forEach(i => {
                let image = new Image();
                image.src = "./images/"+i+".png";
                image.onload = ()=> {
                    n++;
                    images[i] = image;
                    if(n >= imagesURLS.length) {
                        game = new Game(JSON.parse(http.responseText),images,1);
                        game.playGame();
                        anim();
                    }
                };
            })
        }
    }
    http.send();
}
downloadNiveles();

let data =  [{id:"sfbksnfñ",name:"sina",edad:22},{id:"shsl541",name:"mani",edad:18}];

function Sina(nombre,edad,id) {
    this.id = id
    this.paszamine = document.createElement("div");
    this.name = document.createElement("h1");
    this.name.innerHTML = nombre;
    this.edad = document.createElement("h1");
    this.edad.innerHTML = edad;

    this.paszamine.addEventListener("click",()=> {
        alert(this.id);
    })

}
Sina.prototype.appendChild = function(apend = document.querySelector("body")) {
    this.paszamine.appendChild(this.name);
    this.paszamine.appendChild(this.edad);
    apend.appendChild(this.paszamine);

}

data.forEach(data => {
    let newp  = new Sina(data.name,data.edad,data.id);
    newp.appendChild();

})





