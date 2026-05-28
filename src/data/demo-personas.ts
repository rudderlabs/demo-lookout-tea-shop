import type { PaymentData } from '@/components/checkout/PaymentForm';
import type { ShippingData } from '@/components/checkout/ShippingForm';

interface DemoAccountData {
  email: string;
  firstName: string;
  lastName: string;
}

interface DemoPersona {
  id: string;
  account: DemoAccountData;
  shipping: ShippingData;
  payment: PaymentData;
}

const DEMO_PERSONA_STORAGE_KEY = 'serene-leaf-demo-persona-id';

const DEMO_PERSONAS: readonly DemoPersona[] = [
  {
    id: 'maya-patel',
    account: {
      email: 'maya.patel@example.com',
      firstName: 'Maya',
      lastName: 'Patel',
    },
    shipping: {
      firstName: 'Maya',
      lastName: 'Patel',
      email: 'maya.patel@example.com',
      address: '1847 Alder Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98122',
      country: 'United States',
    },
    payment: {
      cardNumber: '4242 4242 4242 4242',
      expiry: '08/30',
      cvc: '242',
      cardHolder: 'Maya Patel',
    },
  },
  {
    id: 'jordan-ramirez',
    account: {
      email: 'jordan.ramirez@example.com',
      firstName: 'Jordan',
      lastName: 'Ramirez',
    },
    shipping: {
      firstName: 'Jordan',
      lastName: 'Ramirez',
      email: 'jordan.ramirez@example.com',
      address: '731 South Lamar Boulevard',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      country: 'United States',
    },
    payment: {
      cardNumber: '5555 5555 5555 4444',
      expiry: '11/29',
      cvc: '512',
      cardHolder: 'Jordan Ramirez',
    },
  },
  {
    id: 'olivia-kim',
    account: {
      email: 'olivia.kim@example.com',
      firstName: 'Olivia',
      lastName: 'Kim',
    },
    shipping: {
      firstName: 'Olivia',
      lastName: 'Kim',
      email: 'olivia.kim@example.com',
      address: '58 Clarendon Street',
      city: 'Boston',
      state: 'MA',
      zipCode: '02116',
      country: 'United States',
    },
    payment: {
      cardNumber: '4000 0566 5566 5556',
      expiry: '03/31',
      cvc: '318',
      cardHolder: 'Olivia Kim',
    },
  },
  {
    id: 'marcus-johnson',
    account: {
      email: 'marcus.johnson@example.com',
      firstName: 'Marcus',
      lastName: 'Johnson',
    },
    shipping: {
      firstName: 'Marcus',
      lastName: 'Johnson',
      email: 'marcus.johnson@example.com',
      address: '2211 North Milwaukee Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60647',
      country: 'United States',
    },
    payment: {
      cardNumber: '6011 1111 1111 1117',
      expiry: '09/30',
      cvc: '601',
      cardHolder: 'Marcus Johnson',
    },
  },
  {
    id: 'zoe-thompson',
    account: {
      email: 'zoe.thompson@example.com',
      firstName: 'Zoe',
      lastName: 'Thompson',
    },
    shipping: {
      firstName: 'Zoe',
      lastName: 'Thompson',
      email: 'zoe.thompson@example.com',
      address: '905 Pearl Street',
      city: 'Denver',
      state: 'CO',
      zipCode: '80203',
      country: 'United States',
    },
    payment: {
      cardNumber: '4111 1111 1111 1111',
      expiry: '06/29',
      cvc: '411',
      cardHolder: 'Zoe Thompson',
    },
  },
  {
    id: 'ethan-nguyen',
    account: {
      email: 'ethan.nguyen@example.com',
      firstName: 'Ethan',
      lastName: 'Nguyen',
    },
    shipping: {
      firstName: 'Ethan',
      lastName: 'Nguyen',
      email: 'ethan.nguyen@example.com',
      address: '1468 Hawthorne Boulevard',
      city: 'Portland',
      state: 'OR',
      zipCode: '97214',
      country: 'United States',
    },
    payment: {
      cardNumber: '4000 0000 0000 3220',
      expiry: '12/30',
      cvc: '320',
      cardHolder: 'Ethan Nguyen',
    },
  },
];

function getRandomPersona(excludeId?: string): DemoPersona {
  const candidates = DEMO_PERSONAS.filter((persona) => persona.id !== excludeId);
  const pool = candidates.length > 0 ? candidates : DEMO_PERSONAS;
  const persona = pool[Math.floor(Math.random() * pool.length)];
  if (persona) return persona;

  throw new Error('Demo persona pool cannot be empty');
}

function getStoredPersonaId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage.getItem(DEMO_PERSONA_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredPersonaId(personaId: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(DEMO_PERSONA_STORAGE_KEY, personaId);
  } catch {
    // sessionStorage may be unavailable
  }
}

function getPersonaById(personaId: string | null): DemoPersona | undefined {
  if (!personaId) return undefined;
  return DEMO_PERSONAS.find((persona) => persona.id === personaId);
}

export function selectRandomDemoPersona(): DemoPersona {
  const persona = getRandomPersona(getStoredPersonaId() ?? undefined);
  setStoredPersonaId(persona.id);
  return persona;
}

export function getDemoPersonaByEmail(
  email: string,
): { shipping: ShippingData; payment: PaymentData } {
  const match = DEMO_PERSONAS.find((p) => p.account.email === email);
  const persona = match ?? DEMO_PERSONAS[0];
  if (!persona) throw new Error('Demo persona pool cannot be empty');
  return { shipping: persona.shipping, payment: persona.payment };
}

export function getCurrentDemoPersona(): DemoPersona {
  const storedPersona = getPersonaById(getStoredPersonaId());
  if (storedPersona) return storedPersona;

  const persona = getRandomPersona();
  setStoredPersonaId(persona.id);
  return persona;
}
