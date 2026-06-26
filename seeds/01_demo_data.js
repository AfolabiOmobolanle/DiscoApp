/**
 * Seed — demo data (Lagos only: IKEDC + EKEDC, 100 each)
 * Run: npm run seed
 */

const IKEDC_AREAS = [
  'Ikeja', 'Agege', 'Ojodu', 'Ogba', 'Berger', 'Oregun', 'Maryland',
  'Omole', 'Magodo', 'Ojota', 'Ketu', 'Mile 12', 'Ikorodu', 'Gbagada',
  'Oworonshoki', 'Palmgrove', 'Somolu', 'Bariga', 'Shomolu', 'Isale Eko',
  'Ikotun', 'Igando', 'Idimu', 'Egbe', 'Isheri', 'Akute', 'Ojokoro',
  'Ifako', 'Ewu Tuntun', 'Alapere'
];

const EKEDC_AREAS = [
  'Victoria Island', 'Lekki', 'Lagos Island', 'Ajah', 'Ikoyi',
  'Oniru', 'Eti-Osa', 'Epe', 'Badagry', 'Apapa', 'Surulere',
  'Yaba', 'Ebute Metta', 'Mushin', 'Oshodi', 'Isolo', 'Ejigbo',
  'Amuwo Odofin', 'Festac', 'Mile 2', 'Orile', 'Coker', 'Iganmu',
  'Otto', 'Badia', 'Alakija', 'Satellite Town', 'Ojo', 'Alaba', 'Agboju'
];

const IKEDC_STREETS = [
  '12 Allen Avenue', '3 Obafemi Awolowo Way', '7 Oba Akran Avenue',
  '15 Isaac John Street', '22 Mobolaji Johnson', '9 Adeniyi Jones',
  '5 Toyin Street', '18 Opebi Road', '33 Agege Motor Road',
  '11 Medical Road', '6 Acme Road', '44 Ikorodu Road',
  '2 Oregun Road', '8 CMD Road', '19 Fatai Atere Way',
  '27 Aina Street', '4 Olowopo Road', '13 Ladipo Street',
  '31 Abimbola Street', '10 Oguntona Crescent'
];

const EKEDC_STREETS = [
  '5 Broad Street', '14 Adeola Odeku', '3 Ozumba Mbadiwe',
  '21 Ahmadu Bello Way', '8 Kofo Abayomi', '16 Karimu Kotun',
  '7 Ligali Ayorinde', '30 Admiralty Way', '2 Adeyemo Alakija',
  '11 Idowu Martins', '4 Campbell Street', '9 Marina Street',
  '25 Bode Thomas', '13 Adelabu Street', '6 Randle Avenue',
  '18 Akin Adesola', '32 Eko Hotel Avenue', '1 Tafawa Balewa Square',
  '17 Catholic Mission Street', '22 Freeman Street'
];

const FIRST_NAMES = [
  'Adeyemi', 'Ngozi', 'Emeka', 'Fatima', 'Chukwudi', 'Aisha', 'Biodun', 'Kemi',
  'Tunde', 'Amina', 'Seun', 'Chioma', 'Yusuf', 'Blessing', 'Rotimi', 'Zainab',
  'Femi', 'Adaeze', 'Kunle', 'Oluwaseun', 'Nkechi', 'Babatunde', 'Tolani', 'Efosa',
  'Hauwa', 'Obinna', 'Sade', 'Aliyu', 'Uchenna', 'Folake', 'Gbenga', 'Nneka',
  'Dare', 'Ifeoma', 'Lanre', 'Chinwe', 'Wale', 'Omotola', 'Jide', 'Adaora',
  'Bimpe', 'Chidi', 'Dupe', 'Ekene', 'Funmi', 'Gbemi', 'Hakeem', 'Iyabo',
  'Jumoke', 'Kayode', 'Lola', 'Mide', 'Nonso', 'Ore', 'Pemi', 'Quincy',
  'Remi', 'Shade', 'Tobi', 'Uche', 'Victor', 'Wunmi', 'Xola', 'Yemi', 'Zoe'
];

