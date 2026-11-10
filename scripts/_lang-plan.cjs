// Batch plan per language: which pages are built in which batch, how each page is selected from the bank (relevance regex) and the guard words.
// dePath = the internal (German) route that renders the page; url = the public URL in the language; mapUrl = entry in data/keywords/<lang>.json.
const E = '(é|e)lectri|assistance|vae';
module.exports = {
  fr: {
    floor: 50,
    vocab: 'velo|velos|electrique|electriques|vtt|vtc|vae|e|bike|bikes|ebike|ebikes|assistance|femme|homme|enfant|enfants|pas|cher|prix|meilleur|meilleurs|acheter|achat|boutique|magasin|en|ligne|pour|de|du|des|d|la|le|les|un|une|et|ville|route|gravel|cargo|pliant|pliable|trekking|montagne|tout|terrain|suspendu|semi|rigide|moteur|batterie|autonomie|gamme|modele|modeles|collection|promo|soldes|comparatif|vente|catalogue|magasins|bicyclette|speed|pedelec|fat|cadre|bas',
    elec: '(é|e)lectri|assistance|\bvae\b|vtt ?ae|pedelec|e.?bike',
    brands: '(cube|scott|ktm|giant|orbea|trek|haibike|specialized|kalkhoff|gazelle|bosch|shimano|yamaha|cannondale|focus|winora|flyer|hercules|brompton|\bliv\b|riese|stromer|kettler|conway|babboe|tenways|nakamura|granville|vespa|moustache|cowboy|btwin)',
    guard: '(occasion|reconditionn|location|louer|leasing|\\btest\\b|\\bavis\\b|notice|manuel|nakamura|decathlon|d[ée]cathlon|\\b20(19|2[0-5])\\b|gratuit|pi[èe]ces? d[ée]tach|troc|leboncoin|trott?inette|spinning|appartement)',
    notSold: '(bianchi|lapierre|canyon|fiido|moustache|btwin|rockrider|elops|riverside|vanmoof|cowboy|victoria|bh bikes?|decathlon)',
    batches: {
      batch1: [
        { display: "Prix d'un VTT électrique", url: '/velos-electriques/vtt-electrique/', dePath: '/e-bikes/e-mountainbikes', mapUrl: '/velos-electriques/vtt-electrique/', name: 'VTT électriques', rel: '(vtt|fat bike|tout.suspendu|semi.rigide|enduro)', exclude: '(femme|homme|enfant|nakamura)' },
        { display: "Vélo cargo pas cher", url: '/velos-electriques/velo-cargo-electrique/', dePath: '/e-bikes/cargo-bikes', mapUrl: '/velos-electriques/velo-cargo-electrique/', name: 'Vélos cargo électriques', needElectric: false, rel: '(cargo|biporteur|triporteur|longtail)', exclude: '(enfant|nakamura|paris|lyon)' },
        { display: "VTC électrique", url: '/velos-electriques/velo-electrique-ville/', dePath: '/e-bikes/city-e-bikes', mapUrl: '/velos-electriques/velo-electrique-ville/', name: 'Vélos électriques de ville', rel: '(vtc|ville|urbain|citadin)', exclude: '(femme|homme|enfant|nakamura)' },
        { display: "Vélo électrique pliable pas cher", url: '/velos-electriques/velo-electrique-pliant/', dePath: '/e-bikes/falt-e-bikes', mapUrl: '/velos-electriques/velo-electrique-pliant/', name: 'Vélos électriques pliants', rel: '(pliant|pliable|pliage)', exclude: '(femme|homme|enfant|nakamura)' },
        { display: "Speed bike 45 km/h", url: '/velos-electriques/speed-pedelec/', dePath: '/e-bikes/s-pedelec', mapUrl: '/velos-electriques/speed-pedelec/', name: 'Speed pedelec (45 km/h)', needElectric: false, rel: '(45 ?km|speed pedelec|s-pedelec)', exclude: '(fat bike|nakamura)' },
        { display: "Vélo électrique pour route", url: '/velos-electriques/velo-electrique-gravel-route/', dePath: '/e-bikes/e-rennrad-gravel', mapUrl: '/velos-electriques/velo-electrique-gravel-route/', name: 'Vélos électriques gravel et route', rel: '(gravel|route|course|cyclocross)', exclude: '(femme|homme|enfant|nakamura)' },
        { display: "Vélo électrique pour enfant", url: '/velos-electriques/velo-electrique-enfant/', dePath: '/e-bikes/kinder-jugend', mapUrl: '/velos-electriques/velo-electrique-enfant/', name: 'Vélos électriques enfant', rel: '(enfant|junior|ado\\b|adolescent)', exclude: '(porte|cargo|si[èe]ge|nakamura)' },
        { display: "Vélo assistance électrique femme", url: '/velos-electriques/velo-electrique-femme/', dePath: '/e-bikes/damen', mapUrl: '/velos-electriques/velo-electrique-femme/', name: 'Vélos électriques femme', rel: '(femme|dame|cadre bas)', exclude: '(nakamura|enfant)' },
        { display: "Meilleur vélo électrique homme", url: '/velos-electriques/velo-electrique-homme/', dePath: '/e-bikes/herren', mapUrl: '/velos-electriques/velo-electrique-homme/', name: 'Vélos électriques homme', rel: '\\bhomme\\b', exclude: '(nakamura|enfant)' },
        { display: "Moteur de vélo électrique", url: '/velos-electriques/moteur-batterie/', dePath: '/e-bikes/motor-antrieb', mapUrl: '/velos-electriques/moteur-batterie/', name: 'Moteur et batterie', rel: '(moteur|autonomie|p[ée]dalier)', exclude: '(kit|conversion|roue arri|nakamura|trottinette|moto\\b)' },
      ]
    }
  }
};
