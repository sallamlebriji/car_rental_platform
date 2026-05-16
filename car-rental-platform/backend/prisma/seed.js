import bcrypt from "bcryptjs";
import {
  PrismaClient,
  PricingType,
  OptionPricingType,
  UserType,
  CarStatus,
  PaymentMethod,
  PaymentStatus,
  ReservationStatus
} from "@prisma/client";

const prisma = new PrismaClient();

const permissions = [
  ["Voir les reservations", "reservations.view", "reservations"],
  ["Modifier les reservations", "reservations.edit", "reservations"],
  ["Supprimer les reservations", "reservations.delete", "reservations"],
  ["Gerer les voitures", "cars.manage", "cars"],
  ["Gerer les clients", "clients.manage", "clients"],
  ["Gerer les paiements", "payments.manage", "payments"],
  ["Gerer les parametres", "settings.manage", "settings"],
  ["Generer les contrats", "contracts.generate", "contracts"],
  ["Gerer les employes", "employees.manage", "employees"],
  ["Voir le dashboard", "dashboard.view", "dashboard"],
  ["Gerer les agences", "agencies.manage", "agencies"],
  ["Voir les audit logs", "audit.logs.view", "audit"],
  ["Gerer les feature flags", "featureflags.manage", "platform"]
];

const defaultMoroccanGeneralTerms = [
  "Le locataire doit presenter une piece d'identite valide, un permis de conduire en cours de validite et un moyen de garantie accepte par l'agence.",
  "Le vehicule doit etre restitue a la date convenue, avec ses papiers, ses cles et un niveau de carburant equivalent a celui du depart, sauf accord contraire.",
  "La circulation du vehicule est limitee au territoire marocain sauf autorisation ecrite expresse de l'agence.",
  "En cas d'accident, de vol ou de dommage important, le locataire doit avertir l'agence immediatement et fournir un constat ou une declaration officielle dans les 24 heures.",
  "La caution couvre notamment la franchise, les dommages non couverts, les accessoires manquants, les cles perdues et les frais contractuels annexes.",
  "Toute prolongation de location doit etre approuvee par l'agence avant l'expiration du contrat initial."
].join("\n");

