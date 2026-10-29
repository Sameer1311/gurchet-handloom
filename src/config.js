// Everything the shop owner may want to change lives here.
export const SHOP = {
  name: 'Gurchet Handloom',
  city: 'Tarn Taran, Punjab',
  phone: '91XXXXXXXXXX', // WhatsApp number, digits only with country code. Placeholder until confirmed.
  hours: { open: 9, close: 19, days: [1, 2, 3, 4, 5, 6] }, // 24h clock, IST; 0 = Sunday
  mapQuery: 'Tarn Taran, Punjab',
}

export const waLink = (text) => `https://wa.me/${SHOP.phone}?text=${encodeURIComponent(text)}`
