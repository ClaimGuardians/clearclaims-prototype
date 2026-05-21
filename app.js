const STORAGE_KEY = "clearclaims.prototype.state.v1";
const SESSION_KEY = "clearclaims.prototype.accountSession.v1";

const USER_PROFILES = {
  customer: {
    id: "customer",
    name: "Maya Johnson",
    email: "maya.johnson@example.com",
    role: "Homeowner",
    defaultView: "timeline",
    assignedArea: "Clear Process",
    focus: "Claim timeline, needed documents, messages, and next steps",
    headline: "Your claim path is organized here.",
  },
  contractor: {
    id: "contractor",
    name: "Roof Right Contractors",
    email: "office@roofrightcontractors.com",
    role: "Contractor Company",
    defaultView: "documents",
    assignedArea: "Clear Records",
    focus: "Upload estimates, invoices, photos, and requested claim information",
    headline: "Upload what the claim needs next.",
  },
  adjuster: {
    id: "adjuster",
    name: "Public Adjuster Demo",
    email: "adjuster@examplepa.com",
    role: "Public Adjuster",
    defaultView: "claim",
    assignedArea: "Clear Advantage",
    focus: "Claim work plan, urgency review, evidence, and communication flow",
    headline: "Your claim work plan starts here.",
  },
  chuck: {
    id: "chuck",
    name: "Chuck Taylor",
    email: "chuck@claimguardians.com",
    role: "Public Adjuster",
    defaultView: "claim",
    assignedArea: "Clear Advantage",
    focus: "Urgency review, payments, strategy, and sales follow-up",
    headline: "Your claim work plan starts here.",
  },
  cynthia: {
    id: "cynthia",
    name: "Cynthia",
    email: "cynthia@claimguardians.com",
    role: "Public Adjuster Team",
    defaultView: "documents",
    assignedArea: "Clear Records",
    focus: "New information review, document filing, and customer updates",
    headline: "Review new claim information first.",
  },
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const seedState = {
  activeClaimId: "claim-demo-1",
  claims: [
    {
      id: "claim-demo-1",
      homeowner: "Maya Johnson",
      propertyAddress: "1842 Live Oak Lane, Wilmington, NC",
      phone: "(910) 555-0148",
      email: "maya.johnson@example.com",
      carrier: "Sample Mutual Insurance",
      claimNumber: "NC-WIND-10482",
      policyNumber: "HO-742819",
      lossDate: "2026-04-14",
      lossType: "Wind and roof leak",
      status: "Carrier Review",
      estimatedLoss: 24800,
      lastCarrierContact: "2026-05-10",
    },
  ],
  documents: [
    {
      id: "doc-1",
      claimId: "claim-demo-1",
      name: "Homeowners policy declarations.pdf",
      category: "Policy Documents",
      date: "2026-04-18",
      size: 482000,
      version: 1,
    },
    {
      id: "doc-2",
      claimId: "claim-demo-1",
      name: "Carrier inspection summary.pdf",
      category: "Adjuster Reports",
      date: "2026-05-02",
      size: 316000,
      version: 1,
    },
    {
      id: "doc-3",
      claimId: "claim-demo-1",
      name: "Roof contractor estimate.pdf",
      category: "Contractor Estimates",
      date: "2026-05-06",
      size: 271000,
      version: 1,
    },
  ],
  photos: [
    {
      id: "photo-1",
      claimId: "claim-demo-1",
      name: "Kitchen ceiling stain",
      area: "Kitchen",
      category: "Water Intrusion",
      date: "2026-04-15",
      caption: "Ceiling stain below the roof area after the storm.",
      thumb: "",
    },
    {
      id: "photo-2",
      claimId: "claim-demo-1",
      name: "Missing shingles",
      area: "Roof",
      category: "Roof Damage",
      date: "2026-04-15",
      caption: "Missing shingles visible from the back yard.",
      thumb: "",
    },
  ],
  timeline: [
    {
      id: "event-1",
      claimId: "claim-demo-1",
      date: "2026-04-14",
      type: "Carrier Call",
      contact: "Claims intake",
      responseDue: "",
      notes: "I opened the claim by phone and received the claim number.",
    },
    {
      id: "event-2",
      claimId: "claim-demo-1",
      date: "2026-05-02",
      type: "Inspection",
      contact: "Carrier adjuster",
      responseDue: "2026-05-12",
      notes: "The carrier adjuster inspected the roof, attic, kitchen ceiling, and back bedroom.",
    },
  ],
  inventory: [
    {
      id: "item-1",
      claimId: "claim-demo-1",
      name: "Kitchen table",
      room: "Kitchen",
      age: 4,
      purchasePrice: 650,
      replacementCost: 820,
      serial: "",
      notes: "Water staining on tabletop after ceiling leak.",
    },
    {
      id: "item-2",
      claimId: "claim-demo-1",
      name: "Area rug",
      room: "Living Room",
      age: 3,
      purchasePrice: 300,
      replacementCost: 375,
      serial: "",
      notes: "Moved from kitchen doorway after water intrusion.",
    },
  ],
  policy: {
    coverageA: 325000,
    coverageB: 32500,
    coverageC: 162500,
    coverageD: 65000,
    deductible: 2500,
    policyPeriod: "2026-01-01 to 2027-01-01",
    policyText: "",
    extraction: [],
  },
  drafts: {
    letter: null,
    doi: null,
    policyRequest: null,
  },
};

let state = loadState();
let session = loadSession();

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(seedState);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(seedState), ...parsed };
  } catch {
    return structuredClone(seedState);
  }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return USER_PROFILES[parsed.accountId] ? parsed : null;
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveSession() {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function activeAccount() {
  if (!session) return null;
  return USER_PROFILES[session.accountId] || null;
}

function accountFromEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  return Object.values(USER_PROFILES).find((profile) => profile.email === normalized);
}

