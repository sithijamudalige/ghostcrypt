"use client";

import { useState } from "react";
import { encryptData, decryptData } from "@/lib/crypto";

export default function Home() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  
  // Encrypt state
  const [inputText, setInputText] = useState("");
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [encryptPassword, setEncryptPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [encryptedOutput, setEncryptedOutput] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  
  // Decrypt state
  const [encryptedInput, setEncryptedInput] = useState("");
  const [decryptPassword, setDecryptPassword] = useState("");
  const [decryptedOutput, setDecryptedOutput] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  const [error, setError] = useState("");
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputImage(event.target?.result as string);
        setInputText(""); // clear text if image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEncrypt = async () => {
    setError("");
    setEncryptedOutput("");
    if (!encryptPassword) {
      setError("Please enter a secret password.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions to proceed.");
      return;
    }
    const dataToEncrypt = inputImage || inputText;
    if (!dataToEncrypt) {
      setError("Please provide a message or an image to encrypt.");
      return;
    }
    
    setIsEncrypting(true);
    try {
      const result = await encryptData(dataToEncrypt, encryptPassword);
      setEncryptedOutput(result);
      
      // Log payload for admin auditing (passwords are strictly never sent)
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData: result })
      }).catch(e => console.error(e)); // Ignore errors silently
    } catch (err: any) {
      setError("Encryption failed: " + err.message);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    setError("");
    setDecryptedOutput("");
    if (!decryptPassword || !encryptedInput) {
      setError("Please provide both the encrypted message and the secret password.");
      return;
    }

    setIsDecrypting(true);
    try {
      const result = await decryptData(encryptedInput, decryptPassword);
      setDecryptedOutput(result);
    } catch (err: any) {
      setError("Decryption failed. Incorrect password or corrupted data.");
    } finally {
      setIsDecrypting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEncryptedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEncryptedInput(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <main className="glass-panel">
        <h1>GhostCrypt</h1>
        <p className="subtitle">Military-Grade Message & Image Encryption</p>

        <div className="tabs">
          <button 
            className={`tab-btn ${mode === "encrypt" ? "active" : ""}`}
            onClick={() => { setMode("encrypt"); setError(""); setEncryptedOutput(""); }}
          >
            Encrypt
          </button>
          <button 
            className={`tab-btn ${mode === "decrypt" ? "active" : ""}`}
            onClick={() => { setMode("decrypt"); setError(""); setDecryptedOutput(""); }}
          >
            Decrypt
          </button>
        </div>

        {error && <div className="error-text" style={{marginBottom: "1rem"}}>{error}</div>}

        {mode === "encrypt" ? (
          <div className="encrypt-section">
            <div className="input-group">
              <label>Secret Message</label>
              <textarea 
                rows={4} 
                placeholder="Enter your top-secret message here..."
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setInputImage(null); }}
                disabled={!!inputImage}
              />
            </div>
            
            <div className="input-group">
              <label>Or Upload an Image (Max ~2MB recommended)</label>
              <div className="file-drop">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{display: 'none'}}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{cursor: 'pointer', display: 'block'}}>
                  {inputImage ? "Image selected. Click to change." : "Click to select an image"}
                </label>
                {inputImage && <img src={inputImage} alt="preview" className="preview-img" />}
              </div>
            </div>

            <div className="input-group">
              <label>Secret Password (Required for decryption)</label>
              <input 
                type="password" 
                placeholder="Make it strong..."
                value={encryptPassword}
                onChange={(e) => setEncryptPassword(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ margin: 0, fontSize: '0.85rem', cursor: 'pointer' }}>
                I agree to the Terms & Conditions and understand that encrypted payloads are logged for IT auditing.
              </label>
            </div>

            <button 
              className="primary" 
              onClick={handleEncrypt}
              disabled={isEncrypting}
            >
              {isEncrypting ? "Encrypting..." : "Encrypt & Generate Code"}
            </button>

            {encryptedOutput && (
              <div className="result-box">
                <h3>Encrypted Payload</h3>
                <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
                  This payload is secured with AES-256-GCM. Share it via WhatsApp or email.
                </p>
                <div style={{maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem', fontFamily: 'monospace'}}>
                  {encryptedOutput}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="copy-btn" onClick={() => copyToClipboard(encryptedOutput)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy to Clipboard
                  </button>
                  <button className="copy-btn" onClick={() => downloadFile(encryptedOutput, "ghostcrypt-message.txt")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download as .txt File
                  </button>
                </div>
                {encryptedOutput.length > 50000 && (
                  <p className="error-text" style={{marginTop: '0.5rem'}}>Warning: This payload is very large. It might exceed character limits on some messaging apps like WhatsApp. Please use the "Download as .txt File" option instead.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="decrypt-section">
            <div className="input-group">
              <label>Encrypted Payload (Paste or Upload)</label>
              <textarea 
                rows={4} 
                placeholder="Paste the encrypted code here..."
                value={encryptedInput}
                onChange={(e) => setEncryptedInput(e.target.value)}
              />
              <div style={{ marginTop: '0.5rem' }}>
                <input 
                  type="file" 
                  accept=".txt"
                  onChange={handleEncryptedFileUpload}
                  style={{display: 'none'}}
                  id="encrypted-file-upload"
                />
                <label htmlFor="encrypted-file-upload" className="copy-btn" style={{display: 'inline-flex', cursor: 'pointer', width: 'auto'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Or Upload .txt File
                </label>
              </div>
            </div>

            <div className="input-group">
              <label>Secret Password</label>
              <input 
                type="password" 
                placeholder="Enter the password used to encrypt..."
                value={decryptPassword}
                onChange={(e) => setDecryptPassword(e.target.value)}
              />
            </div>

            <button 
              className="primary" 
              onClick={handleDecrypt}
              disabled={isDecrypting}
            >
              {isDecrypting ? "Decrypting..." : "Decrypt Payload"}
            </button>

            {decryptedOutput && (
              <div className="result-box">
                <h3>Decrypted Content</h3>
                {decryptedOutput.startsWith("data:image/") ? (
                  <img src={decryptedOutput} alt="Decrypted" className="preview-img" />
                ) : (
                  <div style={{whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontFamily: 'inherit'}}>
                    {decryptedOutput}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      
      <section className="content-section">
        <h2>About GhostCrypt</h2>
        <p>
          GhostCrypt is a highly secure, client-side encryption utility designed to protect your sensitive text messages and images. 
          By leveraging the <strong>AES-256-GCM</strong> (Advanced Encryption Standard with Galois/Counter Mode) algorithm, it ensures military-grade 
          confidentiality and data integrity.
        </p>
        <p>
          When you enter a secret password, the application derives a strong cryptographic key using PBKDF2 (with 100,000 iterations). 
          The encryption process happens <strong>entirely within your browser</strong>. This means your raw data and your secret password 
          never leave your device. Only the final, scrambled payload is generated, which you can safely share across any public channel 
          like WhatsApp, Email, or Discord.
        </p>
        <p>
          <em>Note: For IT and security compliance, the encrypted payloads (the scrambled text) are logged for audit purposes. However, your passwords are strictly kept on your device and are never transmitted.</em>
        </p>
      </section>

      <section className="content-section">
        <h2>Frequently Asked Questions (FAQ)</h2>
        
        <h3>Can GhostCrypt encrypt images?</h3>
        <p>Yes! You can upload an image (we recommend keeping it under 2MB). The image is converted into binary data and encrypted exactly like text. When decrypted with the correct password, the image will display perfectly.</p>

        <h3>Why is my encrypted payload so large?</h3>
        <p>Encryption adds random data (like a salt and initialization vector) to secure your message. If you encrypt an image, the resulting text can easily exceed 50,000 characters. For large payloads, simply use the <strong>Download as .txt File</strong> option instead of copying and pasting.</p>

        <h3>Can anyone at GhostCrypt read my messages?</h3>
        <p>No. We do not have your secret password. Without the exact password used to encrypt the data, it is mathematically impossible to decrypt the payload. We maintain zero-knowledge of your actual content.</p>
        
        <h3>Is it free?</h3>
        <p>Yes, GhostCrypt is 100% free to use for personal and commercial purposes. We support the site through minimal, unintrusive advertisements.</p>
      </section>

      <footer style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 10, paddingBottom: '2rem' }}>
        <p>&copy; {new Date().getFullYear()} Developed and All Rights Reserved by NEDCAD.</p>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Login / Dashboard</a>
          <a href="/blog" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Blog & Articles</a>
          <a href="/quizzes" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Quizzes</a>
          <a href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </footer>
    </>
  );
}
