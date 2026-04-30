window.WEDDING_CONFIG = {
  meta: {
    title: "Punitha Neerattu & Kathu Kuthu Vizha",
    description: "A traditional Tamil celebration invitation."
  },

  couple: {
    partnerOne: " Vetrimaran ",   // 🔥 keep but empty (prevents crash)
    partnerTwo: "Vino Sri",
    monogram: "",
    eyebrow: "Kathu Kuthu & Punitha Neerattu Vizha"
  },

  event: {
    dateDisplay: "May 3, 2026",
    dateBadge: "03 May 2026",
    weekday: "Sunday",
    timeDisplay: "12:00 PM",         // 🔥 REQUIRED
    timeDetail: "From 12:00 PM onwards", // 🔥 REQUIRED
    venueName: "Sri Lakshmi Mahal",
    venueCity: "Anankur Road, Kumarapalayam",
    venueRegion: "Erode, Tamil Nadu"
  },

  intro: {
    subtitle: "A sacred Tamil tradition",
    swipeLabel: "Slide to enter",
    successLabel: "Welcome",
    unlockAriaLabel: "Unlock invitation",
    video: {
      sources: [
        { src: "assets/videos/intro.mp4", type: "video/mp4" }
      ]
    },
    particleCount: 20
  },

  hero: {
    dateSeparator: " · ",
    scrollHint: "Scroll to explore"
  },

  details: {
    tag: "The Celebration",
    titleHtml: "Join us for<br>the <em>function</em>",
    featuredIndex: 1,
    cards: [
      {
        icon: "calendar",
        label: "Date",
        valueLines: ["May 3", "2026"],
        sub: "Sunday"
      },
      {
        icon: "clock",
        label: "Time",
        valueLines: ["12:00 PM"],
        sub: "Onwards"
      },
      {
        icon: "pin",
        label: "Venue",
        valueLines: ["Sri Lakshmi Mahal"],
        sub: "Anankur Road, Kumarapalayam"
      }
    ]
  },

  gallery: {
    tag: "Moments",
    titleHtml: "Captured <em>moments</em>",
    speed: 0, // 🔥 disable old marquee
    items: [
      { src: "assets/images/gallery/img5.jpg", alt: "", caption: "" },
      { src: "assets/images/gallery/img6.jpg", alt: "", caption: "" },
      { src: "assets/images/gallery/img7.jpg", alt: "", caption: "" },
      { src: "assets/images/gallery/img1.jpg", alt: "", caption: "" },
      { src: "assets/images/gallery/img2.jpg", alt: "", caption: "" },
      { src: "assets/images/gallery/img3.jpg", alt: "", caption: "" }
    ]
  },

  closing: {
    preface: "With Blessings",
    quoteHtml: "Looking forward<br>to <em>their</em> welcome",
    subtext: "With the love and blessings of our family",
    badgeItems: ["3 May 2026", "Kumarapalayam", "12 PM"],

    family: [
      {
       title: "Parents",
       names: [
         "K.C Angappan –  A.G Gauthami"
        ]
      },
      {
        title: "Grandparents",
        names: [
          "K. Chandrasekaran – Bannari",
          "P.K. Gopal – Amudhavali"
        ]
      },
      {
        title: "Maternal Family",
        names: [
          "Dr. G. Balamurugan, PhD – Bangalore",
          "B. Saranya, M.Sc., B.Ed",
          "B.S. Dhanshika",
          "B.S. Tamiliniyan"
        ]
      },
      {
        title: "Family",
        names: [
          "S. Jegatheesan – J. Poongothai",
          "J. Tamilchelvan, B.Tech IT",
          "J. Kamal, B.Tech Bio"
        ]
      }
    ],

    contact: ["7010449492", "6381912227"],

    symbols: [
      { char: "✦", top: "10%", left: "6%", size: "5rem", delay: "0s" },
      { char: "✧", bottom: "14%", right: "8%", size: "5.5rem", delay: "2s" }
    ]
  },

  audio: {
    ambientVolume: 0.03,
    unlockChord: [523.25, 659.25, 783.99]
  }
};