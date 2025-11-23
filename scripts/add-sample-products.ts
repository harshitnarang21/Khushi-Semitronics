import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleProducts = [
  // Resistors
  {
    partNumber: 'CFR-25JR-52-1K',
    manufacturer: 'Yageo',
    description: '1K Ohm 1/4W 5% Carbon Film Resistor',
    category: 'Resistors',
    price: 0.15,
    stock: 5000,
    imageUrl: 'https://www.mouser.com/images/yageo/images/CFR-25JR-52-1K.jpg',
  },
  {
    partNumber: 'RC0603FR-0710KL',
    manufacturer: 'Yageo',
    description: '10K Ohm 1/10W 1% Thick Film Resistor',
    category: 'Resistors',
    price: 0.12,
    stock: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'ERJ-3EKF1002V',
    manufacturer: 'Panasonic',
    description: '10K Ohm 1/10W 1% Thick Film Chip Resistor',
    category: 'Resistors',
    price: 0.18,
    stock: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },

  // Capacitors
  {
    partNumber: 'CL10B104KA8NNNC',
    manufacturer: 'Samsung',
    description: '0.1µF 50V Ceramic Capacitor X7R 0805',
    category: 'Capacitors',
    price: 0.25,
    stock: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'CL21B104KBCNNNC',
    manufacturer: 'Samsung',
    description: '0.1µF 50V Ceramic Capacitor X7R 1206',
    category: 'Capacitors',
    price: 0.30,
    stock: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'EEE-FK1H100P',
    manufacturer: 'Panasonic',
    description: '10µF 50V Aluminum Electrolytic Capacitor',
    category: 'Capacitors',
    price: 0.45,
    stock: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'CL32B106KAHNNNE',
    manufacturer: 'Samsung',
    description: '10µF 25V Ceramic Capacitor X7R 1210',
    category: 'Capacitors',
    price: 0.55,
    stock: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },

  // Transistors
  {
    partNumber: '2N3904',
    manufacturer: 'ON Semiconductor',
    description: 'NPN General Purpose Transistor 40V 200mA TO-92',
    category: 'Transistors',
    price: 0.35,
    stock: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: '2N3906',
    manufacturer: 'ON Semiconductor',
    description: 'PNP General Purpose Transistor 40V 200mA TO-92',
    category: 'Transistors',
    price: 0.35,
    stock: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'BC547B',
    manufacturer: 'Fairchild',
    description: 'NPN General Purpose Transistor 45V 100mA TO-92',
    category: 'Transistors',
    price: 0.28,
    stock: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'IRF540N',
    manufacturer: 'Infineon',
    description: 'N-Channel Power MOSFET 100V 33A TO-220',
    category: 'Transistors',
    price: 1.25,
    stock: 500,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },

  // Diodes
  {
    partNumber: '1N4007',
    manufacturer: 'Vishay',
    description: '1A 1000V General Purpose Rectifier Diode DO-41',
    category: 'Diodes',
    price: 0.20,
    stock: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },
  {
    partNumber: '1N4148',
    manufacturer: 'Vishay',
    description: '100V 150mA Fast Switching Diode DO-35',
    category: 'Diodes',
    price: 0.15,
    stock: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },
  {
    partNumber: '1N5819',
    manufacturer: 'Vishay',
    description: '1A 40V Schottky Barrier Rectifier DO-41',
    category: 'Diodes',
    price: 0.30,
    stock: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },

  // LEDs
  {
    partNumber: 'LTST-C170KFKT',
    manufacturer: 'Lite-On',
    description: 'Red LED 2.0V 20mA 1206 SMD',
    category: 'LEDs',
    price: 0.18,
    stock: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'LTST-C170KGKT',
    manufacturer: 'Lite-On',
    description: 'Green LED 2.1V 20mA 1206 SMD',
    category: 'LEDs',
    price: 0.18,
    stock: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'LTST-C170KBKT',
    manufacturer: 'Lite-On',
    description: 'Blue LED 3.2V 20mA 1206 SMD',
    category: 'LEDs',
    price: 0.22,
    stock: 7000,
    imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'LTST-C170KFWT',
    manufacturer: 'Lite-On',
    description: 'White LED 3.2V 20mA 1206 SMD',
    category: 'LEDs',
    price: 0.25,
    stock: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=400&h=400&fit=crop',
  },

  // Integrated Circuits
  {
    partNumber: 'LM358N',
    manufacturer: 'Texas Instruments',
    description: 'Dual Operational Amplifier 8-Pin DIP',
    category: 'Integrated Circuits',
    price: 0.75,
    stock: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'LM7805CT',
    manufacturer: 'STMicroelectronics',
    description: '5V 1A Positive Voltage Regulator TO-220',
    category: 'Integrated Circuits',
    price: 0.85,
    stock: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'LM7812CT',
    manufacturer: 'STMicroelectronics',
    description: '12V 1A Positive Voltage Regulator TO-220',
    category: 'Integrated Circuits',
    price: 0.90,
    stock: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'NE555P',
    manufacturer: 'Texas Instruments',
    description: '555 Timer IC 8-Pin DIP',
    category: 'Integrated Circuits',
    price: 0.50,
    stock: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'ATmega328P-PU',
    manufacturer: 'Microchip',
    description: '8-bit AVR Microcontroller 28-Pin DIP',
    category: 'Integrated Circuits',
    price: 3.50,
    stock: 300,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'ESP32-WROOM-32',
    manufacturer: 'Espressif',
    description: 'Wi-Fi & Bluetooth SoC Module',
    category: 'Integrated Circuits',
    price: 4.50,
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },

  // Connectors
  {
    partNumber: 'USB-A-F-F-90',
    manufacturer: 'Amphenol',
    description: 'USB Type-A Female Connector Right Angle',
    category: 'Connectors',
    price: 1.25,
    stock: 800,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'DC-005-2.1MM',
    manufacturer: 'CUI Devices',
    description: 'DC Power Jack 2.1mm Panel Mount',
    category: 'Connectors',
    price: 0.65,
    stock: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'M20-9990246',
    manufacturer: 'Harwin',
    description: '2.54mm Pitch Header 2x3 Position',
    category: 'Connectors',
    price: 0.35,
    stock: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop',
  },

  // Crystals & Oscillators
  {
    partNumber: 'ABL-16.000MHZ-B2',
    manufacturer: 'Abracon',
    description: '16MHz Crystal 18pF 20ppm HC-49/US',
    category: 'Crystals & Oscillators',
    price: 0.45,
    stock: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'ECS-327MVATX',
    manufacturer: 'ECS',
    description: '32.768kHz Crystal 12.5pF 20ppm',
    category: 'Crystals & Oscillators',
    price: 0.55,
    stock: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },

  // Switches
  {
    partNumber: 'TL3305AF160QG',
    manufacturer: 'E-Switch',
    description: 'Tactile Switch 6x6mm 160gf SMD',
    category: 'Switches',
    price: 0.25,
    stock: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'TL1105SPF160Q',
    manufacturer: 'E-Switch',
    description: 'Tactile Switch 4.3x4.9mm 160gf Through Hole',
    category: 'Switches',
    price: 0.20,
    stock: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },

  // Inductors
  {
    partNumber: 'LPS4018-103MRB',
    manufacturer: 'Coilcraft',
    description: '10µH 1.2A Power Inductor 4x1.8mm',
    category: 'Inductors',
    price: 0.65,
    stock: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'LPS4018-223MRB',
    manufacturer: 'Coilcraft',
    description: '22µH 0.8A Power Inductor 4x1.8mm',
    category: 'Inductors',
    price: 0.70,
    stock: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },

  // Fuses
  {
    partNumber: '0251001.MRT1L',
    manufacturer: 'Littelfuse',
    description: '1A 250V Fast Acting Fuse 5x20mm',
    category: 'Fuses',
    price: 0.40,
    stock: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },
  {
    partNumber: '0251002.MRT1L',
    manufacturer: 'Littelfuse',
    description: '2A 250V Fast Acting Fuse 5x20mm',
    category: 'Fuses',
    price: 0.40,
    stock: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },

  // Relays
  {
    partNumber: 'G5V-2-5VDC',
    manufacturer: 'Omron',
    description: '5V SPDT Signal Relay 1A 30VDC',
    category: 'Relays',
    price: 1.50,
    stock: 600,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
  {
    partNumber: 'G5V-2-12VDC',
    manufacturer: 'Omron',
    description: '12V SPDT Signal Relay 1A 30VDC',
    category: 'Relays',
    price: 1.55,
    stock: 600,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
  },
]

async function main() {
  console.log('Adding/updating sample products with images...')
  
  let added = 0
  let updated = 0
  let skipped = 0

  for (const product of sampleProducts) {
    try {
      const existing = await prisma.product.findUnique({
        where: { partNumber: product.partNumber },
      })

      if (existing) {
        // Update existing product if it doesn't have an image
        if (!existing.imageUrl && product.imageUrl) {
          await prisma.product.update({
            where: { partNumber: product.partNumber },
            data: { imageUrl: product.imageUrl },
          })
          updated++
          console.log(`↻ Updated image: ${product.partNumber}`)
        } else {
          skipped++
          console.log(`⊘ Skipped (already exists): ${product.partNumber}`)
        }
      } else {
        // Create new product
        await prisma.product.create({
          data: product,
        })
        added++
        console.log(`✓ Added: ${product.partNumber}`)
      }
    } catch (error: any) {
      console.error(`✗ Error processing ${product.partNumber}:`, error.message)
    }
  }

  console.log(`\n✅ Complete!`)
  console.log(`   Added: ${added} products`)
  console.log(`   Updated: ${updated} products`)
  console.log(`   Skipped: ${skipped} products`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

