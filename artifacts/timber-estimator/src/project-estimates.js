const ceil = Math.ceil;
const fmt = (value, digits = 1) => Number(value.toFixed(digits)).toLocaleString("en-GB");
const priced = (name, quantity, detail, cost) => [name, quantity, detail, Math.max(0, Math.round(cost))];

export const projects = {
  logstore: {
    title: "Garden Log Store",
    description: "Plan an open-front timber frame for a sheltered stack of logs.",
    fields: [
      { key: "length", label: "Length / span", unit: "m", min: 0.3, max: 10, value: 1.8, step: "any", hint: "Overall width along the front." },
      { key: "depth", label: "Depth / width", unit: "m", min: 0.3, max: 5, value: .65, step: "any", hint: "Front to back." },
      { key: "height", label: "Height", unit: "m", min: 0.3, max: 5, value: 1.5, step: "any", hint: "Overall frame height." }
    ]
  },
  raisedbed: {
    title: "Raised Veg Planter / Garden Bed",
    description: "Estimate a timber bed, liner and growing mix.",
    fields: [
      { key: "length", label: "Bed length", unit: "m", min: .3, max: 10, value: 1.8, step: "any", hint: "Outside length of the bed." },
      { key: "width", label: "Bed width", unit: "m", min: .3, max: 5, value: .9, step: "any", hint: "Outside width of the bed." },
      { key: "height", label: "Bed wall height", unit: "m", min: .15, max: 1, value: .45, step: "any", hint: "Growing depth; check drainage and site conditions." }
    ]
  },
  bin: {
    title: "Wheelie Bin Enclosure",
    description: "Plan a slatted enclosure with a simple felted roof.",
    fields: [
      { key: "length", label: "Enclosure length", unit: "m", min: .8, max: 6, value: 1.8, step: "any", hint: "Allow room for the bins and access." },
      { key: "width", label: "Enclosure depth", unit: "m", min: .6, max: 4, value: 1.2, step: "any", hint: "Front to back, including roof overhang if needed." },
      { key: "height", label: "Enclosure height", unit: "m", min: .8, max: 3, value: 1.3, step: "any", hint: "Measure bins with lids open if required." }
    ]
  },
  decking: {
    title: "Timber Decking Module",
    description: "Estimate a small rectangular deck frame and deck boards.",
    fields: [
      { key: "length", label: "Deck length", unit: "m", min: .5, max: 12, value: 3, step: "any", hint: "Length along the main deck boards." },
      { key: "width", label: "Deck width", unit: "m", min: .5, max: 12, value: 2, step: "any", hint: "Width across the deck boards." },
      { key: "height", label: "Platform height", unit: "m", min: .05, max: 1.5, value: .2, step: "any", hint: "Indicative finished height above the ground." }
    ]
  },
  pergola: {
    title: "Pergola / Lean-To",
    description: "Estimate a timber frame with a covered, felted roof.",
    fields: [
      { key: "length", label: "Structure length", unit: "m", min: 1, max: 12, value: 3, step: "any", hint: "Length along the wall or front beam." },
      { key: "width", label: "Roof projection / depth", unit: "m", min: 1, max: 6, value: 2.4, step: "any", hint: "Wall to front edge of the roof." },
      { key: "height", label: "Front post height", unit: "m", min: 1.8, max: 4.5, value: 2.2, step: "any", hint: "Check access, slope and local requirements." }
    ]
  },
  flyscreen: {
    title: "Window Fly Screen",
    description: "Estimate a made-to-fit frame, mesh and fixing consumables.",
    fields: [
      { key: "width", label: "Window opening width", unit: "mm", min: 100, max: 5000, value: 900, step: "any", hint: "Measure the opening where the screen will sit." },
      { key: "height", label: "Window opening height", unit: "mm", min: 100, max: 5000, value: 1200, step: "any", hint: "Use the same units for width and height." }
    ]
  },
  shelving: {
    title: "Alcove / Wall Shelving Unit",
    description: "Estimate shelf boards, supports and wall fixings.",
    fields: [
      { key: "width", label: "Shelf span", unit: "m", min: .3, max: 6, value: 1.5, step: "any", hint: "Clear span between side walls or supports." },
      { key: "depth", label: "Shelf depth", unit: "m", min: .15, max: 1.2, value: .3, step: "any", hint: "Front edge to wall." },
      { key: "height", label: "Unit height", unit: "m", min: .3, max: 4, value: 2, step: "any", hint: "Overall height of the shelving area." },
      { key: "shelfCount", label: "Number of shelves", unit: "shelves", min: 1, max: 12, value: 4, step: "any", hint: "Fractional entries are rounded to a whole shelf." }
    ]
  },
  workbench: {
    title: "Timber Workbench / Garage Shelving",
    description: "Estimate a framed worktop with optional lower shelves.",
    fields: [
      { key: "length", label: "Workbench length", unit: "m", min: .6, max: 8, value: 2, step: "any", hint: "Overall length of the bench." },
      { key: "width", label: "Workbench depth", unit: "m", min: .4, max: 2, value: .7, step: "any", hint: "Front to back." },
      { key: "height", label: "Workbench height", unit: "m", min: .6, max: 1.5, value: .9, step: "any", hint: "Set to suit the intended work." },
      { key: "shelfCount", label: "Lower shelves", unit: "shelves", min: 0, max: 4, value: 1, step: "any", hint: "Number of lower shelf tiers; fractions are rounded." }
    ]
  },
  radiator: {
    title: "Radiator Cover Frame",
    description: "Estimate a timber cover frame and ventilated slats.",
    fields: [
      { key: "length", label: "Cover length", unit: "m", min: .4, max: 5, value: 1.4, step: "any", hint: "Include side clearance beyond the radiator." },
      { key: "depth", label: "Cover depth", unit: "m", min: .1, max: 1, value: .25, step: "any", hint: "Allow clearance for airflow and pipework." },
      { key: "height", label: "Cover height", unit: "m", min: .2, max: 2, value: .9, step: "any", hint: "Include top clearance above the radiator." }
    ]
  },
  lock: {
    title: "Door Cylinder Lock Change",
    description: "Work out an indicative euro-cylinder size before buying.",
    fields: [
      { key: "thickness", label: "Door thickness", unit: "mm", min: 20, max: 120, value: 44, step: "any", hint: "A useful check alongside the current cylinder." },
      { key: "sideA", label: "Cylinder side A", unit: "mm", min: 10, max: 100, value: 35, step: "any", hint: "Retaining-screw centre to one end." },
      { key: "sideB", label: "Cylinder side B", unit: "mm", min: 10, max: 100, value: 35, step: "any", hint: "Retaining-screw centre to the other end." }
    ]
  },
  plywood: {
    title: "Plywood Surface Prep & Painting",
    description: "Budget primer, top coat and sanding supplies for a panel.",
    fields: [
      { key: "length", label: "Panel length", unit: "m", min: .1, max: 10, value: 1.2, step: "any", hint: "Measure the panel face." },
      { key: "width", label: "Panel width", unit: "m", min: .1, max: 10, value: .8, step: "any", hint: "Area is estimated from one face." },
      { key: "coats", label: "Top-coat coats", unit: "coats", min: 1, max: 5, value: 2, step: "any", hint: "Primer is estimated separately as one coat." }
    ]
  },
  skirting: {
    title: "Skirting Board Fitting",
    description: "Estimate boards, adhesive and finishing materials.",
    fields: [
      { key: "length", label: "Total skirting run", unit: "m", min: 1, max: 100, value: 12, step: "any", hint: "Add wall lengths, less door openings." },
      { key: "height", label: "Skirting height", unit: "m", min: .05, max: .3, value: .12, step: "any", hint: "Measure the visible board height." }
    ]
  },
  laminate: {
    title: "Laminate Flooring Installation",
    description: "Estimate laminate packs, underlay and fitting accessories.",
    fields: [
      { key: "length", label: "Room length", unit: "m", min: .5, max: 30, value: 4, step: "any", hint: "Measure the longest wall-to-wall dimension." },
      { key: "width", label: "Room width", unit: "m", min: .5, max: 30, value: 3, step: "any", hint: "Measure at more than one point if walls are uneven." }
    ]
  },
  custom: {
    title: "Custom Timber Build (Other)",
    description: "Use a simple frame estimate for another timber project.",
    fields: [
      { key: "length", label: "Length", unit: "m", min: .1, max: 10, value: 1.5, step: "any", hint: "Overall length of the project." },
      { key: "width", label: "Width", unit: "m", min: .1, max: 10, value: .6, step: "any", hint: "Overall width or depth." },
      { key: "height", label: "Height", unit: "m", min: .1, max: 5, value: .9, step: "any", hint: "Overall height." }
    ]
  }
};

