var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Define rectangles
var rectangles = [];

let selectedRectangle = null;

// Draw rectangles function
function drawRectangles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    for (let rect of rectangles) {
        // Draw border first
        ctx.strokeStyle = rect.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // Draw fill with transparency
        ctx.fillStyle = rect.fillColor;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
}

// Collision detection function
function checkCollision() {
    for (let i = 0; i < rectangles.length; i++) {
        for (let j = i+1; j < rectangles.length; j++) {
            let rect1 = rectangles[i];
            let rect2 = rectangles[j];

            if (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            ) {
                rect1.borderColor = 'red';
                rect1.fillColor= 'rgba(255, 116, 51, 0.6)';
                rect2.borderColor = 'red';
                rect2.fillColor= 'rgba(255, 116, 51, 0.6)';
            } else {
                rect1.borderColor = 'blue';
                rect1.fillColor = 'rgba(173, 216, 230, 0.6)';
                rect2.borderColor = 'blue';
                rect2.fillColor = 'rgba(173, 216, 230, 0.6)';
            }
        }
    }
}

// Mouse event listeners
canvas.addEventListener('mousedown', function(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Check if the mouse is over any rectangle
    for (let rect of rectangles) {
        if (
            mouseX > rect.x &&
            mouseX < rect.x + rect.width &&
            mouseY > rect.y &&
            mouseY < rect.y + rect.height
        ) {
            rect.isDragging = true;
            selectedRectangle = rect;
            break;
        }
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (selectedRectangle && selectedRectangle.isDragging) {
        let mouseX = event.clientX - canvas.getBoundingClientRect().left;
        let mouseY = event.clientY - canvas.getBoundingClientRect().top;

        // Clamp the position to prevent going outside the canvas boundaries
        selectedRectangle.x = Math.min(
            Math.max(mouseX - selectedRectangle.width / 2, 0),
            canvas.width - selectedRectangle.width
        );

        selectedRectangle.y = Math.min(
            Math.max(mouseY - selectedRectangle.height / 2, 0),
            canvas.height - selectedRectangle.height
        );

        checkCollision(); // Check for collision after moving
        drawRectangles(); // Redraw rectangles
    }
});

canvas.addEventListener('mouseup', function() {
    if (selectedRectangle) {
        selectedRectangle.isDragging = false;
        selectedRectangle = null;
    }
});

canvas.addEventListener('mouseleave', function() {
    if (selectedRectangle) {
        selectedRectangle.isDragging = false;
        selectedRectangle = null;
    }
});

// Resize canvas to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawRectangles(); // Redraw rectangles after resizing
}

// Resize the canvas initially and whenever the window is resized
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Add event listener for the generate button
document.getElementById('generateBtn').addEventListener('click', function() {
    let width = parseInt(document.getElementById('rectWidth').value);
    let height = parseInt(document.getElementById('rectHeight').value);

    if (!isNaN(width) && width > 0 && !isNaN(height) && height > 0) {
        // Generate a new rectangle with random position within the canvas boundaries
        let newRect = {
            x: 10,
            y: 70,
            width: width,
            height: height,
            fillColor: 'rgba(173, 216, 230, 0.6)',
            borderColor: 'blue',
            isDragging: false
        };

        rectangles.push(newRect);
        checkCollision();
        drawRectangles();
    } else {
        alert('Please enter valid dimensions (positive numbers).');
    }
});

// Initial draw
drawRectangles();