const LAST_NAMES = [
  'John', 'Okafor', 'Adeleke', 'Bello', 'Nwosu', 'Abubakar', 'Ogundimu', 'Adeyemi',
  'Musa', 'Chukwu', 'Salami', 'Eze', 'Lawal', 'Obiora', 'Hassan', 'Okonkwo',
  'Yakubu', 'Fashola', 'Igwe', 'Garba', 'Nwachukwu', 'Afolabi', 'Danjuma', 'Obi',
  'Suleiman', 'Adebayo', 'Onyeka', 'Umar', 'Ekwueme', 'Olawale', 'Coker', 'Badmus',
  'Adekunle', 'Bassey', 'Chukwuemeka', 'Dike', 'Ezeala', 'Falola', 'Giwa', 'Haruna',
  'Iroegbu', 'Jibril', 'Kehinde', 'Lawan', 'Momoh', 'Nzinga', 'Okeke', 'Popoola',
  'Quadri', 'Rufai', 'Sanni', 'Taiwo', 'Ugwu', 'Volta', 'Williams', 'Xabi', 'Yusuf'
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomFloat = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(1));
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomBool = () => Math.random() > 0.5;
const generateReference = (i) => `WU_${Date.now() + i}_${Math.random().toString(36).slice(2, 7)}`;

exports.seed = async (knex) => {
  // Clean slate — transactions first (FK dependency)
  await knex('transactions').del();
  await knex('meters').del();

  // ── 100 IKEDC meters (mainland Lagos) ────────────────────────────────────
  const ikecdMeters = Array.from({ length: 100 }, (_, i) => ({
    meter_number:  String(45310000001 + i),
    customer_name: `${getRandom(FIRST_NAMES)} ${getRandom(LAST_NAMES)}`,
    address:       `${getRandom(IKEDC_STREETS)}, ${getRandom(IKEDC_AREAS)}, Lagos`,
    disco:         'IKEDC',
    last_balance:  getRandomFloat(0, 80),
    threshold:     getRandomFloat(5, 20),
    fcm_token:     null,
    auto_recharge: getRandomBool(),
    auto_amount:   [500, 1000, 2000, 3000, 5000][getRandomInt(0, 4)],
  }));

  // BuyPower sandbox test meter — always first IKEDC record
  ikecdMeters[0] = {
    meter_number:  '45310012345',
    customer_name: 'Adeyemi John',
    address:       '12 Allen Avenue, Ikeja, Lagos',
    disco:         'IKEDC',
    last_balance:  34.5,
    threshold:     10,
    fcm_token:     null,
    auto_recharge: false,
    auto_amount:   2000,
  };

  // ── 100 EKEDC meters (island Lagos) ──────────────────────────────────────
  const ekecdMeters = Array.from({ length: 100 }, (_, i) => ({
    meter_number:  String(57200000001 + i),
    customer_name: `${getRandom(FIRST_NAMES)} ${getRandom(LAST_NAMES)}`,
    address:       `${getRandom(EKEDC_STREETS)}, ${getRandom(EKEDC_AREAS)}, Lagos`,
    disco:         'EKEDC',
    last_balance:  getRandomFloat(0, 80),
    threshold:     getRandomFloat(5, 20),
    fcm_token:     null,
    auto_recharge: getRandomBool(),
    auto_amount:   [500, 1000, 2000, 3000, 5000][getRandomInt(0, 4)],
  }));

  // Low-balance EKEDC meter — always first EKEDC record, triggers FCM alert
  ekecdMeters[0] = {
    meter_number:  '57200012345',
    customer_name: 'Ngozi Okafor',
    address:       '5 Broad Street, Lagos Island, Lagos',
    disco:         'EKEDC',
    last_balance:  4.2,
    threshold:     10,
    fcm_token:     null,
    auto_recharge: true,
    auto_amount:   3000,
  };

  const allMeters = [...ikecdMeters, ...ekecdMeters];
  const insertedMeters = await knex('meters').insert(allMeters).returning('*');

  // ── 2-5 transactions per meter ────────────────────────────────────────────
  const statuses = ['success', 'success', 'success', 'failed', 'pending'];
  const amounts  = [500, 1000, 2000, 3000, 5000];
  const transactions = [];
  let refIndex = 0;

  for (const meter of insertedMeters) {
    const txCount = getRandomInt(2, 5);
    for (let i = 0; i < txCount; i++) {
      const status = getRandom(statuses);
      transactions.push({
        meter_number: meter.meter_number,
        amount:       getRandom(amounts),
        reference:    generateReference(refIndex++),
        token:        status === 'success'
          ? `${getRandomInt(1000,9999)} ${getRandomInt(1000,9999)} ${getRandomInt(1000,9999)} ${getRandomInt(1000,9999)} ${getRandomInt(1000,9999)}`
          : null,
        status,
      });
    }
  }

  // Insert in batches of 50
  for (let i = 0; i < transactions.length; i += 50) {
    await knex('transactions').insert(transactions.slice(i, i + 50));
  }

  console.log(`✅  Seeded ${insertedMeters.length} meters (100 IKEDC + 100 EKEDC) and ${transactions.length} transactions.`);
};
