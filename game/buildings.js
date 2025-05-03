// Array of building image paths (replace with your actual images)
const buildingImages = [
    "images/building.webp",
"images/hospital.webp",
"images/school.webp",



// Add more as needed
];

// Y-position (adjust to match dome's base)
const buildingYPosition = '-2%'; // Example: slightly above turret

// X-position ranges (left and right of dome)
const leftBuildingX = '20%';   // Left of dome
const rightBuildingX = '70%';  // Right of dome

function placeBuildings() {
    const container = document.getElementById('buildings-container');

    // Shuffle array to pick random unique buildings
    const shuffledBuildings = [...buildingImages].sort(() => 0.5 - Math.random());

    // Create left building
    const leftBuilding = document.createElement('img');
    leftBuilding.src = shuffledBuildings[0];
    leftBuilding.className = 'building';
    leftBuilding.style.left = leftBuildingX;
    leftBuilding.style.bottom = buildingYPosition;
    container.appendChild(leftBuilding);

    // Create right building
    const rightBuilding = document.createElement('img');
    rightBuilding.src = shuffledBuildings[1];
    rightBuilding.className = 'building';
    rightBuilding.style.left = rightBuildingX;
    rightBuilding.style.bottom = buildingYPosition;
    container.appendChild(rightBuilding);
}

// Initialize buildings when game starts
placeBuildings();