const containerPlan = litres => {
  const sizes = [5, 2.5, 1];
  let remaining = Math.max(.5, litres);
  const cans = [];
  for (const size of sizes) {
    const count = Math.floor((remaining + .00001) / size);
    if (count) {
      cans.push(`${count} × ${size} L`);
      remaining -= count * size;
    }
  }
  if (remaining > .00001) cans.push(`1 × ${remaining <= 1 ? "1" : "2.5"} L`);
  return cans.join(", ");
};

function roofingMaterials(span, roofDepth) {
  const slopedDepth = roofDepth * 1.08;
  const roofArea = span * slopedDepth;
  const sheetCoverage = 2.9768;
  const sheetCount = Math.max(1, ceil(roofArea / sheetCoverage));
  const purchasedSheetArea = sheetCount * sheetCoverage;
  const feltCourses = Math.max(1, ceil(slopedDepth / .9));
  const feltLength = feltCourses * span * 1.1;
  const feltRolls = Math.max(1, ceil(feltLength / 10));
  const feltNails = Math.max(50, ceil(roofArea * 10));
  const nailPacks = Math.max(1, ceil(feltNails / 250));
  return [
    priced("OSB / plywood roof sheets", `${sheetCount} × 2440 × 1220 mm (${fmt(purchasedSheetArea, 2)} m² purchased)`, `About ${fmt(roofArea, 2)} m² roof coverage, including pitch allowance; cut and sheet layout can change the count.`, sheetCount * 25),
    priced("Roofing felt", `${fmt(feltLength, 1)} linear m (${feltRolls} × 10 m rolls)`, `Includes overlaps across ${feltCourses} felt courses; 1 m wide roll assumed.`, feltRolls * 22),
    priced("Felt nails / fixings", `${feltNails} nails (${nailPacks} × 250-pack${nailPacks === 1 ? "" : "s"})`, "Indicative allowance at roughly 10 nails per m²; follow felt manufacturer instructions.", nailPacks * 6)
  ];
}

