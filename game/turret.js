const turret = document.getElementById('turret');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight * 0.90;

let mouseX = centerX;
let mouseY = centerY;
let isShooting = false;
let lastBulletTime = 0;
const bullets = [];

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('mousedown', () => {
    isShooting = true;
});

window.addEventListener('mouseup', () => {
    isShooting = false;
});

// Create a bullet
function shootBullet(baseX, baseY, angle) {
    // Calculate personalized max distance depending on angle
    const baseMaxDistance = window.innerHeight * 0.8;
    const angleStretch = 0.9 / (Math.sin(angle) + 0.001); // Stretch based on sin
    const maxDistance = baseMaxDistance * Math.abs(angleStretch);

    bullets.push({
        x: baseX,
        y: baseY,
        angle: angle,
        distanceTraveled: 0,
        maxDistance: maxDistance
    });
}
function checkCollisions() {
    const bulletSize = window.innerWidth * 0.002;

    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        for (let j = activeBombs.length - 1; j >= 0; j--) {
            const bomb = activeBombs[j];

            if (bullet.x < bomb.x + bomb.width &&
                bullet.x + bulletSize > bomb.x &&
                bullet.y < bomb.y + bomb.height &&
                bullet.y + bulletSize > bomb.y) {

                // Collision detected!
                bullets.splice(i, 1); // Remove bullet

                // Deactivate bomb and clean up
                bomb.isActive = false; // Stops the fall() loop
                bomb.element.remove(); // Remove from DOM
                activeBombs.splice(j, 1); // Remove from array

                console.log("💥 Bullet hit bomb!");
                break;
                }
        }
    }
}

function animate() {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    let angle = Math.atan2(dy, dx);

    // Adjust angle so that "up" means shooting upward
    let displayAngle = angle + Math.PI / 2;

    // Move turret to fixed center
    turret.style.left = `${centerX}px`;
    turret.style.top = `${centerY}px`;
    turret.style.transform = `translate(-50%, -50%) rotate(${displayAngle}rad)`;

    const now = Date.now();

    // Handle shooting
    if (isShooting && now - lastBulletTime > 40) { // 10 bullets/sec
        const turretLength = 30; // Same as turret CSS height
        const tipX = centerX + Math.cos(angle) * turretLength;
        const tipY = centerY + Math.sin(angle) * turretLength;

        shootBullet(tipX, tipY, angle);
        lastBulletTime = now;
    }

    // Update bullets
    const speed = 300 / 60;
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += Math.cos(bullet.angle) * speed;
        bullet.y += Math.sin(bullet.angle) * speed;
        bullet.distanceTraveled += speed;

        if (bullet.distanceTraveled >= bullet.maxDistance) {
            bullets.splice(i, 1);
        }
    }

    // Check for collisions
    checkCollisions();

    // Clear canvas and draw bullets
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    const bulletSize = window.innerWidth * 0.002;

    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
    });

    requestAnimationFrame(animate);
}

animate();
