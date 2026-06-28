// Editorial Content Database: Copywriting for Act II Magazine Sections
export const editorialSections = [
  {
    id: 'editorial-intro',
    type: 'centered-text',
    title: 'THE ART OF ESCAPE',
    subtitle: 'Ducati Panigale V4',
    body: 'The Panigale V4 is more than a superbike. It represents the direct translation of racetrack technology into an absolute expression of street-legal speed. Designed for riders who refuse compromise, it is a precision tool crafted for ultimate performance.',
    meta: 'Act II — Detailed Mechanics'
  },
  {
    id: 'editorial-philosophy',
    type: 'left-aligned-narrative',
    title: 'THE PURSUIT OF LIGHTNESS',
    subtitle: 'Engineering Philosophy',
    body: 'Every single component of the Panigale V4 exists for one purpose: to speed up kinetic transition. By optimizing wall thicknesses and shaving structural mass, weight is concentrated around the crankshaft rotation axis, minimizing inertial resistance. In racing, a gram is a unit of lap time.'
  },
  {
    id: 'editorial-design',
    type: 'feature-block',
    title: 'DESIGN LANGUAGE',
    subtitle: 'Form Driven by Airflow',
    body: 'The silhouette of the Panigale V4 is defined by aerodynamic efficiency. Aggressive, sweeping fairings draw air through internal cooling matrices, while double-profile carbon fiber winglets generate 37 kg of downforce at 300 km/h. This vertical pressure anchors the front wheel, suppressing lift during acceleration.',
    image: 'assets/ducati_fairing.png',
    alignment: 'left',
    meta: 'Aerodynamics & Silhouette'
  },
  {
    id: 'editorial-engine',
    type: 'split-dashboard',
    title: 'DESMOSEDICI STRADALE',
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
    title: 'PRESSURE DYNAMICS',
    subtitle: 'Wind Tunnel Refined Profile',
    body: 'Laminar flow analysis shapes every intake cowl and extract duct. Air is forced through lateral heat exchangers, venting boundary-layer drag beneath the rider’s knees. Vertical drag wing elements stabilize yaw during high-angle corner entries, maintaining high chassis balance.',
    vector: true
  },
  {
    id: 'editorial-rider',
    type: 'feature-block',
    title: 'RIDER INTERACTION',
    subtitle: 'The Seating Triangle',
    body: 'The ergonomic design is configured for absolute control. A narrow tank shape allows the rider to lock in with their knees during heavy braking phases, relieving stress on the wrists. The flat, broad seat provides freedom of movement, letting the rider transition off the bike during hanging corner sweeps.',
    image: 'assets/ducati_cockpit.png',
    alignment: 'right',
    meta: 'Ergonomics & Control'
  },
  {
    id: 'editorial-materials',
    type: 'materials-grid',
    title: 'METALLURGY & COMPOSITES',
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
    title: 'SUSPENSION & STOPPING FORCE',
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
    title: 'COGNITIVE ASSIST',
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
    title: 'RACING DNA CHRONOLOGY',
    subtitle: 'MotoGP Derived Evolution',
    timeline: [
      { year: '1926', event: 'Company founded as radio manufacturer' },
      { year: '1972', event: 'First desmodromic twin superbike success' },
      { year: '1994', event: 'Iconic 916 launch, changing superbike architecture' },
      { year: '2007', event: 'MotoGP World Championship triumph' },
      { year: 'Present', event: 'Panigale V4: peak of track-derived racing lineage' }
    ]
  },
  {
    id: 'editorial-specs-grid',
    type: 'specs-grid',
    title: 'TECHNICAL SPECIFICATIONS',
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
    title: 'THE ESSENCE OF FORM',
    subtitle: 'Chassis Philosophy',
    body: '“Performance is not assembled in a factory. It is engineered through thousands of decisions.”'
  }
];
