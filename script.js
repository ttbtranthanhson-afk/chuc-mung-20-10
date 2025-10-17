// ===================== CẤU HÌNH & TRUY CẬP PHẦN TỬ =====================
const DOT_COUNT = 800; // Tăng số lượng hạt
const DOT_SCALE = 12;  // Giảm tỷ lệ hạt
const IMAGE_SCALE = 20;

const mainContainer = document.querySelector('.main-container');
const dotHeartContainer = document.getElementById('dot-heart-container');
const imageHeartContainer = document.getElementById('image-heart-container');
const petalContainer = document.getElementById('petal-container');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const greetingEl = document.getElementById('greeting');

let dots = [];
const dotColors = ['#9333ea', '#a855f7', '#d8b4fe', '#ec4899', '#f472b6', '#ffcad4'];
const images = [
    "https://placehold.co/100x100/ec4899/ffffff?text=1", "https://placehold.co/100x100/a855f7/ffffff?text=2",
    "https://placehold.co/100x100/9333ea/ffffff?text=3", "https://placehold.co/100x100/d8b4fe/ffffff?text=4",
    "https://placehold.co/100x100/f472b6/ffffff?text=5", "https://placehold.co/100x100/ec4899/ffffff?text=6",
    "https://placehold.co/100x100/a855f7/ffffff?text=7", "https://placehold.co/100x100/9333ea/ffffff?text=8",
    "https://placehold.co/100x100/d8b4fe/ffffff?text=9", "https://placehold.co/100x100/f472b6/ffffff?text=10",
    "https://placehold.co/100x100/ec4899/ffffff?text=11", "https://placehold.co/100x100/a855f7/ffffff?text=12",
];

// ===================== HÀM TOÁN HỌC TRÁI TIM =====================
function getHeartCoords(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: x * scale, y: -y * scale };
}

// ===================== TẠO TRÁI TIM CHẤM (DOT HEART) =====================
function generateDotHeart() {
    dots = [];
    dotHeartContainer.innerHTML = '';

    const numSteps = DOT_COUNT;
    const centerX = dotHeartContainer.clientWidth / 2;
    const centerY = dotHeartContainer.clientHeight / 2;

    for (let i = 0; i < numSteps; i++) {
        const t = (i / numSteps) * (2 * Math.PI);
        const { x, y } = getHeartCoords(t, DOT_SCALE);

        const dotEl = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const color = dotColors[Math.floor(Math.random() * dotColors.length)];

        dotEl.className = 'dot';
        dotEl.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            left: ${centerX + x - size / 2}px;
            top: ${centerY + y - size / 2}px;
        `;

        dotHeartContainer.appendChild(dotEl);

        // Lưu trữ dữ liệu hạt cho animation (Logic Code 2)
        dots.push({
            element: dotEl,
            x: centerX + x,
            y: centerY + y,
            baseX: centerX + x,
            baseY: centerY + y,
            vx: 0,
            vy: 0,
            repelRadius: 70
        });
    }
}

// ===================== HIỆU ỨNG DI CHUỘT (SPRING/REPULSION - Logic Code 2) =====================

const pointer = { x: undefined, y: undefined };
const friction = 0.85;
const spring = 0.05;

// Listener Cảm ứng/Chuột
dotHeartContainer.addEventListener('mousemove', (e) => {
    const rect = dotHeartContainer.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
});
dotHeartContainer.addEventListener('mouseleave', () => {
    pointer.x = undefined;
    pointer.y = undefined;
});
dotHeartContainer.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
        const rect = dotHeartContainer.getBoundingClientRect();
        pointer.x = e.touches[0].clientX - rect.left;
        pointer.y = e.touches[0].clientY - rect.top;
        e.preventDefault();
    }
});
dotHeartContainer.addEventListener('touchend', () => {
    pointer.x = undefined;
    pointer.y = undefined;
});


function animateDots() {
    const hasPointerInteraction = pointer.x !== undefined && pointer.y !== undefined;

    dots.forEach(p => {
        let dx, dy, dist;

        if (hasPointerInteraction) {
            dx = pointer.x - p.x;
            dy = pointer.y - p.y;
            dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < p.repelRadius) {
                // Lực đẩy
                const angle = Math.atan2(dy, dx);
                const force = (p.repelRadius - dist) / p.repelRadius;

                p.vx -= Math.cos(angle) * force * 1.5;
                p.vy -= Math.sin(angle) * force * 1.5;
            }
        }

        // Lực đàn hồi kéo về (Spring)
        const accX = (p.baseX - p.x) * spring;
        const accY = (p.baseY - p.y) * spring;

        p.vx += accX;
        p.vy += accY;

        // Ma sát
        p.vx *= friction;
        p.vy *= friction;

        // Cập nhật vị trí
        p.x += p.vx;
        p.y += p.vy;

        // Cập nhật DOM
        const offsetX = p.x - p.baseX;
        const offsetY = p.y - p.baseY;
        p.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    requestAnimationFrame(animateDots);
}

// ===================== TẠO TRÁI TIM ẢNH =====================
function generateImageHeart() {
    imageHeartContainer.innerHTML = '';

    const IMAGE_COUNT = images.length;
    const centerX = imageHeartContainer.clientWidth / 2;
    const centerY = imageHeartContainer.clientHeight / 2;
    const size = 100;

    for (let i = 0; i < IMAGE_COUNT; i++) {
        const t = (i / IMAGE_COUNT) * (2 * Math.PI);
        const { x, y } = getHeartCoords(t, IMAGE_SCALE);

        const imgEl = document.createElement('img');
        imgEl.src = images[i];
        imgEl.alt = `Ảnh ${i + 1}`;

        imgEl.onerror = () => { imgEl.src = `https://placehold.co/${size}x${size}/8e44ad/ffffff?text=20/10`; };

        imgEl.style.left = `${centerX + x - size / 2}px`;
        imgEl.style.top = `${centerY + y - size / 2}px`;

        imageHeartContainer.appendChild(imgEl);
    }
}

