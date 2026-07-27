// Editorial Content Database: Copywriting for Act II Magazine Sections & Interactive Tabs

// 1. Home Page Act II Magazine Sections (Original)
export const editorialSections = [
  {
    id: 'editorial-intro',
    type: 'centered-text',
    title: 'The Art of Escape',
    subtitle: 'Ducati Panigale V4',
    body: 'The Panigale V4 is more than a superbike. It represents the direct translation of racetrack technology into an absolute expression of street-legal speed. Designed for riders who refuse compromise, it is a precision tool crafted for ultimate performance.',
    meta: 'Act II — Detailed Mechanics'
  },
  {
    id: 'editorial-philosophy',
    type: 'left-aligned-narrative',
    title: 'The Pursuit of Lightness',
    subtitle: 'Engineering Philosophy',
    body: 'Every single component of the Panigale V4 exists for one purpose: to speed up kinetic transition. By optimizing wall thicknesses and shaving structural mass, weight is concentrated around the crankshaft rotation axis, minimizing inertial resistance. In racing, a gram is a unit of lap time.'
  },
  {
    id: 'editorial-design',
    type: 'feature-block',
    title: 'Design Language',
    subtitle: 'Form Driven by Airflow',
    body: 'The silhouette of the Panigale V4 is defined by aerodynamic efficiency. Aggressive, sweeping fairings draw air through internal cooling matrices, while double-profile carbon fiber winglets generate 37 kg of downforce at 300 km/h. This vertical pressure anchors the front wheel, suppressing lift during acceleration.',
    image: 'assets/ducati_fairing.png',
    alignment: 'left',
    meta: 'Aerodynamics & Silhouette'
  },
  {
    id: 'editorial-engine',
    type: 'split-dashboard',
    title: 'Desmosedici Stradale',
    subtitle: 'The Heart of MotoGP',
    body: 'Derived directly from the Desmosedici GP engine, this 1,103 cc 90° V4 utilizes a counter-rotating crankshaft to offset wheel gyroscopic forces. Combined with desmodromic valve actuation—which mechanically closes valves instead of relying on springs—the Stradale revs reliably up to 13,000 RPM, delivering 215 horsepower of high-revving peak power.',
    image: 'assets/ducati_engine.png',
    alignment: 'right',
    specs: [
      { num: '215 HP', label: 'Maximum Power Peak' },
      { num: '123.6 Nm', label: 'Torque Force' },
      { num: '1,103 cc', label: 'Displacement' },
      { num: '13,000', label: 'Peak RPM Limit' }
    ]
  },
  {
    id: 'editorial-aerodynamics',
    type: 'centered-diagram',
    title: 'Pressure Dynamics',
    subtitle: 'Wind Tunnel Refined Profile',
    body: 'Laminar flow analysis shapes every intake cowl and extract duct. Air is forced through lateral heat exchangers, venting boundary-layer drag beneath the rider’s knees. Vertical drag wing elements stabilize yaw during high-angle corner entries, maintaining high chassis balance.',
    vector: true
  },
  {
    id: 'editorial-rider',
    type: 'feature-block',
    title: 'Rider Interaction',
    subtitle: 'The Seating Triangle',
    body: 'The ergonomic design is configured for absolute control. A narrow tank shape allows the rider to lock in with their knees during heavy braking phases, relieving stress on the wrists. The flat, broad seat provides freedom of movement, letting the rider transition off the bike during hanging corner sweeps.',
    image: 'assets/ducati_cockpit.png',
    alignment: 'right',
    meta: 'Ergonomics & Control'
  },
  {
    id: 'editorial-materials',
    type: 'materials-grid',
    title: 'Metallurgy & Composites',
    subtitle: 'The Periodic Table of Performance',
    body: 'To construct a chassis that yields structural flex without cracking, Ducati engineers alternate material properties across critical load paths.',
    materials: [
      { name: 'Titanium', desc: 'Used in the connecting rods and full exhaust headers to reduce reciprocating mass.' },
      { name: 'Carbon Fiber', desc: 'Forming the front subframe, fairings, and wing elements to maintain high rigidity.' },
      { name: 'Forged Aluminum', desc: 'Machined into triple clamps and wheels to eliminate rotational inertia.' },
      { name: 'Magnesium', desc: 'Composing the engine cases to save weight while dissipating thermal stress.' }
    ]
  },
  {
    id: 'editorial-suspension',
    type: 'split-dashboard',
    title: 'Suspension & Stopping Force',
    subtitle: 'Chassis Deceleration',
    body: 'Deceleration requires as much control as acceleration. The chassis matches semi-active Öhlins NPX pressurized forks with monoblock Brembo Stylema calipers. Dynamic adjustments alter hydraulic damping configurations in milliseconds, preventing front-end dive and stabilizing vertical geometry during heavy braking entries.',
    image: 'assets/ducati_suspension.png',
    alignment: 'left',
    specs: [
      { num: '330 mm', label: 'Dual Brembo Rotors' },
      { num: 'Öhlins', label: 'Smart EC 2.0' },
      { num: 'Stylema', label: 'Radial Monoblock' }
    ]
  },
  {
    id: 'editorial-electronics',
    type: 'electronics-grid',
    title: 'Cognitive Assist',
    subtitle: '6-Axis IMU Platform',
    body: 'An advanced Bosch inertial platform monitors pitch, roll, and yaw angles in real time, governing rider safety aids without diluting raw feedback.',
    cards: [
      { icon: 'ABS', title: 'Cornering ABS EVO', text: 'Governs brake line pressure at maximum lean angles to prevent slide-outs.' },
      { icon: 'DTC', title: 'Traction Control EVO 3', text: 'Predictive wheel slip management modulating ignition timing smoothly.' },
      { icon: 'DQS', title: 'Quick Shift Up/Down', text: 'Clutchless gear shifts maintaining full engine loading.' },
      { icon: 'DWC', title: 'Wheelie Control', text: 'Maximizes forward acceleration by keeping the front tire hovering.' }
    ]
  },
  {
    id: 'editorial-heritage',
    type: 'heritage-timeline',
    title: 'Racing DNA Chronology',
    subtitle: 'MotoGP Derived Evolution',
    timeline: [
      { 
        year: '1926', 
        event: 'Bologna Foundation', 
        body: 'Founded as Società Scientifica Radio Brevetti Ducati. The company began by producing radio components and capacitors, establishing a heritage of high-precision micro-mechanics before ever building motor engines.' 
      },
      { 
        year: '1972', 
        event: 'The Imola Breakthrough', 
        body: 'Paul Smart rides a modified desmodromic 750 Twin to victory at the Imola 200. This legendary success cements desmodromic valve actuation as the structural pillar of Ducati engineering.' 
      },
      { 
        year: '1994', 
        event: 'The 916 Masterpiece', 
        body: 'Massimo Tamburini unveils the Ducati 916. Its under-seat exhaust, single-sided swingarm, and sharp dual headlights revolutionize superbike design, packaging, and aerodynamics.' 
      },
      { 
        year: '2007', 
        event: 'MotoGP World Domain', 
        body: 'Casey Stoner tames the aggressive power band of the 800cc V4 Desmosedici GP7, capturing Ducati\'s first GP World Championship in the four-stroke era with raw traction slide control.' 
      },
      { 
        year: 'Present', 
        event: 'The Panigale V4 Era', 
        body: 'Direct transfer of MotoGP counter-rotating crankshaft dynamics and biplane wings into production lines. An absolute expression of street-legal speed engineered through Corse telemetry.' 
      }
    ]
  },
  {
    id: 'editorial-specs-grid',
    type: 'specs-grid',
    title: 'Technical Specifications',
    subtitle: 'Performance Metrics',
    specs: [
      { label: 'Displacement', value: '1,103 cc' },
      { label: 'Maximum Power', value: '215 HP @ 13,000 RPM' },
      { label: 'Torque Output', value: '123.6 Nm @ 9,500 RPM' },
      { label: 'Dry Weight', value: '172 kg (379 lb)' },
      { label: 'Compression Ratio', value: '14.0:1' },
      { label: 'Bore x Stroke', value: '81 x 53.5 mm' },
      { label: 'Transmission', value: '6-speed with DQS EVO 2' },
      { label: 'Top Speed', value: '315 km/h (195 mph)' }
    ]
  },
  {
    id: 'editorial-philosophy-end',
    type: 'centered-quote',
    title: 'The Essence of Form',
    subtitle: 'Chassis Philosophy',
    body: '“Performance is not assembled in a factory. It is engineered through thousands of decisions.”'
  }
];

