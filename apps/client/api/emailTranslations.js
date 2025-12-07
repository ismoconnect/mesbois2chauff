/**
 * Email translations for order confirmation emails
 * Supports: FR, EN, DE, ES, IT, NL, PT
 */

const emailTranslations = {
    fr: {
        subject: 'Confirmation de commande',
        greeting: 'Bonjour',
        intro_new: 'Merci pour votre commande et bienvenue chez',
        intro_existing: 'Merci pour votre commande et votre fidélité.',
        order_number: 'Numéro de commande',
        order_details: 'Détails de votre commande :',
        total_ttc: 'Total TTC',
        delivery_address: 'Adresse de livraison',
        phone: 'Téléphone',
        delivery_info: 'Nous vous enverrons un e-mail dès que votre colis sera expédié. Délais de livraison estimés : 2 à 5 jours selon l\'adresse de livraison. Nous livrons partout en France. Vous pouvez suivre l\'évolution de la livraison de votre achat depuis votre espace client. Pour toute question, répondez à cet e-mail.',
        regards: 'Cordialement,',
        service: 'Service',
        summary: 'Récapitulatif',
        article: 'Article',
        qty: 'Qté',
        price: 'Prix',
        customer_service: 'Service Client'
    },
    en: {
        subject: 'Order Confirmation',
        greeting: 'Hello',
        intro_new: 'Thank you for your order and welcome to',
        intro_existing: 'Thank you for your order and your loyalty.',
        order_number: 'Order number',
        order_details: 'Your order details:',
        total_ttc: 'Total incl. VAT',
        delivery_address: 'Delivery address',
        phone: 'Phone',
        delivery_info: 'We will send you an email as soon as your package is shipped. Estimated delivery time: 2 to 5 days depending on the delivery address. We deliver throughout France. You can track your order from your customer area. For any questions, reply to this email.',
        regards: 'Best regards,',
        service: 'Service',
        summary: 'Summary',
        article: 'Item',
        qty: 'Qty',
        price: 'Price',
        customer_service: 'Customer Service'
    },
    de: {
        subject: 'Bestellbestätigung',
        greeting: 'Hallo',
        intro_new: 'Vielen Dank für Ihre Bestellung und willkommen bei',
        intro_existing: 'Vielen Dank für Ihre Bestellung und Ihre Treue.',
        order_number: 'Bestellnummer',
        order_details: 'Ihre Bestelldetails:',
        total_ttc: 'Gesamtbetrag inkl. MwSt.',
        delivery_address: 'Lieferadresse',
        phone: 'Telefon',
        delivery_info: 'Wir senden Ihnen eine E-Mail, sobald Ihr Paket versandt wurde. Geschätzte Lieferzeit: 2 bis 5 Tage je nach Lieferadresse. Wir liefern in ganz Frankreich. Sie können Ihre Bestellung in Ihrem Kundenbereich verfolgen. Bei Fragen antworten Sie einfach auf diese E-Mail.',
        regards: 'Mit freundlichen Grüßen,',
        service: 'Service',
        summary: 'Zusammenfassung',
        article: 'Artikel',
        qty: 'Menge',
        price: 'Preis',
        customer_service: 'Kundenservice'
    },
    es: {
        subject: 'Confirmación de pedido',
        greeting: 'Hola',
        intro_new: 'Gracias por su pedido y bienvenido a',
        intro_existing: 'Gracias por su pedido y su fidelidad.',
        order_number: 'Número de pedido',
        order_details: 'Detalles de su pedido:',
        total_ttc: 'Total IVA incl.',
        delivery_address: 'Dirección de entrega',
        phone: 'Teléfono',
        delivery_info: 'Le enviaremos un correo electrónico tan pronto como se envíe su paquete. Tiempo de entrega estimado: 2 a 5 días según la dirección de entrega. Entregamos en toda Francia. Puede seguir su pedido desde su área de cliente. Para cualquier pregunta, responda a este correo electrónico.',
        regards: 'Atentamente,',
        service: 'Servicio',
        summary: 'Resumen',
        article: 'Artículo',
        qty: 'Cant.',
        price: 'Precio',
        customer_service: 'Servicio al Cliente'
    },
    it: {
        subject: 'Conferma dell\'ordine',
        greeting: 'Ciao',
        intro_new: 'Grazie per il tuo ordine e benvenuto in',
        intro_existing: 'Grazie per il tuo ordine e la tua fedeltà.',
        order_number: 'Numero d\'ordine',
        order_details: 'Dettagli del tuo ordine:',
        total_ttc: 'Totale IVA incl.',
        delivery_address: 'Indirizzo di consegna',
        phone: 'Telefono',
        delivery_info: 'Ti invieremo un\'email non appena il tuo pacco sarà spedito. Tempo di consegna stimato: da 2 a 5 giorni a seconda dell\'indirizzo di consegna. Consegniamo in tutta la Francia. Puoi tracciare il tuo ordine dalla tua area cliente. Per qualsiasi domanda, rispondi a questa email.',
        regards: 'Cordiali saluti,',
        service: 'Servizio',
        summary: 'Riepilogo',
        article: 'Articolo',
        qty: 'Qtà',
        price: 'Prezzo',
        customer_service: 'Servizio Clienti'
    },
    nl: {
        subject: 'Bevestiging van bestelling',
        greeting: 'Hallo',
        intro_new: 'Bedankt voor uw bestelling en welkom bij',
        intro_existing: 'Bedankt voor uw bestelling en uw trouw.',
        order_number: 'Bestelnummer',
        order_details: 'Uw bestelgegevens:',
        total_ttc: 'Totaal incl. BTW',
        delivery_address: 'Bezorgadres',
        phone: 'Telefoon',
        delivery_info: 'We sturen u een e-mail zodra uw pakket is verzonden. Geschatte levertijd: 2 tot 5 dagen afhankelijk van het bezorgadres. We leveren in heel Frankrijk. U kunt uw bestelling volgen vanuit uw klantengebied. Voor vragen kunt u op deze e-mail antwoorden.',
        regards: 'Met vriendelijke groet,',
        service: 'Service',
        summary: 'Samenvatting',
        article: 'Artikel',
        qty: 'Aantal',
        price: 'Prijs',
        customer_service: 'Klantenservice'
    },
    pt: {
        subject: 'Confirmação de encomenda',
        greeting: 'Olá',
        intro_new: 'Obrigado pela sua encomenda e bem-vindo a',
        intro_existing: 'Obrigado pela sua encomenda e pela sua fidelidade.',
        order_number: 'Número da encomenda',
        order_details: 'Detalhes da sua encomenda:',
        total_ttc: 'Total IVA incl.',
        delivery_address: 'Endereço de entrega',
        phone: 'Telefone',
        delivery_info: 'Enviaremos um e-mail assim que o seu pacote for enviado. Tempo de entrega estimado: 2 a 5 dias dependendo do endereço de entrega. Entregamos em toda a França. Pode acompanhar a sua encomenda na sua área de cliente. Para qualquer questão, responda a este e-mail.',
        regards: 'Atenciosamente,',
        service: 'Serviço',
        summary: 'Resumo',
        article: 'Artigo',
        qty: 'Qtd',
        price: 'Preço',
        customer_service: 'Serviço ao Cliente'
    }
};

/**
 * Get translations for a specific language
 * @param {string} lang - Language code (fr, en, de, es, it, nl, pt)
 * @returns {object} - Translations object
 */
function getEmailTranslations(lang) {
    const normalizedLang = (lang || 'fr').toLowerCase().substring(0, 2);
    return emailTranslations[normalizedLang] || emailTranslations.fr;
}

module.exports = { getEmailTranslations, emailTranslations };