async function createAgencyDefaults(agency, overrides = {}) {
  await prisma.agencySetting.upsert({
    where: { agencyId: agency.id },
    update: {
      agencyName: agency.name,
      slogan: overrides.slogan || "Location de voitures",
      address: agency.address,
      phone: agency.phone,
      email: agency.email,
      whatsapp: agency.whatsapp,
      website: agency.website,
      description: agency.description
    },
    create: {
      agencyId: agency.id,
      agencyName: agency.name,
      slogan: overrides.slogan || "Location de voitures",
      address: agency.address,
      phone: agency.phone,
      email: agency.email,
      whatsapp: agency.whatsapp,
      website: agency.website,
      description: agency.description
    }
  });

  await prisma.visualSetting.upsert({
    where: { agencyId: agency.id },
    update: {
      primaryColor: overrides.primaryColor || "#0f766e",
      secondaryColor: overrides.secondaryColor || "#f59e0b",
      themeMode: "light",
      homepageText: overrides.homepageText || "Reservez votre voiture en quelques clics."
    },
    create: {
      agencyId: agency.id,
      primaryColor: overrides.primaryColor || "#0f766e",
      secondaryColor: overrides.secondaryColor || "#f59e0b",
      themeMode: "light",
      homepageText: overrides.homepageText || "Reservez votre voiture en quelques clics."
    }
  });

  await prisma.reservationSetting.upsert({
    where: { agencyId: agency.id },
    update: {
      minimumRentalDays: 1,
      maximumRentalDays: 30,
      bookingFees: 100,
      requiredAdvancePercent: 20,
      defaultDepositAmount: 3000,
      cancellationPolicy: "Annulation gratuite jusqu'a 48h avant le depart.",
      generalTerms: defaultMoroccanGeneralTerms,
      reservationSuccessMessage: "Votre demande a bien ete enregistree.",
      allowGuestReservation: true,
      allowOnlinePayment: false,
      allowDocumentUpload: true
    },
    create: {
      agencyId: agency.id,
      minimumRentalDays: 1,
      maximumRentalDays: 30,
      bookingFees: 100,
      requiredAdvancePercent: 20,
      defaultDepositAmount: 3000,
      cancellationPolicy: "Annulation gratuite jusqu'a 48h avant le depart.",
      generalTerms: defaultMoroccanGeneralTerms,
      reservationSuccessMessage: "Votre demande a bien ete enregistree.",
      allowGuestReservation: true,
      allowOnlinePayment: false,
      allowDocumentUpload: true
    }
  });

  await prisma.notificationSetting.upsert({
    where: { agencyId: agency.id },
    update: {
      emailNotificationsEnabled: false,
      whatsappNotificationsEnabled: false,
      internalNotificationsEnabled: true,
      autoClientMessage: "Merci pour votre reservation.",
      autoAdminMessage: "Nouvelle reservation a traiter.",
      templates: {
        newReservation: "Une nouvelle reservation a ete creee.",
        reservationConfirmed: "Votre reservation est confirmee.",
        reservationRefused: "Votre reservation a ete refusee."
      }
    },
    create: {
      agencyId: agency.id,
      emailNotificationsEnabled: false,
      whatsappNotificationsEnabled: false,
      internalNotificationsEnabled: true,
      autoClientMessage: "Merci pour votre reservation.",
      autoAdminMessage: "Nouvelle reservation a traiter.",
      templates: {
        newReservation: "Une nouvelle reservation a ete creee.",
        reservationConfirmed: "Votre reservation est confirmee.",
        reservationRefused: "Votre reservation a ete refusee."
      }
    }
  });

  await prisma.documentSetting.upsert({
    where: { agencyId: agency.id },
    update: {
      contractTemplate: `Contrat de location ${agency.name}`,
      generalTerms: defaultMoroccanGeneralTerms,
      privacyPolicy: "Les donnees sont traitees de facon securisee.",
      legalNotice: "Informations legales de l'agence."
    },
    create: {
      agencyId: agency.id,
      contractTemplate: `Contrat de location ${agency.name}`,
      generalTerms: defaultMoroccanGeneralTerms,
      privacyPolicy: "Les donnees sont traitees de facon securisee.",
      legalNotice: "Informations legales de l'agence."
    }
  });
}

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const atlasAgency = await prisma.agency.upsert({
    where: { slug: "atlas-drive" },
    update: {},
    create: {
      name: "Atlas Drive",
      slug: "atlas-drive",
      code: "ATL-CASA",
      description: "Agence principale de location a Casablanca",
      address: "Boulevard Zerktouni, Casablanca",
      city: "Casablanca",
      country: "Maroc",
      phone: "+212522000000",
      email: "contact@atlasdrive.ma",
      whatsapp: "+212600123456",
      website: "https://atlasdrive.ma",
      isActive: true
    }
  });

  const oceanAgency = await prisma.agency.upsert({
    where: { slug: "ocean-rent" },
    update: {},
    create: {
      name: "Ocean Rent",
      slug: "ocean-rent",
      code: "OCN-AGD",
      description: "Agence secondaire a Agadir",
      address: "Marina d'Agadir",
      city: "Agadir",
      country: "Maroc",
      phone: "+212528000111",
      email: "hello@oceanrent.ma",
      whatsapp: "+212611223344",
      website: "https://oceanrent.ma",
      isActive: true
    }
  });

  await createAgencyDefaults(atlasAgency, {
    slogan: "Roulez en toute confiance",
    primaryColor: "#0f766e",
    secondaryColor: "#f59e0b"
  });
  await createAgencyDefaults(oceanAgency, {
    slogan: "Vos locations au bord de l'ocean",
    primaryColor: "#0f4c81",
    secondaryColor: "#fb923c"
  });

  const superAdminRole = await prisma.role.upsert({
    where: { code: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "Super Admin",
      code: "SUPER_ADMIN",
      description: "Acces total a la plateforme",
      isSystem: true
    }
  });

  const adminRole = await prisma.role.upsert({
    where: { code: "ADMIN_AGENCY" },
    update: {},
    create: {
      name: "Admin Agence",
      code: "ADMIN_AGENCY",
      description: "Gestion operationnelle de l'agence",
      isSystem: true
    }
  });

  const employeeRole = await prisma.role.upsert({
    where: { code: "EMPLOYEE" },
    update: {},
    create: {
      name: "Employe",
      code: "EMPLOYEE",
      description: "Acces limite selon permissions",
      isSystem: true
    }
  });

  for (const [name, code, category] of permissions) {
    await prisma.permission.upsert({
      where: { code },
      update: { name, category },
      create: { name, code, category }
    });
  }

  const allPermissions = await prisma.permission.findMany();

  await prisma.rolePermission.deleteMany({
    where: { roleId: { in: [superAdminRole.id, adminRole.id, employeeRole.id] } }
  });

  await prisma.rolePermission.createMany({
    data: [
      ...allPermissions.map((permission) => ({
        roleId: superAdminRole.id,
        permissionId: permission.id
      })),
      ...allPermissions
        .filter((permission) => permission.code !== "settings.manage")
        .map((permission) => ({
          roleId: adminRole.id,
          permissionId: permission.id
        })),
      ...allPermissions
        .filter((permission) => ["reservations.view", "dashboard.view"].includes(permission.code))
        .map((permission) => ({
          roleId: employeeRole.id,
          permissionId: permission.id
        }))
    ],
    skipDuplicates: true
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@agency.com" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@agency.com",
      phone: "+212600000001",
      passwordHash: hashedPassword,
      type: UserType.SUPER_ADMIN,
      roleId: superAdminRole.id
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@agency.com" },
    update: {},
    create: {
      firstName: "Agence",
      lastName: "Admin",
      email: "admin@agency.com",
      phone: "+212600000002",
      passwordHash: hashedPassword,
      type: UserType.ADMIN,
      roleId: adminRole.id,
      agencyId: atlasAgency.id
    }
  });

  await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: { roleId: adminRole.id, title: "Directeur d'agence" },
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
      title: "Directeur d'agence"
    }
  });

  const clientUser = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      firstName: "Sara",
      lastName: "Bennani",
      email: "client@example.com",
      phone: "+212600000003",
      passwordHash: hashedPassword,
      type: UserType.CLIENT,
      agencyId: atlasAgency.id
    }
  });

  const client = await prisma.client.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: {
      userId: clientUser.id,
      city: "Casablanca",
      address: "Maarif, Casablanca",
      cinOrPassport: "AB123456",
      driverLicense: "DL-998877"
    }
  });

  const suvType = await prisma.carType.upsert({
    where: { name: "SUV" },
    update: {},
    create: { name: "SUV", description: "Sport utility vehicle" }
  });

  const cityType = await prisma.carType.upsert({
    where: { name: "Citadine" },
    update: {},
    create: { name: "Citadine", description: "Voiture urbaine" }
  });

  const cars = [
    {
      agencyId: atlasAgency.id,
      brand: "Dacia",
      model: "Duster",
      plateNumber: "12345-A-6",
      year: 2023,
      color: "Blanc",
      seats: 5,
      fuelType: "Diesel",
      transmission: "Manuelle",
      mileage: 18000,
      pricePerDay: 550,
      depositAmount: 4000,
      description: "SUV fiable pour longs trajets.",
      conditions: "Kilometrage limite a 250 km/jour.",
      typeId: suvType.id,
      status: CarStatus.AVAILABLE
    },
    {
      agencyId: atlasAgency.id,
      brand: "Hyundai",
      model: "i10",
      plateNumber: "23456-B-7",
      year: 2024,
      color: "Gris",
      seats: 5,
      fuelType: "Essence",
      transmission: "Automatique",
      mileage: 9000,
      pricePerDay: 320,
      depositAmount: 2500,
      description: "Citadine economique et compacte.",
      conditions: "Assurance de base incluse.",
      typeId: cityType.id,
      status: CarStatus.AVAILABLE
    },
    {
      agencyId: oceanAgency.id,
      brand: "Peugeot",
      model: "208",
      plateNumber: "34567-C-8",
      year: 2024,
      color: "Bleu",
      seats: 5,
      fuelType: "Essence",
      transmission: "Automatique",
      mileage: 6000,
      pricePerDay: 390,
      depositAmount: 2800,
      description: "Modele agile pour la ville et les trajets cotiers.",
      conditions: "Assurance basique incluse.",
      typeId: cityType.id,
      status: CarStatus.AVAILABLE
    }
  ];

  for (const carData of cars) {
    const car = await prisma.car.upsert({
      where: { plateNumber: carData.plateNumber },
      update: carData,
      create: carData
    });

    await prisma.carImage.createMany({
      data: [
        {
          carId: car.id,
          url: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
          sortOrder: 1
        }
      ],
      skipDuplicates: true
    });
  }

  const packs = [
    {
      name: "Pack Economique",
      description: "Solution simple pour petits budgets.",
      pricingType: PricingType.FIXED,
      pricingValue: 0,
      includedKm: 150,
      hasInsurance: false
    },
    {
      name: "Pack Standard",
      description: "Bon equilibre entre prix et confort.",
      pricingType: PricingType.DAILY,
      pricingValue: 80,
      includedKm: 250,
      hasInsurance: true
    },
    {
      name: "Pack Premium",
      description: "Couverture etendue et services inclus.",
      pricingType: PricingType.PERCENTAGE,
      pricingValue: 15,
      includedKm: 350,
      hasInsurance: true,
      includesDelivery: true
    }
  ];

  for (const pack of packs) {
    await prisma.pack.upsert({
      where: { name: pack.name },
      update: pack,
      create: pack
    });
  }

  const options = [
    ["Chauffeur", "Chauffeur professionnel", 350, OptionPricingType.DAILY],
    ["Siege bebe", "Securite bebe", 40, OptionPricingType.DAILY],
    ["GPS", "Navigation integree", 35, OptionPricingType.DAILY],
    ["Livraison", "Livraison a domicile", 150, OptionPricingType.FIXED],
    ["Assurance complete", "Couverture avancee", 120, OptionPricingType.DAILY]
  ];

  for (const [name, description, price, pricingType] of options) {
    await prisma.option.upsert({
      where: { name },
      update: { description, price, pricingType },
      create: { name, description, price, pricingType }
    });
  }

  const oneCar = await prisma.car.findFirst({ where: { agencyId: atlasAgency.id } });
  const onePack = await prisma.pack.findFirst({ where: { name: "Pack Standard" } });
  const gpsOption = await prisma.option.findFirst({ where: { name: "GPS" } });

  if (oneCar && onePack && gpsOption) {
    const reservation = await prisma.reservation.upsert({
      where: { reference: "RES-0001" },
      update: {},
      create: {
        reference: "RES-0001",
        agencyId: atlasAgency.id,
        clientId: client.id,
        carId: oneCar.id,
        packId: onePack.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        totalDays: 3,
        basePrice: 1650,
        packPrice: 240,
        optionsPrice: 105,
        bookingFees: 100,
        totalPrice: 2095,
        advanceAmount: 419,
        remainingAmount: 1676,
        status: ReservationStatus.PENDING
      }
    });

    await prisma.reservationOption.upsert({
      where: {
        reservationId_optionId: {
          reservationId: reservation.id,
          optionId: gpsOption.id
        }
      },
      update: {},
      create: {
        reservationId: reservation.id,
        optionId: gpsOption.id,
        name: gpsOption.name,
        price: gpsOption.price,
        pricingType: gpsOption.pricingType
      }
    });

    await prisma.payment.upsert({
      where: { id: "seed-payment-1" },
      update: {},
      create: {
        id: "seed-payment-1",
        reservationId: reservation.id,
        amountTotal: 2095,
        amountPaid: 419,
        remaining: 1676,
        method: PaymentMethod.CASH,
        status: PaymentStatus.PARTIALLY_PAID
      }
    });
  }

  await prisma.activityLog.create({
    data: {
      userId: superAdmin.id,
      action: "SEED_COMPLETED",
      entityType: "system",
      description: "Initial multi-agency seed executed"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
