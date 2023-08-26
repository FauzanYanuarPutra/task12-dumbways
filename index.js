const express = require("express");
const app = express();
var methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
const path = require("path");
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "src/assets"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.post("/projects", upload.single("image"), postProject);

app.use(express.static("src/assets"));

app.get("/", home);
app.get("/projects", (req, res) => {
  res.json(dataProject);
});

app.post("/projects", upload.single("image"), postProject);
app.patch("/projects/:id", upload.single("image"), updateProject);
app.delete("/projects/:id", deleteProject);

app.get("/testi", testi);
app.get("/testi/rating/:bintang", testiBintang);
app.get("/contact", contact);
app.post("/contact", postContact);

app.listen(port, () => {
  console.log("Berjalan Di Port http://localhost:5000");
});

let dataProject = [
  {
    id: uuidv4(),
    name: "Real Estate Website",
    startDate: new Date("2023-08-01"),
    endDate: new Date("2024-08-12"),
    description:
      "Website Real Estate: Temukan Rumah Impian Anda dengan Kemudahan dan Kepercayaan. Selamat datang di Website Real Estate, destinasi online yang dirancang khusus untuk membantu Anda menemukan properti yang sesuai dengan kebutuhan dan impian Anda. Dengan jaringan luas agen terpercaya dan beragam pilihan properti, kami berkomitmen untuk menjadi mitra Anda dalam perjalanan mencari tempat yang Anda sebut rumah.",
    technologies: ["socket-io", "react", "typescript"],
    image: "/images/project1.png",
    postAt: new Date("2023-08-01T12:00:00"),
  },
  {
    id: uuidv4(),
    name: "Belajar Ngaji Website",
    startDate: new Date("2023-07-15"),
    endDate: new Date("2023-07-30"),
    description:
      "Website Belajar Ngaji: Menemani Perjalanan Spiritual Anda Menuju Kedekatan dengan Al-Quran. Selamat datang di website Belajar Ngaji, tempat di mana Anda dapat memulai atau melanjutkan perjalanan spiritual Anda dalam memahami dan menghafal Al-Quran dengan mudah dan nyaman. Kami telah merancang platform ini dengan penuh dedikasi untuk membantu Anda memperdalam hubungan dengan Kitab Suci dan memperluas pemahaman Anda tentang ajaran Islam.",
    technologies: ["react", "node-js"],
    image: "/images/project2.png",
    postAt: new Date("2023-07-15T08:01:00"),
  },
  {
    id: uuidv4(),
    name: "Floobotics",
    startDate: new Date("2023-07-15"),
    endDate: new Date("2023-07-30"),
    description:
      "Website Flobotics: Menemani Perjalanan Spiritual Anda Menuju Kedekatan dengan Al-Quran. Selamat datang di website Belajar Ngaji, tempat di mana Anda dapat memulai atau melanjutkan perjalanan spiritual Anda dalam memahami dan menghafal Al-Quran dengan mudah dan nyaman. Kami telah merancang platform ini dengan penuh dedikasi untuk membantu Anda memperdalam hubungan dengan Kitab Suci dan memperluas pemahaman Anda tentang ajaran Islam.",
    technologies: ["react"],
    image: "/images/project3.png",
    postAt: new Date("2023-07-15T08:01:00"),
  },
];

const availableTechnologies = [
  { value: "node-js", label: "Node.js" },
  { value: "react", label: "React" },
  { value: "socket-io", label: "Socket io" },
  { value: "typescript", label: "Typescript" },
];

let dataTesti = [];

fetch("https://api.npoint.io/11be16bc5f763e5ba191")
  .then((response) => response.json())
  .then((testimonials) => {
    dataTesti.push(...testimonials);
  })
  .catch((error) => {
    console.error("Error fetching testimonials:", error);
  });

function home(req, res) {
  res.render("views/index", {
    dataProject,
    availableTechnologies,
    editProject: null,
  });
}

// project

function postProject(req, res) {
  const {
    name,
    startDate,
    endDate,
    technologies,
    description,
    imageDescription,
  } = req.body;

  const technologiesArray = Array.isArray(technologies)
    ? technologies
    : [technologies];

  const newProject = {
    id: uuidv4(),
    name,
    startDate,
    endDate,
    technologies: technologiesArray,
    description,
    image: "/images/" + req.file.filename,
    imageDescription,
  };

  dataProject.push(newProject);
  res.redirect("/");
}

function updateProject(req, res) {
  const id = req.params.id;
  const projectIndex = dataProject.findIndex((project) => project.id === id);

  if (projectIndex !== -1) {
    const {
      name,
      startDate,
      endDate,
      technologies,
      description,
      imageDescription,
    } = req.body;

    const technologiesArray = Array.isArray(technologies)
      ? technologies
      : [technologies];

    const updatedProject = {
      id,
      name,
      startDate,
      endDate,
      technologies: technologiesArray,
      description,
      imageDescription,
    };

    if (req.file) {
      updatedProject.image = "/images/" + req.file.filename;
    } else {
      updatedProject.image = dataProject[projectIndex].image;
    }

    dataProject[projectIndex] = updatedProject;
  }

  res.redirect("/");
}

function deleteProject(req, res) {
  const { id } = req.params;
  dataProject = dataProject.filter((c) => c.id !== id);
  res.redirect("/");
}

// end project

function testi(req, res) {
  res.render("views/testimonials", { dataTesti });
}

function testiBintang(req, res) {
  const { bintang } = req.params;
  const dataBintang = dataTesti.filter((b) => b.rating == bintang);
  res.render("views/testimonials", { dataTesti: dataBintang, bintang });
}

function contact(req, res) {
  res.render("views/contact");
}

function postContact(req, res) {
  const name = req.body.name;
  // const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const emailReceiver = "fauzanyanuarp@gmail.com";
  const mailtoLink = `mailto:${emailReceiver}?subject=${subject}&body=Hello nama saya ${name}, ${subject}, ${message}`;
  res.redirect(mailtoLink);
}
