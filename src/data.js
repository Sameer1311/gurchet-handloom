export const CATEGORIES = ['All', 'Bedding', 'Floor', 'Wear', 'Bath']

// `pattern` is a CSS class (index.css) used until real product photos arrive.
export const PRODUCTS = [
  {
    id: 'khes', name: 'Handloom Khes', cat: 'Bedding', pattern: 'pat-khes',
    desc: 'Thick cotton khes in classic Punjabi checks. Warm in winter, lasts for years.',
    details: ['100% cotton, handwoven', 'Single and double bed sizes', 'Gets softer with every wash'],
    colors: [{ name: 'Red check', hex: '#a8322d' }, { name: 'Blue check', hex: '#22305a' }, { name: 'Green check', hex: '#3f6b3a' }],
  },
  {
    id: 'durrie', name: 'Cotton Durrie', cat: 'Floor', pattern: 'pat-durrie',
    desc: 'Flat-woven floor durries in bold traditional designs.',
    details: ['Thick, flat-woven cotton', 'Sizes from 2×3 ft to 6×9 ft', 'Reversible and easy to wash'],
    colors: [{ name: 'Indigo & gold', hex: '#22305a' }, { name: 'Red & cream', hex: '#a8322d' }, { name: 'Forest', hex: '#2f5d50' }],
  },
  {
    id: 'shawl', name: 'Woollen Shawl', cat: 'Wear', pattern: 'pat-shawl',
    desc: 'Soft handwoven shawls for men and women, in plain and patterned weaves.',
    details: ['Pure wool and wool blends', 'Plain and patterned weaves', 'Ideal for gifting'],
    colors: [{ name: 'Maroon', hex: '#6b2b3a' }, { name: 'Charcoal', hex: '#3a3a3a' }, { name: 'Mustard', hex: '#c9962a' }],
  },
  {
    id: 'bedsheet', name: 'Handloom Bedsheet', cat: 'Bedding', pattern: 'pat-sheet',
    desc: 'Breathable pure-cotton bedsheets with matching pillow covers.',
    details: ['Pure cotton, cool in summer', 'Single and double sizes', 'Comes with 2 pillow covers'],
    colors: [{ name: 'Indigo', hex: '#22305a' }, { name: 'Rust', hex: '#b5532e' }, { name: 'Sage', hex: '#7d9171' }],
  },
  {
    id: 'parna', name: 'Parna & Towels', cat: 'Bath', pattern: 'pat-parna',
    desc: 'Light cotton parnas and towels that get softer with every wash.',
    details: ['Quick-drying cotton', 'Bath and hand sizes', 'Sets of 2, 4 and 6'],
    colors: [{ name: 'Classic stripe', hex: '#e0a526' }, { name: 'Red stripe', hex: '#a8322d' }, { name: 'Blue stripe', hex: '#22305a' }],
  },
  {
    id: 'dupatta', name: 'Handwoven Dupatta', cat: 'Wear', pattern: 'pat-dupatta',
    desc: 'Bright handloom dupattas for daily wear and weddings.',
    details: ['Light cotton and silk blends', 'Hand-finished edges', 'Wedding colours on request'],
    colors: [{ name: 'Wedding red', hex: '#a8322d' }, { name: 'Pink', hex: '#c2477a' }, { name: 'Peacock', hex: '#1f6f78' }],
  },
]

export const STEPS = [
  { t: 'Choosing the yarn', d: 'Strong cotton and wool yarn is picked by hand. Good yarn is why our pieces last.' },
  { t: 'Dyeing', d: 'The yarn is dyed in rich, colourfast shades and dried in the sun.' },
  { t: 'Weaving on the loom', d: 'Our weavers set the warp and weave each piece by hand, thread by thread.' },
  { t: 'Finishing & checking', d: 'Every piece is washed, checked and folded before it leaves the shop.' },
]

export const FAQS = [
  { q: 'Do you deliver outside Punjab?', a: 'Yes, across India. Send your pin code on WhatsApp and we will tell you the delivery charge.' },
  { q: 'Can I order custom colours or sizes?', a: 'Yes, for most products. Share the colour and size you need and we will confirm the price and time.' },
  { q: 'Do you give wholesale rates?', a: 'Yes. Shops and traders get special rates on bulk orders. Message us with your quantity.' },
  { q: 'How do I pay?', a: 'UPI, bank transfer or cash at the shop. Payment details are shared when you confirm your order.' },
]
