# <img src="./static/logo.png" width="40" alt="PennyPincher Logo"> PennyPincher

PennyPincher is a comprehensive budgeting application designed to help you manage your finances with ease. Track your income and expenses, visualize your spending habits with insightful graphs, and organize your transactions with customizable categories. PennyPincher empowers you to take control of your financial life and make informed decisions about your money.

-----

## Getting Started

To get started with PennyPincher, you'll need to have Node.js and npm installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pennypincher.git
    cd pennypincher
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the development server and open the application in your browser.

-----

## Features

  * **Dashboard:** Get a quick overview of your current balance, recent income, and recent expenses.
  * **Income and Expense Tracking:** Easily add, edit, and delete your income and expense transactions.
  * **Categorization:** Organize your transactions into custom categories to better understand your spending patterns.
  * **Interactive Graphs:** Visualize your financial data with various graphs, including:
      * Balance over time (line and average)
      * Income over time (dot, average, and histogram)
      * Expenses over time (dot, average, and histogram)
  * **Data Import/Export:** Import and export your financial data in CSV format.
  * **AI-Powered Chatbot:** Get answers to your budgeting questions from our friendly chatbot, Abe.

-----

## Technologies Used

PennyPincher is built with a modern tech stack, including:

  * **SvelteKit:** A powerful framework for building web applications of all sizes.
  * **Vite:** A next-generation frontend tooling that provides a faster and leaner development experience.
  * **TypeScript:** A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
  * **better-sqlite3:** A library for interacting with SQLite databases.
  * **Chart.js:** A flexible and responsive charting library.
  * **Google Gemini AI:** Powering our AI chatbot, Abe.
  * **Unplugin Icons:** A tool for using icons from any icon set.

-----

## Database

PennyPincher uses a SQLite database to store all your financial data. The database schema is defined in the `db/init.sql` file and includes the following tables:

  * `balance`: Stores your current account balance.
  * `income`: Stores all your income transactions.
  * `expense`: Stores all your expense transactions.
  * `categories`: Stores your custom spending categories.
  * `abe_messages`: Logs conversations with our AI chatbot, Abe.

You can reset the database to its initial state by running the `db/reset.sh` script.

-----

## Attributions

PennyPincher is made possible by the following open-source libraries and frameworks:

### Core Frameworks & Tools

  * **Svelte:** Our UI library of choice.
  * **SvelteKit:** The official application framework for Svelte.
  * **Vite:** Frontend tooling.
  * **TypeScript:** A type-safe superset of JavaScript.

### Backend

  * **better-sqlite3:** The fastest and simplest library for SQLite3 in Node.js.
  * **Google Generative AI:** Google's latest and most capable AI models.

### Frontend

  * **Chart.js:** Simple yet flexible JavaScript charting for designers & developers.
  * **@iconify-json/mdi:** Material Design Icons iconify.

This project was created by Anhaar Wasi, Cedric Serio, and Gavin McCown for the FBLA 2025 Coding & Programming competition.
