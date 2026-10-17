(() => {
  if (window.portfolioLanguageInitialized) return;
  window.portfolioLanguageInitialized = true;
  const translations = {
    navHome: ["Home", "Beranda"], navAbout: ["About", "Tentang"], navJourney: ["Journey", "Perjalanan"],
    navSkills: ["Skills", "Keahlian"], navProjects: ["Projects", "Proyek"], navContact: ["Contact", "Kontak"],
    letsTalk: ["Let's Talk!", "Mari Bicara!"], aboutHeadingPrefix: ["Short", "Sedikit"], aboutHeadingAccent: ["About Me", "Tentang Saya"],
    myPrefix: ["My", ""], journeyHeading: ["Journey!", "Perjalanan!"], education: ["Education", "Pendidikan"],
    organizationExperience: ["Organization Experience", "Pengalaman Organisasi"], workExperience: ["Work Experience", "Pengalaman Kerja"],
    skillsHeading: ["Skills", "Keahlian"], projectsHeading: ["Projects", "Proyek"],
    contactPrefix: ["Let's", "Mari"], contactHeading: ["Connect", "Terhubung"],
    galleryEmpty: ["No project images added yet.", "Belum ada gambar project."],
    galleryClose: ["×", "×"], galleryPrevious: ["‹", "‹"], galleryNext: ["›", "›"], galleryVisit: ["Visit project ↗", "Lihat project ↗"]
  };
  let language = "en";
  try { language = localStorage.getItem("portfolioLanguage") === "id" ? "id" : "en"; } catch { /* Storage may be disabled. */ }
  let current = language;
  const button = document.querySelector("#language-toggle");
  const replaceTextNodes = (element, value) => {
    const textNodes = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
    if (textNodes.length) {
      textNodes[0].nodeValue = value;
      textNodes.slice(1).forEach((node) => node.remove());
    } else {
      element.insertBefore(document.createTextNode(value), element.firstChild);
    }
  };
  const apply = (lang) => {
    current = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const pair = translations[element.dataset.i18n];
      if (!pair) return;
      replaceTextNodes(element, pair[lang === "id" ? 1 : 0]);
    });
    document.querySelectorAll("[data-localize-default]").forEach((element) => {
      const text = window.localizePortfolioValue(element.dataset.localizeDefault);
      if (element.dataset.localizeNode === "first") replaceTextNodes(element, text);
      else element.textContent = text;
    });
    document.querySelectorAll("[data-en-text][data-id-text]").forEach((element) => {
      element.textContent = lang === "id" ? element.dataset.idText : element.dataset.enText;
    });
    if (button) {
      button.textContent = lang.toUpperCase();
      button.setAttribute("aria-label", lang === "id" ? "Ganti bahasa ke Inggris" : "Switch language to Indonesian");
      button.setAttribute("aria-pressed", String(lang === "id"));
    }
  };
  window.portfolioLanguage = () => current;
  window.localizePortfolioValue = (value, targetLanguage = current) => {
    if (typeof value !== "string") return value;
    const englishToIndonesian = {
      "Hi, I'm Giovanni": "Hai, saya Giovanni",
      "Just a Dreamer who wants himself to be successful.": "Hanya seorang pemimpi yang ingin meraih kesuksesan.",
      "Dreamer": "Pemimpi",
      "This man was born on December. He was born at the hospital and always makes it difficult for his parents. But he really loves his parents more than anything. When he grew up, he had a dream. He want to be someone who plunged into the IT world. And always be a motivation when he learns.": "Ia lahir pada bulan Desember dan sangat menyayangi orang tuanya. Sejak kecil, ia bermimpi terjun ke dunia teknologi informasi dan terus belajar untuk meraih cita-citanya.",
      "Tools and technologies I use to bring ideas to life.": "Teknologi dan alat yang saya gunakan untuk mewujudkan ide.",
      "A few things I have built and learned from.": "Beberapa hal yang telah saya bangun dan menjadi bahan pembelajaran.",
      "Have a project in mind or just want to say hello? Reach out.": "Punya ide proyek atau ingin menyapa? Hubungi saya.",
      "View project ↗": "Lihat proyek ↗",
      "Portfolio Website": "Situs Portofolio", "Project coming soon": "Proyek segera hadir", "Your tech stack": "Teknologi Anda",
      "Major: ": "Jurusan: ", "Position: ": "Posisi / jabatan: ",
      "A personal portfolio to share my journey, skills, and work.": "Portofolio pribadi untuk berbagi perjalanan, keahlian, dan karya saya.",
      "This space is ready for a project you would like to showcase.": "Bagian ini siap menampilkan proyek yang ingin Anda tunjukkan."
    };
    const indonesianToEnglish = Object.fromEntries(Object.entries(englishToIndonesian).map(([english, indonesian]) => [indonesian, english]));
    const journeyTranslations = {
      "Perjalanan pertama dimulai dari SD 003 YKPP Dumai.": "My journey began at SD 003 YKPP Dumai.",
      "Masa SMP yang membentuk pengalaman dan kedisiplinan.": "Middle school helped shape my experience and discipline.",
      "Banyak pengalaman yang menjadi bekal untuk jenjang berikutnya.": "I gained experiences that prepared me for the next chapter.",
      "Belajar dan membangun pengalaman untuk berkarir sebagai Full Stack Developer.": "Studying and gaining experience to build a career as a Full Stack Developer.",
      "Divisi dokumentasi yang berfokus pada pengambilan momen.": "A documentation team focused on capturing meaningful moments.",
      "Organisasi pertama yang membuka pengalaman beraktivitas di luar sekolah.": "My first organization and introduction to activities outside school.",
      "Wadah mahasiswa Dumai yang kuliah di Pekanbaru.": "A community for Dumai students studying in Pekanbaru.",
    };
    const english = { ...indonesianToEnglish, ...journeyTranslations };
    return targetLanguage === "id" ? (englishToIndonesian[value] || value) : (english[value] || value);
  };
  if (button) button.addEventListener("click", () => {
    const next = current === "en" ? "id" : "en";
    try { localStorage.setItem("portfolioLanguage", next); } catch { /* Language still changes for this page view. */ }
    apply(next);
    document.dispatchEvent(new CustomEvent("portfolio-language-change", { detail: { language: next } }));
  });
  apply(current);
})();