function signInAccount(accountId) {
  const profile = USER_PROFILES[accountId];
  if (!profile) return;
  session = { accountId, signedInAt: new Date().toISOString() };
  saveSession();
  applySession({ route: true });
  showToast(`${profile.name} signed in. Routed to ${profile.assignedArea}.`);
}

function signOutAccount() {
  session = null;
  saveSession();
  document.body.classList.remove("staff-authenticated");
  window.location.hash = "";
  const status = $("#authStatus");
  if (status) status.textContent = "Signed out. Log in to view your ClearClaims workspace.";
}

function applySession(options = {}) {
  const profile = activeAccount();
  document.body.classList.toggle("staff-authenticated", Boolean(profile));

  if (!profile) return;

  const labels = {
    sessionStaffName: `${profile.name}`,
    sessionAssignedArea: `${profile.assignedArea}: ${profile.focus}`,
    staffBadgeName: `${profile.role} workspace`,
    staffBadgeArea: `${profile.assignedArea}: ${profile.focus}`,
    authStatus: `${profile.name} is signed in.`,
    accountRoleLabel: `${profile.role} / ${profile.assignedArea}`,
    heroSubtitle: profile.headline,
  };

  Object.entries(labels).forEach(([id, value]) => {
    const element = $(`#${id}`);
    if (element) element.textContent = value;
  });

  if (options.route || !window.location.hash) {
    setView(profile.defaultView);
  }
}

function activeClaim() {
  return state.claims.find((claim) => claim.id === state.activeClaimId) || state.claims[0];
}

