// Game Variables
let score = 0;
let tappingPower = 1000; // Starting power
let level = 1;
let tapPowerIncrease = 5; // Default tapping power decrease
let currentFrogSkinIndex = 0; // Track which frog skin is currently active

const frogSkins = [
    'images/frog.png',
    'images/frog2.png',
    'images/frog3.png',
    'images/frog4.png',
    'images/frog5.png',
    'images/frog6.png',
    'images/frog7.png',
    'images/frog8.png',
    'images/frog9.png',
    'images/frog10.png'
];

// User Variables
let users = {}; // To store users by ID
let currentUser = {
    id: Math.random().toString(36).substr(2, 9), // Generating a unique ID
    referralCode: '', // This will store the user's unique referral code
    referCount: 0 // Count of how many users they have referred
};

// Generate a unique referral code based on the user ID
currentUser.referralCode = currentUser.id; // Using user ID as referral code
users[currentUser.id] = currentUser; // Store current user

// DOM Elements
const frog = document.getElementById('frog');
const scoreboard = document.getElementById('score');
const powerDisplay = document.getElementById('power');
const levelDisplay = document.getElementById('level');
const powerBarFill = document.getElementById('power-bar-fill');
const referralLinkField = document.getElementById('referral-link');
const copyLinkButton = document.getElementById('copy-link');

const invitePage = document.getElementById('invite-page');
const taskPage = document.getElementById('task-page');
const storePage = document.getElementById('store-page');
const leaderboardPage = document.getElementById('leaderboard-page');

// Prevent zooming when tapping on frog
frog.addEventListener('touchstart', function(event) {
    event.preventDefault(); // Prevent default behavior (zooming)
});

// Prevent zooming on all buttons and input fields
document.querySelectorAll('button, input, textarea').forEach(element => {
    element.addEventListener('touchstart', function(event) {
        event.preventDefault(); // Prevent default behavior (zooming)
    });
});

// Touch management variables
let touchCount = 0; // Track the number of simultaneous touches

// Handle Frog Touch Start Function
function handleFrogTouchStart(event) {
    event.preventDefault(); // Prevent default behavior to avoid any surprises
    if (touchCount === 0) { // Only run if it's the first touch
        handleFrogClick(event);
    }
    touchCount++; // Increment touch count for each touch
}

// Handle Frog Touch End Function
function handleFrogTouchEnd() {
    touchCount--; // Decrement touch count
    if (touchCount <= 0) { // Reset if no touches are active
        touchCount = 0;
    }
}

// Update Score Function
function updateScore() {
    scoreboard.innerText = `SCORE: ${score}`;
}

// Spawn Coin Animation Function
function spawnCoin(x, y) {
    const coin = document.createElement('img');
    coin.src = 'images/coin.png'; // Ensure you have coin.png in your images folder
    coin.classList.add('coin');
    document.getElementById('coin-container').appendChild(coin);

    const targetX = scoreboard.getBoundingClientRect().left + scoreboard.clientWidth / 2 - 25; // Center of scoreboard
    const targetY = scoreboard.getBoundingClientRect().top + scoreboard.clientHeight / 2 - 25;  // Center of scoreboard

    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;

    // Coin animation: Move upward and to the center of the scoreboard
    coin.animate([
        { transform: `translate(0, 0)`, opacity: 1 },
        { transform: `translate(${(targetX - x)}px, ${targetY - y - 50}px)`, opacity: 0 } // Move upwards and horizontally
    ], {
        duration: 1000,
        easing: 'ease-out',
        fill: 'forwards'
    });

    // Remove the coin after the animation
    coin.addEventListener('animationend', () => {
        coin.remove();
    });
}

// Handle Frog Click Function
function handleFrogClick(event) {
    if (tappingPower > 0) {
        tappingPower -= tapPowerIncrease; // Decrease tapping power
        powerDisplay.innerText = `Power: ${tappingPower}`;
        powerBarFill.style.width = `${(tappingPower / 1000) * 100}%`;

        const rect = frog.getBoundingClientRect();

        // Determine coordinates based on whether it's a touch event or a mouse click
        const isTouchEvent = event.type === 'touchstart';
        const x = isTouchEvent ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
        const y = isTouchEvent ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

        spawnCoin(rect.left + x, rect.top + y);
        score += 5; // Increase score
        updateScore(); // Update score display
        checkLevelUp(); // Check for level up
    }
}

// Check Level Up Function
function checkLevelUp() {
    if (score >= level * 5000) {
        level++;
        tappingPower += 50; // Increase tapping power on level up
        levelDisplay.innerText = `Level: ${level}`;
        powerDisplay.innerText = `Power: ${tappingPower}`;
        powerBarFill.style.width = `${(tappingPower / 1000) * 100}%`;

        // Change frog skin based on level
        if (level <= frogSkins.length) {
            currentFrogSkinIndex = level - 1;
            frog.src = frogSkins[currentFrogSkinIndex]; // Change the frog image based on level
        }
    }
}

