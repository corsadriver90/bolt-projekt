// src/lib/pdfExportHtml.js

/**
 * Baut das komplette HTML für den Begleitschein zusammen – inkl. sämtlicher
 * Inline-Styles, damit html2pdf.js korrekt rendern kann.
 *
 * @param {Object} params
 * @param {string} params.ankaufsNummer      – Die Ankaufsnummer, z.B. "BR-12345678"
 * @param {string} params.name               – Name des Kunden
 * @param {string} params.email              – E-Mail des Kunden
 * @param {string} params.address            – Adresse des Kunden
 * @param {number} params.totalWeight        – Gewicht in kg
 * @param {string} params.date               – Datum / Uhrzeit des Ankaufs
 * @param {string} [params.qrCodeDataURL]    – Data-URL des QR-Codes (falls vorhanden)
 * @param {boolean} [params.onlyBody=false]  – Wenn true, gibt nur den <body>-Inhalt zurück
 *
 * @returns {string} Reines HTML (complete Document), das alles Nötige enthält.
 */
export function generatePdfExportHtml({
	ankaufsNummer,
	name,
	email,
	address,
	totalWeight,
	date,
	qrCodeDataURL,
	onlyBody = false
  }) {
	// Inline-Styles für <head>, z.B. für Fonts oder globale Einstellungen
	const headStyles = `
	  <style>
		/* Dokument-Breite auf A4 anpassen (Approximativ in px) */
		@page { size: A4 portrait; margin: 0; }
		html, body {
		  margin: 0;
		  padding: 0;
		  width: 210mm; 
		  height: 297mm; 
		  font-family: sans-serif;
		  background-color: #FFFFFF;
		  color: #222222;
		}
		/* Überschriften */
		h1 { font-size: 28px; color: #0A8043; margin-bottom: 12px; }
		h2 { font-size: 20px; color: #0A8043; margin-top: 24px; margin-bottom: 8px; }
		/* Absätze */
		p, span { font-size: 14px; margin: 2px 0; line-height: 1.4; }
		/* Tabelle */
		table { border-collapse: collapse; width: 100%; margin-top: 12px; }
		th, td {
		  border: 1px solid #AAAAAA;
		  padding: 6px 8px;
		  font-size: 14px;
		}
		th {
		  background-color: #F0F0F0;
		  font-weight: bold;
		}
		/* QR-Code - Container */
		.qr-container {
		  margin-top: 16px;
		  margin-bottom: 16px;
		}
		/* Fußzeile */
		.footer {
		  position: absolute;
		  bottom: 24px;
		  left: 0;
		  width: 100%;
		  font-size: 12px;
		  color: #666666;
		  text-align: center;
		}
	  </style>
	`;
  
	// Der „Body“-Inhalt des Begleitscheins mit Inline-Styles und Tabellen
	const bodyContent = `
	  <div style="padding: 24px 36px; position: relative;">
  
		<h1>Begleitschein</h1>
  
		<p><strong>Ankaufsnummer:</strong> ${ankaufsNummer}</p>
		<p><strong>Datum/Uhrzeit:</strong> ${date}</p>
  
		<h2>Kundendaten</h2>
		<p><strong>Name:</strong> ${name}</p>
		<p><strong>E-Mail:</strong> ${email}</p>
		<p><strong>Adresse:</strong> ${address}</p>
  
		<h2>Packstück-Details</h2>
		<table>
		  <tr>
			<th>Artikelgewicht (kg)</th>
			<th>Anzahl Artikel</th>
		  </tr>
		  <tr>
			<td style="text-align: center;">${totalWeight.toFixed(2)} kg</td>
			<td style="text-align: center;">1</td>
		  </tr>
		</table>
  
		${qrCodeDataURL ? `
		  <div class="qr-container" style="text-align: center;">
			<p><strong>QR-Code (Ankaufsnummer):</strong></p>
			<img src="${qrCodeDataURL}" alt="QR Code" style="width: 120px; height: 120px; border: 1px solid #CCCCCC; padding: 4px; background: #FFFFFF;" />
		  </div>
		` : ''}
  
		<div style="margin-top: 24px; font-size: 14px; color: #333333;">
		  <p><strong>HINWEISE:</strong></p>
		  <ul style="margin-left: 16px;">
			<li>Dieser Begleitschein muss dem Paket beigelegt werden.</li>
			<li>Bitte sorge dafür, dass die Artikel sicher verpackt sind.</li>
			<li>Stornierungen oder Änderungen sind nur per E-Mail möglich.</li>
			<li>Bei Rückfragen kontaktiere uns unter info@dein-shop.de.</li>
		  </ul>
		</div>
  
		<div class="footer">
		  <p>Die Buchretter • Triftstr. 21b • 16348 Wandlitz • Tel: 03338 123456 • info@die-buchretter.de</p>
		</div>
	  </div>
	`;
  
	if (onlyBody) {
	  // Wenn nur der <body>-Inhalt gebraucht wird (seltener), kann man ihn direkt zurückgeben
	  return bodyContent;
	}
  
	// Komplettes Dokument (inkl. <head> + <body>)
	const fullDocument = `
	  <!DOCTYPE html>
	  <html lang="de">
		<head>
		  <meta charset="UTF-8" />
		  <title>Begleitschein ${ankaufsNummer}</title>
		  ${headStyles}
		</head>
		<body>
		  ${bodyContent}
		</body>
	  </html>
	`;
	return fullDocument;
  }
  