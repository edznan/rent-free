/* UI strings — English (default) and Bosnian.
   t(lang, key, vars) resolves a string, tn(lang, key, n) picks the plural form.
   Both the interface and the headings printed on the CV use these. */
(function (global, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else global.I18n = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const DEFAULT_LANG = "en";

  /* English first: it is what a first visit shows. */
  const LANGS = [
    { code: "en", label: "English", locale: "en-US" },
    { code: "bs", label: "Bosanski", locale: "bs-BA" },
  ];

  const DICT = {
    en: {
      /* app chrome */
      "app.title": "RentFree",
      "app.error.title": "Screen error",
      "app.error.home": "Go home",
      "nav.home": "Home",
      "nav.new": "New resume",
      "nav.settings": "Settings",
      "nav.account": "Account",

      /* resume section labels (printed on the CV itself) */
      "resume.contact": "Contact",
      "resume.hobbies": "Hobbies",
      "resume.languages": "Languages",
      "resume.license": "Driving license",
      "resume.summary": "Summary",
      "resume.education": "Education",
      "resume.experience": "Experience",
      "resume.skills": "Skills",

      /* home */
      "home.title": "Home",
      "home.count.one": "{n} resume",
      "home.count.few": "{n} resumes",
      "home.count.many": "{n} resumes",
      "home.welcome": "Welcome",
      "home.welcomeSub": "Create your resume — it takes a few minutes.",
      "home.create": "Create your resume",
      "home.localOnly": "Everything stays on this device.",

      /* resume list */
      "resumes.new": "New",
      "resumes.confirmDelete": "Delete this resume?",

      /* edit form */
      "form.title": "Edit",
      "form.saved": "Saved ✓",
      "form.basics": "The basics",
      "form.fullName": "Full name",
      "form.role": "Role / subtitle",
      "form.summary": "Summary",
      "form.contact": "Contact",
      "form.phone": "Phone",
      "form.email": "Email",
      "form.location": "Location",
      "form.education": "Education",
      "form.degree": "Degree",
      "form.school": "School",
      "form.addEducation": "Add education",
      "form.experience": "Experience",
      "form.expRole": "Role",
      "form.company": "Company",
      "form.period": "Period",
      "form.description": "Description",
      "form.bulletList": "Bullet list",
      "form.descHint": "Each line starting with - or • becomes a bullet point in the PDF.",
      "form.iconPick": "Choose an icon",
      "form.iconNone": "No icons match.",
      "form.tags": "Tags (comma separated)",
      "form.addExperience": "Add experience",
      "form.skills": "Skills",
      "form.skillsHint": "Comma separated — 4 per row on the page.",
      "form.more": "More options (optional)",
      "form.photo": "Photo",
      "form.photoUrl": "…or image URL",
      "form.languages": "Languages",
      "form.language": "Language",
      "form.level": "Level",
      "form.addLanguage": "Add language",
      "form.hobbies": "Hobbies",
      "form.icon": "Icon",
      "form.label": "Label",
      "form.addHobby": "Add hobby",
      "form.license": "Driving license",
      "form.sideSections": "Sidebar sections",
      "form.mainSections": "Main page sections",
      "form.addSection": "Add section",
      "form.sectionTitle": "Title",
      "form.lines": "Lines",
      "form.line": "Line",

      /* sidebar + secondary pages */
      "nav.more": "More",
      "drawer.title": "More",
      "drawer.close": "Close",
      "drawer.about": "About",
      "drawer.contact": "Contact",
      "drawer.support": "Support the project",
      "drawer.terms": "Terms of use",
      "drawer.privacy": "Privacy",
      "contact.title": "Contact",
      "contact.p1": "Found a bug, or have a suggestion? Get in touch.",
      "contact.p2": "If this app saved you time, you can support its development.",
      "contact.emailBtn": "Send an email",
      "contact.githubBtn": "GitHub",
      "doc.updated": "Last changed: {date}",

      /* print + install */
      "print.hint": "In the print dialog choose “Save as PDF”.",
      "print.blocked": "Couldn’t open the print dialog. Allow pop-ups for this site and try again.",
      "install.title": "Install the app",
      "install.body": "Add RentFree to your home screen — it opens full screen and works offline.",
      "install.iosBody": "Tap the Share button in Safari, then choose “Add to Home Screen”.",
      "install.cta": "Install",
      "install.later": "Not now",
      "install.done": "App installed ✓",
      "install.unavailable": "This browser can’t install the app — you can keep using it in the browser.",
      "install.action": "Install app",

      "resume.tags": "Tags",

      /* templates */
      "templates.title": "Choose a template",
      "templates.hint": "Pick how your CV should read. You can switch at any time — your details stay exactly as they are.",
      "templates.change": "Template",
      "templates.current": "Selected",
      "tpl.group.ats": "Compatibility with structured recruiting systems.",
      "tpl.group.human": "Visual scanning by recruiters and hiring managers.",
      "tpl.group.hybrid": "A balance of structured parsing and visual reading.",
      "tpl.ats.classic": "Letter-spaced name, plain caps headings, contact details on one line.",
      "tpl.ats.precise": "Centred header with an accent rule, thin rules between sections, dates on the right.",
      "tpl.ats.executive": "Large centred name and grey caps headings on simple lines.",
      "tpl.ats.uncluttered": "Sentence-case headings and generous spacing: the plainest reading order.",
      "tpl.ats.editorial": "Left-aligned serif name, ruled section headings, wide margins.",
      "tpl.ats.expressive": "Oversized serif name and centred headings, still a single plain column.",
      "tpl.human.sidebar": "Dark sidebar with a round photo and framed section headings.",
      "tpl.human.accent": "The sidebar takes your accent colour, with a diagonal detail behind it.",
      "tpl.human.airy": "Light sidebar, dark text and accent headings: the softest of the set.",
      "tpl.human.portrait": "Photo and name in a full-width band above a dark sidebar.",
      "tpl.human.midnight": "Near-black sidebar with a dotted texture and outline icons.",
      "tpl.human.bold": "Reversed name in an accent band, with bold skill chips.",
      "tpl.hybrid.blend": "Soft tinted header band, labelled contact details, accented headings.",
      "tpl.hybrid.frame": "A fine accent frame around the page with bar-accented headings.",
      "tpl.hybrid.atlas": "Photo beside the name, contact as label and value pairs, ruled sections.",
      "tpl.hybrid.meridian": "Centred name with wide letter-spacing and heavier section rules.",
      "tpl.hybrid.slate": "Grey header band, accent-bar headings, compact single column.",
      "tpl.hybrid.tower": "Centred caps name, thick accent rule, label and value contact block.",

      /* preview */
      "preview.title": "Preview",
      "preview.empty": "Nothing to preview yet.",
      "preview.create": "Create one",
      "preview.note": "This is exactly what the PDF will look like (A4).",

      /* settings */
      "settings.title": "Settings",
      "settings.language": "Language",
      "settings.languageNote": "Changes the app language and the section labels printed on your resume.",
      "settings.langDone": "Language changed",
      "settings.font": "Font",
      "settings.accent": "Accent color",
      "settings.sideBg": "Sidebar color",
      "settings.layout": "Layout",
      "settings.multipage": "Allow multiple pages (off = auto-shrink to fit one A4 page)",
      "settings.support": "Support",
      "settings.supportNote": "RentFree is free and has no ads. If it helped you, you can support its development.",
      "settings.reset": "Reset",
      "settings.resetBtn": "Reset to defaults",
      "settings.resetNote": "Applies to all your resumes.",
      "settings.confirmReset": "Reset font and colors to defaults?",
      "settings.resetDone": "Settings reset",

      /* account */
      "account.title": "Account",
      "account.profile": "Profile",
      "account.profileNote": "Used as defaults for new resumes.",
      "account.name": "Name",
      "account.email": "Email",
      "account.data": "Your data",
      "account.export": "Export all",
      "account.import": "Import",
      "account.wipe": "Delete everything",
      "account.privacy": "All data stays on this device. Nothing is uploaded anywhere.",
      "account.confirmWipe": "Delete ALL resumes and settings? This cannot be undone.",
      "account.wiped": "Everything deleted",
      "account.imported": "Imported ✓",
      "account.importFailed": "Import failed: {msg}",
      "migrate.imported": "Imported your existing resume",

      /* relative time */
      "time.now": "just now",
      "time.min": "{n}m ago",
      "time.hour": "{n}h ago",
      "time.day": "{n}d ago",
      "time.updated": "Updated {when}",

      /* common */
      "common.back": "Back",
      "common.edit": "Edit",
      "common.preview": "Preview",
      "common.pdf": "PDF",
      "common.untitled": "Untitled",

      /* placeholders / examples */
      "ph.name": "Jane Doe",
      "ph.role": "Your profession or title",
      "ph.summary": "A short paragraph about you…",
      "ph.phone": "+387 …",
      "ph.email": "you@mail.com",
      "ph.location": "City, Country",
      "ph.degree": "Degree or qualification",
      "ph.school": "School or institution",
      "ph.expRole": "Job title",
      "ph.period": "2022 – Now",
      "ph.tags": "e.g. teamwork, driving licence",
      "ph.skills": "e.g. communication, organisation, Excel",
      "ph.level": "Fluent",
      "ph.license": "Category B",
    },

    bs: {
      /* app chrome */
      "app.title": "RentFree",
      "app.error.title": "Greška ekrana",
      "app.error.home": "Na početnu",
      "nav.home": "Početna",
      "nav.new": "Novi CV",
      "nav.settings": "Postavke",
      "nav.account": "Račun",

      /* resume section labels (printed on the CV itself) */
      "resume.contact": "Kontakt",
      "resume.hobbies": "Hobiji",
      "resume.languages": "Jezici",
      "resume.license": "Vozačka dozvola",
      "resume.summary": "Sažetak",
      "resume.education": "Obrazovanje",
      "resume.experience": "Iskustvo",
      "resume.skills": "Vještine",

      /* home */
      "home.title": "Početna",
      "home.count.one": "{n} CV",
      "home.count.few": "{n} CV-a",
      "home.count.many": "{n} CV-ova",
      "home.welcome": "Dobrodošli",
      "home.welcomeSub": "Kreirajte svoj CV — potrebno je samo nekoliko minuta.",
      "home.create": "Kreirajte svoj CV",
      "home.localOnly": "Sve ostaje na ovom uređaju.",

      /* resume list */
      "resumes.new": "Novi",
      "resumes.confirmDelete": "Obrisati ovaj CV?",

      /* edit form */
      "form.title": "Uredi",
      "form.saved": "Sačuvano ✓",
      "form.basics": "Osnovni podaci",
      "form.fullName": "Ime i prezime",
      "form.role": "Zanimanje / podnaslov",
      "form.summary": "Sažetak",
      "form.contact": "Kontakt",
      "form.phone": "Telefon",
      "form.email": "Email",
      "form.location": "Lokacija",
      "form.education": "Obrazovanje",
      "form.degree": "Stepen obrazovanja",
      "form.school": "Škola",
      "form.addEducation": "Dodaj obrazovanje",
      "form.experience": "Iskustvo",
      "form.expRole": "Pozicija",
      "form.company": "Firma",
      "form.period": "Period",
      "form.description": "Opis",
      "form.bulletList": "Lista s tačkama",
      "form.descHint": "Svaki red koji počinje s - ili • postaje tačka u PDF-u.",
      "form.iconPick": "Odaberi ikonu",
      "form.iconNone": "Nema ikona koje odgovaraju.",
      "form.tags": "Oznake (odvojene zarezom)",
      "form.addExperience": "Dodaj iskustvo",
      "form.skills": "Vještine",
      "form.skillsHint": "Odvojeno zarezom — 4 u redu na stranici.",
      "form.more": "Dodatne opcije (opcionalno)",
      "form.photo": "Fotografija",
      "form.photoUrl": "…ili URL slike",
      "form.languages": "Jezici",
      "form.language": "Jezik",
      "form.level": "Nivo",
      "form.addLanguage": "Dodaj jezik",
      "form.hobbies": "Hobiji",
      "form.icon": "Ikona",
      "form.label": "Naziv",
      "form.addHobby": "Dodaj hobi",
      "form.license": "Vozačka dozvola",
      "form.sideSections": "Sekcije u bočnoj traci",
      "form.mainSections": "Sekcije na glavnoj stranici",
      "form.addSection": "Dodaj sekciju",
      "form.sectionTitle": "Naslov",
      "form.lines": "Redovi",
      "form.line": "Red",

      /* sidebar + secondary pages */
      "nav.more": "Više",
      "drawer.title": "Više",
      "drawer.close": "Zatvori",
      "drawer.about": "O aplikaciji",
      "drawer.contact": "Kontakt",
      "drawer.support": "Podrži projekt",
      "drawer.terms": "Uslovi korištenja",
      "drawer.privacy": "Privatnost",
      "contact.title": "Kontakt",
      "contact.p1": "Našli ste grešku ili imate prijedlog? Javite se.",
      "contact.p2": "Ako vam je aplikacija uštedjela vrijeme, možete podržati njen razvoj.",
      "contact.emailBtn": "Pošalji email",
      "contact.githubBtn": "GitHub",
      "doc.updated": "Posljednja izmjena: {date}",

      /* print + install */
      "print.hint": "U dijalogu za štampu odaberite „Sačuvaj kao PDF“.",
      "print.blocked": "Nije moguće otvoriti dijalog za štampu. Dozvolite iskačuće prozore za ovu stranicu i pokušajte ponovo.",
      "install.title": "Instaliraj aplikaciju",
      "install.body": "Dodaj RentFree na početni ekran — otvara se preko cijelog ekrana i radi offline.",
      "install.iosBody": "U Safariju dodirnite dugme Podijeli, pa odaberite „Dodaj na početni ekran“.",
      "install.cta": "Instaliraj",
      "install.later": "Ne sada",
      "install.done": "Aplikacija instalirana ✓",
      "install.unavailable": "Vaš preglednik ne podržava instalaciju — aplikaciju možete i dalje koristiti u pregledniku.",
      "install.action": "Instaliraj aplikaciju",

      "resume.tags": "Oznake",

      /* templates */
      "templates.title": "Odaberite template",
      "templates.hint": "Odaberite kako će vaš CV izgledati. Možete ga promijeniti u svakom trenutku — podaci ostaju nepromijenjeni.",
      "templates.change": "Template",
      "templates.current": "Odabrano",
      "tpl.group.ats": "Kompatibilnost sa strukturiranim regrutnim sistemima.",
      "tpl.group.human": "Vizuelno pregledanje — za regrutere i menadžere.",
      "tpl.group.hybrid": "Ravnoteža između strukturiranog čitanja i vizuelnog pregleda.",
      "tpl.ats.classic": "Ime s razmaknutim slovima, naslovi velikim slovima, kontakt u jednom redu.",
      "tpl.ats.precise": "Centrirano zaglavlje s akcentnom linijom, tanke linije između sekcija, datumi desno.",
      "tpl.ats.executive": "Veliko centrirano ime i sivi naslovi velikim slovima na jednostavnim redovima.",
      "tpl.ats.uncluttered": "Naslovi malim slovima i prostran raspored: najčišći redoslijed čitanja.",
      "tpl.ats.editorial": "Serifno ime uz lijevu marginu, podvučeni naslovi sekcija, široke margine.",
      "tpl.ats.expressive": "Veliko serifno ime i centrirani naslovi, i dalje jedna obična kolona.",
      "tpl.human.sidebar": "Tamna bočna traka, okrugla fotografija i uokvireni naslovi sekcija.",
      "tpl.human.accent": "Bočna traka u vašoj akcentnoj boji, s dijagonalnim detaljem u pozadini.",
      "tpl.human.airy": "Svijetla bočna traka, tamni tekst i akcentni naslovi: najmekša varijanta.",
      "tpl.human.portrait": "Fotografija i ime u traci pune širine iznad tamne bočne trake.",
      "tpl.human.midnight": "Gotovo crna bočna traka s točkastom teksturom i obrisnim ikonama.",
      "tpl.human.bold": "Ime u akcentnoj traci i istaknute oznake vještina.",
      "tpl.hybrid.blend": "Mekana tonirana traka zaglavlja, označeni kontakt podaci, akcentni naslovi.",
      "tpl.hybrid.frame": "Tanki akcentni okvir oko stranice i naslovi s akcentnom crtom.",
      "tpl.hybrid.atlas": "Fotografija uz ime, kontakt kao parovi naziv/vrijednost, podvučene sekcije.",
      "tpl.hybrid.meridian": "Centrirano ime sa širokim razmakom slova i debljim linijama sekcija.",
      "tpl.hybrid.slate": "Siva traka zaglavlja, naslovi s akcentnom crtom, kompaktna kolona.",
      "tpl.hybrid.tower": "Centrirano ime velikim slovima, debela akcentna linija, kontakt kao parovi.",

      /* preview */
      "preview.title": "Pregled",
      "preview.empty": "Još nema ničega za pregled.",
      "preview.create": "Kreirajte CV",
      "preview.note": "Ovako će tačno izgledati PDF (A4).",

      /* settings */
      "settings.title": "Postavke",
      "settings.language": "Jezik",
      "settings.languageNote": "Mijenja jezik aplikacije i nazive sekcija koji se ispisuju u vašem CV-u.",
      "settings.langDone": "Jezik promijenjen",
      "settings.font": "Font",
      "settings.accent": "Boja akcenta",
      "settings.sideBg": "Boja bočne trake",
      "settings.layout": "Raspored",
      "settings.multipage": "Dozvoli više stranica (isključeno = automatsko smanjivanje da stane na jednu A4 stranicu)",
      "settings.support": "Podrška",
      "settings.supportNote": "RentFree je besplatan i bez reklama. Ako vam je pomogao, možete podržati njegov razvoj.",
      "settings.reset": "Resetovanje",
      "settings.resetBtn": "Vrati na zadane vrijednosti",
      "settings.resetNote": "Primjenjuje se na sve vaše CV-ove.",
      "settings.confirmReset": "Vratiti font i boje na zadane vrijednosti?",
      "settings.resetDone": "Postavke resetovane",

      /* account */
      "account.title": "Račun",
      "account.profile": "Profil",
      "account.profileNote": "Koristi se kao zadano za nove CV-ove.",
      "account.name": "Ime",
      "account.email": "Email",
      "account.data": "Vaši podaci",
      "account.export": "Izvezi sve",
      "account.import": "Uvezi",
      "account.wipe": "Obriši sve",
      "account.privacy": "Svi podaci ostaju na ovom uređaju. Ništa se nigdje ne šalje.",
      "account.confirmWipe": "Obrisati SVE CV-ove i postavke? Ovo se ne može poništiti.",
      "account.wiped": "Sve je obrisano",
      "account.imported": "Uvezeno ✓",
      "account.importFailed": "Uvoz nije uspio: {msg}",
      "migrate.imported": "Uvezen je vaš postojeći CV",

      /* relative time */
      "time.now": "upravo sad",
      "time.min": "prije {n} min",
      "time.hour": "prije {n} h",
      "time.day": "prije {n} d",
      "time.updated": "Ažurirano {when}",

      /* common */
      "common.back": "Nazad",
      "common.edit": "Uredi",
      "common.preview": "Pregled",
      "common.pdf": "PDF",
      "common.untitled": "Bez naslova",

      /* placeholders / examples */
      "ph.name": "Amina Hodžić",
      "ph.role": "Vaše zanimanje ili titula",
      "ph.summary": "Kratak pasus o vama…",
      "ph.phone": "+387 …",
      "ph.email": "vi@mail.com",
      "ph.location": "Grad, Država",
      "ph.degree": "Stepen ili kvalifikacija",
      "ph.school": "Škola ili ustanova",
      "ph.expRole": "Naziv pozicije",
      "ph.period": "2022 – danas",
      "ph.tags": "npr. timski rad, vozačka dozvola",
      "ph.skills": "npr. komunikacija, organizacija, Excel",
      "ph.level": "Tečno",
      "ph.license": "Kategorija B",
    },
  };

  /** Coerce anything (e.g. "bs-BA", null) into a supported code. */
  function normalizeLang(value) {
    const code = String(value ?? "").trim().toLowerCase().slice(0, 2);
    return Object.prototype.hasOwnProperty.call(DICT, code) ? code : DEFAULT_LANG;
  }

  /** Plural form for a count: Bosnian has three, English two. */
  function form(lang, n) {
    if (lang !== "bs") return Math.abs(n) === 1 ? "one" : "many";
    const i = Math.abs(Math.trunc(n)) % 100;
    const j = i % 10;
    if (i === 1 || j === 1) return i === 11 ? "many" : "one";
    if (j >= 2 && j <= 4 && !(i >= 12 && i <= 14)) return "few";
    return "many";
  }

  /** Translate a key into a language, interpolating {placeholders} from vars. */
  function t(lang, key, vars) {
    const code = normalizeLang(lang);
    let out = DICT[code][key];
    if (out === undefined) out = DICT[DEFAULT_LANG][key];
    if (out === undefined) return key; // loud in the UI, never a crash
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] == null ? m : String(vars[k])));
    return out;
  }

  /** Count-aware translate: uses <key>.one|.few|.many, interpolating {n}. */
  function tn(lang, key, n) {
    const code = normalizeLang(lang);
    const exact = key + "." + form(code, n);
    return t(code, DICT[code][exact] !== undefined ? exact : key + ".many", { n: n });
  }

  /** BCP-47 locale for dates. */
  function locale(lang) {
    const hit = LANGS.find((l) => l.code === normalizeLang(lang));
    return hit ? hit.locale : "en-US";
  }

  return { DEFAULT_LANG, LANGS, DICT, t, tn, locale, normalizeLang };
});