function sketchFor(key, x) {
  const framedProjects = new Set(["logstore", "raisedbed", "bin", "decking", "pergola", "flyscreen", "shelving", "workbench", "radiator", "custom"]);
  if (!framedProjects.has(key)) return null;
  let length = x.length ?? x.width;
  let width = x.depth ?? x.width ?? x.height;
  let height = x.height ?? .1;
  if (key === "flyscreen") {
    length = x.width / 1000;
    width = x.height / 1000;
    height = .05;
  } else if (key === "shelving") {
    length = x.width;
    width = x.depth;
  } else if (key === "radiator") {
    length = x.length;
    width = x.depth;
  }
  const steps = {
    logstore: ["Set out a level base to the measured footprint.", "Assemble and square the base rails.", "Fix the uprights and perimeter rails.", "Fit rafters, roof sheets, felt and weatherproof fixings."],
    raisedbed: ["Choose and level the bed position.", "Build the side-board courses to the measured size.", "Fasten the corner posts and check the frame is square.", "Line the bed, confirm drainage, then add growing mix."],
    bin: ["Mark out a level base with bin access in mind.", "Assemble the base and corner-post frame.", "Fix the slatted sides and roof rafters.", "Fit roof sheets, felt and corrosion-resistant fixings."],
    decking: ["Prepare and level the ground supports.", "Assemble the perimeter frame and joists.", "Lay deck boards with consistent drainage gaps.", "Secure decking screws and check edges and steps."],
    pergola: ["Confirm the wall line, post positions and clearances.", "Set posts plumb and secure the main beams.", "Space and fix rafters to the planned span.", "Fit roof sheets, felt and suitable structural fixings."],
    flyscreen: ["Measure the opening at several points.", "Cut and assemble the screen-frame rails.", "Fit mesh evenly with spline around the perimeter.", "Check the frame is square and test the fit."],
    shelving: ["Mark shelf heights and locate sound wall supports.", "Cut boards and support rails to the measured span.", "Fix brackets or frame supports into suitable structure.", "Level each shelf and check the intended load rating."],
    workbench: ["Mark the worktop and leg positions.", "Assemble the base frame and cross supports.", "Fit the worktop and any lower shelves.", "Check the bench is level and secure before loading."],
    radiator: ["Check radiator clearance and airflow requirements.", "Assemble the base and upright frame.", "Fit ventilated slats and the top panel.", "Confirm the finished cover does not restrict heat or access."],
    custom: ["Set out a level base to the measured footprint.", "Assemble and square the base rails.", "Fix the uprights and top supports.", "Fit project-specific rails and suitable fixings."]
  };
  return {
    length,
    width,
    height,
    roofed: ["logstore", "bin", "pergola"].includes(key),
    steps: steps[key]
  };
}

export function sortProducts(products) {
  const priority = name => {
    if (["Saw", "Driver", "Sander", "FloorCutter"].includes(name)) return 0;
    if (["Measure", "Screwdriver", "Square", "Spline"].includes(name)) return 1;
    if (/screw|fix|nail|bracket|cylinder|adhesive/i.test(name)) return 2;
    return 3;
  };
  return products
    .map((product, originalIndex) => ({ product, originalIndex }))
    .sort((a, b) => priority(a.product[0]) - priority(b.product[0]) || a.originalIndex - b.originalIndex)
    .map(({ product }) => product);
}

