Secure Message Burner
A modern, secure, one-time message sharing application. This tool allows users to create encrypted, self-destructing messages that can be shared securely via a link, ensuring that the information is viewed only once before being permanently destroyed.
✨ Features
Message Creation & Security Options
🔒 End-to-End Encryption: Messages are encrypted in the browser using the Web Crypto API (AES-GCM) before being sent to the server.
🔑 Password Protection: Users can choose to protect messages with a strong password.
<img src="https://i.imgur.com/K42Ea7G.png" width="40" alt="no password icon"> Password-less Mode: For quick, ephemeral notes, users can create messages that don't require a password to view.
🛡️ Two Security Levels:
Normal Mode: A standard viewing experience with a self-destruct timer.
Secure Mode: Implements advanced anti-screenshot measures for highly sensitive information.
⏲️ Custom Self-Destruct Timer: Senders can set a countdown timer (in seconds) after which the message will burn.
💪 Password Strength Meter: Provides real-time visual feedback to encourage strong passwords.
Message Viewing & Destruction
🔥 True One-Time View: Each message link is globally unique and can only be successfully accessed once. The server immediately deletes the message after the first retrieval.
🕵️ Advanced Anti-Screenshot Measures (Secure Mode):
Hover-to-Reveal: The message is rendered as a series of blurred words. The reader must hover over each word to reveal it, making a full screenshot impractical.
Heuristic Detection: The application actively listens for screenshot key presses (PrintScreen), right-clicks, and window focus changes, instantly burning the message if any are detected.
📱 Fully Responsive Design: A clean, modern UI optimized for both desktop and mobile devices.
📋 Easy Link Sharing: A "Copy Link" button provides a seamless way to share the generated one-time link.
Technical Stack
Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)
Backend: Node.js with Express.js
Cryptography: Web Crypto API (AES-GCM with PBKDF2 for key derivation)
Architecture:
Client-Side Encryption: Ensures the server never sees the unencrypted message content or password.
Server-Side State Management: The Node.js server acts as the central authority, managing the "burned" state of each message to guarantee one-time access.
RESTful API: A simple API for creating and retrieving messages.
Core Principles:
Zero Frameworks: Built with pure, modern JavaScript to demonstrate core DOM manipulation and API communication skills.
Clean Code: Organized into separate, dedicated files for HTML, CSS, and JavaScript for maintainability.
Security First: Designed from the ground up to protect user privacy and ensure data ephemerality.
About the Project
I created this project to explore the intersection of practical web security and user interface design. The goal was to build a tool that not only implements strong end-to-end encryption but also addresses the physical security challenge of screen capture.
This application serves as a showcase of my ability to:
Implement robust, modern JavaScript features like the Web Crypto API.
Build and manage a simple but effective Node.js backend.
Design a clean, intuitive, and responsive user interface.
Think creatively about security challenges and implement layered defense mechanisms.