function currentClaimRecords(key) {
  const claim = activeClaim();
  return state[key].filter((item) => item.claimId === claim.id);
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function addDays(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addYears(value, years) {
  const date = new Date(`${value}T12:00:00`);
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().slice(0, 10);
}

function daysBetween(start, end = todayIso()) {
  if (!start) return 0;
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  return Math.round((endDate - startDate) / 86400000);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fileSize(size) {
  if (!size) return "0 KB";
  if (size > 1000000) return `${(size / 1000000).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1000))} KB`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("active");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("active"), 2600);
}

function setView(view) {
  $$(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view").forEach((section) => section.classList.toggle("active", section.id === `view-${view}`));
  const activeButton = $(`.nav-button[data-view="${view}"]`);
  $("#viewTitle").textContent = activeButton ? activeButton.textContent.trim() : "ClearClaims";
  window.location.hash = view;
}

function renderAll() {
  renderShell();
  renderClaim();
  renderDocuments();
  renderPhotos();
  renderTimeline();
  renderInventory();
  renderPolicy();
  renderRightsLibrary();
  renderDoi();
  restoreDrafts();
}

function renderShell() {
  const claim = activeClaim();
  $("#sideClaimNumber").textContent = claim.claimNumber || "Claim number pending";
  $("#sideCarrier").textContent = claim.carrier || "Carrier pending";
}

function renderClaim() {
  const claim = activeClaim();
  const form = $("#claimForm");
  Object.entries(claim).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value ?? "";
  });

  $("#claimSnapshotText").textContent = `${claim.homeowner || "Homeowner"} is tracking a ${claim.lossType || "claim"} with ${claim.carrier || "the carrier"}. Estimated loss entered by homeowner: ${formatCurrency(claim.estimatedLoss)}.`;
  $("#claimStatusPill").textContent = claim.status || "Status pending";
  $("#metricDaysSinceLoss").textContent = Math.max(0, daysBetween(claim.lossDate));
  $("#metricDocuments").textContent = currentClaimRecords("documents").length;
  $("#metricTimeline").textContent = currentClaimRecords("timeline").length;
  $("#metricInventory").textContent = formatCurrency(currentClaimRecords("inventory").reduce((sum, item) => sum + Number(item.replacementCost || 0), 0));
  renderDeadlines();
}

function renderDeadlines() {
  const claim = activeClaim();
  const deadlines = [];
  if (claim.lossDate) {
    deadlines.push({
      label: "Proof of loss reference date",
      detail: "60 days from date of loss under NC standard fire policy context.",
      date: addDays(claim.lossDate, 60),
    });
    deadlines.push({
      label: "Suit limitation reference date",
      detail: "Three years from date of loss under NC standard fire policy context.",
      date: addYears(claim.lossDate, 3),
    });
  }

  currentClaimRecords("timeline")
    .filter((event) => event.responseDue)
    .forEach((event) => {
      deadlines.push({
        label: `${event.type} response date`,
        detail: event.contact || "Timeline event",
        date: event.responseDue,
      });
    });

  const list = $("#deadlineList");
  if (!deadlines.length) {
    list.innerHTML = `<div class="empty-state">Add a date of loss or timeline response date to see dates here.</div>`;
    return;
  }

  list.innerHTML = deadlines
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((deadline) => {
      const days = daysBetween(todayIso(), deadline.date);
      const status = days < 0 ? "past" : days <= 7 ? "soon" : "ok";
      const label = days < 0 ? `${Math.abs(days)} days past` : `${days} days`;
      return `
        <div class="deadline-item">
          <div>
            <strong>${escapeHtml(deadline.label)}</strong>
            <p class="micro-copy">${escapeHtml(deadline.detail)} Date: ${formatDate(deadline.date)}</p>
          </div>
          <span class="deadline-badge ${status}">${label}</span>
        </div>
      `;
    })
    .join("");
}

function renderDocuments() {
  const docs = currentClaimRecords("documents").sort((a, b) => b.date.localeCompare(a.date));
  const table = $("#documentTable");
  if (!docs.length) {
    table.innerHTML = `<div class="empty-state">No documents added yet.</div>`;
  } else {
    table.innerHTML = `
      <div class="table-row header"><div>Name</div><div>Type</div><div>Date</div><div>Size</div><div>Action</div></div>
      ${docs
        .map(
          (doc) => `
          <div class="table-row">
            <div><strong>${escapeHtml(doc.name)}</strong><p class="micro-copy">Version ${doc.version || 1}</p></div>
            <div>${escapeHtml(doc.category)}</div>
            <div>${formatDate(doc.date)}</div>
            <div>${fileSize(doc.size)}</div>
            <div><button class="row-action" data-remove="documents" data-id="${doc.id}" title="Remove document" aria-label="Remove ${escapeHtml(doc.name)}"><svg><use href="#i-trash"></use></svg></button></div>
          </div>
        `
        )
        .join("")}
    `;
  }

  const required = ["Policy Documents", "Carrier Correspondence", "Adjuster Reports", "Contractor Estimates", "Invoices & Receipts", "Proof of Loss"];
  $("#documentChecklist").innerHTML = required
    .map((category) => {
      const found = docs.some((doc) => doc.category === category);
      return `<div class="check-item"><strong>${found ? "Added" : "Needed"}</strong><span>${category}</span></div>`;
    })
    .join("");
}

function renderPhotos() {
  const photos = currentClaimRecords("photos").sort((a, b) => b.date.localeCompare(a.date));
  const grid = $("#photoGrid");
  if (!photos.length) {
    grid.innerHTML = `<div class="empty-state">No photos added yet.</div>`;
    return;
  }

  grid.innerHTML = photos
    .map(
      (photo) => `
      <article class="photo-card">
        <div class="photo-visual">
          ${
            photo.thumb
              ? `<img src="${photo.thumb}" alt="${escapeHtml(photo.caption || photo.name)}" />`
              : `<span>${escapeHtml((photo.area || "Photo").slice(0, 18))}</span>`
          }
        </div>
        <div class="photo-body">
          <strong>${escapeHtml(photo.name)}</strong>
          <span class="tag">${escapeHtml(photo.category)}</span>
          <p class="micro-copy">${formatDate(photo.date)} · ${escapeHtml(photo.area || "Area not set")}</p>
          <p>${escapeHtml(photo.caption || "Caption not added.")}</p>
          <button class="row-action" data-remove="photos" data-id="${photo.id}" title="Remove photo" aria-label="Remove ${escapeHtml(photo.name)}"><svg><use href="#i-trash"></use></svg></button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderTimeline() {
  const events = currentClaimRecords("timeline").sort((a, b) => b.date.localeCompare(a.date));
  const list = $("#timelineList");
  if (!events.length) {
    list.innerHTML = `<div class="empty-state">No timeline entries yet.</div>`;
  } else {
    list.innerHTML = events
      .map(
        (event) => `
        <article class="timeline-card">
          <div class="timeline-date">
            <span>${formatDate(event.date)}</span>
            <span class="tag">${escapeHtml(event.type)}</span>
          </div>
          <div>
            <strong>${escapeHtml(event.contact || "No contact listed")}</strong>
            <p>${escapeHtml(event.notes)}</p>
            ${event.responseDue ? `<p class="micro-copy">Response needed by ${formatDate(event.responseDue)}</p>` : ""}
          </div>
          <button class="row-action" data-remove="timeline" data-id="${event.id}" title="Remove event" aria-label="Remove timeline event"><svg><use href="#i-trash"></use></svg></button>
        </article>
      `
      )
      .join("");
  }

  const trackerItems = events.filter((event) => event.responseDue);
  $("#responseTracker").innerHTML = trackerItems.length
    ? trackerItems
        .map((event) => {
          const days = daysBetween(todayIso(), event.responseDue);
          const status = days < 0 ? "past" : days <= 7 ? "soon" : "ok";
          return `
            <div class="response-item">
              <strong>${escapeHtml(event.contact || event.type)}</strong>
              <span class="deadline-badge ${status}">${days < 0 ? `${Math.abs(days)} days past` : `${days} days`}</span>
              <p class="micro-copy">${formatDate(event.responseDue)}</p>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-state">Add response dates to timeline entries to track them here.</div>`;
}

function renderInventory() {
  const items = currentClaimRecords("inventory").sort((a, b) => a.room.localeCompare(b.room));
  const table = $("#inventoryTable");
  if (!items.length) {
    table.innerHTML = `<div class="empty-state">No contents items added yet.</div>`;
    return;
  }

  table.innerHTML = `
    <div class="table-row header"><div>Item</div><div>Room</div><div>Age</div><div>Replacement</div><div>Action</div></div>
    ${items
      .map(
        (item) => `
        <div class="table-row">
          <div><strong>${escapeHtml(item.name)}</strong><p class="micro-copy">${escapeHtml(item.notes || "No notes")}</p></div>
          <div>${escapeHtml(item.room)}</div>
          <div>${Number(item.age || 0)}</div>
          <div>${formatCurrency(item.replacementCost)}</div>
          <div><button class="row-action" data-remove="inventory" data-id="${item.id}" title="Remove item" aria-label="Remove ${escapeHtml(item.name)}"><svg><use href="#i-trash"></use></svg></button></div>
        </div>
      `
      )
      .join("")}
  `;
}

function renderPolicy() {
  Object.entries(state.policy).forEach(([key, value]) => {
    const input = $(`[data-policy="${key}"]`);
    if (input) input.value = value ?? "";
  });
  $("#policyText").value = state.policy.policyText || "";
  renderPolicyExtraction();
  if (!$("#policyExplanation").innerHTML) {
    $("#policyExplanation").innerHTML = `<p>Paste policy language and ask a question to create a plain-language reference note.</p>`;
  }
}

function renderPolicyExtraction() {
  const list = $("#policyExtractionList");
  const extraction = state.policy.extraction || [];
  if (!extraction.length) {
    list.innerHTML = `<div class="empty-state">Upload a dec page or paste policy text to preview extracted limits here.</div>`;
    return;
  }

  list.innerHTML = extraction
    .map(
      (item) => `
      <div class="extraction-item">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.value)}</span>
        <p class="micro-copy">${escapeHtml(item.source || "Prototype extraction")}</p>
      </div>
    `
    )
    .join("");
}

function renderRightsLibrary() {
  const cards = [
    {
      title: "Proof of loss",
      source: "N.C.G.S. § 58-44-16",
      text: "NC standard fire policy language includes a 60-day proof of loss reference. Exact requirements depend on the policy and facts.",
    },
    {
      title: "Carrier denials",
      source: "11 NCAC 4.0401",
      text: "A denial should cite the policy provision used by the carrier. You can ask the carrier to identify the provision and factual basis.",
    },
    {
      title: "DOI complaints",
      source: "NC DOI Consumer Services",
      text: "The DOI can review complaints about claim handling. It cannot act as your lawyer or order a specific claim payment.",
    },
  ];

  $("#rightsLibrary").innerHTML = cards
    .map(
      (card) => `
      <article class="rights-card">
        <strong>${escapeHtml(card.title)}</strong>
        <span class="tag">${escapeHtml(card.source)}</span>
        <p>${escapeHtml(card.text)}</p>
      </article>
    `
    )
    .join("");
}

function renderDoi() {
  const docs = currentClaimRecords("documents");
  const required = [
    ["Full homeowner contact information", Boolean(activeClaim().homeowner && activeClaim().email)],
    ["Insurance company name", Boolean(activeClaim().carrier)],
    ["Policy number", Boolean(activeClaim().policyNumber)],
    ["Claim number", Boolean(activeClaim().claimNumber)],
    ["Date of loss", Boolean(activeClaim().lossDate)],
    ["Chronological summary", currentClaimRecords("timeline").length > 0],
    ["Copy of relevant carrier correspondence", docs.some((doc) => doc.category === "Carrier Correspondence")],
    ["Copy of policy declarations page", docs.some((doc) => doc.category === "Policy Documents")],
  ];

  $("#doiChecklist").innerHTML = required
    .map(([label, complete]) => `<div class="check-item"><strong>${complete ? "Ready" : "Missing"}</strong><span>${label}</span></div>`)
    .join("");

  $("#submissionChannels").innerHTML = [
    ["Online portal", "https://my.ncdoi.com/SA_form/INS_COMPLAINT"],
    ["Mail", "NC DOI Consumer Services, 1201 Mail Service Center, Raleigh, NC 27699-1201"],
    ["Fax", "1-866-848-9856"],
    ["Email", "Verify current NCDOI instructions before sending by email"],
    ["Phone", "1-855-408-1212"],
  ]
    .map(([name, value]) => `<div class="submission-card"><strong>${name}</strong><span>${escapeHtml(value)}</span></div>`)
    .join("");
}

function restoreDrafts() {
  if (state.drafts.letter) renderLetterDraft(state.drafts.letter);
  if (state.drafts.doi) renderDoiDraft(state.drafts.doi);
  if (state.drafts.policyRequest) renderPolicyRequest(state.drafts.policyRequest);
}

function readForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setupEvents() {
  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = readForm(event.currentTarget);
    const profile = accountFromEmail(data.email);
    const status = $("#authStatus");
    if (!profile) {
      status.textContent = "Account not recognized in this prototype. Try a demo email or create an account preview below.";
      return;
    }
    signInAccount(profile.id);
  });

  $$("[data-account-login]").forEach((button) => button.addEventListener("click", () => signInAccount(button.dataset.accountLogin)));

  $("#createAccountForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = readForm(event.currentTarget);
    $("#authStatus").textContent = `${data.name}'s ${data.role} account preview is ready. In production, this role will control the starting workspace after login.`;
    event.currentTarget.reset();
  });

  $("#signOut").addEventListener("click", signOutAccount);

  $$(".nav-button").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $$("[data-jump]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.jump)));

  $("#claimForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const claim = activeClaim();
    Object.assign(claim, readForm(event.currentTarget));
    claim.estimatedLoss = Number(claim.estimatedLoss || 0);
    saveState();
    renderAll();
    showToast("Claim details saved.");
  });

  $("#documentForm").addEventListener("submit", handleDocumentSubmit);
  $("#photoForm").addEventListener("submit", handlePhotoSubmit);
  $("#timelineForm").addEventListener("submit", handleTimelineSubmit);
  $("#inventoryForm").addEventListener("submit", handleInventorySubmit);
  $("#suggestRoomItems").addEventListener("click", handleSuggestItems);
  $("#policyUploadForm").addEventListener("submit", handlePolicyUpload);
  $("#policyRequestForm").addEventListener("submit", handlePolicyRequestSubmit);
  $("#savePolicy").addEventListener("click", handlePolicySave);
  $("#explainPolicyText").addEventListener("click", handlePolicyExplain);
  $("#letterForm").addEventListener("submit", handleLetterSubmit);
  $("#doiForm").addEventListener("submit", handleDoiSubmit);
  $("#doiScreener").addEventListener("change", renderScreenerResult);
  $("#letterCertification").addEventListener("change", updateLetterDownloadState);
  $("#doiCertification").addEventListener("change", updateDoiDownloadState);
  $("#downloadDocumentIndex").addEventListener("click", downloadDocumentIndex);
  $("#downloadEvidencePackage").addEventListener("click", downloadPhotoLog);
  $("#downloadTimeline").addEventListener("click", downloadTimeline);
  $("#downloadInventory").addEventListener("click", downloadInventoryCsv);
  $("#downloadPolicyRequest").addEventListener("click", downloadPolicyRequest);
  $("#downloadLetter").addEventListener("click", downloadLetter);
  $("#downloadDoiPacket").addEventListener("click", downloadDoiPacket);
  $("#exportData").addEventListener("click", () => downloadText("clearclaims-data.json", JSON.stringify(state, null, 2), "application/json"));
  $("#resetDemo").addEventListener("click", resetDemo);

  document.body.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove]");
    if (!removeButton) return;
    const key = removeButton.dataset.remove;
    const id = removeButton.dataset.id;
    state[key] = state[key].filter((item) => item.id !== id);
    saveState();
    renderAll();
    showToast("Removed.");
  });
}

function handleDocumentSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = readForm(form);
  const files = Array.from(form.elements.files.files || []);
  if (!files.length) {
    showToast("Select at least one file.");
    return;
  }
  const claim = activeClaim();
  files.forEach((file) => {
    const existingVersions = state.documents.filter((doc) => doc.claimId === claim.id && doc.name === file.name).length;
    state.documents.push({
      id: makeId("doc"),
      claimId: claim.id,
      name: file.name,
      category: data.category,
      date: data.date || todayIso(),
      size: file.size,
      version: existingVersions + 1,
    });
  });
  form.reset();
  saveState();
  renderAll();
  showToast("Document index updated.");
}

async function handlePhotoSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = readForm(form);
  const files = Array.from(form.elements.photos.files || []);
  if (!files.length) {
    showToast("Select at least one photo.");
    return;
  }
  const claim = activeClaim();
  const photos = await Promise.all(
    files.map(async (file) => ({
      id: makeId("photo"),
      claimId: claim.id,
      name: file.name,
      area: data.area,
      category: data.category,
      date: data.date || todayIso(),
      caption: data.caption,
      thumb: file.size < 850000 ? await fileToDataUrl(file) : "",
    }))
  );
  state.photos.push(...photos);
  form.reset();
  saveState();
  renderAll();
  showToast("Photo log updated.");
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function handleTimelineSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = readForm(form);
  state.timeline.push({
    id: makeId("event"),
    claimId: activeClaim().id,
    date: data.date,
    type: data.type,
    contact: data.contact,
    responseDue: data.responseDue,
    notes: data.notes,
  });
  form.reset();
  saveState();
  renderAll();
  showToast("Timeline entry added.");
}

function handleInventorySubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = readForm(form);
  state.inventory.push({
    id: makeId("item"),
    claimId: activeClaim().id,
    name: data.name,
    room: data.room,
    age: Number(data.age || 0),
    purchasePrice: Number(data.purchasePrice || 0),
    replacementCost: Number(data.replacementCost || 0),
    serial: data.serial,
    notes: data.notes,
  });
  form.reset();
  saveState();
  renderAll();
  showToast("Inventory item added.");
}

function handleSuggestItems(event) {
  event.preventDefault();
  const suggestions = [
    ["Microwave", "Kitchen", 180],
    ["Window blinds", "Kitchen", 220],
    ["Small appliance", "Kitchen", 95],
  ];
  $("#suggestionList").innerHTML = suggestions
    .map(
      ([name, room, amount], index) => `
      <div class="suggestion-item" data-suggestion="${index}">
        <div><strong>${name}</strong><p class="micro-copy">${room} · ${formatCurrency(amount)}</p></div>
        <button class="text-button compact" data-accept-suggestion="${index}"><svg><use href="#i-check"></use></svg><span>Add</span></button>
        <button class="icon-button" data-reject-suggestion="${index}" title="Reject suggestion" aria-label="Reject ${name}"><svg><use href="#i-x"></use></svg></button>
      </div>
    `
    )
    .join("");

  $$("[data-accept-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const [name, room, amount] = suggestions[Number(button.dataset.acceptSuggestion)];
      state.inventory.push({
        id: makeId("item"),
        claimId: activeClaim().id,
        name,
        room,
        age: 0,
        purchasePrice: 0,
        replacementCost: amount,
        serial: "",
        notes: "Added from reviewed suggestion.",
      });
      button.closest(".suggestion-item").remove();
      saveState();
      renderInventory();
      renderClaim();
      showToast("Suggestion added.");
    });
  });

  $$("[data-reject-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".suggestion-item").remove();
      showToast("Suggestion rejected.");
    });
  });
}

