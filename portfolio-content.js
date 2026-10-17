(() => {
  if (window.portfolioContentRendered) return;
  window.portfolioContentRendered = true;
  const defaults = {
    homeTitle: "Hi, I'm Giovanni",
    homeRole: "Full-Stack Developer",
    homeTagline: "Just a Dreamer who wants himself to be successful.",
    aboutTitle: "Dreamer",
    aboutDescription: "This man was born on December. He was born at the hospital and always makes it difficult for his parents. But he really loves his parents more than anything. When he grew up, he had a dream. He want to be someone who plunged into the IT world. And always be a motivation when he learns.",
    aboutImage: "bg.jpg",
    educationList: [
      { year: "2009–2015", title: "SD 003 YKPP Bukit Datuk Dumai", description: "Perjalanan pertama dimulai dari SD 003 YKPP Dumai." },
      { year: "2015–2018", title: "SMP IT Bazma Brilliant Dumai", description: "Masa SMP yang membentuk pengalaman dan kedisiplinan." },
      { year: "2018–2021", title: "SMAN 1 Kota Dumai", description: "Banyak pengalaman yang menjadi bekal untuk jenjang berikutnya." },
      { year: "2021–Now", title: "Universitas Islam Riau — Teknik Informatika", description: "Belajar dan membangun pengalaman untuk berkarir sebagai Full Stack Developer." }
    ],
    experienceList: [
      { year: "2019–2021", title: "SMOTHER (Smansa Momen Hunter)", description: "Divisi dokumentasi yang berfokus pada pengambilan momen." },
      { year: "2019–2021", title: "Forum Anak Dumai", description: "Organisasi pertama yang membuka pengalaman beraktivitas di luar sekolah." },
      { year: "2021–Now", title: "IMKD Pekanbaru", description: "Wadah mahasiswa Dumai yang kuliah di Pekanbaru." }
    ],
    workExperienceList: [],
    skillsIntro: "Tools and technologies I use to bring ideas to life.",
    skillsList: [
      { name: "JavaScript", logo: "javascript" }, { name: "Next.js", logo: "nextjs" },
      { name: "React", logo: "react" }, { name: "HTML5", logo: "html5" },
      { name: "CSS3", logo: "css3" }, { name: "Node.js", logo: "nodejs" },
      { name: "MySQL", logo: "mysql" }, { name: "C++", logo: "cplusplus" }
    ],
    projectsIntro: "A few things I have built and learned from.",
    projectsList: [
      { name: "Portfolio Website", description: "A personal portfolio to share my journey, skills, and work.", stack: "HTML · CSS · JavaScript", link: "#home" },
      { name: "Project coming soon", description: "This space is ready for a project you would like to showcase.", stack: "Your tech stack", link: "#projects" }
    ],
    contactIntro: "Have a project in mind or just want to say hello? Reach out.",
    email: "hello@example.com",
    contactLinks: [
      { label: "LinkedIn", url: "https://www.linkedin.com/", icon: "bxl-linkedin" },
      { label: "Instagram", url: "https://instagram.com/giopanggabean_", icon: "bxl-instagram" },
      { label: "GitHub", url: "https://github.com/", icon: "bxl-github" }
    ]
  };

  let content = { ...defaults };
  try {
    const saved = window.portfolioServerContent || JSON.parse(localStorage.getItem("portfolioContent") || "{}");
    content = { ...defaults, ...saved };
    if (!saved.organizationExperienceList && saved.experienceList) content.organizationExperienceList = saved.experienceList;
    if (!content.organizationExperienceList) content.organizationExperienceList = defaults.experienceList;
  } catch (error) { console.warn("Portfolio content could not be loaded.", error); }
  content.educationList = (content.educationList || []).map((item) => {
    const [legacyInstitution, ...legacyMajor] = (item.title || "").split(/\s+[—–-]\s+/);
    return { year: item.year || "", institution: item.institution || legacyInstitution || "", major: item.major || legacyMajor.join(" — "), description: item.description || "" };
  });
  content.organizationExperienceList = (content.organizationExperienceList || content.experienceList || defaults.experienceList).map((item) => ({ year: item.year || "", organization: item.organization || item.title || "", position: item.position || "", description: item.description || "" }));
  content.workExperienceList = (content.workExperienceList || []).map((item) => ({ year: item.year || "", company: item.company || item.title || "", position: item.position || "", description: item.description || "" }));
  content.projectsList = (content.projectsList || []).map((item) => ({
    ...item,
    images: Array.isArray(item.images) ? item.images : [],
  }));

  document.querySelectorAll("[data-content]").forEach((element) => {
    const key = element.dataset.content;
    if (key === "aboutImage") { element.src = content[key] || defaults[key]; return; }
    if (["educationList", "experienceList", "organizationExperienceList", "workExperienceList", "skillsList", "projectsList", "contactLinks"].includes(key)) return;
    if (typeof content[key] === "string") {
      element.dataset.localizeDefault = content[key];
      element.dataset.localizeNode = "first";
      const textNodes = Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
      const textNode = textNodes[0];
      const value = window.localizePortfolioValue(content[key]);
      if (textNode) textNode.nodeValue = value;
      else element.prepend(document.createTextNode(value));
      textNodes.slice(1).forEach((node) => node.remove());
    }
  });

  const makeCard = (item, className) => {
    const card = document.createElement("article"); card.className = className;
    const primary = item.institution || item.organization || item.company || item.title || item.name || "";
    const secondary = item.major || item.position || "";
    const title = document.createElement("h3"); title.dataset.localizeDefault = primary; title.textContent = window.localizePortfolioValue(primary); card.append(title);
    if (secondary) {
      const detail = document.createElement("h4"); detail.className = "journey-detail";
      const label = document.createElement("span"); label.dataset.localizeDefault = item.major ? "Major: " : "Position: "; label.textContent = window.localizePortfolioValue(label.dataset.localizeDefault);
      detail.append(label, document.createTextNode(secondary)); card.append(detail);
    }
    if (item.year) { const year = document.createElement("span"); year.className = "content-year"; year.textContent = item.year; card.prepend(year); }
    if (item.description) { const description = document.createElement("p"); description.dataset.localizeDefault = item.description; description.textContent = window.localizePortfolioValue(item.description); card.append(description); }
    if (item.stack) { const stack = document.createElement("span"); stack.className = "project-stack"; stack.dataset.localizeDefault = item.stack; stack.textContent = window.localizePortfolioValue(item.stack); card.append(stack); }
    return card;
  };
  ["educationList", "organizationExperienceList", "workExperienceList"].forEach((key) => {
    const container = document.querySelector(`[data-content="${key}"]`);
    if (!container) return;
    container.replaceChildren();
    const list = content[key] || (key === "organizationExperienceList" ? content.experienceList : []);
    (Array.isArray(list) ? list : []).forEach((item) => container.append(makeCard(item, "journey-card section-reveal-item")));
  });
  const skills = document.querySelector('[data-content="skillsList"]');
  if (skills) skills.replaceChildren();
  if (skills) (Array.isArray(content.skillsList) ? content.skillsList : []).forEach((item) => {
    const card = document.createElement("article"); card.className = "skill-card section-reveal-item";
    const logo = document.createElement("img"); logo.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${encodeURIComponent(item.logo || "code")}/${encodeURIComponent(item.logo || "code")}-original.svg`; logo.alt = ""; logo.loading = "lazy"; logo.onerror = () => { logo.hidden = true; };
    const name = document.createElement("h3"); name.textContent = item.name || "Skill"; card.append(logo, name); skills.append(card);
  });
  const projects = document.querySelector('[data-content="projectsList"]');
  if (projects) projects.replaceChildren();
  const gallery = document.querySelector("#project-gallery");
  const galleryImage = document.querySelector("#gallery-image");
  const galleryTitle = document.querySelector("#gallery-title");
  const galleryDescription = document.querySelector("#gallery-description");
  const galleryStack = document.querySelector("#gallery-stack");
  const galleryProjectLink = document.querySelector("#gallery-project-link");
  const galleryCount = document.querySelector("#gallery-count");
  const galleryDots = document.querySelector("#gallery-dots");
  const galleryEmpty = document.querySelector("#gallery-empty");
  const previousButton = document.querySelector("#gallery-previous");
  const nextButton = document.querySelector("#gallery-next");
  let activeProject = null;
  let activeImage = 0;
  const localizeProjectText = (value) => window.localizePortfolioValue(value || "");
  const renderGalleryImage = () => {
    const images = activeProject?.images || [];
    const selected = images[activeImage];
    galleryImage.hidden = !selected;
    galleryEmpty.hidden = Boolean(selected);
    previousButton.disabled = images.length < 2;
    nextButton.disabled = images.length < 2;
    galleryCount.textContent = images.length ? `${activeImage + 1} / ${images.length}` : "0 / 0";
    galleryDots.replaceChildren();
    images.forEach((image, index) => {
      const dot = document.createElement("button"); dot.type = "button"; dot.className = `gallery-dot${index === activeImage ? " active" : ""}`;
      dot.setAttribute("aria-label", `Image ${index + 1} of ${images.length}`); dot.setAttribute("aria-current", String(index === activeImage));
      dot.onclick = () => { activeImage = index; renderGalleryImage(); }; galleryDots.append(dot);
    });
    if (selected) {
      galleryImage.src = typeof selected === "string" ? selected : selected.src;
      galleryImage.alt = typeof selected === "string" ? `${activeProject.name} ${activeImage + 1}` : selected.alt || `${activeProject.name} ${activeImage + 1}`;
    } else { galleryImage.removeAttribute("src"); }
  };
  const updateGalleryCopy = (project) => {
    galleryTitle.textContent = localizeProjectText(project.name);
    galleryDescription.textContent = localizeProjectText(project.description);
    galleryStack.textContent = localizeProjectText(project.stack);
    galleryStack.hidden = !galleryStack.textContent;
    galleryProjectLink.hidden = !/^https?:\/\//i.test(project.link || "");
    if (!galleryProjectLink.hidden) galleryProjectLink.href = project.link;
  };
  const openProjectGallery = (project) => {
    activeProject = project; activeImage = 0;
    updateGalleryCopy(project);
    renderGalleryImage(); gallery.showModal();
  };
  previousButton.addEventListener("click", () => { activeImage = (activeImage - 1 + activeProject.images.length) % activeProject.images.length; renderGalleryImage(); });
  nextButton.addEventListener("click", () => { activeImage = (activeImage + 1) % activeProject.images.length; renderGalleryImage(); });
  document.querySelector(".gallery-close").addEventListener("click", () => gallery.close());
  gallery.addEventListener("click", (event) => { if (event.target === gallery) gallery.close(); });
  if (projects) (Array.isArray(content.projectsList) ? content.projectsList : []).forEach((item) => {
    const card = makeCard(item, "project-card section-reveal-item");
    const setLocalized = (element, value) => {
      element.dataset.localizeDefault = value || "";
      element.textContent = localizeProjectText(value);
    };
    setLocalized(card.querySelector("h3"), item.name);
    let description = card.querySelector("p");
    if (!description) { description = document.createElement("p"); card.append(description); }
    setLocalized(description, item.description);
    const stack = card.querySelector(".project-stack");
    if (stack) setLocalized(stack, item.stack);
    const link = document.createElement("button"); link.type = "button"; link.className = "project-link"; link.textContent = window.localizePortfolioValue("View project ↗"); link.onclick = () => openProjectGallery(item); card.append(link);
    projects.append(card);
  });
  const links = document.querySelector('[data-content="contactLinks"]');
  if (links) {
    links.replaceChildren();
    const emailAddress = (content.email || defaults.email).trim();
    const email = document.createElement("a"); email.className = "contact-email section-reveal-item";
    email.href = `mailto:${encodeURIComponent(emailAddress)}`;
    email.setAttribute("aria-label", `Send email to ${emailAddress}`);
    const emailIcon = document.createElement("i"); emailIcon.className = "bx bx-envelope"; emailIcon.setAttribute("aria-hidden", "true");
    const emailText = document.createElement("span"); emailText.textContent = content.email || defaults.email; email.append(emailIcon, emailText); links.append(email);
    (Array.isArray(content.contactLinks) ? content.contactLinks : []).forEach((item) => {
      const link = document.createElement("a"); link.className = "social-link section-reveal-item"; link.href = item.url || "#"; link.target = "_blank"; link.rel = "noopener noreferrer";
      const icon = document.createElement("i"); icon.className = `bx ${item.icon || "bx-link"}`; const label = document.createElement("span"); label.textContent = item.label || "Social"; link.append(icon, label); links.append(link);
    });
  }
  document.addEventListener("portfolio-language-change", () => {
    if (activeProject && gallery.open) updateGalleryCopy(activeProject);
  });
})();
