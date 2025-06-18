const elements = {
    notification: document.getElementById('notification'),
    decryptPrompt: document.getElementById('decrypt-prompt'), warningText: document.getElementById('warning-text'),
    messageContainer: document.getElementById('message-container'), viewMessageBtn: document.getElementById('view-message-btn'),
    readPasswordInput: document.getElementById('read-password'), burnCountdown: document.getElementById('burn-countdown'),
    countdownTimerSpan: document.getElementById('countdown-timer'),
    messageDisplayWrapper: document.getElementById('message-display-wrapper'),
    secureDisclaimer: document.getElementById('secure-disclaimer'),
};
let dataFetchedFromServer = null;
let countdownInterval = null;
let isBurned = false;
let secureModeListeners = [];
const internalNoPassKey = "ThisIsASecretKeyForPasswordlessMessages-7a9b3c_d4e5f6";

const decryptMessageData = async (encryptedData, password) => {
    try {
        const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
        const salt = combined.slice(0, 16); const iv = combined.slice(16, 28);
        const ciphertext = combined.slice(28, combined.length - 4);
        const timer = new DataView(combined.buffer).getUint32(combined.length - 4, false);
        const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
        const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        const decryptedPayload = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext));
        const [securityLevel, ...messageParts] = decryptedPayload.split('::');
        const message = messageParts.join('::');
        return { message, timer, securityLevel };
    } catch (e) { return null; }
};

const showPermanentlyBurnedState = (message = "This link has expired or was already used.") => {
    if (isBurned) return;
    isBurned = true;
    if (countdownInterval) clearInterval(countdownInterval);
    deactivateSecureModeDefenses();
    elements.decryptPrompt.style.display = 'none';
    elements.messageContainer.style.display = 'block';
    elements.messageDisplayWrapper.innerHTML = `<div style="text-align: center; cursor: default;"><p style="color: var(--error-color); font-size: 1.5em; font-weight: bold; margin: 0;">LINK EXPIRED</p><p style="font-size: 0.9em; color: var(--subtitle-color); margin-top: 10px;">${message}</p></div>`;
    elements.burnCountdown.style.display = 'none';
};

const addListener = (element, event, handler) => {
    element.addEventListener(event, handler);
    secureModeListeners.push({ element, event, handler });
};

const deactivateSecureModeDefenses = () => {
    secureModeListeners.forEach(({ element, event, handler }) => element.removeEventListener(event, handler));
    secureModeListeners = [];
};

const activateSecureModeDefenses = (originalMessage) => {
    const instantBurn = () => showPermanentlyBurnedState("SECURITY ALERT: Suspicious activity detected. Message burned.");
    const keyListener = (e) => { if (['PrintScreen', 'Meta', 'Super', 'Hyper'].includes(e.key)) instantBurn(); };
    const contextListener = (e) => { e.preventDefault(); instantBurn(); };
    
    addListener(window, 'blur', instantBurn);
    addListener(document, 'keyup', keyListener);
    addListener(document, 'contextmenu', contextListener);

    elements.messageDisplayWrapper.innerHTML = '';
    const words = originalMessage.split(/(\s+)/);

    words.forEach((word, index) => {
        if (word.trim() === '') {
            elements.messageDisplayWrapper.appendChild(document.createTextNode(word));
            return;
        }
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        
        if (index === 0) {
            wordSpan.className = 'secure-word revealed';
        } else {
            wordSpan.className = 'secure-word';
        }
        elements.messageDisplayWrapper.appendChild(wordSpan);
    });
};

const displayAndStartTimer = (result) => {
    elements.decryptPrompt.style.display = 'none';
    elements.messageContainer.style.display = 'block';
    
    if (result.securityLevel === 'secure') {
        elements.secureDisclaimer.textContent = 'Any tampering (screenshot, right-click, changing windows) will terminate the message immediately.';
        elements.secureDisclaimer.style.display = 'block';
        activateSecureModeDefenses(result.message);
    } else {
        elements.messageDisplayWrapper.textContent = result.message;
    }
    
    let remaining = result.timer;
    elements.countdownTimerSpan.textContent = remaining;
    countdownInterval = setInterval(() => {
        if(isBurned) return clearInterval(countdownInterval);
        remaining--;
        elements.countdownTimerSpan.textContent = remaining;
        if (remaining <= 0) {
            showPermanentlyBurnedState("MESSAGE BURNED");
        }
    }, 1000);
};

elements.viewMessageBtn.addEventListener('click', async () => {
    const password = elements.readPasswordInput.value;
    if (!password || !dataFetchedFromServer) return;
    elements.viewMessageBtn.disabled = true; elements.readPasswordInput.disabled = true;
    const result = await decryptMessageData(dataFetchedFromServer, password);
    if (!result) {
        showNotification('Decryption failed. Incorrect password.');
        showPermanentlyBurnedState('Decryption failed. The link has been burned.');
        return;
    }
    displayAndStartTimer(result);
});

window.addEventListener('load', async () => {
    const id = window.location.hash.substring(1);
    if (!id) return showPermanentlyBurnedState("Invalid or missing message link.");
    try {
        const response = await fetch(`/api/message/${id}`);
        if (!response.ok) return showPermanentlyBurnedState();
        const { encryptedData } = await response.json();
        dataFetchedFromServer = encryptedData;
        const noPassResult = await decryptMessageData(dataFetchedFromServer, internalNoPassKey);
        if (noPassResult) {
            displayAndStartTimer(noPassResult);
        } else {
            elements.warningText.innerHTML = "<strong>SECURITY WARNING:</strong> You must hover over each word to reveal it. Any attempt to screenshot or change windows will instantly burn the message.";
            elements.decryptPrompt.style.display = 'block';
        }
    } catch (err) {
        showNotification('Error contacting server.');
        showPermanentlyBurnedState("Could not connect to the message server.");
    }
});