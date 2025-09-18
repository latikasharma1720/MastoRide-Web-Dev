// src/components/QRDownload.jsx
import { QRCodeCanvas } from "qrcode.react";

export default function QRDownload() {
  return (
    <section className="qr-wrap">
      <div className="qr-card">
        <h2 className="qr-title">Get the MastoRide App</h2>
        <p className="qr-sub">Scan the QR code or download directly</p>

        {/* QR Code */}
        <div className="qr-box">
          <QRCodeCanvas value="https://github.com/latikasharma1720/MastoRide-Web-Dev" size={140} />
        </div>

        {/* Store buttons */}
        <div className="store-buttons">
          <a
            href="https://github.com/latikasharma1720/MastoRide-Web-Dev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-white"
          >
            📥 Download from GitHub
          </a>

          <button type="button" className="btn btn-white" disabled>
            Play Store (coming soon)
          </button>

          <button type="button" className="btn btn-white" disabled>
            App Store (coming soon)
          </button>
        </div>

        <p className="qr-hint">Available soon on all platforms.</p>
      </div>
    </section>
  );
}
