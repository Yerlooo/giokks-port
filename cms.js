const defaults = {
  homeTitle: "Hi, I'm Giovanni",
  homeRole: "Full-Stack Developer",
  homeTagline: "Just a Dreamer who wants himself to be successful.",
  aboutTitle: "Dreamer",
  aboutDescription:
    "This man was born on December. He was born at the hospital and always makes it difficult for his parents. But he really loves his parents more than anything. When he grew up, he had a dream. He want to be someone who plunged into the IT world. And always be a motivation when he learns.",
  aboutImage: "bg.jpg",
  educationList: [
    {
      year: "2009–2015",
      title: "SD 003 YKPP Bukit Datuk Dumai",
      description: "Perjalanan pertama dimulai dari SD 003 YKPP Dumai.",
    },
    {
      year: "2015–2018",
      title: "SMP IT Bazma Brilliant Dumai",
      description: "Masa SMP yang membentuk pengalaman dan kedisiplinan.",
    },
    {
      year: "2018–2021",
      title: "SMAN 1 Kota Dumai",
      description:
        "Banyak pengalaman yang menjadi bekal untuk jenjang berikutnya.",
    },
    {
      year: "2021–Now",
      title: "Universitas Islam Riau — Teknik Informatika",
      description:
        "Belajar dan membangun pengalaman untuk berkarir sebagai Full Stack Developer.",
    },
  ],
  organizationExperienceList: [
    {
      year: "2019–2021",
      title: "SMOTHER (Smansa Momen Hunter)",
      description: "Divisi dokumentasi yang berfokus pada pengambilan momen.",
    },
    {
      year: "2019–2021",
      title: "Forum Anak Dumai",
      description:
        "Organisasi pertama yang membuka pengalaman beraktivitas di luar sekolah.",
    },
    {
      year: "2021–Now",
      title: "IMKD Pekanbaru",
      description: "Wadah mahasiswa Dumai yang kuliah di Pekanbaru.",
    },
  ],
  workExperienceList: [],
  skillsIntro: "Tools and technologies I use to bring ideas to life.",
  skillsList: [
    { name: "JavaScript", logo: "javascript" },
    { name: "Next.js", logo: "nextjs" },
    { name: "React", logo: "react" },
    { name: "HTML5", logo: "html5" },
    { name: "CSS3", logo: "css3" },
    { name: "Node.js", logo: "nodejs" },
    { name: "MySQL", logo: "mysql" },
    { name: "C++", logo: "cplusplus" },
  ],
  projectsIntro: "A few things I have built and learned from.",
  projectsList: [
    {
      name: "Portfolio Website",
      description:
        "A personal portfolio to share my journey, skills, and work.",
      stack: "HTML · CSS · JavaScript",
      link: "#home",
    },
    {
      name: "Project coming soon",
      description:
        "This space is ready for a project you would like to showcase.",
      stack: "Your tech stack",
      link: "#projects",
    },
  ],
  contactIntro: "Have a project in mind or just want to say hello? Reach out.",
  email: "hello@example.com",
  contactLinks: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/",
      icon: "bxl-linkedin",
    },
    {
      label: "Instagram",
      url: "https://instagram.com/giopanggabean_",
      icon: "bxl-instagram",
    },
    { label: "GitHub", url: "https://github.com/", icon: "bxl-github" },
  ],
};
defaults.educationList = defaults.educationList.map(({ year, title, description }) => {
  const [institution, ...majorParts] = title.split(/\s+[—–-]\s+/);
  return { year, institution, major: majorParts.join(" — "), description };
});
defaults.organizationExperienceList = defaults.organizationExperienceList.map(({ year, title, description }) => ({ year, organization: title, position: "", description }));
defaults.projectsList = defaults.projectsList.map((item) => ({
  ...item,
  images: [],
}));
const sectionInfo = {
  home: ["Home", "Atur judul dan perkenalan pada halaman utama."],
  about: ["About", "Ubah foto profil dan deskripsi tentang diri Anda."],
  journey: ["Journey", "Kelola riwayat pendidikan dan pengalaman."],
  skills: ["Skills", "Tambah skill dan nama logo teknologinya."],
  projects: ["Projects", "Kelola proyek yang ingin ditampilkan."],
  contact: ["Contact", "Perbarui email dan akun sosial media."],
};
let content;
try {
  const saved = window.portfolioServerContent || JSON.parse(localStorage.getItem("portfolioContent") || "{}");
  content = { ...structuredClone(defaults), ...saved };
  if (!saved.organizationExperienceList && saved.experienceList) content.organizationExperienceList = saved.experienceList;
} catch {
  content = structuredClone(defaults);
}
if (!Array.isArray(content.workExperienceList)) content.workExperienceList = [];
content.educationList = (content.educationList || []).map((item) => {
  const [legacyInstitution, ...legacyMajor] = (item.title || "").split(/\s+[—–-]\s+/);
  return { year: item.year || "", institution: item.institution || legacyInstitution || "", major: item.major || legacyMajor.join(" — "), description: item.description || "" };
});
content.organizationExperienceList = (content.organizationExperienceList || []).map((item) => ({ year: item.year || "", organization: item.organization || item.title || "", position: item.position || "", description: item.description || "" }));
content.workExperienceList = content.workExperienceList.map((item) => ({ year: item.year || "", company: item.company || item.title || "", position: item.position || "", description: item.description || "" }));
content.projectsList = (content.projectsList || []).map((item) => ({
  ...item,
  images: Array.isArray(item.images) ? item.images : [],
}));
const fields = document.querySelector("#cms-fields");
const status = document.querySelector("#editor-status");
let activePanel = "home";
const syncFields = () =>
  fields.querySelectorAll("[data-key]").forEach((input) => {
    const [key, index, prop] = input.dataset.key.split(".");
    if (index === undefined) content[key] = input.value;
    else content[key][Number(index)][prop] = input.value;
  });