function handlePolicySave(event) {
  event.preventDefault();
  $$("[data-policy]").forEach((input) => {
    const key = input.dataset.policy;
    state.policy[key] = input.type === "number" ? Number(input.value || 0) : input.value;
  });
  state.policy.policyText = $("#policyText").value;
  saveState();
  showToast("Policy notes saved.");
}

async function handlePolicyUpload(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = readForm(form);
  const file = form.elements.policyFile.files?.[0];
  let sourceText = data.policyExtractText || "";

  if (file) {
    const safeName = file.name.replace(/\.[^.]+$/, "").replaceAll("_", " ").replaceAll("-", " ");
    sourceText = `${sourceText}\n${safeName}`;
    state.documents.push({
      id: makeId("doc"),
      claimId: activeClaim().id,
      name: file.name,
      category: "Policy Documents",
      date: todayIso(),
      size: file.size,
      version: state.documents.filter((doc) => doc.claimId === activeClaim().id && doc.name === file.name).length + 1,
    });
  }

  const extracted = extractPolicyLimits(sourceText);
  if (!Object.keys(extracted.values).length) {
    state.policy.extraction = [
      {
        label: "No limits detected",
        value: "Try pasting the declarations page text with labels like Coverage A, Coverage B, Coverage C, Coverage D, or Deductible.",
        source: file ? file.name : "Pasted text",
      },
    ];
    saveState();
    renderAll();
    showToast("No policy limits detected.");
    return;
  }

  Object.entries(extracted.values).forEach(([key, value]) => {
    state.policy[key] = value;
  });
  state.policy.extraction = extracted.items;
  state.policy.policyText = sourceText.trim() || state.policy.policyText;
  form.reset();
  saveState();
  renderAll();
  showToast("Policy fields populated for review.");
}

function extractPolicyLimits(sourceText) {
  const text = String(sourceText || "");
  const normalized = text.replace(/\s+/g, " ");
  const patterns = [
    ["coverageA", "Coverage A", /(?:coverage\s*a|dwelling|cov\s*a)[^$0-9]{0,24}\$?\s*([\d,]{3,})/i],
    ["coverageB", "Coverage B", /(?:coverage\s*b|other\s+structures|cov\s*b)[^$0-9]{0,24}\$?\s*([\d,]{3,})/i],
    ["coverageC", "Coverage C", /(?:coverage\s*c|personal\s+property|contents|cov\s*c)[^$0-9]{0,24}\$?\s*([\d,]{3,})/i],
    ["coverageD", "Coverage D", /(?:coverage\s*d|loss\s+of\s+use|additional\s+living\s+expense|ale|cov\s*d)[^$0-9]{0,24}\$?\s*([\d,]{3,})/i],
    ["deductible", "Deductible", /(?:deductible|all\s+peril\s+deductible|wind\s+hail\s+deductible)[^$0-9]{0,24}\$?\s*([\d,]{2,})/i],
  ];
  const items = [];
  const values = {};

  patterns.forEach(([key, label, pattern]) => {
    const match = normalized.match(pattern);
    if (!match) return;
    const value = Number(match[1].replaceAll(",", ""));
    if (!Number.isFinite(value) || value <= 0) return;
    values[key] = value;
    items.push({
      label,
      value: formatCurrency(value),
      source: "Detected from uploaded file name or pasted declarations text",
    });
  });

  const periodMatch = normalized.match(/(?:policy\s+period|effective\s+date|period)[^A-Za-z0-9]{0,20}([A-Za-z0-9, /-]{8,60})/i);
  if (periodMatch) {
    state.policy.policyPeriod = periodMatch[1].trim();
    items.push({
      label: "Policy period",
      value: state.policy.policyPeriod,
      source: "Detected from pasted declarations text",
    });
  }

  return { values, items };
}

function handlePolicyRequestSubmit(event) {
  event.preventDefault();
  const data = readForm(event.currentTarget);
  const claim = activeClaim();
  const recipient = data.recipient || "Claims Representative";
  const baseRequest = data.requestDetails || "Please send me a complete copy of my homeowner policy, including the declarations page, endorsements, exclusions, and all forms that apply to my current policy period.";
  const subject = `Request for complete policy copy${claim.policyNumber ? ` - ${claim.policyNumber}` : ""}`;
  let paragraphs;

  if (data.channel === "text") {
    paragraphs = [
      `Hi ${recipient}, this is ${claim.homeowner || "the policyholder"}. ${baseRequest} My claim number is ${claim.claimNumber || "[claim number]"} and my policy number is ${claim.policyNumber || "[policy number]"}. Please send it to ${claim.email || "[my email]"}. Thank you.`,
    ];
  } else {
    paragraphs = [
      `${claim.homeowner || ""}\n${claim.propertyAddress || ""}\n${claim.email || ""}\n${claim.phone || ""}\n\n${formatDate(todayIso())}`,
      `Subject: ${subject}`,
      `Dear ${recipient},`,
      `I am requesting a complete copy of my homeowner insurance policy for my records. ${baseRequest}`,
      `For reference, my policy number is ${claim.policyNumber || "[policy number]"} and my claim number is ${claim.claimNumber || "[claim number]"}.`,
      "Please send the policy documents to me directly. I am making this request myself.",
      `Sincerely,\n${claim.homeowner || ""}`,
    ];
  }

  const draft = {
    channel: data.channel,
    createdAt: todayIso(),
    paragraphs,
  };
  state.drafts.policyRequest = draft;
  saveState();
  renderPolicyRequest(draft);
  showToast("Policy request created.");
}

