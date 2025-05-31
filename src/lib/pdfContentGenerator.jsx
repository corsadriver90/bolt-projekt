const getDeliveryTypeGerman = (type) => {
        if (type === 'selbstanlieferung') return 'Selbstanlieferung';
        if (type === 'versand') return 'Versand';
        if (type === 'abholung') return 'Abholung';
        return type;
    };

    const generateItemsTable = (cartItems, totalWeight, totalPrice) => {
      const itemsHtml = cartItems.map(item => `
        <tr>
          <td>${item.category}</td>
          <td style="text-align: right;">${item.weight.toFixed(2)} kg</td>
          <td style="text-align: right;">${item.price.toFixed(2)} €</td>
        </tr>
      `).join('');

      return `
        <table>
            <thead>
                <tr>
                    <th>Kategorie</th>
                    <th style="text-align: right;">Gewicht</th>
                    <th style="text-align: right;">Preis (geschätzt)</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr class="total-row">
                    <td>Gesamtsumme (geschätzt)</td>
                    <td style="text-align: right;">${totalWeight.toFixed(2)} kg</td>
                    <td style="text-align: right;">${totalPrice.toFixed(2)} €</td>
                </tr>
            </tfoot>
        </table>
      `;
    };

    const generatePaymentInfoPage1 = (data) => {
      const { deliveryType, iban, paypal } = data;
      let paymentInfoHtml = '<span class="section-subheading">Auszahlungsinformationen</span>';
      if (iban) paymentInfoHtml += `<p><strong>IBAN:</strong> ${iban}</p>`;
      if (paypal) paymentInfoHtml += `<p><strong>PayPal:</strong> ${paypal}</p>`;
      
      if (deliveryType === 'selbstanlieferung') {
          if (!iban && !paypal) paymentInfoHtml += '<p>Auszahlung erfolgt vor Ort in Bar oder nach Vereinbarung.</p>';
      } else { 
          if (!iban && !paypal) paymentInfoHtml += '<p>Keine Bank-/PayPal-Daten für Auszahlung angegeben.</p>';
      }
      return paymentInfoHtml;
    };
    
    const generateSpecificDeliveryDetailsPage1 = (data) => {
      const { deliveryType, pickupDetails, selfDeliveryNotes, selectedTimeSlot, deliveryDate } = data;
      let specificDetailsHtml = '<span class="section-subheading">Details zur Abgabe</span>';

      if (deliveryType === 'abholung' && pickupDetails) {
        if (pickupDetails.date) {
            specificDetailsHtml += `<p><strong>Abholung am:</strong> ${new Date(pickupDetails.date).toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}${pickupDetails.time ? ` / ${pickupDetails.time} Uhr` : ''}</p>`;
        } else {
            specificDetailsHtml += `<p><strong>Abholung:</strong> Wir kontaktieren Sie zur Terminvereinbarung.</p>`;
        }
        if (pickupDetails.notes) specificDetailsHtml += `<p><strong>Anmerkungen:</strong> ${pickupDetails.notes}</p>`;
      } else if (deliveryType === 'selbstanlieferung') {
         if (deliveryDate) {
            specificDetailsHtml += `<p><strong>Anlieferung am:</strong> ${new Date(deliveryDate).toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>`;
         }
         specificDetailsHtml += `<p><strong>Zeitfenster:</strong> ${selectedTimeSlot || 'Kein festes Zeitfenster'}</p>`;
         specificDetailsHtml += `<p><strong>Anlieferadresse:</strong> Die Buchretter GbR, Triftstr. 21B, 16348 Wandlitz OT Klosterfelde</p>`;
         if (selfDeliveryNotes) specificDetailsHtml += `<p><strong>Anmerkungen:</strong> ${selfDeliveryNotes}</p>`;
      } else if (deliveryType === 'versand') {
        specificDetailsHtml += `<p><strong>Versand an:</strong> Die Buchretter GbR, Triftstr. 21B, 16348 Wandlitz OT Klosterfelde</p>`;
      }
      return specificDetailsHtml;
    };

    const generatePage1Header = () => `
        <div class="header">
            <h1>
                <svg class="logo-inline" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 4H5V20H19V4Z M8.13551 6.01215C7.89424 5.53594 8.0127 4.9447 8.48891 4.70343C8.96512 4.46216 9.55636 4.58063 9.79763 5.05684L13.0632 11.0399C13.1391 11.1788 13.1843 11.3351 13.1955 11.4964L13.6667 18H10.3333L10.0856 12.9601L8.13551 6.01215Z M15.8645 6.01215L13.9144 12.9601L13.6667 18H10.3333L10.0676 11.0399C10.1829 10.9794 10.2924 10.9011 10.3948 10.8063C11.0167 10.1932 11.0167 9.19929 10.3948 8.58618C9.77298 7.97306 8.77905 7.97306 8.15713 8.58618L7.0237 9.71962L8.13551 6.01215C7.89424 5.53594 8.0127 4.9447 8.48891 4.70343C8.96512 4.46216 9.55636 4.58063 9.79763 5.05684L12 9.1602L14.2024 5.05684C14.4436 4.58063 15.0349 4.46216 15.5111 4.70343C15.9873 4.9447 16.1058 5.53594 15.8645 6.01215Z M15.8429 8.58618C15.221 7.97306 14.227 7.97306 13.6052 8.58618C12.9833 9.19929 12.9833 10.1932 13.6052 10.8063C13.9067 11.1079 14.2943 11.2799 14.6972 11.298L15.3333 11.5646L16.9763 9.71962L15.8429 8.58618Z"/></svg>
                Die Buchretter - Begleitschein / Ankaufbeleg
            </h1>
             <p class="slogan">Mehr als nur Bücher! Wir kaufen deine gebrauchten Schätze – einfach nach Gewicht.</p>
        </div>
    `;
    
    const generateSenderReceiverInfoPage1 = (data) => `
        <div class="info-grid">
            <div class="info-block">
                <span class="section-subheading">Absender (Ihre Daten)</span>
                <p><strong>${data.companyName ? data.companyName : data.name}</strong></p>
                ${data.companyName ? `<p>${data.name}</p>`: ''}
                <p>${data.street}</p>
                <p>${data.zip} ${data.city}</p>
                <p><strong>E-Mail:</strong> ${data.email}</p>
                ${data.phone ? `<p><strong>Telefon:</strong> ${data.phone}</p>` : ''}
            </div>
            <div class="info-block">
                <span class="section-subheading">Empfänger (Unsere Daten)</span>
                <p><strong>Die Buchretter GbR</strong></p>
                <p>Triftstr. 21B</p>
                <p>16348 Wandlitz OT Klosterfelde</p>
                <p>Deutschland</p>
                <p><strong>E-Mail:</strong> info@die-buchretter.de</p>
                <p><strong>Telefon:</strong> 033396 748863</p>
            </div>
        </div>
    `;

    const generateAnkaufsDetailsSectionPage1 = (ankaufsNummer, formattedDate, deliveryType) => `
        <div class="ankauf-details">
          <p><strong>Ankaufsnummer: ${ankaufsNummer}</strong></p>
          <p>Datum der Anfrage: ${formattedDate} Uhr</p>
          <p>Gewählte Abgabeart: ${getDeliveryTypeGerman(deliveryType)}</p>
        </div>
    `;
    
    const generateQrAndSignatureSectionPage1 = (qrCodeDataURL, ankaufsNummer) => `
        <div class="qr-signature-section">
            <div class="qr-code-container">
                <span class="section-subheading">QR-Code (Interne Abwicklung)</span>
                ${qrCodeDataURL ? `<img src="${qrCodeDataURL}" alt="QR Code für Ankaufsnummer ${ankaufsNummer}"/>` : '<p>QR-Code konnte nicht geladen werden.</p>'}
                <p class="qr-id">Ankaufs-ID: ${ankaufsNummer}</p>
            </div>
            <div class="signature-area">
                <span class="section-subheading">Bestätigung des Verkäufers</span>
                <p>Ich bestätige die Richtigkeit der Angaben und die Akzeptanz der AGB.</p>
                <p><span class="signature-line-container">Datum: <span class="signature-line"></span></span></p>
                <p><span class="signature-line-container">Unterschrift: <span class="signature-line"></span></span></p>
            </div>
        </div>
    `;
    
    const generateImportantNotePage1 = () => `
      <div class="important-note-combined">
        <p><strong>Wichtig:</strong> Bitte diesen Beleg (Seite 1) ausdrucken und der Sendung beilegen oder bei Abholung/Anlieferung vorzeigen. Der Wert der Artikel ist eine Schätzung und wird nach Prüfung ggf. angepasst.</p>
      </div>
    `;

    const generatePage1Footer = () => `
        <div class="footer">
            <p>Vielen Dank für deine Anfrage! Wir freuen uns auf deine Schätze.</p>
            <p>Die Buchretter GbR | Triftstr. 21B, 16348 Wandlitz | info@die-buchretter.de | 033396 748863</p>
        </div>
    `;

    export const getPage1Content = (data, ankaufsNummer, formattedDate) => {
      const { cartItems, totalWeight, totalPrice, qrCodeDataURL } = data;

      const itemsTableHtml = generateItemsTable(cartItems, totalWeight, totalPrice);
      const paymentInfoHtml = generatePaymentInfoPage1(data);
      const specificDeliveryDetailsHtml = generateSpecificDeliveryDetailsPage1(data);

      return `
        <div class="page-content"> 
            ${generatePage1Header()}
            ${generateSenderReceiverInfoPage1(data)}
            ${generateAnkaufsDetailsSectionPage1(ankaufsNummer, formattedDate, data.deliveryType)}
            
            <span class="main-section-heading">Artikelübersicht</span>
            ${itemsTableHtml}

            <div class="main-content-columns">
                <div class="column-left">
                    <div class="section-compact">
                        ${paymentInfoHtml}
                    </div>
                    <div class="section-compact">
                        ${specificDeliveryDetailsHtml}
                    </div>
                </div>
                <div class="column-right">
                    ${generateQrAndSignatureSectionPage1(qrCodeDataURL, ankaufsNummer)}
                </div>
            </div>
            ${generateImportantNotePage1()}
            ${generatePage1Footer()}
        </div> 
      `;
    };
    
    const generatePage2DeliverySection = (data) => {
        const { deliveryType, pickupDetails, selectedTimeSlot, deliveryDate, selfDeliveryNotes } = data;
        let content = '';
        if (deliveryType === 'versand') {
        content += `
            <div>
                <span class="section-subheading">Versand per Post/DHL</span>
                <ol>
                    <li><strong>Verpacken:</strong> Verpacke deine Artikel sicher in einem stabilen Karton. Polstere Hohlräume gut aus, um Transportschäden zu vermeiden. Lege den Ankaufsbeleg (Seite 1) gut sichtbar bei.</li>
                    <li><strong>Versandetikett (ab 10kg):</strong> Wenn deine Sendung 10kg oder mehr wiegt und du ein kostenloses Label von uns erhalten hast (per E-Mail oder Download), klebe dieses gut sichtbar auf das Paket.</li>
                    <li><strong>Versand (unter 10kg oder ohne unser Label):</strong> Frankiere das Paket bitte ausreichend und sende es an: Die Buchretter GbR, Triftstr. 21B, 16348 Wandlitz OT Klosterfelde.</li>
                    <li><strong>Nach Eingang:</strong> Sobald deine Sendung bei uns eintrifft und geprüft wurde, veranlassen wir die Auszahlung gemäß deinen Angaben. Dies kann einige Werktage in Anspruch nehmen.</li>
                </ol>
                <p><strong>Verpackungstipps:</strong> Stabile Kartons verwenden, Leerräume füllen, sorgfältig verkleben, alte Etiketten entfernen.</p>
            </div>
        `;
      } else if (deliveryType === 'abholung') {
        content += `
            <div>
                <span class="section-subheading">Persönliche Abholung durch uns</span>
                <ol>
                    <li><strong>Terminbestätigung:</strong> Wir melden uns (i.d.R. 1-2 Werktage) zur Terminbestätigung ${pickupDetails && pickupDetails.date ? `(Wunsch: ${new Date(pickupDetails.date).toLocaleDateString('de-DE')} ${pickupDetails.time ? ` ${pickupDetails.time} Uhr` : ''})` : ''}.</li>
                    <li><strong>Vorbereitung:</strong> Artikel transportfertig bereitstellen. Ankaufsbeleg (Seite 1) bereithalten.</li>
                    <li><strong>Abholung & Auszahlung:</strong> Fahrer prüft grob vor Ort. Endgültige Prüfung & Wiegung im Lager. Auszahlung per Überweisung/PayPal nach finaler Prüfung.</li>
                    ${pickupDetails && pickupDetails.notes ? `<li><strong>Deine Anmerkungen:</strong> ${pickupDetails.notes}</li>` : ''}
                </ol>
            </div>
        `;
      } else if (deliveryType === 'selbstanlieferung') {
        content += `
            <div>
                <span class="section-subheading">Selbstanlieferung durch dich</span>
                <ol>
                    <li><strong>Dein Termin:</strong> ${deliveryDate ? `${new Date(deliveryDate).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` : 'Gewähltes Datum'} ${selectedTimeSlot ? ` (${selectedTimeSlot})` : ''}.</li>
                    <li><strong>Adresse:</strong> Die Buchretter GbR, Triftstr. 21B, 16348 Wandlitz OT Klosterfelde.</li>
                    <li><strong>Mitbringen:</strong> Ankaufsbeleg (Seite 1) ausgedruckt oder digital.</li>
                    <li><strong>Vor Ort:</strong> Wiegung und Auszahlung (Bar oder digital nach Prüfung).</li>
                    ${selfDeliveryNotes ? `<li><strong>Deine Anmerkungen:</strong> ${selfDeliveryNotes}</li>` : ''}
                </ol>
                <p>Bei Terminänderung bitte frühzeitig Bescheid geben.</p>
            </div>
        `;
      }
      return content;
    };

    const generatePage2GeneralHints = () => `
         <div>
            <span class="section-subheading">Allgemeine Hinweise zum Ankauf</span>
            <ul>
                <li><strong>Artikelzustand:</strong> Gemäß <a href="/was-wir-annehmen">Ankaufsbedingungen</a> (keine Schäden, Schimmel etc.).</li>
                <li><strong>Preisgültigkeit:</strong> Tagesaktuell bei Formularabsendung.</li>
                <li><strong>Endgültige Bewertung:</strong> Belegsumme ist Schätzung. Endgültige Gutschrift nach Prüfung.</li>
                <li><strong>Datenschutz:</strong> Gemäß <a href="/datenschutz">Datenschutzerklärung</a>.</li>
                <li><strong>Fragen?</strong> info@die-buchretter.de oder 033396 748863.</li>
            </ul>
        </div>
    `;

    const generatePage2Footer = () => `
        <div class="footer">
            <p>Wir freuen uns auf dich und deine Artikel! Dein Team von Die Buchretter GbR</p>
        </div>
    `;
    
    export const getPage2Content = (data) => {
      let content = `
        <div class="page-content"> 
            <div class="header page2-header">
                <h1>Nächste Schritte & Wichtige Hinweise</h1>
            </div>
            <div class="combined-hints-section">
              ${generatePage2DeliverySection(data)}
              ${generatePage2GeneralHints()}
            </div>
            ${generatePage2Footer()}
        </div>
      `;
      return content;
    };