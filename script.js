gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const howToPlayButtons = document.querySelectorAll('.how-to-play-button');
    const modal = document.getElementById('rulesModal');
    const closeModalButton = document.querySelector('.close-modal');
    const modalRules = document.getElementById('modal-rules');

    const rules = {
        'ultimate-tic-tac-toe': {
            title: 'Ultimate Tic-Tac-Toe',
            rules: [
                {
                    text: 'The game board is a 3x3 grid containing nine smaller 3x3 tic-tac-toe boards. Your goal is to win three smaller boards in a row to claim victory in the ultimate game!',
                    image: 'images/u1.png'
                },
                {
                    text: 'First Move: You can place your mark (X or O) in any cell of any smaller board. Choose wisely, as this sets up the flow of the game!',
                    image: 'images/u2.png'
                },
                {
                    text: 'Next Moves: Here\'s the twist - your move in a small board determines where your opponent must play next. For example, if you play in the top-right cell of any small board, your opponent must play in the top-right large board.',
                    image: 'images/u3.png'
                },
                {
                    text: 'Winning Small Boards: Win a smaller board by getting three marks in a row (horizontal, vertical, or diagonal). Once won, you\'ve claimed that section of the main board!',
                    image: 'images/u4.png'
                },
                {
                    text: 'Strategic Freedom: If you\'re sent to a board that\'s completely filled, you get to play in any available cell on any board. Use this freedom to your advantage!',
                    image: 'images/u5.png'
                },
                {
                    text: 'Victory Condition: Win the game by claiming three small boards in a row on the main grid. Think ahead and plan your moves carefully!',
                    image: 'images/u6.png'
                },
                {
                    text: 'Draws: If all smaller boards are filled and no player has won three in a row, the game ends in a draw. Every move counts in preventing your opponent\'s victory!',
                    image: 'images/u7.png'
                }
            ]
        },
        'tic-tac-toe': {
            title: 'Classic Tic-Tac-Toe',
            rules: [
                {
                    text: 'Take turns placing your mark (X or O) in empty cells on the 3x3 grid.',
                    image: 'images/c1.png'
                },
                {
                    text: 'Get three of your marks in a row (horizontal, vertical, or diagonal) to win!',
                    image: 'images/c2.png'
                },
                {
                    text: 'If all cells are filled and no one has three in a row, the game is a draw.',
                    image: 'images/c3.png'
                }
            ]
        }
    };

    function createRuleElement(rule, index) {
        const ruleContainer = document.createElement('div');
        ruleContainer.className = 'rule-container';

        const textDiv = document.createElement('div');
        textDiv.className = 'rule-text';
        textDiv.innerHTML = `<span class="rule-number">${index + 1}.</span> ${rule.text}`;

        const img = document.createElement('img');
        img.src = rule.image;
        img.alt = `Rule ${index + 1} visualization`;
        img.className = 'rule-image';

        // Add loading animation and error handling for images
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });

        img.addEventListener('error', () => {
            img.src = 'images/placeholder.png'; // Fallback image
            console.log(`Failed to load image: ${rule.image}`);
        });

        ruleContainer.appendChild(textDiv);
        ruleContainer.appendChild(img);

        return ruleContainer;
    }

    function showModal(gameType) {
        const gameRules = rules[gameType];
        
        modalRules.innerHTML = `
            <h2 class="modal-title">${gameRules.title}</h2>
        `;

        gameRules.rules.forEach((rule, index) => {
            modalRules.appendChild(createRuleElement(rule, index));
        });

        modal.style.display = "block";
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Restore scrolling
        modalRules.innerHTML = ''; // Clear modal content
    }

    // Event Listeners
    howToPlayButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const gameType = button.dataset.game;
            showModal(gameType);
        });
    });

    closeModalButton.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // Prevent modal close when clicking inside modal-content
    document.querySelector('.modal-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Add smooth scrolling for rule navigation if needed
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createParticles() {
    const numParticles = 20; //Reduced from 50

    const particles = document.createElement('div');
    particles.className = 'particles';
    document.body.appendChild(particles);

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particles.appendChild(particle);

        gsap.set(particle, {
            x: random(0, window.innerWidth),
            y: random(0, window.innerHeight),
            scale: random(0.5, 1.5)
        });

        animateParticle(particle);
    }
}

function animateParticle(particle) {
    gsap.to(particle, {
        x: random(0, window.innerWidth),
        y: random(0, window.innerHeight),
        duration: random(4, 12), // Slightly slower animation
        ease: 'power1.out', // Smoother ease
        repeat: -1, // Use repeat instead of onComplete for performance
        yoyo: true // Add yoyo for more natural movement
    });
    gsap.to(particle, {
        scale: random(0.5,1.5),
        duration: random(2, 8),
        ease: 'none',
        onComplete: () => animateParticle(particle)
    });

}

createParticles();

// Add GSAP animations here:
gsap.from(".main-title", {
  duration: 1.5,
  y: -50,
  opacity: 0,
  ease: "power2.out"
});

gsap.from(".section-title", {
  duration: 1,
  x: -50,
  opacity: 0,
  ease: "power2.out"
});

gsap.from(".game-grid", {
  duration: 1,
  y: 50,
  opacity: 0,
  ease: "power2.out",
  stagger: 0.2
});

gsap.from(".footer-content", {
  duration: 1.5,
  y: 50,
  opacity: 0,
  ease: "power2.out"
});