// ===================== HIỆU ỨNG CÁNH HOA RƠI =====================
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';

    petal.style.left = `${Math.random() * 100}vw`;
    const duration = Math.random() * 10 + 5;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;

    const size = Math.random() * 10 + 5;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;

    petalContainer.appendChild(petal);

    setTimeout(() => petal.remove(), (duration + parseFloat(petal.style.animationDelay)) * 1000);
}

let petalInterval;
function startPetalFall() {
    if (petalInterval) clearInterval(petalInterval);
    // Tăng tốc độ tạo cánh hoa (100ms)
    petalInterval = setInterval(createPetal, 100);
}

// ===================== LỜI CHÚC THAY ĐỔI =====================
const greetings = [
    "Chúc bạn luôn xinh đẹp, tự tin và rạng rỡ như những bông hoa ngày 20/10 💐",
    "Chúc bạn mãi tươi trẻ, hạnh phúc và tràn đầy yêu thương ❤️",
    "Chúc bạn luôn mỉm cười và gặp nhiều điều may mắn trong cuộc sống 🌸",
    "Cảm ơn bạn vì đã làm cho thế giới này trở nên dịu dàng hơn 💖"
];

let greetingInterval;
function changeGreeting() {
    let idx = Math.floor(Math.random() * greetings.length);
    greetingEl.textContent = greetings[idx];
}

function startGreetingCycle() {
    if (greetingInterval) clearInterval(greetingInterval);
    setInterval(changeGreeting, 30000);
}

// ===================== NÚT NHẠC =====================
let isPlaying = false;
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.textContent = "🔊 Bật nhạc";
    } else {
        bgMusic.play().catch(error => console.log("Lỗi phát nhạc:", error));
        musicBtn.textContent = "🔇 Tắt nhạc";
    }
    isPlaying = !isPlaying;
});

// ===================== KHỞI TẠO CHÍNH =====================
function init() {
    // Điều chỉnh kích thước container chính
    const size = Math.min(window.innerWidth, window.innerHeight, 800) * 0.9;
    mainContainer.style.width = `${size}px`;
    mainContainer.style.height = `${size}px`;

    // Tái tạo các hiệu ứng
    generateDotHeart();
    generateImageHeart();

    // Khởi động vòng lặp
    startPetalFall();
    startGreetingCycle();
    animateDots(); // Bắt đầu vòng lặp animation hạt
}

window.onload = init;
window.addEventListener('resize', init);