// 2. Evolution Section Database
export const evolutionData = {
  title: 'Seven Decades of Pressure, Speed & Innovation.',
  subtitle: 'A focused archive of the major design eras that turned simple racing machines into carbon, hybrid, ground-effect laboratories.',
  cards: [
    {
      era: '1950s',
      title: 'Desmodromic Beginnings',
      body: 'Fabio Taglioni introduces desmodromic valve actuation, eliminating valve float springs to reach rev levels previously deemed mechanically impossible.',
      image: 'assets/evolution_1950s.png',
      idea: 'Mechanical synchronization over valve springs'
    },
    {
      era: '1970s',
      title: 'The V-Twin Revolution',
      body: 'Ducati establishes its signature 90° L-Twin engine geometry at Imola, balancing primary engine harmonics with absolute chassis narrowness.',
      image: 'assets/evolution_1970s.png',
      idea: 'Aerodynamic narrow profile and torque delivery'
    },
    {
      era: '1990s',
      title: 'The Iconic 916 Era',
      body: 'Massimo Tamburini crafts a design icon. An under-seat exhaust configuration and single-sided swingarm revolutionize superbike packaging and styling.',
      image: 'assets/evolution_1990s.png',
      idea: 'Symmetrical airflow extraction and visual balance'
    },
    {
      era: '2000s',
      title: 'MotoGP Desmosedici Entry',
      body: 'Ducati debuts in MotoGP with the V4 Desmosedici GP7. Casey Stoner tames the aggressive power band to claim a historic world championship title.',
      image: 'assets/evolution_2000s.png',
      idea: 'Raw desmosedici output and modular chassis flex'
    },
    {
      era: 'Present',
      title: 'Panigale V4 Stradale',
      body: 'A direct bridge between track limits and street legality. Counter-rotating crankshaft engineering offsets tire gyroscopic dynamics to corner effortlessly.',
      image: 'assets/evolution_present.png',
      idea: 'GP-derived architecture on production lines'
    }
  ]
};

