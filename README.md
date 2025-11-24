# Jovibe Code

![Jovibe Code Logo](/public/logo.png)

**Jovibe Code** is a modern, web-based code editor designed for rapid prototyping and learning HTML, CSS, and JavaScript. It provides a seamless, all-in-one environment where you can write code, see a live preview of your work, and interact with an AI assistant to help you build and learn. The entire application runs in the browser, saves your projects to local storage, and requires no installation or setup.

## Features

*   **Live Code Editor:** A powerful editor with syntax highlighting, autocomplete, and multi-language support (HTML, CSS, JS).
*   **Real-Time Preview:** Instantly see the results of your code as you type.
*   **Integrated Console:** A built-in console for debugging your JavaScript without leaving the editor.
*   **AI-Powered Assistant ("Jovibe with AI"):**
    *   **Generate Code from Prompts:** Describe what you want to build in plain English, and the AI will generate the code for you.
    *   **Image-to-Code:** Provide an image, and the AI can help you replicate its style or layout.
    *   **Interactive Debugging:** Ask the AI for help with errors or to refactor your code.
*   **Project Management:** Create, rename, and switch between multiple files, all saved in your browser's local storage.
*   **Zero-Setup Environment:** No installation or configuration needed. Just open the web app and start coding.

## What Makes Jovibe Code Unique?

While there are many online code editors, Jovibe Code stands out due to its deep integration of a generative AI assistant. This transforms the editor from a passive tool into an **active creative partner**. Instead of just writing code, you can have a conversation with the AI about what you want to build. This makes it an incredibly powerful tool for learning, experimentation, and rapid development.

The standout feature is the **"Jovibe with AI"** panel, which acts as a 24/7 pair programmer. It helps you:
*   **Bridge the gap between idea and implementation.**
*   **Learn by example** by seeing how the AI solves a problem.
*   **Experiment freely** without the fear of getting stuck.

## Technology Stack

*   **Frontend:** React, TypeScript
*   **Bundler:** Vite
*   **AI:** Google Gemini
*   **Styling:** Tailwind CSS

## Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd jovibe-code
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add your Google Gemini API key:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.