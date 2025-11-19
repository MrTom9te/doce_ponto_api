#!/usr/bin/env node
/*
 E2E dinâmico para sessão anônima + pedido público
 - Cria sessão anônima (captura cookie)
 - Escolhe uma loja e um produto existentes
 - Cria um pedido
 - Consulta pedido com cookie e via accessCode
 Uso:
   node scripts/e2e_anon_order.mjs --api=http://localhost:3000/api
*/

const API = process.argv.find(a => a.startsWith('--api='))?.split('=')[1] || process.env.API || 'http://localhost:3000/api';

function log(section, data) {
  console.log(`\n== ${section} ==`);
  if (typeof data === 'string') console.log(data);
  else console.log(JSON.stringify(data, null, 2));
}

function getHeader(res, name) {
  // Node fetch headers are case-insensitive
  for (const [k, v] of res.headers) {
    if (k.toLowerCase() === name.toLowerCase()) return v;
  }
  return undefined;
}

async function main() {
  let cookie = '';

  // 1) Criar sessão anônima
  const resSession = await fetch(`${API}/anon/session`, { method: 'POST' });
  const bodySession = await resSession.json().catch(() => ({}));
  if (!resSession.ok) {
    log('Erro sessão anônima', { status: resSession.status, body: bodySession });
    process.exit(1);
  }
  const setCookie = getHeader(resSession, 'set-cookie');
  if (!setCookie || !setCookie.includes('anon_session=')) {
    log('Erro', 'Set-Cookie da sessão anônima não encontrado');
    process.exit(1);
  }
  cookie = setCookie.split(';')[0]; // "anon_session=..."
  log('Sessão criada', bodySession);

  // 2) Buscar uma loja pública
  const resStores = await fetch(`${API}/public/stores?limit=1&page=1`);
  const stores = await resStores.json().catch(() => ({}));
  if (!resStores.ok || !stores?.data?.length) {
    log('Erro lojas públicas', { status: resStores.status, body: stores });
    process.exit(1);
  }
  const slug = stores.data[0].slug;
  log('Loja escolhida', { slug, name: stores.data[0].name });

  // 3) Buscar um produto público dessa loja
  const resProducts = await fetch(`${API}/public/loja/${slug}/products?limit=1&page=1`);
  const products = await resProducts.json().catch(() => ({}));
  if (!resProducts.ok || !products?.data?.length) {
    log('Erro produtos da loja', { status: resProducts.status, body: products });
    process.exit(1);
  }
  const product = products.data[0];
  log('Produto escolhido', product);

  // 4) Criar pedido
  const today = new Date();
  const delivery = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const yyyy = delivery.getFullYear();
  const mm = String(delivery.getMonth() + 1).padStart(2, '0');
  const dd = String(delivery.getDate()).padStart(2, '0');
  const deliveryDate = `${yyyy}-${mm}-${dd}`;

  const orderReq = {
    customerName: 'Cliente Demo',
    customerPhone: '11999999999',
    customerEmail: 'cliente.demo@example.com',
    customerTaxId: '54892547697',
    productId: product.id,
    quantity: 1,
    deliveryDate,
    deliveryTime: '14h',
    deliveryType: 'DELIVERY',
    address: { street: 'Rua A', city: 'Manaus', state: 'AM', zipCode: '69000000' }
  };

  const resOrder = await fetch(`${API}/public/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
    body: JSON.stringify(orderReq),
  });
  const orderResp = await resOrder.json().catch(() => ({}));
  if (!resOrder.ok) {
    log('Erro criar pedido', { status: resOrder.status, body: orderResp });
    process.exit(1);
  }
  const orderId = orderResp?.data?.id || orderResp?.data?.order?.id;
  const orderAccessCode = orderResp?.data?.orderAccessCode;
  const orderNumber = orderResp?.data?.orderNumber;
  log('Pedido criado', { orderId, orderNumber, orderAccessCode });

  // 5) Consultar pedido com cookie (mesma sessão)
  const resGetWithCookie = await fetch(`${API}/public/orders/${orderId}`, {
    headers: { 'Cookie': cookie },
  });
  const getWithCookie = await resGetWithCookie.json().catch(() => ({}));
  log('GET pedido com cookie', { status: resGetWithCookie.status, body: getWithCookie });

  // 6) Consultar pedido com accessCode (sem cookie)
  const resGetWithCode = await fetch(`${API}/public/orders/${orderId}?accessCode=${orderAccessCode}`);
  const getWithCode = await resGetWithCode.json().catch(() => ({}));
  log('GET pedido com accessCode', { status: resGetWithCode.status, body: getWithCode });

  console.log('\nOK: Fluxo E2E concluído.');
}

// Node 18+ tem fetch global
if (typeof fetch !== 'function') {
  console.error('Este script requer Node 18+ (fetch global).');
  process.exit(1);
}

main().catch(err => {
  console.error('Falha no E2E:', err);
  process.exit(1);
});