const field = (label, key, value, type = "text") => {
  const wrapper = document.createElement("label");
  wrapper.className = "cms-field";
  wrapper.append(document.createTextNode(label));
  const input =
    type === "textarea"
      ? document.createElement("textarea")
      : document.createElement("input");
  if (type !== "textarea") input.type = type;
  input.dataset.key = key;
  input.value = value || "";
  wrapper.append(input);
  return wrapper;
};
const projectImagesEditor = (item, index) => {
  const wrapper = document.createElement("div"); wrapper.className = "cms-project-images";
  const heading = document.createElement("strong"); heading.textContent = "Gambar project"; wrapper.append(heading);
  const hint = document.createElement("p"); hint.textContent = "Tambahkan maksimal 4 gambar per project. Gambar akan dioptimalkan agar lebih ringan."; wrapper.append(hint);
  const picker = document.createElement("label"); picker.className = "cms-image-picker"; picker.textContent = "+ Tambah gambar";
  const input = document.createElement("input"); input.type = "file"; input.accept = "image/*"; input.multiple = true; picker.append(input); wrapper.append(picker);
  const previews = document.createElement("div"); previews.className = "cms-image-list";
  (item.images || []).forEach((image, imageIndex) => {
    const tile = document.createElement("div"); tile.className = "cms-image-tile";
    const thumb = document.createElement("img"); thumb.src = typeof image === "string" ? image : image.src; thumb.alt = typeof image === "string" ? "Project image" : image.alt || "Project image"; tile.append(thumb);
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "cms-remove"; remove.textContent = "Hapus";
    remove.onclick = () => { syncFields(); content.projectsList[index].images.splice(imageIndex, 1); render(activePanel); };
    tile.append(remove); previews.append(tile);
  });
  wrapper.append(previews);
  input.onchange = async () => {
    syncFields();
    const remaining = Math.max(0, 4 - (content.projectsList[index].images || []).length);
    const files = Array.from(input.files || []).slice(0, remaining);
    if (!files.length) { status.textContent = "Maksimal 4 gambar untuk setiap project."; return; }
    const optimize = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const photo = new Image(); photo.onerror = reject;
        photo.onload = () => {
          const scale = Math.min(1, 1400 / Math.max(photo.naturalWidth, photo.naturalHeight));
          const canvas = document.createElement("canvas"); canvas.width = Math.round(photo.naturalWidth * scale); canvas.height = Math.round(photo.naturalHeight * scale);
          const context = canvas.getContext("2d"); context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(photo, 0, 0, canvas.width, canvas.height);
          let src = canvas.toDataURL("image/jpeg", 0.72);
          if (src.length > 500_000) src = canvas.toDataURL("image/jpeg", 0.5);
          if (src.length > 500_000) reject(new Error(`${file.name} masih terlalu besar setelah dioptimalkan.`));
          else resolve({ src, alt: file.name.replace(/\.[^.]+$/, "") });
        };
        photo.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    try {
      const images = await Promise.all(files.map(optimize));
      content.projectsList[index].images.push(...images);
      status.textContent = "Gambar ditambahkan. Simpan perubahan untuk menerapkannya.";
      render(activePanel);
    } catch (error) { status.textContent = error.message || "Gambar tidak dapat diproses."; }
  };
  return wrapper;
};
const listEditor = (key, title, labels, emptyItem) => {
  const group = document.createElement("div");
  group.className = `cms-list-group${key === "skillsList" ? " cms-list-skills" : ""}`;
  const heading = document.createElement("div");
  heading.className = "cms-list-heading";
  const h = document.createElement("h3");
  h.textContent = title;
  heading.append(h);
  const add = document.createElement("button");
  add.type = "button";
  add.className = "cms-add";
  add.textContent = "+ Tambah";
  add.onclick = () => {
    syncFields();
    content[key].push({ ...emptyItem });
    render(activePanel);
  };
  heading.append(add);
  group.append(heading);
  (content[key] || []).forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "cms-item";
    const top = document.createElement("div");
    top.className = "cms-item-top";
    const name = document.createElement("strong");
    name.textContent = `${title} ${index + 1}`;
    top.append(name);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cms-remove";
    remove.textContent = "Hapus";
    remove.onclick = () => {
      syncFields();
      content[key].splice(index, 1);
      render(activePanel);
    };
    top.append(remove);
    card.append(top);
    labels.forEach(([prop, label, type]) =>
      card.append(field(label, `${key}.${index}.${prop}`, item[prop], type)),
    );
    if (key === "projectsList") card.append(projectImagesEditor(item, index));
    group.append(card);
  });
  return group;
};
function render(panel) {
  activePanel = panel;
  fields.replaceChildren();
  const [title, description] = sectionInfo[panel];
  document.querySelector("#panel-kicker").textContent = title.toUpperCase();
  document.querySelector("#panel-title").textContent = title;
  document.querySelector("#panel-description").textContent = description;
  document
    .querySelectorAll(".cms-menu-item")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.panel === panel),
    );
  if (panel === "home")
    [
      ["Judul utama", "homeTitle"],
      ["Jabatan / spesialisasi", "homeRole"],
      ["Kalimat perkenalan", "homeTagline", "textarea"],
    ].forEach(([label, key, type]) =>
      fields.append(field(label, key, content[key], type)),
    );
  if (panel === "about") {
    fields.append(
      field("Judul About", "aboutTitle", content.aboutTitle),
      field(
        "Deskripsi",
        "aboutDescription",
        content.aboutDescription,
        "textarea",
      ),
    );
    const photo = document.createElement("div");
    photo.className = "cms-field";
    photo.append(document.createTextNode("Foto profil"));
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 2_000_000) {
        status.textContent = "Ukuran foto maksimal 2 MB.";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        content.aboutImage = reader.result;
        status.textContent = "Foto siap disimpan.";
      };
      reader.readAsDataURL(file);
    };
    photo.append(input);
    fields.append(photo);
  }
  if (panel === "journey") {
    fields.append(
      listEditor(
        "educationList",
        "Pendidikan",
        [
          ["year", "Periode"],
          ["institution", "Nama sekolah / institusi"],
          ["major", "Jurusan"],
          ["description", "Deskripsi", "textarea"],
        ],
        { year: "", institution: "", major: "", description: "" },
      ),
      listEditor(
        "organizationExperienceList",
        "Pengalaman Organisasi",
        [
          ["year", "Periode"],
          ["organization", "Nama organisasi"],
          ["position", "Posisi / jabatan"],
          ["description", "Deskripsi", "textarea"],
        ],
        { year: "", organization: "", position: "", description: "" },
      ),
      listEditor(
        "workExperienceList",
        "Pengalaman Kerja",
        [
          ["year", "Periode"],
          ["company", "Nama perusahaan"],
          ["position", "Posisi / jabatan"],
          ["description", "Deskripsi", "textarea"],
        ],
        { year: "", company: "", position: "", description: "" },
      ),
    );
  }
  if (panel === "skills") {
    fields.append(
      field(
        "Kalimat pengantar",
        "skillsIntro",
        content.skillsIntro,
        "textarea",
      ),
      listEditor(
        "skillsList",
        "Skill",
        [
          ["name", "Nama skill"],
          ["logo", "Logo (slug Devicon)"],
        ],
        { name: "Skill baru", logo: "javascript" },
      ),
    );
    const hint = document.createElement("p");
    hint.className = "cms-hint";
    hint.textContent =
      "Contoh slug logo: javascript, nextjs, mysql, react, html5, css3, nodejs.";
    fields.append(hint);
  }
  if (panel === "projects")
    fields.append(
      field(
        "Kalimat pengantar",
        "projectsIntro",
        content.projectsIntro,
        "textarea",
      ),
      listEditor(
        "projectsList",
        "Project",
        [
          ["name", "Nama project"],
          ["description", "Deskripsi", "textarea"],
          ["stack", "Teknologi"],
          ["link", "URL project"],
        ],
        { name: "New project", description: "", stack: "", link: "", images: [] },
      ),
    );
  if (panel === "contact")
    fields.append(
      field(
        "Kalimat pengantar",
        "contactIntro",
        content.contactIntro,
        "textarea",
      ),
      field("Email", "email", content.email, "email"),
      listEditor(
        "contactLinks",
        "Akun sosial media",
        [
          ["label", "Nama akun"],
          ["url", "URL akun"],
          ["icon", "Icon Boxicons (contoh: bxl-linkedin)"],
        ],
        {
          label: "LinkedIn",
          url: "https://www.linkedin.com/",
          icon: "bxl-linkedin",
        },
      ),
    );
  status.textContent = "";
}
document
  .querySelectorAll(".cms-menu-item")
  .forEach((button) =>
    button.addEventListener("click", () => render(button.dataset.panel)),
  );

document.querySelector("#save-content").addEventListener("click", async () => {
  syncFields();

  const serialized = JSON.stringify(content);
  const token = prompt("Masukkan token CMS untuk menyimpan perubahan.");

  if (!token) {
    status.textContent = "Penyimpanan dibatalkan.";
    return;
  }

  status.textContent = "Menyimpan perubahan...";

  try {
    const response = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cms-token": token,
      },
      body: serialized,
    });

    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "Token CMS salah atau belum dikonfigurasi."
          : `Gagal menyimpan (HTTP ${response.status}).`
      );
    }

    localStorage.setItem("portfolioContent", serialized);
    status.textContent = "Konten berhasil disimpan ke server.";
  } catch (error) {
    status.textContent = error.message || "Gagal menyimpan konten.";
  }
});

render("home");