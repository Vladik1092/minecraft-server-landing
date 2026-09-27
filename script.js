const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let W, H;
function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);


const PX = 4;


const blockTypes = [
    
    {
        name: 'grass',
        colors: ['#6aa84f', '#7fbf5f', '#5c8f3f', '#8b5a2b', '#6b4423', '#7a5230']
    },
    {
        name: 'dirt',
        colors: ['#8b5a2b', '#7a5230', '#6b4423', '#9c6b3a']
    },

    {
        name: 'stone',
        colors: ['#7f7f7f', '#8c8c8c', '#6e6e6e', '#9a9a9a']
    },

    {
        name: 'diamond',
        colors: ['#4aedd9', '#2bc4b0', '#7ff5e8', '#1a9c8a']
    },
   
    {
        name: 'gold',
        colors: ['#fcd34d', '#fbbf24', '#f59e0b', '#d97706']
    },
    {
        name: 'redstone',
        colors: ['#c0392b', '#e74c3c', '#a93226', '#ff6b5b']
    }

];


function drawBlock(x, y, size, type, alpha = 1) {
    const cell = size / 8;
    ctx.globalAlpha = alpha;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            
            let color;
            if (type.name === 'grass') {
                color = (i < 2)
                    ? type.colors[Math.floor(Math.random() * 3)]
                    : type.colors[3 + Math.floor(Math.random() * 3)];
            } else {
                color = type.colors[Math.floor(Math.random() * type.colors.length)];
            }
            ctx.fillStyle = color;
            ctx.fillRect(x + j * cell, y + i * cell, cell, cell);
        }
    }

   
    ctx.globalAlpha = alpha * 0.4;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    ctx.globalAlpha = 1;
}


class FallingBlock {
    constructor(init = false) {
        this.size = 40 + Math.floor(Math.random() * 3) * 20; // 40, 60, 80
        this.type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        this.x = Math.random() * (W - this.size);
        this.y = init ? Math.random() * H : -this.size;
        this.speed = 0.5 + Math.random() * 1.5;
        this.rotation = 0;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.alpha = 0.35 + Math.random() * 0.35; 
        this.pattern = this._makePattern();
    }

    _makePattern() {
        const p = [];
        for (let i = 0; i < 8; i++) {
            const row = [];
            for (let j = 0; j < 8; j++) {
                let c;
                if (this.type.name === 'grass') {
                    c = (i < 2)
                        ? this.type.colors[Math.floor(Math.random() * 3)]
                        : this.type.colors[3 + Math.floor(Math.random() * 3)];
                } else {
                    c = this.type.colors[Math.floor(Math.random() * this.type.colors.length)];
                }
                row.push(c);
            }
            p.push(row);
        }
        return p;
    }

    update(dt) {
        this.y += this.speed * dt * 0.06;
        this.rotation += this.rotSpeed;
        if (this.y > H + this.size) {
          
            this.y = -this.size;
            this.x = Math.random() * (W - this.size);
            this.type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            this.pattern = this._makePattern();
            this.speed = 0.5 + Math.random() * 1.5;
        }
    }

    draw() {
        const cell = this.size / 8;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);

     
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                ctx.fillStyle = this.pattern[i][j];
                ctx.fillRect(
                    -this.size / 2 + j * cell,
                    -this.size / 2 + i * cell,
                    cell, cell
                );
            }
        }

       
        ctx.globalAlpha = this.alpha * 0.5;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);

        ctx.restore();
    }
}


const blocks = [];
const BLOCK_COUNT = 15;
for (let i = 0; i < BLOCK_COUNT; i++) {
    blocks.push(new FallingBlock(true));
}


function drawSky() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1e3a5f');   // тёмно-синий верх
    grad.addColorStop(0.5, '#2c5a7c');
    grad.addColorStop(1, '#1a2a1a');   // тёмно-зелёный низ
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
}


let last = performance.now();
function loop(now) {
    const dt = now - last;
    last = now;

    drawSky();

    
    for (const b of blocks) {
        b.update(dt);
        b.draw();
    }

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-arrow.prev');
const nextBtn = document.querySelector('.slider-arrow.next');

let currentSlide = 0;
let slideTimer = null;

function goToSlide(index) {
    
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAuto();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAuto();
});

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index));
        resetAuto();
    });
});


function startAuto() {
    slideTimer = setInterval(nextSlide, 6000);
}
function resetAuto() {
    clearInterval(slideTimer);
    startAuto();
}
startAuto();


document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prevSlide(); resetAuto(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAuto(); }
});