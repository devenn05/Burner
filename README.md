# Secure Message Burner

A modern, secure, one-time message sharing application. This tool allows users to create encrypted, self-destructing messages that can be shared securely via a link, ensuring that the information is viewed only once before being permanently destroyed.

---

![Icon](https://github.com/user-attachments/assets/11d92dc6-e759-4536-aacf-f612547208e9)


## ✨ Features

### Message Creation & Security Options

* **🔒 End-to-End Encryption:** Messages are encrypted directly in the browser using the **Web Crypto API (AES-GCM)** before any data is sent to the server. Your sensitive information is protected from the moment you type it.
* **🔑 Password Protection:** Users can choose to protect messages with a strong, unique password. This password is never stored and must be shared separately with the recipient.
* **<img src="https://i.imgur.com/K42Ea7G.png" width="20" alt="No password icon"> Password-less Mode:** For quick, ephemeral notes where less stringent security is acceptable, messages can be created without a password, relying solely on the one-time link.
* **🛡️ Two Security Levels:**
    * **Normal Mode:** A standard viewing experience with a self-destruct timer.
    * **Secure Mode:** Implements advanced anti-screenshot measures for highly sensitive information, adding an extra layer of visual protection.
* **⏲️ Custom Self-Destruct Timer:** Senders can set a countdown timer (in seconds) after which the message will be permanently destroyed in the recipient's view.
* **💪 Password Strength Meter:** Provides real-time visual feedback to encourage users to create strong, robust passwords, enhancing overall security.

### Message Viewing & Destruction

* **🔥 True One-Time View:** Each message link generated is globally unique and can only be successfully accessed **once**. The Node.js server immediately and permanently deletes the message from its database after the first retrieval, ensuring true ephemerality.
* **🕵️ Advanced Anti-Screenshot Measures (Secure Mode):**
    * **Hover-to-Reveal:** The message content is initially rendered as a series of blurred or obscured words. The reader must actively hover their mouse over each word to progressively reveal it, making a full, clear screenshot of the entire message impractical.
    * **Heuristic Detection:** The application actively monitors for common screenshot triggers (e.g., `PrintScreen` key presses), right-clicks, and changes in window focus. If suspicious activity is detected, the message is instantly burned.
* **📱 Fully Responsive Design:** A clean, intuitive, and modern user interface optimized for seamless use on both desktop and mobile devices.
* **📋 Easy Link Sharing:** A "Copy Link" button provides a convenient and seamless way for senders to share the generated one-time link.

---

## 💻 Technical Stack

* **Frontend:**
    * **HTML5:** Semantic structure for web content.
    * **CSS3:** Modern styling and responsive design.
    * **Vanilla JavaScript (ES6+):** Powers all client-side logic, interactivity, and cryptographic operations.
* **Backend:**
    * **Node.js with Express.js:** A fast and unopinionated web framework for handling API requests and managing message state.
* **Cryptography:**
    * **Web Crypto API (AES-GCM):** For robust client-side symmetric encryption.
    * **PBKDF2:** Used for secure key derivation from user passwords.

---

## 🏛️ Architecture

The Secure Message Burner employs a hybrid client-server architecture designed with security and ephemerality as its core principles:

* **Client-Side Encryption:** All encryption of messages and derivation of keys from passwords happens **within the user's browser**. This critical design choice means the unencrypted message content and the user's password **never leave the client and are never sent to the server.** The server only ever receives and stores encrypted data.
* **Server-Side State Management:** The Node.js backend acts as the central authority for managing the "burned" state of each message. It's responsible for:
    * Receiving and storing the encrypted message (without ever seeing its plaintext).
    * Generating unique, one-time-use links.
    * Tracking whether a link has been accessed.
    * **Immediately deleting the encrypted message from the database after its first successful retrieval.** This ensures the "true one-time view" functionality.
* **RESTful API:** A simple and efficient API facilitates communication between the frontend and backend for creating and retrieving messages.

---

## 🌟 Core Principles

* **Zero Frameworks (Frontend):** The frontend is built using pure, modern JavaScript. This approach was chosen to showcase a deep understanding of core DOM manipulation, asynchronous programming, and direct API communication, without relying on complex frontend frameworks.
* **Clean Code:** The codebase is meticulously organized into separate, dedicated files for HTML structure, CSS styling, and JavaScript logic, promoting maintainability, readability, and scalability.
* **Security First:** The application's design prioritizes user privacy and data ephemerality. Every architectural decision, from client-side encryption to server-side self-destruction, aims to minimize data exposure and ensure that messages truly "burn."

---

## 💡 About the Project

I created this project to explore the intersection of practical web security and intuitive user interface design. The primary goal was to build a tool that not only implements strong end-to-end encryption but also innovatively addresses the challenge of preventing unauthorized retention through screen capture.

This application serves as a comprehensive showcase of my ability to:

* Implement robust, modern JavaScript features, particularly utilizing the powerful Web Crypto API for cryptographic operations.
* Build and manage a simple yet effective Node.js backend to handle server-side logic, data persistence, and crucial "one-time view" state management.
* Design a clean, intuitive, and responsive user interface that provides a seamless and secure experience across various devices.
* Think creatively about complex security challenges and implement layered defense mechanisms to enhance data protection beyond standard encryption.
