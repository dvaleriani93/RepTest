function generatePDF(sBarcode, sDescriptions, sTitolo) {
    const input = sBarcode;
    const title = sTitolo;

    if (input.trim() === "") {
        alert("Inserisci almeno un valore valido per i barcode");
        return;
    }

    // ✅ Divide correttamente barcode e descrizioni gestendo spazi vuoti
    let barcodes = input.split(",").map(val => val.trim()).filter(val => val !== "");
   
    // barcodes = [...new Set(barcodes)]; // Evita duplicati
    // if (barcodes.length === 0) {
    //     alert("Inserisci almeno un valore valido per i barcode");
    //     return;
    // }

    let descriptions = sDescriptions.split(",").map(val => val.trim()).filter(val => val !== "");
    // descriptions = [...new Set(descriptions)]; // Evita duplicati

    // ✅ Assicura che barcode e descrizioni abbiano la stessa lunghezza
    // while (descriptions.length < barcodes.length) {
    //     descriptions.push("");  
    // }

    generateBarcodePDF(barcodes, descriptions, title);
}

function generateBarcodePDF(barcodes, descriptions, title = "") {
    const { jsPDF } = window.jspdf;

    if (!jsPDF) {
        alert("Errore: jsPDF non è stato caricato correttamente!");
        return;
    }

    const doc = new jsPDF();

    if (title) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 102, 204);
        doc.text(title, 105, 15, { align: "center" });
    }

    let xPosition = 10;
    let yPosition = title ? 30 : 15;
    let barcodeHeight = 40;
    let barcodeWidth = 80;
    let descriptionHeight = 10;

    for (let i = 0; i < barcodes.length; i++) {
        const barcode = barcodes[i];
        const description = descriptions[i] || "";
        const canvas = document.createElement("canvas");

        if (typeof JsBarcode === 'undefined') {
            alert("Errore: JsBarcode non è stato caricato correttamente!");
            return;
        }

        JsBarcode(canvas, barcode, { format: "CODE128", displayValue: true });

        const barcodeImage = canvas.toDataURL("image/png");

        doc.addImage(barcodeImage, "PNG", xPosition, yPosition);

        if (description) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(description, xPosition + 5, yPosition + barcodeHeight + 5, { maxWidth: 75 });
        }

        if ((i + 1) % 2 === 0) {
            xPosition = 10;
            yPosition += barcodeHeight + descriptionHeight + 10;
        } else {
            xPosition += barcodeWidth + 20;
        }

        if (yPosition > 260) {
            doc.addPage();
            xPosition = 10;
            yPosition = 15;
        }
    }

    doc.save("barcodes.pdf");
}