// 3. Mechanical Components Database
export const mechanicalData = {
  title: 'Every Major Assembly, Explained.',
  subtitle: 'A professional component view for the systems that define a superbike: structure, suspension, braking, cooling, exhaust, and aerodynamics.',
  cards: [
    {
      num: '01',
      title: 'Front Frame Monocoque',
      body: 'The ultra-compact aluminum Front Frame uses the engine block as a structural stressed member, yielding extreme torsional stiffness while saving chassis weight.',
      image: 'assets/mechanical_frame.png'
    },
    {
      num: '02',
      title: 'Biplane Winglets',
      body: 'Dual-profile carbon fiber winglets create 37 kg of downforce at 300 km/h. This vertical pressure anchors the front contact patch, suppressing wheelie lift.',
      image: 'assets/ducati_fairing.png'
    },
    {
      num: '03',
      title: 'Ohlins Damping forks',
      body: 'Semi-active Ohlins NPX pressurized forks adjust compression and rebound in real-time, preventing front-end dive during heavy deceleration entries.',
      image: 'assets/ducati_suspension.png'
    },
    {
      num: '04',
      title: 'Brembo Calipers',
      body: 'Dual monoblock Brembo Stylema calipers bite into 330 mm rotors, combining optimized fluid ventilation with maximum thermal deceleration stability.',
      image: 'assets/mechanical_brakes.png'
    },
    {
      num: '05',
      title: 'Desmosedici Engine',
      body: 'A 1,103 cc 90-degree desmodromic V4 utilizing a MotoGP counter-rotating crankshaft configuration to suppress wheelie lift and corner inertia.',
      image: 'assets/ducati_engine.png'
    },
    {
      num: '06',
      title: 'Titanium Exhaust',
      body: 'A lightweight under-engine exhaust layout containing long-runner pipes that optimize pressure waves while keeping center-of-gravity centralized.',
      image: 'assets/mechanical_exhaust.png'
    }
  ]
};

