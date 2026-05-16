import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { prisma } from "../prisma.js";
import { generateContractNumber } from "../utils/reference.js";
import { ApiError } from "../utils/errors.js";

const contractsDir = path.resolve("src/uploads/contracts");
fs.mkdirSync(contractsDir, { recursive: true });

function buildDefaultMoroccanTerms(reservation, agency) {
  return [
    "1. Documents et eligibilite",
    "- Le locataire doit presenter une piece d'identite valide, un permis de conduire en cours de validite et un moyen de garantie accepte par l'agence.",
    "- Le conducteur principal et tout conducteur additionnel doivent etre identifies dans le contrat. Toute conduite par une personne non autorisee reste sous la responsabilite du locataire.",
    "",
    "2. Mise a disposition et restitution",
    "- Le vehicule est remis pour la duree prevue au contrat. Toute prolongation doit faire l'objet d'un accord ecrit ou confirme par l'agence avant l'echeance.",
    "- Le vehicule doit etre restitue avec ses cles, papiers et accessoires dans l'etat general constate au depart.",
    "- Sauf mention contraire, le niveau de carburant au retour doit etre equivalent a celui du depart.",
    "",
    "3. Usage du vehicule",
    "- Le vehicule est destine a un usage normal de location. Il ne peut pas etre sous-loue, utilise pour des competitions, tractages ou transports remuneres sans autorisation ecrite.",
    "- La circulation est limitee au territoire marocain, sauf autorisation expresse de l'agence.",
    "",
    "4. Assurance, caution et responsabilite",
    `- Une caution de ${reservation.car.depositAmount.toString()} MAD est prevue pour couvrir la franchise, les dommages non couverts, le carburant manquant, les cles perdues et les frais annexes contractuels.`,
    "- Le locataire reste gardien du vehicule pendant toute la location et supporte les consequences d'un usage non conforme ou negligent.",
    "- Les dommages sur pneumatiques, jantes, soubassements, cles, accessoires ou documents de bord peuvent rester a la charge du locataire selon les garanties souscrites.",
    "",
    "5. Accident, vol ou immobilisation",
    "- En cas d'accident, de tentative de vol, de vol ou de dommage grave, le locataire doit avertir l'agence sans delai et fournir un constat amiable ou une declaration officielle dans les 24 heures.",
    "- Le non-respect de ces formalites peut entrainer la perte du benefice des garanties applicables.",
    "",
    "6. Retard, frais et cloture",
    "- Tout retard de restitution peut entrainer une facturation complementaire selon la grille tarifaire en vigueur ainsi que les frais lies a l'immobilisation du vehicule.",
    "- Le present contrat est execute conformement aux usages contractuels applicables au Royaume du Maroc.",
    "",
    `Agence de reference: ${agency?.agencyName || "Agence"}.`
  ].join("\n");
}

function normalizeContractClauses(rawTerms) {
  return String(rawTerms || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function writeSection(doc, title, lines) {
  doc.font("Helvetica-Bold").fontSize(12).text(title);
  doc.moveDown(0.35);
  doc.font("Helvetica").fontSize(10.5);
  lines.forEach((line) => {
    doc.text(line, {
      align: "justify",
      lineGap: 2
    });
  });
  doc.moveDown();
}

export async function generateContractPdf(reservationId) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      client: { include: { user: true } },
      car: true,
      pack: true
    }
  });

  if (!reservation) throw new ApiError(404, "Reservation introuvable");

  const agency = await prisma.agencySetting.findFirst();
  const documents = await prisma.documentSetting.findFirst();
  const existingContract = await prisma.contract.findUnique({
    where: { reservationId }
  });

  const contractNumber = existingContract?.contractNumber || generateContractNumber();
  const fileName = `${contractNumber}.pdf`;
  const filePath = path.join(contractsDir, fileName);
  const generalTerms = documents?.generalTerms || reservation.car.conditions || buildDefaultMoroccanTerms(reservation, agency);
  const clauseLines = normalizeContractClauses(generalTerms);
  const signatureClientLabel = documents?.invoiceTemplate || "Signature client";
  const signatureAgencyLabel = documents?.paymentReceiptTemplate || "Signature agence";
  const legalNotice = documents?.legalNotice || "";

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.font("Helvetica-Bold").fontSize(20).text(
      documents?.contractTemplate || `Contrat de location ${agency?.agencyName || "Agence"}`,
      { align: "center" }
    );
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(11).text(`Contrat N° ${contractNumber}`, { align: "center" });
    doc.moveDown(1.2);

    writeSection(doc, "A. Informations agence", [
      `Agence: ${agency?.agencyName || "Agence"}`,
      `Adresse: ${agency?.address || "Non renseignee"}`,
      `Telephone: ${agency?.phone || "Non renseigne"}`,
      `Email: ${agency?.email || "Non renseigne"}`
    ]);

    writeSection(doc, "B. Informations client", [
      `Client: ${reservation.client.user.firstName} ${reservation.client.user.lastName}`,
      `Telephone: ${reservation.client.user.phone || "Non renseigne"}`,
      `Email: ${reservation.client.user.email || "Non renseigne"}`,
      `Ville / adresse: ${[reservation.client.city, reservation.client.address].filter(Boolean).join(" - ") || "Non renseigne"}`,
      `CIN / Passeport: ${reservation.client.cinOrPassport || "Non renseigne"}`,
      `Permis de conduire: ${reservation.client.driverLicense || "Non renseigne"}`
    ]);

    writeSection(doc, "C. Vehicule et location", [
      `Vehicule: ${reservation.car.brand} ${reservation.car.model} - ${reservation.car.plateNumber}`,
      `Pack: ${reservation.pack?.name || "Sans pack specifique"}`,
      `Periode: du ${reservation.startDate.toLocaleDateString("fr-MA")} au ${reservation.endDate.toLocaleDateString("fr-MA")}`,
      `Duree: ${reservation.totalDays} jour(s)`,
      `Prix total: ${reservation.totalPrice.toString()} MAD`,
      `Caution: ${reservation.car.depositAmount.toString()} MAD`
    ]);

    writeSection(doc, "D. Conditions generales de location", clauseLines);

    if (legalNotice) {
      writeSection(doc, "E. Mentions legales", normalizeContractClauses(legalNotice));
    }

    doc.moveDown(1.2);
    doc.font("Helvetica-Bold").fontSize(12).text("Signatures", { underline: true });
    doc.moveDown(1.2);
    doc.font("Helvetica").fontSize(11);
    doc.text(`${signatureClientLabel}: ____________________________`, 40, doc.y);
    doc.text(`${signatureAgencyLabel}: ____________________________`, 320, doc.y - 11);

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  const snapshot = {
    agencyName: agency?.agencyName || "",
    clientName: `${reservation.client.user.firstName} ${reservation.client.user.lastName}`,
    car: `${reservation.car.brand} ${reservation.car.model}`,
    totalPrice: reservation.totalPrice.toString(),
    startDate: reservation.startDate.toISOString(),
    endDate: reservation.endDate.toISOString(),
    generalTerms,
    legalNotice,
    signatureClientLabel,
    signatureAgencyLabel
  };

  const contract = await prisma.contract.upsert({
    where: { reservationId },
    update: {
      contractNumber,
      fileUrl: filePath,
      contentSnapshot: snapshot
    },
    create: {
      reservationId,
      contractNumber,
      fileUrl: filePath,
      contentSnapshot: snapshot
    }
  });

  return contract;
}
