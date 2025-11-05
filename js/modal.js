// js/modal.js
import { gameState } from './state.js';
import { changePlayerName } from './gameLogic.js';

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block'; // Láthatóvá tesszük
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none'; // Eltüntetjük
    }
}

export function initializeProfileModal() {
    const profileBtn = document.getElementById('profile-button');
    const modal = document.getElementById('profile-modal');
    // MÓDOSÍTVA: A bezárás gomb új ID-ja
    const closeModalBtn = document.getElementById('close-modal-button');
    const saveNameBtn = document.getElementById('save-username-button');
    const nameInput = document.getElementById('username-input');

    if (!profileBtn || !modal || !closeModalBtn || !saveNameBtn || !nameInput) {
        console.warn("Profile modal elements not found, skipping initialization.");
        return;
    }

    profileBtn.addEventListener('click', () => {
        nameInput.value = gameState.player.username;
        nameInput.focus();
        openModal('profile-modal');
    });

    closeModalBtn.addEventListener('click', () => closeModal('profile-modal'));

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal('profile-modal');
        }
    });

    saveNameBtn.addEventListener('click', () => {
        changePlayerName(nameInput.value);
        closeModal('profile-modal');
    });

    nameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveNameBtn.click();
        }
    });
}