// 4. Technical Electronic Systems Database
export const technicalData = {
  title: 'Engineering Intelligence in Motion.',
  subtitle: 'An advanced 6-axis Bosch IMU measures chassis roll, pitch, and yaw in milliseconds to govern riding assistance programs dynamically.',
  cards: [
    {
      icon: 'ABS',
      title: 'Cornering ABS EVO',
      desc: 'Controls brake line pressure dynamically based on motorcycle lean angle to prevent front-end slide-outs during mid-corner deceleration.'
    },
    {
      icon: 'DTC',
      title: 'Traction Control EVO 3',
      desc: 'Utilizes predictive slip algorithms to modulate engine torque via ignition retard and fuel injection, ensuring rear tire slide predictability.'
    },
    {
      icon: 'DQS',
      title: 'Quick Shift Up/Down',
      desc: 'Interprets gear linkage load cells to cut ignition briefly, allowing lightning-fast clutchless shifts under full acceleration throttle.'
    },
    {
      icon: 'DWC',
      title: 'Wheelie Control',
      desc: 'Detects front wheel lift height via suspension stroke sensors and pitch rate, reducing engine load to maximize forward forward drive.'
    }
  ]
};

// 5. Legends Section Database
export const legendsData = {
  title: 'Legends',
  subtitle: 'Four racing legends chosen for world championships, absolute desmo racecraft, and era-defining dominance.',
  cards: [
    {
      name: 'Carl Fogarty',
      role: 'The King of WSBK',
      body: 'Foggy established the Ducati dominance of the 1990s. His aggressive head-down cornering style and four World Superbike championships cemented the Ducati red as a global racing icon.',
      image: 'assets/legend_fogarty.png',
      achievements: '4x WSBK Champion, 55 World Superbike Wins'
    },
    {
      name: 'Troy Bayliss',
      role: 'The Maverick of Imola',
      body: 'Bayliss captured three WSBK titles across three generations of Ducati superbikes (996, 999, 1098). His legendary slide control and drift-happy riding style defined desmo limits.',
      image: 'assets/legend_bayliss.jpg',
      achievements: '3x WSBK Champion, 52 Wins, 1 MotoGP Victory'
    },
    {
      name: 'Casey Stoner',
      role: 'MotoGP Desmo Tamer',
      body: 'Stoner was the only rider capable of riding the wild V4 Desmosedici GP7 on the ragged edge. His slide-throttle style secured Ducati’s first historic MotoGP World Championship in 2007.',
      image: 'assets/legend_stoner.png',
      achievements: '2x MotoGP Champion (2007, 2011), 38 MotoGP Wins'
    },
    {
      name: 'Francesco Bagnaia',
      role: 'The Modern Champion',
      body: 'Pecco Bagnaia combines desmodromic power with precision corner entry dynamics, securing back-to-back MotoGP world titles to establish a new golden era of Ducati Corse dominance.',
      image: 'assets/legend_bagnaia.jpg',
      achievements: '2x MotoGP Champion (2022, 2023), 28+ Grand Prix Wins'
    }
  ]
};