// Gradually Refill Tapping Power
setInterval(() => {
    if (tappingPower < 1000) {
        tappingPower += 2;
        powerDisplay.innerText = `Power: ${tappingPower}`;
        powerBarFill.style.width = `${(tappingPower / 1000) * 100}%`;
    }
}, 1000);

// Referral Link Generation
function generateReferralLink() {
    const baseURL = window.location.href.split('?')[0];
    return `${baseURL}?ref=${currentUser.referralCode}`;
}

function updateReferralLink() {
    referralLinkField.value = generateReferralLink();
}

// Handle Referral Tracking
function handleReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerCode = urlParams.get('ref');

    if (referrerCode && users[referrerCode]) {
        // New user was referred
        let referrer = users[referrerCode];
        referrer.referCount += 1; // Increment referral count for the referrer
        alert(`You were referred by ${referrerCode}!`);
        // You can reward the referrer here (e.g., increase score or give tokens)
    }
}

// Copy Referral Link to Clipboard
copyLinkButton.onclick = function() {
    referralLinkField.select();
    document.execCommand('copy'); // Copy the link to clipboard
    alert('Referral link copied to clipboard!');
};

// Task Functionality
document.addEventListener('DOMContentLoaded', () => {
    handleReferral(); // Check for referral on page load
    updateReferralLink(); // Update the referral link on the display when the page loads

    // Navigation Button Functionality
    document.getElementById('task-button').onclick = () => {
        taskPage.style.display = 'block'; // Show task page
    };

    document.getElementById('close-task-button').onclick = () => {
        taskPage.style.display = 'none'; // Hide task page
    };

    // Show the invite page when the invite button is clicked
    document.getElementById('invite-button').onclick = () => {
        invitePage.style.display = 'block'; // Show the invite page
        updateReferralLink(); // Update the referral link when the invite page is opened
    };

    document.getElementById('close-invite-button').onclick = () => {
        invitePage.style.display = 'none'; // Hide invite page
    };

    document.getElementById('close-store-button').onclick = () => {
        storePage.style.display = 'none'; // Hide store page
    };

    document.getElementById('store-button').onclick = () => {
        storePage.style.display = 'block'; // Show store page
    };

    // Show leaderboard page when the leaderboard button is clicked
    document.getElementById('leaderboard-button').onclick = () => {
        leaderboardPage.style.display = 'block'; // Show leaderboard page
    };

    // Close leaderboard page
    document.getElementById('close-leaderboard-button').onclick = () => {
        leaderboardPage.style.display = 'none'; // Hide leaderboard page
    };

    // Close leaderboard when the close button is clicked
    document.getElementById('close-leaderboard-btn').onclick = () => {
        leaderboardPage.style.display = 'none'; // Hide leaderboard page
    };

    // Frog Skin Purchase Functionality
    document.querySelectorAll('.buy-skin').forEach(button => {
        button.onclick = () => {
            const skinCost = button.parentElement.getAttribute('data-cost');
            const skinID = button.getAttribute('data-skin-id');

            if (score >= skinCost) {
                score -= skinCost; // Deduct cost from score
                currentFrogSkinIndex = skinID - 1; // Change the skin index
                frog.src = frogSkins[currentFrogSkinIndex]; // Change frog's image
                updateScore(); // Update score display
                button.disabled = true; // Disable the button after purchase
                button.innerText = 'Purchased'; // Change button text
            } else {
                alert('Not enough coins!'); // Alert if not enough coins
            }
        };
    });

    // Add event listeners for frog clicks
    frog.addEventListener('click', handleFrogClick);
    frog.addEventListener('touchstart', handleFrogTouchStart); // Handle mobile touch event
    frog.addEventListener('touchend', handleFrogTouchEnd); // Manage touch end

    // Add event listeners for task completion buttons
    document.querySelectorAll('.complete-task').forEach(button => {
        button.onclick = () => {
            const task = button.getAttribute('data-task');

            switch(task) {
                case 'twitter-follow':
                    alert('Thank you for following us on Twitter! You earned 100 coins!');
                    score += 100; // Increment score by 100
                    updateScore(); // Update displayed score
                    break;
                case 'twitter-like-retweet':
                    alert('Thank you for liking and retweeting! You earned 150 coins!');
                    score += 150; // Increment score by 150
                    updateScore(); // Update displayed score
                    break;
                case 'youtube-subscribe':
                    alert('Thank you for subscribing to our YouTube channel! You earned 200 coins!');
                    score += 200; // Increment score by 200
                    updateScore(); // Update displayed score
                    break;
                case 'facebook-follow':
                    alert('Thank you for following us on Facebook! You earned 100 coins!');
                    score += 100; // Increment score by 100
                    updateScore(); // Update displayed score
                    break;
                default:
                    console.log('Unknown task!');
            }

            button.disabled = true; // Disable button after completion
            button.innerText = 'Completed'; // Change button text to indicate task is completed
        };
    });
});