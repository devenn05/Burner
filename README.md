# Secure Message Burner

The Secure Message Burner is a web application designed for secure, one-time message sharing. It allows users to create encrypted messages that automatically self-destruct after being viewed, ensuring ephemeral communication.

Link: https://secure-burner.onrender.com
---

![Icon](https://github.com/user-attachments/assets/11d92dc6-e759-4536-aacf-f612547208e9)

---

## ✨ Key Features

### Message Creation & Security
* **End-to-End Encryption:** Messages are encrypted in the user's browser using **Web Crypto API (AES-GCM)** before transmission, ensuring plaintext is never exposed to the server.
* **Password Protection:** Messages can be secured with a user-defined password, which must be shared separately with the recipient for decryption.
* **Password-less Option:** Provides a convenient mode for quick, less sensitive ephemeral notes.
* **Two Security Modes:**
    * **Normal Mode:** Standard viewing with a configurable self-destruct timer.
    * **Secure Mode:** Includes enhanced anti-screenshot mechanisms for highly sensitive content.
* **Configurable Self-Destruct Timer:** Senders can set a specific duration (in seconds) for message visibility before destruction.
* **Password Strength Indicator:** Offers real-time visual feedback to promote the use of strong passwords.

### Message Viewing & Destruction
* **True One-Time View:** Each message link is unique and can be accessed successfully only **once**. The server permanently deletes the message immediately after its first retrieval.
* **Advanced Anti-Screenshot Measures (Secure Mode):**
    * **Hover-to-Reveal Content:** Message text is initially obscured; individual words are revealed only when the user hovers over them, making comprehensive screen capture impractical.
    * **Active Detection:** The application monitors for common screenshot triggers (e.g., `PrintScreen` key presses, right-clicks, window focus changes) and initiates immediate message destruction upon detection.
* **Responsive User Interface:** A clean, modern design optimized for seamless use across desktop and mobile devices.
* **Simplified Link Sharing:** A dedicated button facilitates easy copying of the generated one-time message link.

---

## 💻 Technical Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend:** Node.js with Express.js
* **Cryptography:** Web Crypto API (AES-GCM for encryption, PBKDF2 for key derivation)

---

## 🏛️ Architecture Overview

The Secure Message Burner utilizes a hybrid client-server architecture centered on privacy and ephemerality:

* **Client-Side Encryption:** Message encryption and key derivation occur entirely within the user's browser. This ensures that raw message content and passwords are never transmitted to or stored on the server.
* **Server-Side State Management:** The Node.js backend stores encrypted messages and their unique identifiers. It manages the "viewed" status for each message, guaranteeing single-access retrieval and performing immediate, permanent deletion from the database upon first view.
* **RESTful API:** Facilitates efficient communication between the frontend and backend for message creation and retrieval.

---

## 🌟 Core Principles

* **Framework-Agnostic Frontend:** Developed using pure JavaScript to demonstrate fundamental web development skills without reliance on external frameworks.
* **Code Clarity:** Emphasizes organized and modular code for enhanced maintainability and readability.
* **Security-First Design:** Prioritizes user privacy and data ephemerality through robust cryptographic implementations and a server-side "burn" mechanism.

---

## 💡 Project Overview

Initially, this project began as an exploration into developing a unique messaging platform. As I delved deeper into the technical challenges, the focus evolved towards creating a robust, secure, and truly ephemeral message burner. This shift allowed for a concentrated effort on client-side encryption and server-side message destruction.

I plan to continue developing this project, with future enhancements potentially including the ability to send these secure links anonymously, though the exact implementation details for this feature are still being explored.

This application demonstrates proficiency in:

* Implementing modern JavaScript features, including the Web Crypto API.
* Developing and managing a Node.js backend for critical server-side logic and state management.
* Designing intuitive and responsive user interfaces.
* Applying creative solutions to security challenges, building layered defense mechanisms.