function renderPolicyRequest(draft) {
  const preview = $("#policyRequestPreview");
  preview.classList.add("active");
  preview.innerHTML = draft.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`).join("");
  $("#downloadPolicyRequest").disabled = false;
}

function handlePolicyExplain(event) {
  event.preventDefault();
  const text = $("#policyText").value.trim();
  const question = $("#policyQuestion").value.trim();
  state.policy.policyText = text;
  saveState();

  if (!text) {
    $("#policyExplanation").innerHTML = `<p>Paste a policy section first.</p>`;
    return;
  }

  const lower = `${text} ${question}`.toLowerCase();
  let plain = "This language should be read together with the rest of the policy. It may describe a condition, limit, exclusion, or step that affects how a claim is reviewed.";
  if (lower.includes("deduct")) {
    plain = "This text appears to discuss a deductible. A deductible is the amount listed in the policy that is usually applied before payment is calculated.";
  } else if (lower.includes("exclusion") || lower.includes("exclude")) {
    plain = "This text appears to discuss an exclusion. An exclusion describes a type of loss or situation the policy says is not included.";
  } else if (lower.includes("appraisal")) {
    plain = "This text appears to discuss appraisal. Appraisal is commonly used when the homeowner and carrier disagree about the amount of loss, not whether coverage exists.";
  } else if (lower.includes("proof of loss")) {
    plain = "This text appears to discuss proof of loss. A proof of loss is a signed statement and supporting documentation from the policyholder.";
  }

  $("#policyExplanation").innerHTML = `
    <blockquote>${escapeHtml(text.slice(0, 700))}${text.length > 700 ? "..." : ""}</blockquote>
    <p>${escapeHtml(plain)}</p>
    <p class="micro-copy">This note does not decide whether your claim is covered or what the carrier owes.</p>
  `;
}

function handleLetterSubmit(event) {
  event.preventDefault();
  const data = readForm(event.currentTarget);
  const claim = activeClaim();
  const subjectMap = {
    status: "Request for claim status update",
    denial: "Request for written explanation of claim decision",
    payment: "Request for basis of partial payment",
    proof: "Proof of loss submission cover letter",
  };
  const requestLead =
    data.template === "payment"
      ? "I am asking for the basis for the valuation and any documents or policy provisions used to calculate the payment."
      : data.template === "denial"
        ? "I am asking for the specific policy provision and factual basis used for the claim decision."
        : data.template === "proof"
          ? "I am submitting materials for the carrier's review and asking that receipt be confirmed in writing."
          : "I am asking for a written update on the current status of the claim.";

  const paragraphs = [
    {
      text: `${claim.homeowner || "I"}\n${claim.propertyAddress || ""}\n${claim.email || ""}\n${claim.phone || ""}\n\n${formatDate(todayIso())}`,
      flagged: false,
    },
    {
      text: `Re: ${subjectMap[data.template]} for claim ${claim.claimNumber || "[claim number]"}, date of loss ${formatDate(claim.lossDate)}`,
      flagged: false,
    },
    {
      text: `Dear ${data.contact || "Claims Representative"},`,
      flagged: false,
    },
    {
      text: `I am writing about my homeowner insurance claim with ${claim.carrier || "the carrier"}. ${requestLead}`,
      flagged: true,
    },
    {
      text: `Here are the facts as I understand them: ${data.facts}`,
      flagged: true,
    },
    {
      text: `Please provide or explain the following: ${data.request}`,
      flagged: true,
    },
    {
      text: "I am sending this request myself and ask that all responses be provided to me in writing.",
      flagged: false,
    },
    {
      text: "Sincerely,\n" + (claim.homeowner || ""),
      flagged: false,
    },
  ];

  const draft = {
    template: data.template,
    tone: data.tone,
    createdAt: todayIso(),
    paragraphs,
  };
  state.drafts.letter = draft;
  saveState();
  renderLetterDraft(draft);
  showToast("Draft created for homeowner review.");
}

function renderLetterDraft(draft) {
  $("#letterCertification").checked = false;
  $("#letterReview").innerHTML = draft.paragraphs
    .map((paragraph, index) =>
      paragraph.flagged
        ? `<label class="review-item"><input type="checkbox" data-review-line="${index}" /> <span>This statement reflects my own view: "${escapeHtml(paragraph.text.slice(0, 90))}${paragraph.text.length > 90 ? "..." : ""}"</span></label>`
        : ""
    )
    .join("");

  $$("[data-review-line]").forEach((box) => box.addEventListener("change", updateLetterDownloadState));

  $("#letterPreview").classList.add("active");
  $("#letterPreview").innerHTML = `
    <h3>Draft letter preview</h3>
    ${draft.paragraphs
      .map((paragraph) => `<p class="draft-line ${paragraph.flagged ? "flagged" : ""}">${escapeHtml(paragraph.text).replaceAll("\n", "<br />")}</p>`)
      .join("")}
  `;
  updateLetterDownloadState();
}

function updateLetterDownloadState() {
  const reviewBoxes = $$("[data-review-line]");
  const allReviewed = reviewBoxes.length === 0 || reviewBoxes.every((box) => box.checked);
  $("#downloadLetter").disabled = !(state.drafts.letter && allReviewed && $("#letterCertification").checked);
}

function handleDoiSubmit(event) {
  event.preventDefault();
  const data = readForm(event.currentTarget);
  const claim = activeClaim();
  const draft = {
    createdAt: todayIso(),
    paragraphs: [
      `Homeowner: ${claim.homeowner || ""}\nAddress: ${claim.propertyAddress || ""}\nPhone: ${claim.phone || ""}\nEmail: ${claim.email || ""}`,
      `Insurance company: ${claim.carrier || ""}\nPolicy number: ${claim.policyNumber || ""}\nClaim number: ${claim.claimNumber || ""}\nDate of loss: ${formatDate(claim.lossDate)}`,
      `What happened: ${data.whatHappened}`,
      `Carrier action or issue I want reviewed: ${data.carrierIssue}`,
      `Outcome I am asking DOI to review: ${data.requestedOutcome}`,
      "I understand that DOI cannot order a specific claim payment, act as my representative, or provide legal advice.",
    ],
  };
  state.drafts.doi = draft;
  saveState();
  renderDoiDraft(draft);
  showToast("DOI packet preview created.");
}

function renderDoiDraft(draft) {
  $("#doiCertification").checked = false;
  $("#doiPreview").classList.add("active");
  $("#doiPreview").innerHTML = `
    <h3>Complaint packet preview</h3>
    ${draft.paragraphs.map((paragraph) => `<p class="draft-line">${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`).join("")}
  `;
  updateDoiDownloadState();
}

function updateDoiDownloadState() {
  $("#downloadDoiPacket").disabled = !(state.drafts.doi && $("#doiCertification").checked);
}

function renderScreenerResult() {
  const form = $("#doiScreener");
  const data = readForm(form);
  let message = "Answer the questions to see a general readiness note.";
  if (data.filed === "no") {
    message = "Start by filing the claim with your carrier. A DOI complaint usually concerns how a claim was handled after it was filed.";
  } else if (data.written === "no") {
    message = "You may want to request a written explanation or decision first so you have a clear record to attach.";
  } else if (data.records === "no") {
    message = "Gather documents and timeline notes before preparing a complaint package.";
  } else if (data.filed === "yes" && data.written === "yes" && data.records === "yes") {
    message = "You appear to have the basic records needed to organize a DOI complaint package. This is not a recommendation about whether to file.";
  }
  $("#doiScreenerResult").textContent = message;
}

function downloadDocumentIndex() {
  const docs = currentClaimRecords("documents");
  const lines = ["Document Index", "", ...docs.map((doc) => `${formatDate(doc.date)} | ${doc.category} | ${doc.name} | v${doc.version || 1}`)];
  downloadText("document-index.txt", lines.join("\n"));
}

function downloadPhotoLog() {
  const photos = currentClaimRecords("photos");
  const lines = [
    "Photo Log",
    "",
    ...photos.map((photo) => `${formatDate(photo.date)} | ${photo.area} | ${photo.category} | ${photo.name}\nCaption: ${photo.caption || ""}`),
  ];
  downloadText("photo-log.txt", lines.join("\n"));
}

function downloadTimeline() {
  const events = currentClaimRecords("timeline").sort((a, b) => a.date.localeCompare(b.date));
  const lines = [
    "Claim Timeline",
    "",
    ...events.map((event) => `${formatDate(event.date)} | ${event.type} | ${event.contact || ""}\n${event.notes}\nResponse due: ${event.responseDue ? formatDate(event.responseDue) : "Not set"}`),
  ];
  downloadText("claim-timeline.txt", lines.join("\n"));
}

function downloadInventoryCsv() {
  const items = currentClaimRecords("inventory");
  const header = ["Item", "Room", "Age", "Original Cost", "Replacement Estimate", "Model or Serial", "Notes"];
  const rows = items.map((item) => [item.name, item.room, item.age, item.purchasePrice, item.replacementCost, item.serial, item.notes]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  downloadText("contents-inventory.csv", csv, "text/csv");
}

function downloadPolicyRequest() {
  if (!state.drafts.policyRequest) return;
  const filename = state.drafts.policyRequest.channel === "text" ? "policy-request-text.txt" : "policy-request-draft.txt";
  downloadText(filename, state.drafts.policyRequest.paragraphs.join("\n\n"));
}

function downloadLetter() {
  if (!state.drafts.letter) return;
  downloadText("carrier-letter-draft.txt", state.drafts.letter.paragraphs.map((p) => p.text).join("\n\n"));
}

function downloadDoiPacket() {
  if (!state.drafts.doi) return;
  downloadText("doi-complaint-packet.txt", state.drafts.doi.paragraphs.join("\n\n"));
}

function downloadText(filename, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function resetDemo() {
  const confirmed = window.confirm("Reset the local prototype data to the sample claim?");
  if (!confirmed) return;
  state = structuredClone(seedState);
  saveState();
  renderAll();
  showToast("Demo data reset.");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

function init() {
  setupEvents();
  renderAll();
  applySession();
  if (activeAccount()) {
    setView((window.location.hash || `#${activeAccount().defaultView}`).slice(1));
  }
  registerServiceWorker();
}

init();
