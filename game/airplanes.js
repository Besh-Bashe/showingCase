window.gameStarted = window.gameStarted || false;

// Track all airplanes and bombs
window.airplanes = [];
window.activeBombs = [];
const totalAirplanes = 1; // Default starting amount

// Spawn airplanes with CSS-based image and separate hitbox
function spawnAirplanes() {
    // 🔥 Clear previous airplanes if any
    document.querySelectorAll('.airplane-container').forEach(el => el.remove());
    window.airplanes = [];

    for (let i = 0; i < totalAirplanes; i++) {
        // Create elements
        const container = document.createElement("div");
        const visual = document.createElement("div");
        const hitbox = document.createElement("div");

        // 🔥 MUST add classes before appending
        container.className = "airplane-container";
        visual.className = "airplane-visual";
        hitbox.className = "airplane-hitbox";

        // 🔥 Assemble BEFORE positioning
        container.appendChild(visual);
        container.appendChild(hitbox);
        document.body.appendChild(container);

        // Position (unchanged)
        const startY = 5 + Math.random() * 5;
        const startX = Math.random() < 0.5 ? 0 : 100;
        const direction = startX === 0 ? 1 : -1;

        container.style.top = `${startY}vh`;
        container.style.left = `${startX}vw`;

        if (direction === -1) {
            visual.style.transform = 'scaleX(-1)';
        }

        // Store reference
        window.airplanes.push({
            el: container,
            hitbox: hitbox,
            visual: visual,
            x: startX,
            y: startY,
            speed: 0.3 + Math.random() * 0.2,
                              dir: direction,
                              lastBombTime: 0
        });
    }
}

// Move airplanes across screen
function moveAirplanes() {
    const screenWidth = window.innerWidth;

    for (let i = airplanes.length - 1; i >= 0; i--) {
        const a = airplanes[i];
        const airplaneWidth = a.el.offsetWidth;
        const airplaneX = (a.x / 100) * screenWidth;

        // Update position
        a.x += a.speed * a.dir;
        a.el.style.left = `${a.x}vw`;

        // Reverse direction at screen edges
        if ((a.dir === 1 && airplaneX + airplaneWidth >= screenWidth) ||
            (a.dir === -1 && airplaneX <= 0)) {
            a.dir *= -1;
        a.visual.style.transform = a.dir === 1 ? 'scaleX(1)' : 'scaleX(-1)';
            }
    }
}

// Drop bombs (unchanged from original)
function dropBomb(airplane) {
    const bomb = document.createElement("div");
    bomb.classList.add("bomb");

    const rect = airplane.hitbox.getBoundingClientRect(); // Now using hitbox for collision
    const left = rect.left + rect.width / 2;
    const top = rect.top + rect.height;

    bomb.style.left = `${left}px`;
    bomb.style.top = `${top}px`;
    document.body.appendChild(bomb);

    const bombObj = {
        element: bomb,
        x: left,
        y: top,
        width: 10,
        height: 15,
        isActive: true
    };
    activeBombs.push(bombObj);

    // Bomb falling animation
    function fall() {
        if (!bombObj.isActive) return;

        bombObj.y += 2;
        bombObj.element.style.top = `${bombObj.y}px`;

        // Check building collisions
        const buildings = document.querySelectorAll('.building');
        buildings.forEach(building => {
            const buildingRect = building.getBoundingClientRect();
            if (bombObj.y + bombObj.height > buildingRect.top &&
                bombObj.y < buildingRect.bottom &&
                bombObj.x + bombObj.width > buildingRect.left &&
                bombObj.x < buildingRect.right) {
                // Hit building
                building.remove();
            bombObj.isActive = false;
            bombObj.element.remove();
            return;
                }
        });

        if (bombObj.isActive && bombObj.y < window.innerHeight) {
            requestAnimationFrame(fall);
        } else if (bombObj.isActive) {
            bombObj.element.remove();
            activeBombs.splice(activeBombs.indexOf(bombObj), 1);
        }
    }
    fall();
}

// Main game loop
function updateAirplanes() {
    if (!window.gameStarted) {
        requestAnimationFrame(updateAirplanes);
        return;
    }

    moveAirplanes();

    const currentTime = Date.now();
    for (let airplane of airplanes) {
        if (currentTime - airplane.lastBombTime > 3000 && Math.random() < 0.3) {
            dropBomb(airplane);
            airplane.lastBombTime = currentTime;
        }
    }

    requestAnimationFrame(updateAirplanes);
}

// Initialize
spawnAirplanes();
updateAirplanes();
