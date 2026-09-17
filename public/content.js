/* Long-form page copy (English + Bosnian) and the site identity they refer to.
   ---------------------------------------------------------------------------
   FILL THESE IN — everything in brackets elsewhere comes from here:
     supportUrl : your Ko-fi / Buy Me a Coffee page (leave "" to hide that option)
     paypal     : PayPal.me link or PayPal email ("" to hide)
     bank       : bank details line ("" to hide)
     githubUrl  : repo link ("" to hide the GitHub mentions)
     updated    : date shown as "last changed" on the legal pages
   --------------------------------------------------------------------------- */
(function (global, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else global.SiteContent = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const SITE = {
    name: "RentFree",
    maker: "Edžnan Jusufović",
    email: "edznan.j@gmail.com",
    supportUrl: "",
    paypal: "",
    bank: "",
    githubUrl: "",
    updated: "17. 09. 2026.",
  };

  const CONTENT = {
    bs: {

      privacy: {
        title: "Politika privatnosti",
        showUpdated: true,
        sections: [
          { h: "1. Ko je rukovodilac obrade?", p: [
            `${SITE.name} („aplikacija“) je besplatni alat za izradu CV-jeva. Rukovodilac obrade podataka o ličnosti je: ${SITE.maker}, kontakt: ${SITE.email}.` ] },
          { h: "2. Najvažnije u nekoliko rečenica", ul: [
            "Sve što unesete u aplikaciju — lični podaci, obrazovanje, iskustvo, fotografija — čuva se isključivo u vašem pregledniku, na vašem uređaju. Ne šaljemo ih nama niti trećim licima.",
            "Nemamo registraciju, korisničke naloge, reklame, analitiku niti prodaju podataka.",
            "Ne koristimo kolačiće za praćenje. Koristimo samo tehnički neophodnu lokalnu pohranu preglednika.",
            "Pri učitavanju aplikacije (fontovi, ikone) vaša IP adresa se, kao kod svakog preuzimanja sadržaja s interneta, bilježi kod javnih CDN servisa.",
            "PDF se izrađuje lokalno, u vašem pregledniku — podaci pritom ne napuštaju vaš uređaj." ] },
          { h: "3. Koje podatke obrađujemo?", p: [
            "a) Sadržaj vašeg CV-ja (lokalno, na vašem uređaju). Podatke koje unesete aplikacija čuva u lokalnoj pohrani preglednika (localStorage). Oni napuštaju vaš uređaj samo ako ih sami izvezete i podijelite.",
            "b) Tehnički podaci prilikom posjete. Kada otvorite aplikaciju, preglednik preuzima dijelove aplikacije (fontove, ikone, stilove) s javnih CDN servisa (npr. cdnjs/Cloudflare i Google Fonts). Ti servisi prilikom toga primaju vašu IP adresu i standardne tehničke podatke o pregledniku. Mi nemamo pristup njihovim zapisima. Nakon prvog učitavanja aplikacija radi offline, pa se ovi zahtjevi više ne šalju.",
            "c) Izvoz PDF-a. PDF se izrađuje u vašem pregledniku, naredbom za štampu („Sačuvaj kao PDF“). Podaci pritom ne napuštaju vaš uređaj i ne šalju se nijednom serveru." ] },
          { h: "4. Kolačići i lokalna pohrana", p: [
            "Ne koristimo kolačiće niti slične tehnologije u svrhu praćenja, reklama ili analitike. Koristimo localStorage — tehnički neophodnu pohranu u pregledniku — kako bi se vaš CV i postavke sačuvali između posjeta. Propisi o elektronskoj privatnosti ovakvu nužno potrebnu pohranu izuzimaju iz obaveze traženja saglasnosti, zato na našoj stranici nema banera o kolačićima. Podatke možete obrisati u svakom trenutku: opcijom „Obriši sve“ u aplikaciji ili brisanjem podataka web-lokacije u postavkama vašeg preglednika." ] },
          { h: "5. Svrha i pravna osnova obrade", p: [
            "Podatke obrađujemo isključivo kako bismo: omogućili funkcionalnost aplikacije (čuvanje i uređivanje CV-ja), isporučili sadržaj aplikacije (CDN) i omogućili izradu PDF-a u vašem pregledniku. Pravna osnova je nužnost obrade za pružanje usluge koju ste zatražili (član 6. st. 1. tačka (b) Opće uredbe o zaštiti podataka — GDPR) i naš legitimni interes za ispravno i sigurno funkcionisanje aplikacije (član 6. st. 1. tačka (f) GDPR). Ne vršimo profiliranje niti donosimo automatske odluke." ] },
          { h: "6. Koliko dugo podatke čuvamo", p: [
            "Ne čuvamo podatke o ličnosti na serverima — aplikacija ih uopšte ne šalje na server. Podaci u vašem pregledniku ostaju dok ih sami ne obrišete ili dok ne obrišete podatke preglednika." ] },
          { h: "7. Vaša prava", p: [
            "U skladu s GDPR-om i Zakonom o zaštiti podataka o ličnosti Bosne i Hercegovine, imate pravo na: pristup podacima, ispravku, brisanje („pravo na zaborav“), ograničenje obrade, prenosivost podataka, prigovor obradi, te pravo da povučete saglasnost ako je data. Kako se podaci obrađuju na vašem uređaju, većinu ovih prava ostvarujete neposredno u aplikaciji — pregled, izmjena, izvoz (JSON) i brisanje dostupni su vam u svakom trenutku. Za sve ostalo pišite nam na " + SITE.email + ". Imate i pravo žalbe nadzornom organu (u BiH: Agencija za zaštitu ličnih podataka i slobode pristupa informacijama; u EU: nadležni organ za mjesto vašeg boravka)." ] },
          { h: "8. Prenos podataka u druge države", p: [
            "Aplikacija ne prenosi vaše podatke izvan vašeg uređaja. Jedini izuzetak su CDN servisi iz tačke 3b, koji mogu koristiti infrastrukturu izvan vaše zemlje — ali oni primaju samo zahtjev za datotekama aplikacije, ne i sadržaj vašeg CV-ja." ] },
          { h: "9. Djeca", p: [
            "Aplikacija nije namijenjena osobama mlađim od 16 godina, a budući da ne prikupljamo podatke na serverima, ni namjerno ne prikupljamo njihove podatke." ] },
          { h: "10. Sigurnost", p: [
            "Aplikacija se isporučuje isključivo preko HTTPS-a, a podaci se čuvaju na vašem uređaju. Naša preporuka: povremeno izvezite sigurnosnu kopiju (Račun → Izvezi sve), jer brisanje podataka preglednika ili prelazak na novi uređaj mogu trajno ukloniti vaše podatke — za njih ne postoji server backup." ] },
          { h: "11. Izmjene politike", p: [
            "Povremeno možemo ažurirati ovu politiku. Nadnevak posljednje izmjene uvijek je naveden na vrhu, a značajnije izmjene ćemo istaknuti u aplikaciji." ] },
          { h: "12. Kontakt", p: [
            `Pitanja u vezi privatnosti: ${SITE.maker}, ${SITE.email}.` ] },
        ],
      },

      terms: {
        title: "Uslovi korištenja",
        showUpdated: true,
        sections: [
          { h: "1. Prihvaćanje uslova", p: [`Korištenjem aplikacije ${SITE.name} („aplikacija“) prihvatate ove Uslove korištenja. Ako se s njima ne slažete, molimo da aplikaciju ne koristite.`] },
          { h: "2. Opis usluge", p: ["Aplikacija je besplatni alat za izradu, uređivanje, pregled i izvoz CV-jeva. Radi u vašem pregledniku, a podaci se čuvaju lokalno na vašem uređaju. Moguća je i instalacija kao aplikacija (PWA) i offline korištenje."] },
          { h: "3. Cijena", p: ["Osnovna funkcionalnost aplikacije je besplatna i takvom ostaje."] },
          { h: "4. Vaši podaci i sigurnosne kopije", p: ["Sve što unesete čuva se samo na vašem uređaju. Vi ste isključivo odgovorni za čuvanje vlastitih podataka. Preporučujemo redovni izvoz (Račun → Izvezi sve); brisanje podataka preglednika, ponovna instalacija preglednika ili promjena uređaja mogu dovesti do trajnog gubitka podataka bez mogućnosti oporavka s naše strane."] },
          { h: "5. Tačnost sadržaja", p: ["Vi ste isključivo odgovorni za istinitost i tačnost podataka koje unosite u CV (obrazovanje, iskustvo, kontakti i sl.), kao i za poštivanje prava trećih osoba (npr. pravo na sliku ako ugrađujete fotografiju)."] },
          { h: "6. Prihvatljiva upotreba", p: ["Zabranjeno je koristiti aplikaciju u nezakonite svrhe, za kršenje prava trećih, za navođenje trećih u zabludu lažnim podacima, kao i pokušaje zloupotrebe infrastrukture."] },
          { h: "7. Intelektualno vlasništvo", p: [`Sadržaj u vašem CV-ju pripada vama. Samu aplikaciju (kod, dizajn, naziv) je autorizovao ${SITE.maker}.` + (SITE.githubUrl ? ` Izvorni kod je objavljen na ${SITE.githubUrl}.` : "")] },
          { h: "8. Usluge trećih strana", p: ["Aplikacija koristi javne CDN servise za isporuku fontova i ikona. Na te usluge primjenjuju se uslovi njihovih pružalaca. PDF se izrađuje u vašem pregledniku i ne uključuje nijednu uslugu treće strane."] },
          { h: "9. Odricanje od garancija", p: ["Aplikacija se pruža „onakva kakva jest“ („as is“), bez garantovanja neprekidnog rada, rada bez grešaka ili prikladnosti za određenu svrhu."] },
          { h: "10. Ograničenje odgovornosti", p: [`U najvećem obimu koji zakon dozvoljava, ${SITE.maker} ne odgovara za nikakve štete, uključujući gubitak podataka, izgubljene poslovne prilike ili druge posljedice nastale korištenjem ili nemogućnošću korištenja aplikacije.`] },
          { h: "11. Dostupnost i izmjene", p: ["Aplikaciju možemo poboljšavati, mijenjati, pauzirati ili ukinuti bez prethodne najave. Budući da radi lokalno i offline, većina funkcija ostaje dostupna i nakon toga, na vašem uređaju."] },
          { h: "12. Izmjene uslova", p: ["Izmijenjene uslove objavljujemo na ovoj stranici s novim nadnevkom. Nastavkom korištenja nakon izmjena smatra se da ste ih prihvatili."] },
          { h: "13. Pravo i nadležnost", p: ["Na ove uslove primjenjuje se pravo Bosne i Hercegovine. Sporovi su u nadležnosti sudova u Bosni i Hercegovini."] },
          { h: "14. Kontakt", p: [SITE.email] },
        ],
      },

      about: {
        title: "O nama",
        intro: ["Zdravo! 👋",
          `${SITE.name} je nastao iz jednostavnog razloga: traženje posla je dovoljno naporno, pa izrada CV-ja ne bi smjela biti još jedan problem. Postojeći alati su često pretrpani, traže registraciju, ili — najgore od svega — šalju vaše lične podatke na servere o kojima ništa ne znate.`,
          "Zato smo napravili drugačiji pristup:"],
        points: [
          { b: "Vaši podaci su vaši.", t: "Sve što unesete ostaje u vašem pregledniku, na vašem uređaju. Nema servera, nema naloga, nema praćenja." },
          { b: "Jednostavno je jednostavno.", t: "Unesete podatke — i CV je tu. Bez mnoštva opcija i bez učenja „kako radi“." },
          { b: "Besplatno je besplatno.", t: "Bez skrivenih plaćanja, vodenih žigova ili „premium“ brava na osnovnim stvarima." },
        ],
        outro: [`Iza projekta stoji ${SITE.maker}. Projekt je nastao u slobodno vrijeme i razvija se prema povratnim informacijama korisnika.`,
          "Ako vam je aplikacija koristila, najbolja podrška je da je podijelite s prijateljima koji traže posao ili nam se javite s prijedlogom. A želite li malo više — pogledajte stranicu Podrži projekt."],
        contact: "Kontakt",
      },

      support: {
        title: "Podrži projekt",
        intro: [`${SITE.name} je besplatan i takav će i ostati — bez reklama, bez naloga, bez prodaje podataka.`,
          "Ali „besplatno“ ne znači „bez troškova“: domen, hosting i vrijeme uloženo u razvoj i održavanje plaćaju se iz džepa. Ako vam je aplikacija pomogla da dobijete posao ili barem uštedite nekoliko sati mucenja po šablonima, kupite nam kafu — to je svo terapijsko gorivo koje ovaj projekt dobija. ☕💚"],
        waysTitle: "Načini podrške",
        ways: {
          coffee: "Ko-fi / Buy Me a Coffee",
          paypal: "PayPal",
          bank: "Bankovna uplata",
          free: "Besplatna opcija: podijelite aplikaciju s nekim ko traži posao",
          star: "Ostavite zvijezdicu na GitHubu",
          pending: "Link za podršku još nije objavljen — javite se na " + SITE.email + " ako želite pomoći.",
        },
        goodTitle: "Dobro je znati",
        good: [
          "Podrška je potpuno dobrovoljna — ništa u aplikaciji ne zavisi od toga da li ste platili ili ne.",
          "Sredstva se koriste za troškove infrastrukture i dalji razvoj.",
          "Ukoliko se nešto promijeni, objavit ćemo to ovdje.",
        ],
        thanks: "Hvala vam — i srećno s onim intervjuom! 🚀",
      },
  
    },
    en: {
      privacy: {
        title: "Privacy policy",
        showUpdated: true,
        sections: [
          { h: "1. Who is responsible for the processing?", p: [
            `${SITE.name} (the “app”) is a free CV builder. The controller of your personal data is ${SITE.maker}, contact: ${SITE.email}.` ] },
          { h: "2. The short version", ul: [
            "Everything you enter — personal details, education, experience, photo — is stored only in your browser, on your device. We never send it to us or to anyone else.",
            "There is no sign-up, no account, no ads, no analytics and no selling of data.",
            "We use no tracking cookies. The only storage we use is the technically necessary local storage of your browser.",
            "When the app loads (fonts, icons) your IP address is recorded by public CDN services, exactly as with any download from the internet.",
            "The PDF is produced locally, in your browser — your data never leaves your device." ] },
          { h: "3. What data do we process?", p: [
            "a) Your CV content (locally, on your device). What you type is kept in your browser’s local storage (localStorage). It leaves your device only if you export and share it yourself.",
            "b) Technical data when you visit. When you open the app, your browser downloads parts of the app (fonts, icons, styles) from public CDNs (e.g. cdnjs/Cloudflare and Google Fonts). Those services receive your IP address and standard browser information. We have no access to their logs. After the first load the app works offline, so those requests are no longer made.",
            "c) PDF export. The PDF is created in your browser through the print dialog (“Save as PDF”). Your data does not leave your device and is not sent to any server." ] },
          { h: "4. Cookies and local storage", p: [
            "We use no cookies or similar technologies for tracking, advertising or analytics. We use localStorage — technically necessary browser storage — so that your CV and settings survive between visits. Electronic privacy rules exempt such strictly necessary storage from the consent requirement, which is why there is no cookie banner on our site. You can erase your data at any time: with “Delete everything” in the app, or by clearing site data in your browser settings." ] },
          { h: "5. Purpose and legal basis", p: [
            "We process data only to: make the app work (saving and editing your CV), deliver the app’s content (CDN) and let you produce a PDF in your browser. The legal basis is that processing is necessary to provide the service you asked for (Article 6(1)(b) GDPR) and our legitimate interest in the app working correctly and safely (Article 6(1)(f) GDPR). We do not profile you and make no automated decisions." ] },
          { h: "6. How long we keep data", p: [
            "We keep no personal data on servers — the app never sends it to a server at all. Data in your browser stays until you delete it or clear your browser data." ] },
          { h: "7. Your rights", p: [
            "Under the GDPR and the Law on Protection of Personal Data of Bosnia and Herzegovina you have the right to: access, rectification, erasure (“right to be forgotten”), restriction of processing, data portability, objection to processing, and withdrawal of consent where given. Because the data is processed on your device, you exercise most of these directly in the app — viewing, editing, exporting (JSON) and deleting are always available to you. For anything else, write to " + SITE.email + ". You also have the right to lodge a complaint with a supervisory authority (in BiH: the Agency for the Protection of Personal Data and Freedom of Access to Information; in the EU: the authority for your place of residence)." ] },
          { h: "8. Transfers to other countries", p: [
            "The app does not transfer your data outside your device. The only exception is the CDN services in point 3b, which may use infrastructure outside your country — but they only receive a request for the app’s files, never your CV content." ] },
          { h: "9. Children", p: [
            "The app is not intended for people under 16, and since we collect nothing on servers, we do not knowingly collect their data either." ] },
          { h: "10. Security", p: [
            "The app is served over HTTPS only, and your data is stored on your device. Our advice: export a backup now and then (Account → Export all), because clearing browser data or moving to a new device can permanently remove your data — there is no server backup." ] },
          { h: "11. Changes to this policy", p: [
            "We may update this policy from time to time. The date of the last change is always shown at the top, and significant changes will be highlighted in the app." ] },
          { h: "12. Contact", p: [
            `Privacy questions: ${SITE.maker}, ${SITE.email}.` ] },
        ],
      },

      terms: {
        title: "Terms of use",
        showUpdated: true,
        sections: [
          { h: "1. Accepting the terms", p: [`By using ${SITE.name} (the “app”) you accept these Terms of Use. If you do not agree with them, please do not use the app.`] },
          { h: "2. What the service is", p: ["The app is a free tool for creating, editing, previewing and exporting CVs. It runs in your browser and stores your data locally on your device. It can also be installed as an app (PWA) and used offline."] },
          { h: "3. Price", p: ["The core functionality of the app is free and stays free."] },
          { h: "4. Your data and backups", p: ["Everything you enter is stored only on your device. You are solely responsible for keeping your own data safe. We recommend exporting regularly (Account → Export all); clearing browser data, reinstalling your browser or changing device can lead to permanent loss of data with no way for us to recover it."] },
          { h: "5. Accuracy of content", p: ["You are solely responsible for the truthfulness and accuracy of what you put in your CV (education, experience, contacts and so on), and for respecting the rights of third parties (for example image rights if you embed a photo)."] },
          { h: "6. Acceptable use", p: ["You may not use the app for unlawful purposes, to infringe the rights of others, to mislead others with false information, or to attempt to abuse the infrastructure."] },
          { h: "7. Intellectual property", p: [`The content of your CV belongs to you. The app itself (code, design, name) is the work of ${SITE.maker}.` + (SITE.githubUrl ? ` The source code is published at ${SITE.githubUrl}.` : "")] },
          { h: "8. Third-party services", p: ["The app uses public CDN services to deliver fonts and icons. Those services are governed by their providers’ terms. The PDF is produced in your browser and involves no third-party service."] },
          { h: "9. Disclaimer of warranties", p: ["The app is provided “as is”, without any guarantee of uninterrupted operation, freedom from errors, or fitness for a particular purpose."] },
          { h: "10. Limitation of liability", p: [`To the fullest extent permitted by law, ${SITE.maker} is not liable for any damages, including lost data, lost business opportunities or other consequences arising from the use of, or inability to use, the app.`] },
          { h: "11. Availability and changes", p: ["We may improve, change, pause or discontinue the app without prior notice. Because it runs locally and offline, most of it remains available on your device regardless."] },
          { h: "12. Changes to the terms", p: ["We publish revised terms on this page with a new date. Continuing to use the app after a change means you accept it."] },
          { h: "13. Law and jurisdiction", p: ["These terms are governed by the law of Bosnia and Herzegovina. Disputes fall under the jurisdiction of the courts of Bosnia and Herzegovina."] },
          { h: "14. Contact", p: [SITE.email] },
        ],
      },

      about: {
        title: "About",
        intro: ["Hi there! 👋",
          `${SITE.name} came from a simple observation: job hunting is hard enough, and building a CV should not be one more problem. Existing tools are often cluttered, demand a sign-up, or — worst of all — send your personal details to servers you know nothing about.`,
          "So we took a different approach:"],
        points: [
          { b: "Your data is yours.", t: "Everything you type stays in your browser, on your device. No server, no account, no tracking." },
          { b: "Simple is simple.", t: "You enter your details — and the CV is there. No pile of options, nothing to learn." },
          { b: "Free means free.", t: "No hidden charges, no watermarks, no “premium” locks on the basics." },
        ],
        outro: [`The project is made by ${SITE.maker}. It started in spare time and grows from user feedback.`,
          "If the app helped you, the best support is to share it with friends who are job hunting, or to send us a suggestion. And if you want to do a little more, take a look at the Support the project page."],
        contact: "Contact",
      },

      support: {
        title: "Support the project",
        intro: [`${SITE.name} is free and will stay free — no ads, no accounts, no selling of data.`,
          "But “free” does not mean “costless”: the domain, the hosting and the time spent building and maintaining it come out of one pocket. If the app helped you land a job, or at least saved you a few hours of fighting with templates, buy us a coffee — it is the only fuel this project runs on. ☕💚"],
        waysTitle: "Ways to support",
        ways: {
          coffee: "Ko-fi / Buy Me a Coffee",
          paypal: "PayPal",
          bank: "Bank transfer",
          free: "Free option: share the app with someone who is job hunting",
          star: "Star the project on GitHub",
          pending: "The support link is not published yet — email " + SITE.email + " if you would like to help.",
        },
        goodTitle: "Good to know",
        good: [
          "Support is entirely voluntary — nothing in the app depends on whether you paid or not.",
          "Funds go towards infrastructure costs and further development.",
          "If anything changes, we will post it here.",
        ],
        thanks: "Thank you — and good luck with that interview! 🚀",
      },
    },
  };

  return { SITE, CONTENT };
});
