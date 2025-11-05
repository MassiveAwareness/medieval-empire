# Medieval Empire

<div align="center">
  <img src="./assets/background.png" style="width: 40%" alt="Medieval Empire Banner">
</div>

**Alpha v1.2.1**

---

<div align="center">

A text-based empire-building and management game crafted with pure, vanilla HTML, CSS, and JavaScript (ES6 Modules).

</div>

<div align="center">
  <img src="./assets/screenshot.png" style="width: 40%" alt="Medieval Empire Gameplay Screenshot">
</div>

## Table of Contents

- [About The Game](#about-the-game)
- [Current Features](#current-features)
- [How To Play](#how-to-play)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Usage](#installation--usage)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [Author](#author)

## About The Game

**Medieval Empire** is an incremental, text-based base-building game where you start as the lord of a humble settlement. Your goal is to manage resources, upgrade buildings, and make strategic decisions to grow your settlement into a thriving and feared empire. The game evokes the spirit of classic browser-based strategy games, implemented with modern web technologies and running entirely on the client-side.

## Current Features

- **Multi-Page Interface:** The game is structured across multiple pages for a clean and organized experience: a central `Dashboard`, a `Buildings` management page, and a dedicated page for the `Keep`.
- **Offline Progression:** Your empire works for you even when you're away! The game calculates and awards resources generated while the browser was closed, rewarding you upon your return.
- **Advanced Resource Management:** Automatically gather Wood, Stone, and Food. Manage your storage capacity by upgrading your `Warehouse` and `Keep`.
- **Multiple Buildings:** Build up to 3 instances of each production building (Lumberyard, Quarry, Farm) to specialize your economy.
- **Global Bonuses:** Construct a `Keep` to gain powerful empire-wide bonuses, such as increased storage capacity and reduced construction times.
- **Time-Based Construction:** Upgrading buildings takes time. With only a single construction queue, strategic planning is essential. Maximum building levels are capped for balanced progression.
- **Persistent & Automatic State:** All progress is automatically saved to the browser's `localStorage` when you leave the page, ensuring no progress is lost. A reset option is available for starting a new game.
- **Polished UI/UX:** A custom, atmospheric user interface featuring non-intrusive toast notifications, a loading screen, and intelligent welcome messages for returning players.
- **Modular Codebase:** The JavaScript is organized into logical, separate modules (`state`, `ui`, `gameLogic`, `app`), making the code clean, maintainable, and easy to extend.

## How To Play

1.  **Navigate Your Empire:** Use the navigation bar to switch between the Dashboard, Buildings, and Keep pages.
2.  **Manage Resources:** Keep an eye on your resource generation and storage capacity on the top panel, which is visible on all pages.
3.  **Build & Upgrade:** On the Buildings page, construct new production buildings or upgrade existing ones. Click the "Upgrade" button to start the construction process.
4.  **Plan Ahead:** You only have one builder! While one upgrade is in progress, you cannot start another. Prioritize your construction queue for maximum efficiency.
5.  **Return for Rewards:** Your progress is saved automatically when you close the tab. Come back later to see the resources your empire has gathered in your absence.

## Tech Stack

This project is proudly built on the fundamental building blocks of the web, without any external JavaScript frameworks.

- **HTML5:** Provides the structure and content for the multiple pages of the game.
- **CSS3:** Used for all visual styling, creating the medieval atmosphere, layout, and animations.
- **JavaScript (ES6+):** The engine for all game logic. It leverages ES6 Modules for a clean and organized codebase.

## Project Structure

The project follows a multi-page structure with shared assets, promoting code reusability and organization.

```graphql
/MedievalEmpire/
|
|-- index.html          # Main dashboard page.
|-- buildings.html      # Page for managing all buildings.
|-- keep.html           # Page dedicated to the Keep.
|-- style.css           # Shared CSS file for all pages.
|-- README.md           # This documentation file.
|
|-- /assets/            # Renamed from /images/ for better clarity
|   |-- background.png  # The main background image for the game.
|   |-- screenshot.png  # The screenshot used above.
|   |-- favicon.ico     # Favicon of the website.
|
|-- /js/
    |-- app.js          # MAIN ENTRY POINT: Manages loading, initializes the game, and sets up page-specific event listeners.
    |-- state.js        # The central brain of the game, contains the gameState object and building meta-data.
    |-- ui.js           # Handles all DOM manipulation (UI rendering, toast notifications).
    |-- gameLogic.js    # The core gameplay logic: building, upgrading, saving/loading, and the main gameLoop.
```

## Installation & Usage

Since this project uses no server-side technologies or complex build steps, running it is extremely simple.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MassiveAwareness/medieval-empire.git
    ```

2.  **Open the `index.html` file:**
    Navigate to the cloned directory and open the `index.html` file in your favorite web browser.

    > **Note:** Due to the use of ES6 Modules, it is highly recommended to serve the files using a simple local server (like the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code) to avoid potential CORS errors when running locally.

## Development Roadmap

The game is currently in its Alpha stage, but the plans are ambitious. The following is the planned development path.

- [x] **Phase 1: Core Gameplay Mechanics**
  - [x] Resource generation
  - [x] Building upgrades
  - [x] Time-based, single-threaded construction queue
  - [x] Save & Load functionality (`localStorage`) with automatic saving
  - [x] Code modularization

- [x] **Phase 2: Content Expansion (In Progress)**
  - [x] **Warehouse:** Introduce a resource cap that can be upgraded.
  - [x] **Keep:** A special building providing global bonuses (storage, build time).
  - [x] **Multiple Buildings:** Allow multiple instances of production buildings.
  - [ ] **Barracks:** Allow for the training of military units.
  - [ ] **Marketplace:** Generate a new resource: Gold.
  - [ ] **Unit Upkeep:** Military units will consume Gold and/or Food.

- [ ] **Phase 3: Deeper Gameplay**
  - [ ] **Technology Tree:** Research technologies that provide passive bonuses or unlock new buildings/units.
  - [ ] **Missions & Raids:** Ability to send troops on missions to acquire loot.
  - [ ] **Events:** Random events (e.g., "Bandit Attack," "Bountiful Harvest") that provide challenges or bonuses.

- [ ] **Phase 4: Polish & Refinement**
  - [x] **Offline Progression:** Calculate and award resources generated while offline.
  - [ ] **UI/UX Enhancements:** Add tooltips, better visual feedback, and animations.
  - [ ] **Sound & Music:** Implement basic sound effects and atmospheric background music.
  - [ ] **Game Balancing:** Fine-tune all costs, timers, and production rates for the best player experience.

## Contributing

This project is currently a solo endeavor, but I may be open to contributions in the future. If you have an idea or have found a bug, please open an issue in the GitHub repository.

## Author

**MassiveAwareness**

- GitHub: [@MassiveAwareness](https://github.com/MassiveAwareness)
