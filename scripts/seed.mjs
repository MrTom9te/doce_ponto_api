// Seed script to populate API with random users, stores and products
// Usage:
//   node scripts/seed.mjs --users=2 --products=5 --api=http://localhost:3000/api
// Defaults:
//   users=1 products=5 api=http://localhost:3000/api

import { TINY_PNG_BASE64 } from "./TINY_PNG_BASE64.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? ''];
  }),
);

const API = args.api || process.env.API_URL || 'http://localhost:3000/api';
const USERS = Number(args.users || 1);
const PRODUCTS_PER_STORE = Number(args.products || 5);

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) - 0 + min;
}

function slugify(text) {
  return (text || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 40);
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomPrice() {
  return Number((Math.random() * 90 + 10).toFixed(2));
}

function randomName() {
  const nouns = ['Doce', 'Bolo', 'Torta', 'Brigadeiro', 'Pudim', 'Trufa', 'Cookie', 'Cupcake'];
  const adjs = ['Delícia', 'Caseiro', 'Premium', 'DaVovó', 'Sabores', 'Gourmet', 'DaCasa', 'Especial'];
  return `${randomFrom(nouns)} ${randomFrom(adjs)}`;
}

function randomProductName() {
  const bases = ['Chocolate', 'Morango', 'Nutella', 'Cenoura', 'Baunilha', 'Red Velvet', 'Limão', 'Coco'];
  const kinds = ['Bolo', 'Torta', 'Brigadeiro', 'Cookie', 'Cupcake', 'Cheesecake'];
  return `${randomFrom(kinds)} de ${randomFrom(bases)}`;
}

async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const msg = data?.error || data?.message || res.statusText;
    throw new Error(`${method} ${path} ${res.status} ${msg}`);
  }
  return data;
}

function randomPhone() {
  // Backend espera 10 ou 11 dígitos (sem formatação)
  const ddd = String(randInt(11, 99)).padStart(2, '0');
  const useEleven = Math.random() < 0.7; // maioria com 11 dígitos (celular)
  const prefix = useEleven ? '9' : '';
  const rest = String(randInt(10000000, 99999999)); // 8 dígitos
  return `${ddd}${prefix}${rest}`; // total 10 ou 11 dígitos
}

async function createUserAndStore(i) {
  const name = `Usuário ${i}`;
  const email = `seed_${Date.now()}_${i}@example.com`;
  const password = 'secret123';
  const phone = randomPhone();

  await api('/auth/register', { method: 'POST', body: { name, email, password, phone } });
  const login = await api('/auth/login', { method: 'POST', body: { email, password } });
  const token = login?.data?.token || login?.token;
  if (!token) throw new Error('Login sem token');

  const storeName = `${randomName()} ${i}`;
  const slug = `${slugify(storeName)}-${Date.now().toString().slice(-5)}`;

  const createStorePayload = {
    name: storeName,
    slug,
    themeColor: randomFrom(['#FFC0CB', '#8A2BE2', '#4CAF50', '#2196F3', '#FF9800']),
    layoutStyle: randomFrom(['grid', 'list']),
    fontFamily: randomFrom(['Inter', 'System', 'Cursive', 'Sans-Serif']),
    street: 'Rua Exemplo',
    number: String(randInt(1, 999)),
    neighborhood: 'Centro',
    city: 'Manaus',
    state: 'AM',
    zipCode: '69000-000',
    supportedDeliveryTypes: randomFrom([["DELIVERY"], ["PICKUP"], ["DELIVERY","PICKUP"]]),
    imageBase64: TINY_PNG_BASE64,
    isOpen: true,
    openingHours: {
      monday: { enabled: true, open: '08:00', close: '18:00' },
      tuesday: { enabled: true, open: '08:00', close: '18:00' },
      wednesday: { enabled: true, open: '08:00', close: '18:00' },
      thursday: { enabled: true, open: '08:00', close: '18:00' },
      friday: { enabled: true, open: '08:00', close: '18:00' },
      saturday: { enabled: false, open: '08:00', close: '12:00' },
      sunday: { enabled: false, open: '08:00', close: '12:00' },
    },
  };

  // Cria loja (POST /api/store)
  await api('/store', { method: 'POST', body: createStorePayload, token });
  // Ativa automaticamente (o PATCH calcula isActive com base nos campos completos)
  await api('/store', { method: 'PATCH', body: createStorePayload, token });

  // Confirma ativação e reforça dados se necessário
  const ensureActive = async () => {
    for (let t = 0; t < 3; t++) {
      const storeResp = await api('/store', { method: 'GET', token });
      const storeData = storeResp?.data || storeResp;
      if (storeData?.isActive) return true;

      // Patch de reforço com campos completos
      const fullOpening = {
        monday: { enabled: true, open: '08:00', close: '18:00' },
        tuesday: { enabled: true, open: '08:00', close: '18:00' },
        wednesday: { enabled: true, open: '08:00', close: '18:00' },
        thursday: { enabled: true, open: '08:00', close: '18:00' },
        friday: { enabled: true, open: '08:00', close: '18:00' },
        saturday: { enabled: false, open: '08:00', close: '12:00' },
        sunday: { enabled: false, open: '08:00', close: '12:00' },
      };
      const reinforce = {
        ...createStorePayload,
        openingHours: fullOpening,
        supportedDeliveryTypes: ["DELIVERY", "PICKUP"],
        isOpen: true,
      };
      await api('/store', { method: 'PATCH', body: reinforce, token });
    }
    return false;
  };
  await ensureActive();

  // Cria produtos
  for (let p = 0; p < PRODUCTS_PER_STORE; p++) {
    const productPayload = {
      name: randomProductName(),
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: randomPrice(),
      imageBase64: TINY_PNG_BASE64,
    };
    await api('/products', { method: 'POST', body: productPayload, token });
  }

  console.log(`✔️  Usuário ${email} + Loja '${storeName}' + ${PRODUCTS_PER_STORE} produtos`);
}

(async () => {
  console.log(`Seeding via API: ${API}`);
  for (let i = 1; i <= USERS; i++) {
    try {
      await createUserAndStore(i);
    } catch (e) {
      console.error('Falha ao criar usuário/loja/produtos:', e?.message || e);
    }
  }
  console.log('Seed finalizado.');
})();
