// Use the existing missile element from the HTML
const player = document.getElementById("missile");

// Initial position (based on screen size)
let x = window.innerWidth * 0.49;  // 50vw
let y = window.innerHeight * 0.88; // 88vh
let angle = -Math.PI / 2; // Facing upward
let launched = false;
const speed = 3;
const turnSpeed = 0.05;

// Position and rotation setup
player.style.left = `${x}px`;
player.style.top = `${y}px`;
player.style.transform = `rotate(${angle + Math.PI / 2}rad)`;

// Track key states
const keys = {
    a: false,
    d: false,
    " ": false
};

// Key down
document.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
    }
});

// Key up
document.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

// Collision detection function
function checkCollision(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// Game loop
function update() {
    // Handle missile rotation
    if (keys["a"]) angle -= turnSpeed;
    if (keys["d"]) angle += turnSpeed;
    if (keys[" "]) launched = true;

    // Move missile if launched
    if (launched) {
        x += Math.cos(angle) * speed;
        y += Math.sin(angle) * speed;
    }

    // Update missile DOM position
    player.style.left = `${x}px`;
    player.style.top = `${y}px`;
    player.style.transform = `rotate(${angle}rad)`;

    // Collision with airplanes
    const missileRect = player.getBoundingClientRect();
    for (let i = window.airplanes.length - 1; i >= 0; i--) {
        const airplane = window.airplanes[i];
        const airplaneRect = airplane.el.getBoundingClientRect();
        if (checkCollision(missileRect, airplaneRect)) {
            console.log("💥 Boom! Hit airplane");

            // Remove airplane from screen and list
            airplane.el.remove();
            window.airplanes.splice(i, 1);

            // Hide the missile
            player.style.display = "none";

            // Stop the missile logic
            launched = false;

            break;
        }
    }

    requestAnimationFrame(update);
}

update();
