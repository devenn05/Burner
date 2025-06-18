const elements = {
    notification: document.getElementById('notification'),
    passwordInput: document.getElementById('password'), passwordStrengthBar: document.getElementById('password-strength-bar'),
    createBtn: document.getElementById('create-btn'), messageInput: document.getElementById('message'), timerInput: document.getElementById('timer'),
    resultDiv: document.getElementById('result'), copyLinkBtn: document.getElementById('copy-link-btn'),
    requirePasswordCb: document.getElementById('require-password-cb'), passwordSection: document.getElementById('password-section'),
    passwordStrengthDiv: document.querySelector('.password-strength'),
};
let generatedLink = '';

const showNotification = (message) => {
    elements.notification.textContent = message;
    elements.notification.classList.add('show');
    setTimeout(() => elements.notification.classList.remove('show'), 3000);
};

const encryptMessage = async (message, password, timer, securityLevel) => {
    const payload = `${securityLevel}::${message}`;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(payload));
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength + 4);
    combined.set(salt, 0); combined.set(iv, salt.length); combined.set(new Uint8Array(encrypted), salt.length + iv.length);
    new DataView(combined.buffer).setUint32(combined.length - 4, timer, false);
    return btoa(String.fromCharCode(...combined));
};

elements.passwordInput.addEventListener('input', () => {
    const pass = elements.passwordInput.value;
    let strength = 0;
    if (pass.length >= 8) strength++; if (/[A-Z]/.test(pass)) strength++; if (/[a-z]/.test(pass)) strength++; if (/[0-9]/.test(pass)) strength++; if (/[^A-Za-z0-9]/.test(pass)) strength++;
    let strength_percent = (strength / 5) * 100;
    elements.passwordStrengthBar.style.width = `${strength_percent}%`;
    if(strength < 2) { elements.passwordStrengthBar.className = 'password-strength-bar weak'; }
    else if (strength < 4) { elements.passwordStrengthBar.className = 'password-strength-bar medium'; }
    else { elements.passwordStrengthBar.className = 'password-strength-bar strong'; }
});

elements.requirePasswordCb.addEventListener('change', () => {
    const isRequired = elements.requirePasswordCb.checked;
    elements.passwordInput.disabled = !isRequired;
    elements.passwordSection.style.opacity = isRequired ? '1' : '0.5';
    elements.passwordStrengthDiv.style.opacity = isRequired ? '1' : '0.5';
});

elements.createBtn.addEventListener('click', async () => {
    const hasPassword = elements.requirePasswordCb.checked;
    const password = elements.passwordInput.value;
    const internalNoPassKey = "ThisIsASecretKeyForPasswordlessMessages-7a9b3c_d4e5f6";
    if (!elements.messageInput.value.trim()) return showNotification('Please enter a message');
    if (hasPassword && password.length < 8) return showNotification('Password must be at least 8 characters');
    elements.createBtn.disabled = true; elements.createBtn.textContent = 'Encrypting & Storing...';
    const securityLevel = document.querySelector('input[name="security"]:checked').value;
    const effectivePassword = hasPassword ? password : internalNoPassKey;
    const clientEncryptedData = await encryptMessage(elements.messageInput.value, effectivePassword, parseInt(elements.timerInput.value), securityLevel);
    if (clientEncryptedData) {
        try {
            const response = await fetch('/api/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ encryptedData: clientEncryptedData }) });
            if (!response.ok) throw new Error('Server error');
            const { id } = await response.json();
            generatedLink = `${window.location.origin}/read.html#${id}`;
            elements.resultDiv.style.display = 'block';
            showNotification('Burn link created!');
        } catch (err) { showNotification('Could not contact server.'); }
    }
    elements.createBtn.disabled = false; elements.createBtn.textContent = 'Generate Burn Link';
});

elements.copyLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
        showNotification('Link Copied to Clipboard!');
    });
});