export function estimate(key, x, budget) {
  const materials = [];
  const assumptions = [];
  const products = [];
  let title = projects[key].title;

  if (key === "logstore") {
    const { length: l, depth: d, height: h } = x;
    const rafters = ceil(l / .6) + 1;
    const backSlats = ceil(l / .12) + 1;
    const floorSlats = ceil(l / .12) + 1;
    const frameRaw = 4 * h + 4 * (l + d) + rafters * d;
    const slatRaw = backSlats * h + floorSlats * d;
    const frameStock = ceil(frameRaw * 1.12 / 3);
    const slatStock = ceil(slatRaw * 1.12 / 3);
    const treatmentArea = l * h + 2 * d * h + l * d;
    const litres = treatmentArea * 2 / 10;
    const screws = ceil((backSlats * 2 + floorSlats * 2 + rafters * 2) * 1.2);
    materials.push(
      priced("Frame timber", `${frameStock} × 3 m lengths`, `Uprights, perimeter rails and ${rafters} roof rafters; includes 12% cutting waste.`, frameStock * 8.5),
      priced("Side slats", `${slatStock} × 3 m lengths`, `${backSlats} back slats and ${floorSlats} floor slats; includes 12% waste.`, slatStock * 5.25),
      priced("Exterior screws", `About ${screws} screws`, "Allowance tied to frame, slat and rafter fixing points.", Math.max(8, ceil(screws / 100) * 6)),
      priced("Wood treatment", `${containerPlan(litres)} (${fmt(litres, 2)} L needed)`, `Two coats over about ${fmt(treatmentArea, 1)} m²; check product coverage.`, Math.max(12, ceil(litres) * 8)),
      ...roofingMaterials(l, d)
    );
    assumptions.push("Simple open-front frame with rafters at no more than 600 mm spacing. Roofing quantities assume a single felted pitch; verify structure, timber sections and roof load before building.");
    products.push(
      ["Saw", "Compound mitre saw · repeatable frame and rafter cuts", "CUT"],
      ["Driver", "Drill/driver and exterior-rated driver bits", "TOOL"],
      ["Measure", "Tape measure and combination square · accurate set-out", "MEAS"],
      ["Screws", "Exterior wood screws · corrosion-resistant fixings", "FIX"],
      ["Treatment", "Exterior wood treatment · suitable for outdoor timber", "CARE"],
      ["Felt Nails", "Galvanised roofing felt nails · compatible with the felt system", "NAIL"]
    );
  } else if (key === "raisedbed") {
    const { length: l, width: w, height: h } = x;
    const courses = Math.ceil(h / .15);
    const sideBoardLength = 2 * (l + w) * courses;
    const sideStock = ceil(sideBoardLength * 1.12 / 3);
    const postStock = ceil(4 * h * 1.12 / 3);
    const screws = Math.max(24, ceil(sideBoardLength * 2));
    const linerArea = 2 * (l + w) * h;
    const fillVolume = l * w * h;
    materials.push(
      priced("Corner posts", `${postStock} × 3 m lengths`, `Four corner posts at ${fmt(h, 2)} m high, plus cutting allowance.`, postStock * 8.5),
      priced("Side boards", `${sideStock} × 3 m lengths (${courses} courses)`, `About ${fmt(sideBoardLength, 1)} linear m before waste.`, sideStock * 5.25),
      priced("Exterior screws", `About ${screws} screws`, "Corrosion-resistant fixings for the board courses and posts.", Math.max(6, ceil(screws / 100) * 6)),
      priced("Bed liner", `${fmt(linerArea, 2)} m²`, "Inside wall area only; omit or adjust for your bed design.", linerArea * 2),
      priced("Growing mix", `${fmt(fillVolume, 2)} m³`, "Loose fill volume before settling; excludes drainage materials.", fillVolume * 75)
    );
    assumptions.push("Assumes a rectangular, open-bottom bed with 150 mm board courses. Confirm safe retaining height, drainage and timber treatment for edible planting.");
    products.push(
      ["Saw", "Compound mitre saw · square cuts for the bed frame", "CUT"],
      ["Driver", "Drill/driver and exterior-rated driver bits", "TOOL"],
      ["Measure", "Tape measure and carpenter’s square", "MEAS"],
      ["Screws", "Exterior timber screws · suitable for treated wood", "FIX"],
      ["Liner", "Garden-bed liner · check suitability for planting", "LINER"]
    );
  } else if (key === "bin") {
    const { length: l, width: w, height: h } = x;
    const perimeterFrame = 4 * (l + w) + 4 * h;
    const frameStock = ceil(perimeterFrame * 1.12 / 3);
    const cladArea = (l + 2 * w) * h;
    const slatLength = cladArea / .12;
    const slatStock = ceil(slatLength * 1.12 / 3);
    const screws = Math.max(40, ceil(slatLength * 2 + perimeterFrame * 2));
    materials.push(
      priced("Frame timber", `${frameStock} × 3 m lengths`, `Base and top rails with four uprights; about ${fmt(perimeterFrame, 1)} m net plus 12% waste.`, frameStock * 8.5),
      priced("Front and side slats", `${slatStock} × 3 m lengths`, `About ${fmt(cladArea, 2)} m² screened area at 120 mm board coverage.`, slatStock * 5.25),
      priced("Exterior screws", `About ${screws} screws`, "Separate allowance for the enclosure frame and slats.", ceil(screws / 100) * 7),
      ...roofingMaterials(l, w)
    );
    assumptions.push("Assumes a three-sided slatted enclosure with an access opening and one felted roof pitch. Allow clearance for bin lids, handles and movement.");
    products.push(
      ["Saw", "Compound mitre saw · repeatable frame and roof cuts", "CUT"],
      ["Driver", "Drill/driver and exterior-rated driver bits", "TOOL"],
      ["Measure", "Tape measure and square · set out the enclosure", "MEAS"],
      ["Screws", "Exterior wood screws · corrosion-resistant fixings", "FIX"],
      ["Felt Nails", "Galvanised roofing felt nails · compatible with the felt system", "NAIL"]
    );
  } else if (key === "decking") {
    const { length: l, width: w, height: h } = x;
    const joistRows = ceil(w / .4) + 1;
    const supportCount = (ceil(l / 1.2) + 1) * (ceil(w / 1.2) + 1);
    const joistLength = joistRows * l + 2 * w + supportCount * h;
    const joistStock = ceil(joistLength * 1.12 / 3);
    const deckRows = ceil(w / .145);
    const boardLength = deckRows * l;
    const boardStock = ceil(boardLength * 1.1 / 3);
    const screwCount = Math.max(100, ceil(deckRows * (ceil(l / .4) + 1) * 2));
    const area = l * w;
    materials.push(
      priced("Joists and supports", `${joistStock} × 3 m lengths`, `${joistRows} joist rows and about ${supportCount} supports; includes cutting allowance.`, joistStock * 8.5),
      priced("Decking boards", `${boardStock} × 3 m lengths`, `${deckRows} board runs across ${fmt(area, 2)} m²; includes 10% trimming allowance.`, boardStock * 6.5),
      priced("Decking screws", `About ${screwCount} screws`, "Pack allowance based on two fixings at each joist crossing.", ceil(screwCount / 100) * 8),
      priced("Ground membrane", `${fmt(area, 2)} m²`, "Indicative coverage beneath the deck; site preparation is not included.", area * 2.5)
    );
    assumptions.push("Assumes a low rectangular module with joists at about 400 mm centres and supports at about 1.2 m spacing. Check ground preparation, drainage, ventilation and structural requirements.");
    products.push(
      ["Saw", "Compound mitre saw · cut joists and deck boards", "CUT"],
      ["Driver", "Drill/driver and decking driver bits", "TOOL"],
      ["Measure", "Tape measure and long level · set out joists", "MEAS"],
      ["Screws", "Exterior decking screws · corrosion-resistant fixings", "FIX"],
      ["Membrane", "Ground-control membrane · suitable for the site", "MEM"]
    );
  } else if (key === "pergola") {
    const { length: l, width: w, height: h } = x;
    const postsAndRails = 4 * h + 2 * (l + w);
    const rafterCount = ceil(l / .6) + 1;
    const rafterLength = rafterCount * w * 1.08;
    const frameStock = ceil(postsAndRails * 1.15 / 3);
    const rafterStock = ceil(rafterLength * 1.12 / 3);
    const structuralScrews = Math.max(32, ceil((postsAndRails + rafterLength) * 2));
    materials.push(
      priced("Posts and perimeter beams", `${frameStock} × 3 m lengths`, `Four posts and perimeter beams; about ${fmt(postsAndRails, 1)} m net plus 15% waste.`, frameStock * 9.5),
      priced("Roof rafters", `${rafterStock} × 3 m lengths (${rafterCount} rafters)`, `Rafters spaced at no more than 600 mm across a ${fmt(w, 1)} m projection.`, rafterStock * 9.5),
      ...roofingMaterials(l, w),
      priced("Structural fixings", `About ${structuralScrews} screws`, "Indicative structural screw allowance; confirm fastener type and connection design.", ceil(structuralScrews / 50) * 12)
    );
    assumptions.push("Roofing assumes a covered lean-to/pergola roof, not an open slatted pergola. Verify wall attachment, wind uplift, post foundations and local building requirements with a competent professional.");
    products.push(
      ["Saw", "Compound mitre saw · accurate beam and rafter cuts", "CUT"],
      ["Driver", "High-torque drill/driver and structural driver bits", "TOOL"],
      ["Measure", "Tape measure, long level and framing square", "MEAS"],
      ["Structural Fixings", "Exterior structural screws and compatible anchors", "FIX"],
      ["Felt Nails", "Galvanised roofing felt nails · compatible with the felt system", "NAIL"]
    );
  } else if (key === "flyscreen") {
    const w = x.width / 1000, h = x.height / 1000;
    const perimeter = 2 * (w + h);
    const area = w * h;
    const mesh = area * 1.1;
    const fixes = ceil(perimeter / .3) + 4;
    materials.push(
      priced("Screen frame", `${fmt(perimeter * 1.1, 2)} m perimeter allowance`, "Frame perimeter plus 10% for joints and trimming.", 12 + perimeter * 3),
      priced("Insect mesh", `${fmt(mesh, 2)} m²`, `Opening area ${fmt(area, 2)} m² plus 10% allowance.`, mesh * 13),
      priced("Spline", `${fmt(perimeter * 1.1, 2)} m`, "Allow a little extra for trimming at the corners.", 7 + perimeter * 2),
      priced("Fixings & kit", `About ${fixes} fixing points`, "Fixings estimated at 300 mm spacing, plus a corner allowance.", Math.max(5, fixes * .18))
    );
    assumptions.push("Assumes a simple rectangular screen frame. Check opening clearance, frame profile and mesh type before buying a kit.");
    products.push(
      ["Driver", "Compact drill/driver and bit set · for frame fixings", "TOOL"],
      ["Measure", "Tape measure and small square · check the opening", "MEAS"],
      ["Spline", "Screen spline and roller tool · for a neat mesh fit", "FIT"],
      ["Mesh", "Fine insect screen mesh · cut-to-size roll", "MESH"],
      ["Seal", "Removable window seal strip · close small edge gaps", "SEAL"]
    );
  } else if (key === "shelving") {
    const { width: w, depth: d, height: h } = x;
    const shelfCount = Math.max(1, Math.round(x.shelfCount));
    const shelfArea = shelfCount * w * d;
    const sheetCount = Math.max(1, ceil(shelfArea / 2.9768));
    const supportLength = 4 * h + shelfCount * 2 * d;
    const supportStock = ceil(supportLength * 1.1 / 3);
    const screwCount = shelfCount * 6 + 16;
    const brackets = shelfCount * 2;
    materials.push(
      priced("Shelf boards", `${shelfCount} shelves · ${sheetCount} × 2440 × 1220 mm sheets`, `About ${fmt(shelfArea, 2)} m² board area; sheet cutting plan may change quantities.`, sheetCount * 28),
      priced("Uprights and support rails", `${supportStock} × 3 m lengths`, `About ${fmt(supportLength, 1)} m net support timber plus 10% waste.`, supportStock * 8.5),
      priced("Shelf brackets", `${brackets} brackets`, "Two bracket points per shelf; select type to suit the wall and load.", brackets * 1.5),
      priced("Wall plugs and screws", `About ${screwCount} fixings`, "Use fixings matched to the wall construction.", ceil(screwCount / 50) * 5)
    );
    assumptions.push(`Uses ${shelfCount} shelves and a basic support frame. Shelf span, board thickness and wall fixings must suit the intended load; locate studs or masonry before drilling.`);
    products.push(
      ["Saw", "Compound mitre saw or track saw · cut shelf boards and rails", "CUT"],
      ["Driver", "Drill/driver and wall/material bit set", "TOOL"],
      ["Measure", "Tape measure and spirit level · mark shelf heights", "MEAS"],
      ["Brackets", "Shelf brackets and wall plugs · match to wall type", "FIX"],
      ["Screws", "Timber screws · suitable length for shelf supports", "SCREW"]
    );
  } else if (key === "workbench") {
    const { length: l, width: w, height: h } = x;
    const shelfCount = Math.max(0, Math.round(x.shelfCount));
    const frameLength = 4 * h + 2 * (l + w) * (shelfCount + 1);
    const frameStock = ceil(frameLength * 1.12 / 3);
    const boardArea = l * w * (shelfCount + 1);
    const sheetCount = Math.max(1, ceil(boardArea / 2.9768));
    const screws = Math.max(40, ceil(frameLength * 3));
    materials.push(
      priced("Frame timber", `${frameStock} × 3 m lengths`, `Four legs and perimeter rails for top${shelfCount ? ` plus ${shelfCount} lower shelf tiers` : ""}; includes 12% waste.`, frameStock * 8.5),
      priced("Worktop and shelf boards", `${sheetCount} × 2440 × 1220 mm sheets`, `About ${fmt(boardArea, 2)} m² board area before cutting waste.`, sheetCount * 28),
      priced("Timber screws", `About ${screws} screws`, "Indicative frame-joint allowance; size fixings to the timber and expected loads.", ceil(screws / 100) * 7),
      priced("Worktop finish", "1 tin allowance", "Optional protective finish for the work surface.", 15)
    );
    assumptions.push("Assumes a freestanding rectangular bench frame and a simple sheet-material top. Worktop thickness, leg bracing, fixings and capacity must suit the tools and loads placed on it.");
    products.push(
      ["Saw", "Compound mitre saw · cut frame rails and legs", "CUT"],
      ["Driver", "Drill/driver and wood-bit/driver-bit set", "TOOL"],
      ["Measure", "Tape measure, square and level", "MEAS"],
      ["Screws", "Heavy-duty timber screws · size for the frame joints", "FIX"],
      ["Finish", "Durable worktop oil or varnish · check compatibility", "CARE"]
    );
  } else if (key === "radiator") {
    const { length: l, depth: d, height: h } = x;
    const frameLength = 4 * h + 2 * l + 2 * d;
    const frameStock = ceil(frameLength * 1.12 / 3);
    const slatCount = ceil((l + 2 * d) / .1);
    const slatLength = slatCount * h;
    const slatStock = ceil(slatLength * 1.12 / 3);
    const screws = Math.max(24, ceil((frameLength + slatLength) * 2));
    materials.push(
      priced("Frame timber", `${frameStock} × 3 m lengths`, `About ${fmt(frameLength, 1)} m for the perimeter and uprights, plus 12% waste.`, frameStock * 8.5),
      priced("Ventilated slats", `${slatStock} × 3 m lengths (${slatCount} slats)`, `Vertical slats at approximately 100 mm centres; adjust for the design.`, slatStock * 5.25),
      priced("Timber screws", `About ${screws} screws`, "Basic allowance for frame and slat joints.", ceil(screws / 100) * 6),
      priced("Decorative top panel", `${fmt(l * d, 2)} m²`, "One simple top panel; ventilation cut-outs and trim not included.", Math.max(12, l * d * 30))
    );
    assumptions.push("Leave generous airflow, pipe and valve access. Do not cover a radiator in a way that traps heat; follow relevant safety guidance and check the finished clearance.");
    products.push(
      ["Saw", "Compound mitre saw · cut frame and cover slats", "CUT"],
      ["Driver", "Drill/driver and wood-bit/driver-bit set", "TOOL"],
      ["Measure", "Tape measure and square · check clearances", "MEAS"],
      ["Screws", "Timber screws · suitable length for the frame", "FIX"],
      ["Slats", "Planed timber slats · allow for airflow", "WOOD"]
    );
  } else if (key === "lock") {
    const cylinderLength = ceil((x.sideA + x.sideB) / 5) * 5;
    materials.push(
      priced("Replacement cylinder", `1 × approximately ${cylinderLength} mm (${x.sideA} / ${x.sideB} mm measured)`, "Length rounded up to the nearest 5 mm; confirm against the existing hardware.", 17),
      priced("Fitting fixings", "1 retaining screw + 2 spare screws", "Small allowance for suitable replacement fixings.", 3.5)
    );
    assumptions.push(`Door thickness recorded as ${x.thickness} mm. Check the actual cylinder against the current hardware, cam position, door furniture and your security needs; do not rely on this estimate alone.`);
    products.push(
      ["Measure", "Steel rule or tape measure · confirm both sides from screw centre", "MEAS"],
      ["Screwdriver", "Manual screwdriver set · remove and refit existing hardware", "TOOL"],
      ["Cylinder", "Euro-profile replacement cylinder · verify size and security rating", "LOCK"],
      ["Fixings", "Cylinder retaining screws · check length and thread", "FIX"]
    );
  } else if (key === "plywood") {
    const area = x.length * x.width;
    const primerLitres = area / 10;
    const topLitres = area * x.coats / 12;
    const primerPack = Math.max(1, ceil(primerLitres));
    const paintPack = Math.max(1, ceil(topLitres));
    const sandingSheets = Math.max(5, ceil(area * 5 / 5) * 5);
    materials.push(
      priced("Plywood primer", `${primerPack} L allowance (${fmt(primerLitres, 2)} L needed)`, `One coat at approximately 10 m²/L over ${fmt(area, 2)} m².`, primerPack * 14),
      priced("Top-coat paint", `${paintPack} L allowance (${fmt(topLitres, 2)} L needed)`, `${x.coats} coats at approximately 12 m²/L; check label coverage.`, paintPack * 19),
      priced("Sandpaper", `${sandingSheets} sheets`, `Rough allowance of 5 sheets per m²; pack rounded up.`, sandingSheets)
    );
    assumptions.push("One face of the panel is included. Coverage varies with plywood porosity, paint system and application; follow product instructions and allow drying time.");
    products.push(
      ["Sander", "Random-orbit sander and dust extraction bag", "TOOL"],
      ["Measure", "Tape measure and straightedge · mark panel edges", "MEAS"],
      ["Primer", "Plywood / multi-surface primer · check compatibility", "PRIME"],
      ["Paint", "Durable water-based top-coat paint · chosen finish", "PAINT"],
      ["Sanding", "Mixed-grit sanding sheets · prep between coats", "SAND"],
      ["Seal", "Paintable edge sealer · help reduce thirsty plywood edges", "SEAL"]
    );
  } else if (key === "skirting") {
    const stockLength = 2.4;
    const boardCount = ceil(x.length * 1.1 / stockLength);
    const fixingCount = ceil(x.length / .3);
    const adhesiveTubes = Math.max(1, ceil(x.length / 4));
    const sealantTubes = Math.max(1, ceil(x.length / 10));
    materials.push(
      priced("Skirting boards", `${boardCount} × 2.4 m lengths`, `About ${fmt(x.length * 1.1, 1)} linear m including 10% for cuts and mitres.`, boardCount * 10.5),
      priced("Panel pins / fixings", `About ${fixingCount} fixing points`, "Indicative fixing point every 300 mm; select for the wall type.", Math.max(5, ceil(fixingCount / 500) * 5)),
      priced("Grab adhesive", `${adhesiveTubes} tubes`, "Planning allowance of one tube per 4 m.", adhesiveTubes * 5.5),
      priced("Paintable sealant", `${sealantTubes} tubes`, "Planning allowance for small top-edge gaps and joints.", sealantTubes * 4.5)
    );
    assumptions.push("Run length includes corners and excludes door openings. Mitre waste, uneven walls, fixing method and board profile can change quantities; prime or paint where appropriate.");
    products.push(
      ["Saw", "Compound mitre saw · make repeatable skirting mitres", "CUT"],
      ["Measure", "Tape measure, bevel and pencil · mark wall angles", "MEAS"],
      ["Fixings", "Panel pins or wall-compatible fixings", "FIX"],
      ["Adhesive", "Grab adhesive · check board and wall compatibility", "GLUE"],
      ["Seal", "Paintable decorator’s caulk · finish small gaps", "SEAL"]
    );
  } else if (key === "laminate") {
    const roomArea = x.length * x.width;
    const orderArea = roomArea * 1.1;
    const packCoverage = 2.2;
    const packs = Math.max(1, ceil(orderArea / packCoverage));
    const underlayRolls = Math.max(1, ceil(orderArea / 10));
    const perimeter = 2 * (x.length + x.width);
    materials.push(
      priced("Laminate flooring", `${packs} packs (${fmt(orderArea, 2)} m² incl. 10% waste)`, `Room area ${fmt(roomArea, 2)} m²; assumes 2.2 m² coverage per pack.`, packs * 28),
      priced("Underlay", `${underlayRolls} × 10 m² rolls`, "Coverage allowance includes cutting waste; confirm the subfloor system.", underlayRolls * 20),
      priced("Expansion spacers", "1 pack", "Reuse during installation; maintain the gap specified by the floor maker.", 5),
      priced("Underlay / joint tape", `${Math.ceil(perimeter / 20)} roll allowance`, `Room perimeter is about ${fmt(perimeter, 1)} m; tape system varies by underlay.`, Math.max(5, ceil(perimeter / 20) * 5))
    );
    assumptions.push("Assumes a rectangular room and 10% cutting waste. Acclimatise flooring, prepare a level dry subfloor and follow the manufacturer’s expansion-gap and underlay instructions.");
    products.push(
      ["FloorCutter", "Laminate flooring cutter or jigsaw with a fine-tooth blade", "CUT"],
      ["Measure", "Tape measure, square and pencil · plan board rows", "MEAS"],
      ["Spacers", "Laminate expansion spacers · maintain the perimeter gap", "FIT"],
      ["Underlay", "Flooring underlay · choose for the subfloor", "UNDER"],
      ["Tape", "Underlay joint tape · use the specified system", "TAPE"]
    );
  } else if (key === "custom") {
    const { length: l, width: w, height: h } = x;
    const frameRaw = 4 * (l + w) + 4 * h;
    const frameStock = ceil(frameRaw * 1.15 / 3);
    const screwCount = Math.max(16, ceil(frameRaw / .3) * 2);
    const screwPacks = ceil(screwCount / 100);
    title = `${x.projectDescription} (Custom project)`;
    materials.push(
      priced("General timber frame", `${frameStock} × 3 m lengths`, `About ${fmt(frameRaw, 2)} m for four uprights and upper/lower perimeter rails, plus 15% cutting allowance.`, frameStock * 8.5),
      priced("Wood screws", `About ${screwCount} screws (${screwPacks} × 100-count pack${screwPacks === 1 ? "" : "s"})`, "Generic frame-fixing allowance; select a suitable size and finish for your project.", screwPacks * 6)
    );
    assumptions.push("Fallback model for a simple rectangular frame only. It does not include shelves, seat boards, panels, bracing, load requirements, surface treatment, or a project-specific cut list.");
    products.push(
      ["Saw", "Compound mitre saw · make repeatable timber cuts", "CUT"],
      ["Driver", "Drill/driver and wood/driver bit set · assemble the frame", "TOOL"],
      ["Measure", "Tape measure and carpenter’s square · check the frame layout", "MEAS"],
      ["Screws", "General-purpose wood screws · choose for the project and location", "FIX"]
    );
  } else {
    throw new Error(`Unknown project estimate: ${key}`);
  }

  const materialCost = materials.reduce((total, item) => total + item[3], 0);
  let tools = budget === "pro" ? [85, 225] : [28, 76];
  const toolRanges = {
    lock: { basic: [12, 42], pro: [55, 155] },
    flyscreen: { basic: [20, 58], pro: [72, 190] },
    raisedbed: { basic: [40, 100], pro: [110, 280] },
    bin: { basic: [45, 120], pro: [140, 360] },
    decking: { basic: [55, 145], pro: [170, 425] },
    pergola: { basic: [65, 165], pro: [200, 500] },
    workbench: { basic: [45, 120], pro: [140, 360] },
    shelving: { basic: [32, 90], pro: [100, 260] },
    radiator: { basic: [35, 100], pro: [110, 275] },
    skirting: { basic: [35, 100], pro: [110, 280] },
    laminate: { basic: [35, 105], pro: [100, 270] }
  };
  if (toolRanges[key]) tools = toolRanges[key][budget];

  return {
    title,
    materials,
    assumptions,
    products,
    materialCost,
    tools,
    sketch: sketchFor(key, x)
  };
}
