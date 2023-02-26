const imagesURLS = ["a_m","a_r","a","am_a","am_r","am","b_a","b_am","b_m","b_r","m_am","m","r_v","r","v_a","v_m","v"];
function px(x) {
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

function Sopa(w,h,s,color,pelota = {}) {
    this.pelota = pelota;
    this.display = false;
    this.x = this.pelota.x;
    this.y = this.pelota.y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.color = color;
    this.r = 0;
    this.p = 0;

    window.addEventListener("mousedown",(e) => {
        this.display = true;
    })
    window.addEventListener("mousemove",(e) => {
        if(this.display) {

            let x = e.pageX - this.pelota.x;
            let y = e.pageY - this.pelota.y;
            this.r = (Math.atan2(y,x)*180) / Math.PI;
            let distancia = Math.sqrt((e.pageX - this.pelota.x)**2 + (e.pageY - this.pelota.y)**2)-this.pelota.r;
            this.p = distancia < 100 ? distancia : 100;
        }
    })
    window.addEventListener("mouseup",(e)=> {
        if(this.display) {

            let distancia = Math.sqrt((e.pageX - this.pelota.x)**2 + (e.pageY - this.pelota.y)**2)-this.pelota.r;
            if(distancia <= 0) {
                let sx = (this.pelota.x - e.pageX)/2; 
                let sy = (this.pelota.y - e.pageY)/2; 
                this.pelota.sx = sx;
                this.pelota.sy = sy;
                console.log(this.x );
            }
            this.display = false;
        }
    })
}
Sopa.prototype.draw = function() {
    if(this.display) {
        canvas.ctx.save(); 
        canvas.ctx.translate(this.x, this.y); 
        canvas.ctx.rotate((this.r-90) * Math.PI /180);
        canvas.ctx.drawImage(
            game.images[this.color],
            110,
            148,
            140,
            580,
            this.x-512,
            this.y-(750-this.p),
            this.w,
            this.h
        )
        canvas.ctx.restore();
    }
}
Sopa.prototype.update = function() {
    // this.r += .5;
}


function Game(niveles = [],images = [],nivel) {
    this.nivel = nivel;
    this.niveles = niveles;
    this.images = images;
    this.pelotas = [];
    this.sopa = {};
}
Game.prototype.playGame = function() {
    this.pelotas = [];
    this.sopa = {};
    this.niveles[this.nivel-1].forEach(n => {
        this.pelotas.push(new Pelota(px(n.x),py(n.y),px(n.w),py(n.h),px(2.5),0,0,n.colors))
    });
    this.sopa = new Sopa(px(5),py(12),1,"v",this.pelotas[0]);
}
Game.prototype.draw = function() {
    this.pelotas.forEach(p => {
        p.draw();
    })
    this.sopa.draw();
}
Game.prototype.update = function() {
    this.pelotas.forEach(p => {
        p.update();
    })
    this.sopa.update();
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

