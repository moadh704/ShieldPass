document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordInput = document.getElementById('passwordInput');
    const toggleVisibility = document.getElementById('toggleVisibility');
    const copyPassword = document.getElementById('copyPassword');
    const generatePassword = document.getElementById('generatePassword');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const scoreText = document.getElementById('scoreText');
    const themeToggle = document.getElementById('themeToggle');
    const apiStatus = document.getElementById('apiStatus');
    const gaugeFill = document.getElementById('gaugeFill');
    const gaugeValue = document.getElementById('gaugeValue');
    const copyReport = document.getElementById('copyReport');
    
    // Generator elements
    const genLength = document.getElementById('genLength');
    const lengthValueGen = document.getElementById('lengthValueGen');
    const genUpper = document.getElementById('genUpper');
    const genLower = document.getElementById('genLower');
    const genNumbers = document.getElementById('genNumbers');
    const genSymbols = document.getElementById('genSymbols');
    
    // Custom Word Passphrase elements
    const customWordsInput = document.getElementById('customWords');
    const customWordsCount = document.getElementById('customWordsCount');
    const wordsCountValue = document.getElementById('wordsCountValue');
    const customSeparator = document.getElementById('customSeparator');
    const customCapitalize = document.getElementById('customCapitalize');
    const customAddNumber = document.getElementById('customAddNumber');
    const customAddSymbol = document.getElementById('customAddSymbol');
    const generateCustomPassphrase = document.getElementById('generateCustomPassphrase');
    
    const clearHistoryBtn = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');
    
    // Checklist items
    const lengthCheck = document.getElementById('lengthCheck');
    const uppercaseCheck = document.getElementById('uppercaseCheck');
    const lowercaseCheck = document.getElementById('lowercaseCheck');
    const numberCheck = document.getElementById('numberCheck');
    const symbolCheck = document.getElementById('symbolCheck');
    const sequenceCheck = document.getElementById('sequenceCheck');
    const repeatCheck = document.getElementById('repeatCheck');
    const commonCheck = document.getElementById('commonCheck');
    
    // Stat values
    const lengthValue = document.getElementById('lengthValue');
    const entropyValue = document.getElementById('entropyValue');
    const charTypes = document.getElementById('charTypes');
    const pwnedCount = document.getElementById('pwnedCount');
    const crackTimeValue = document.getElementById('crackTimeValue');
    
    const recommendations = document.getElementById('recommendations');
    
    // Common passwords list
    const commonPasswords = new Set([
        'password', '123456', '123456789', 'qwerty', 'abc123', 'password1', '12345678', '111111',
        '123123', 'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'sunshine',
        'princess', 'football', 'shadow', 'superman', 'michael', 'batman', 'trustno1', 'iloveyou',
        '000000', '1234', '12345', '1234567', '1234567890', 'qwerty123', 'password123', '1q2w3e4r',
        'baseball', 'starwars', 'passw0rd', 'whatever', 'whatever1', 'hello123', 'freedom'
    ]);

    let isPasswordVisible = false;

    // Visibility toggle
    toggleVisibility.addEventListener('click', function() {
        isPasswordVisible = !isPasswordVisible;
        passwordInput.type = isPasswordVisible ? 'text' : 'password';
        toggleVisibility.innerHTML = isPasswordVisible ? 
            '<i class="fas fa-eye-slash"></i>' : 
            '<i class="fas fa-eye"></i>';
    });
    
    // Copy password
    copyPassword.addEventListener('click', function() {
        if (passwordInput.value) {
            navigator.clipboard.writeText(passwordInput.value).then(() => {
                const original = copyPassword.innerHTML;
                copyPassword.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => copyPassword.innerHTML = original, 1500);
            });
        }
    });

    // Length slider
    genLength.addEventListener('input', () => lengthValueGen.textContent = genLength.value);
    customWordsCount.addEventListener('input', () => wordsCountValue.textContent = customWordsCount.value);

    // Random password generator
    generatePassword.addEventListener('click', function() {
        const length = parseInt(genLength.value);
        let charset = '';
        if (genUpper.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (genLower.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (genNumbers.checked) charset += '0123456789';
        if (genSymbols.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (!charset) { alert('Please select at least one character type!'); return; }
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        setPasswordAndAnalyze(password);
    });

    // === Custom Word Passphrase Generator ===
    generateCustomPassphrase.addEventListener('click', function() {
        const rawInput = customWordsInput.value.trim();
        if (!rawInput) {
            alert('Please enter some words first!');
            return;
        }

        // Parse words (split by comma or space)
        let words = rawInput.split(/[\s,]+/).filter(w => w.length > 0);
        if (words.length === 0) {
            alert('Please enter valid words.');
            return;
        }

        const count = parseInt(customWordsCount.value);
        const separator = customSeparator.value;
        const capitalize = customCapitalize.checked;
        const addNumber = customAddNumber.checked;
        const addSymbol = customAddSymbol.checked;

        // Shuffle and pick words
        words = words.sort(() => Math.random() - 0.5);
        let selected = words.slice(0, Math.min(count, words.length));

        // Format words
        if (capitalize) {
            selected = selected.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        }

        let passphrase = selected.join(separator);

        // Add number and/or symbol
        if (addNumber) {
            passphrase += (Math.floor(Math.random() * 90) + 10);
        }
        if (addSymbol) {
            const symbols = '!@#$%^&*';
            passphrase += symbols[Math.floor(Math.random() * symbols.length)];
        }

        setPasswordAndAnalyze(passphrase);
    });

    function setPasswordAndAnalyze(password) {
        passwordInput.value = password;
        passwordInput.type = 'text';
        isPasswordVisible = true;
        toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
        analyzePassword(password);
    }

    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        themeToggle.innerHTML = document.body.classList.contains('light-mode') 
            ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
    
    // Real-time analysis
    passwordInput.addEventListener('input', () => analyzePassword(passwordInput.value));
    
    // Copy report
    copyReport.addEventListener('click', function() {
        const pw = passwordInput.value;
        if (!pw) { alert('Analyze a password first!'); return; }
        const report = generateAnalysisReport(pw);
        navigator.clipboard.writeText(report).then(() => {
            const orig = copyReport.innerHTML;
            copyReport.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => copyReport.innerHTML = orig, 2000);
        });
    });

    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('Clear all password history?')) {
            localStorage.removeItem('shieldpass_history');
            renderHistory();
        }
    });

    // Main analysis function
    function analyzePassword(password) {
        if (!password) { resetUI(); return; }

        const checks = performChecks(password);
        const score = calculateScore(checks, password);
        const entropy = calculateEntropy(password);
        const crackTime = estimateCrackTime(entropy, password);
        
        updateUI(checks, score, entropy, password, crackTime);
        
        if (password.length >= 4) {
            checkPwnedPassword(password);
        } else {
            pwnedCount.textContent = '-';
            apiStatus.innerHTML = '<i class="fas fa-circle"></i> <span>Enter at least 4 characters to check breaches</span>';
            apiStatus.className = 'api-status';
        }

        saveToHistory(password, score, entropy);
    }

    function resetUI() {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'None';
        scoreText.textContent = '0%';
        lengthValue.textContent = '0';
        entropyValue.textContent = '0';
        charTypes.textContent = '0';
        pwnedCount.textContent = '-';
        crackTimeValue.textContent = 'N/A';
        gaugeFill.style.strokeDashoffset = 314;
        gaugeValue.textContent = '0';
        recommendations.innerHTML = `<div class="recommendation"><i class="fas fa-info-circle"></i> <span>Enter a password to get security recommendations</span></div>`;
        
        const checks = [lengthCheck, uppercaseCheck, lowercaseCheck, numberCheck, symbolCheck, sequenceCheck, repeatCheck, commonCheck];
        checks.forEach(el => {
            el.className = 'check-item';
            el.innerHTML = el.innerHTML.replace(/<i.*?<\/i>/, '<i class="fas fa-times-circle"></i>');
        });
    }

    function performChecks(password) {
        const lower = password.toLowerCase();
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^A-Za-z0-9]/.test(password),
            sequence: !hasKeyboardSequence(password),
            repeat: !hasRepeatedChars(password),
            common: !commonPasswords.has(lower)
        };
    }

    function hasKeyboardSequence(password) {
        const seqs = ['123456','abcdef','qwerty','asdfgh','zxcvbn','password','12345678','123456789','1234567890'];
        return seqs.some(s => password.toLowerCase().includes(s));
    }

    function hasRepeatedChars(password) {
        return /(.)\1{2,}/.test(password);
    }

    function calculateScore(checks, password) {
        let score = 0;
        if (checks.length) score += 18;
        if (checks.uppercase) score += 14;
        if (checks.lowercase) score += 14;
        if (checks.number) score += 14;
        if (checks.symbol) score += 14;
        if (checks.sequence) score += 8;
        if (checks.repeat) score += 8;
        if (checks.common) score += 10;
        if (password.length >= 12) score += 8;
        if (password.length >= 16) score += 10;
        if (password.length >= 20) score += 5;
        return Math.min(Math.max(score, 0), 100);
    }

    function calculateEntropy(password) {
        if (!password) return 0;
        let size = 0;
        if (/[a-z]/.test(password)) size += 26;
        if (/[A-Z]/.test(password)) size += 26;
        if (/[0-9]/.test(password)) size += 10;
        if (/[^A-Za-z0-9]/.test(password)) size += 32;
        return Math.round(Math.log2(Math.pow(size || 1, password.length)));
    }

    function estimateCrackTime(entropy, password) {
        if (!password || entropy === 0) return { text: 'N/A', color: 'var(--gray)' };
        const guessesPerSec = 10_000_000_000;
        const guesses = Math.pow(2, entropy);
        const seconds = guesses / guessesPerSec;

        if (seconds < 1) return { text: 'Instant', color: 'var(--danger)' };
        if (seconds < 60) return { text: `${Math.ceil(seconds)}s`, color: 'var(--danger)' };
        if (seconds < 3600) return { text: `${Math.ceil(seconds/60)}m`, color: 'var(--danger)' };
        if (seconds < 86400) return { text: `${Math.ceil(seconds/3600)}h`, color: 'var(--warning)' };
        if (seconds < 31536000) return { text: `${Math.ceil(seconds/86400)}d`, color: 'var(--warning)' };
        if (seconds < 315360000) return { text: `${Math.ceil(seconds/31536000)}y`, color: '#4cd964' };
        return { text: 'Centuries+', color: 'var(--primary)' };
    }

    function updateUI(checks, score, entropy, password, crackTime) {
        strengthFill.style.width = `${score}%`;
        
        let level, color;
        if (score < 40) { level = 'Weak'; color = 'var(--danger)'; }
        else if (score < 65) { level = 'Fair'; color = 'var(--warning)'; }
        else if (score < 85) { level = 'Good'; color = '#4cd964'; }
        else { level = 'Strong'; color = 'var(--primary)'; }
        
        strengthFill.style.background = color;
        strengthText.textContent = level;
        strengthText.style.color = color;
        scoreText.textContent = `${score}%`;

        updateCheckItem(lengthCheck, checks.length);
        updateCheckItem(uppercaseCheck, checks.uppercase);
        updateCheckItem(lowercaseCheck, checks.lowercase);
        updateCheckItem(numberCheck, checks.number);
        updateCheckItem(symbolCheck, checks.symbol);
        updateCheckItem(sequenceCheck, checks.sequence);
        updateCheckItem(repeatCheck, checks.repeat);
        updateCheckItem(commonCheck, checks.common);

        lengthValue.textContent = password.length;
        entropyValue.textContent = entropy;
        
        let types = 0;
        if (checks.lowercase) types++;
        if (checks.uppercase) types++;
        if (checks.number) types++;
        if (checks.symbol) types++;
        charTypes.textContent = types;

        const offset = 314 - Math.min((entropy / 120) * 314, 314);
        gaugeFill.style.strokeDashoffset = offset;
        gaugeValue.textContent = entropy;

        crackTimeValue.textContent = crackTime.text;
        crackTimeValue.style.color = crackTime.color;

        updateRecommendations(checks, score, entropy, password);
    }

    function updateCheckItem(el, valid) {
        const icon = valid ? 'fa-check-circle' : 'fa-times-circle';
        el.className = valid ? 'check-item valid' : 'check-item invalid';
        const text = el.textContent.includes('>') ? el.textContent.split('> ').pop() : el.textContent;
        el.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    }

    function updateRecommendations(checks, score, entropy, password) {
        recommendations.innerHTML = '';
        if (score >= 85) {
            recommendations.innerHTML += `<div class="recommendation positive"><i class="fas fa-check-circle"></i> <span>Excellent! This is a strong, secure password.</span></div>`;
        }
        if (!checks.length) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>Use at least 12-16 characters.</span></div>`;
        if (!checks.uppercase || !checks.lowercase) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>Mix upper and lower case letters.</span></div>`;
        if (!checks.number) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>Add numbers.</span></div>`;
        if (!checks.symbol) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>Add symbols (!@#$ etc).</span></div>`;
        if (!checks.sequence) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>Avoid common sequences like "qwerty".</span></div>`;
        if (!checks.repeat) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>Avoid repeated characters.</span></div>`;
        if (!checks.common) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>This is a very common password. Change it!</span></div>`;
        if (entropy < 50) recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-lightbulb"></i> <span>More randomness would help — try a longer passphrase.</span></div>`;
    }

    async function checkPwnedPassword(password) {
        try {
            apiStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> <span>Checking against known breaches...</span>';
            apiStatus.className = 'api-status';

            const encoder = new TextEncoder();
            const hashBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(password));
            const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('').toUpperCase();
            const prefix = hashHex.substring(0,5);
            const suffix = hashHex.substring(5);

            const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!res.ok) throw new Error('API error');
            const text = await res.text();
            
            let count = 0;
            for (const line of text.split('\n')) {
                const [h, c] = line.split(':');
                if (h === suffix) { count = parseInt(c); break; }
            }

            pwnedCount.textContent = count > 0 ? count.toLocaleString() : '0';
            if (count > 0) {
                apiStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>Seen in ${count.toLocaleString()} breaches!</span>`;
                apiStatus.className = 'api-status error';
                recommendations.innerHTML += `<div class="recommendation"><i class="fas fa-exclamation-triangle"></i> <span>Exposed in breaches. Do not use this password.</span></div>`;
            } else {
                apiStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>Not found in known breaches</span>';
                apiStatus.className = 'api-status connected';
            }
        } catch (e) {
            apiStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Unable to check breaches</span>';
            apiStatus.className = 'api-status error';
            pwnedCount.textContent = '?';
        }
    }

    function generateAnalysisReport(password) {
        const checks = performChecks(password);
        const score = calculateScore(checks, password);
        const entropy = calculateEntropy(password);
        const crack = estimateCrackTime(entropy, password);
        
        let r = `ShieldPass Analysis Report\n========================\n\n`;
        r += `Password: ${password.replace(/./g, '*')}\n`;
        r += `Score: ${score}% (${strengthText.textContent})\n`;
        r += `Entropy: ${entropy} bits\n`;
        r += `Est. Crack Time: ${crack.text}\n`;
        r += `Length: ${password.length}\n\nChecks Passed:\n`;
        if (checks.length) r += `  ✓ Length >= 8\n`;
        if (checks.uppercase) r += `  ✓ Uppercase letters\n`;
        if (checks.lowercase) r += `  ✓ Lowercase letters\n`;
        if (checks.number) r += `  ✓ Numbers\n`;
        if (checks.symbol) r += `  ✓ Symbols\n`;
        if (checks.sequence) r += `  ✓ No keyboard sequences\n`;
        if (checks.repeat) r += `  ✓ No repeated chars\n`;
        if (checks.common) r += `  ✓ Not a common password\n`;
        r += `\nGenerated: ${new Date().toLocaleString()}\nShieldPass v2.0`;
        return r;
    }

    // History
    function saveToHistory(password, score, entropy) {
        let hist = JSON.parse(localStorage.getItem('shieldpass_history') || '[]');
        hist = hist.filter(h => h.password !== password);
        hist.unshift({ password, score, entropy, timestamp: new Date().toISOString() });
        if (hist.length > 8) hist.length = 8;
        localStorage.setItem('shieldpass_history', JSON.stringify(hist));
        renderHistory();
    }

    function renderHistory() {
        const hist = JSON.parse(localStorage.getItem('shieldpass_history') || '[]');
        historyList.innerHTML = '';
        if (hist.length === 0) {
            historyList.innerHTML = `<div class="history-empty">No passwords analyzed yet.</div>`;
            return;
        }
        hist.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            const date = new Date(item.timestamp).toLocaleDateString();
            div.innerHTML = `
                <div class="history-info">
                    <span class="history-password">${item.password.replace(/./g, '•')}</span>
                    <span class="history-meta">${item.score}% • ${item.entropy} bits • ${date}</span>
                </div>
                <button class="btn btn-small load-btn" data-idx="${idx}"><i class="fas fa-redo"></i></button>
            `;
            div.querySelector('.load-btn').onclick = () => {
                passwordInput.value = item.password;
                passwordInput.type = 'text';
                isPasswordVisible = true;
                toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
                analyzePassword(item.password);
            };
            historyList.appendChild(div);
        });
    }

    function initialize() {
        lengthValueGen.textContent = genLength.value;
        wordsCountValue.textContent = customWordsCount.value;
        renderHistory();

        // Demo
        setTimeout(() => {
            if (!passwordInput.value) {
                passwordInput.value = 'ExamplePass123!';
                analyzePassword('ExamplePass123!');
            }
        }, 700);
    }

    initialize();
});
