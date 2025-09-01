import React from 'react';

const cvData = {
  profile: {
    name: "Joohoon Kim",
    title: "Postdoctoral Researcher, Pohang University of Science and Technology (POSTECH) Institute of Artificial Intelligence (PIAI)",
    email: "kimjuhoon@postech.ac.kr",
    phone: "+82-54-279-6806",
    office: "R1259 RIST Building I",
    links: [
      {
        name: "Google Scholar",
        url: "https://scholar.google.com/citations?user=tRNVtewAAAAJ&hl=ko"
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/kim-joohoon-054454219/"
      },
      {name: "ORCID", url: "https://orcid.org/0000-0002-0827-1919"}
    ]
  },
  education: [
    {
      degree: "M.S./Ph.D. in Mechanical Engineering",
      university: "POSTECH",
      country: "Korea",
      from: "2021",
      to: "2026",
    },
    {
      degree: "B.S. in Mechanical Engineering",
      university: "POSTECH",
      country: "Korea",
      from: "2017",
      to: "2021",
    },
  ],
  experience: [
    {
      role: "Postdoctoral Researcher",
      institution: "PIAI",
      location: "Korea",
      period: "2026 – current",
      description: null
    },
    {
      role: "Entrepreneurial Member",
      institution: "Metacloud",
      location: "Korea",
      period: "2023 – 2024",
      description: "Funded by I-Corps program (Startup investment program by the Ministry of Science and ICT)"
    },
    {
      role: "Visiting Researcher",
      institution: "Plant and Food Research",
      location: "New Zealand",
      period: "2023",
      description: "Host: Dr. Jonghyun Choi"
    },
    {
      role: "Visiting Researcher",
      institution: "Northeastern University",
      location: "USA",
      period: "2022",
      description: "Host: Prof. Yongmin Liu"
    },
    {
      role: "Visiting Researcher",
      institution: "Massachusetts Institute of Technology",
      location: "USA",
      period: "2022",
      description: "Host: Prof. Juejun Hu"
    },
    {
      role: "Entrepreneurial Leader",
      institution: "ThinLens",
      location: "Korea",
      period: "2022 – 2023",
      description: "Funded by I-Corps program (Startup investment program by the Ministry of Science and ICT)"
    },
    {
      role: "Undergraduate Researcher",
      institution: "POSTECH",
      location: "Korea",
      period: "2019 – 2021",
      description: "Advisor: Junsuk Rho"
    },
    {
      role: "Internship",
      institution: "Samsung Electronics",
      location: "Korea",
      period: "2018",
      description: null
    }
  ],
  awards: [
    {
      name: "Editage Grant",
      details: "2nd place",
      year: "2024"
    },
    {
      name: "Presidential Science Fellowship",
      details: "Ph.D.",
      year: "2024 – 2026"
    },
    {
      name: "Asan Biomedical Science Fellowship",
      details: null,
      year: "2024 – 2026"
    },
    {
      name: "iCore Lab Start-Up Award",
      details: "Grand Prize",
      year: "2024"
    },
    {
      name: "NAEK Wonik \"Young Engineers Honor Society\" Award",
      details: "1st place",
      year: "2024"
    },
    {
      name: "3.1 Fellowship",
      details: null,
      year: "2023 – 2024"
    },
    {
      name: "KIDS Award (IMID)",
      details: "Gold",
      year: "2023"
    },
    {
      name: "Samsung Humantech Paper Award",
      details: "Silver",
      year: "2023"
    },
    {
      name: "Talent Award of Korea",
      details: null,
      year: "2022"
    },
    {
      name: "KIDS Award (IMID)",
      details: "Gold",
      year: "2022"
    }
  ],
  publications: [
    {
      title: "Wide-field-of-view, switchable, multi-dimensional light-field display using a metasurface lenticular lens",
      journal: "Nature",
      status: "In revision"
    },
    {
      title: "300 units per second roll-to-roll manufacturing of visible metalenses",
      journal: "Nature",
      status: "In revision"
    },
    {
      title: "Scalable manufacturing of high-index atomic layer-polymer hybrid metasurfaces for metaphotonics in the visible",
      journal: "Nature Materials",
      volume: "22",
      pages: "474-481",
      year: "2023",
      if: "38.5"
    },
    {
      title: "Roll-to-plate printable RGB achromatic metalens for wide-field-of-view holographic near-eye display",
      journal: "Nature Materials",
      volume: "24",
      pages: "535-543",
      year: "2025",
      if: "38.5"
    },
    {
      title: "Full-color augmented reality near-eye displays using single-layer achromatic metasurface waveguides",
      journal: "Nature Nanotechnology",
      volume: "20",
      pages: "747-754",
      year: "2025",
      if: "34.9"
    },
    {
      title: "A water-soluble label for food products prevents packaging waste and counterfeiting",
      journal: "Nature Food",
      volume: "5",
      pages: "293-300",
      year: "2024",
      if: "21.9"
    },
    {
      title: "Anti-aliased metasurfaces beyond the Nyquist limit",
      journal: "Nature Communications",
      volume: "16",
      pages: "411",
      year: "2025",
      if: "15.7"
    },
    {
      title: "Polariton condensate far-detuned from exciton resonance in WS2 bound states in the continuum",
      journal: "Nature Communications",
      status: "In revision"
    },
    {
      title: "Amorphous to crystalline transition in nanoimprinted sol-gel titanium oxide metasurfaces",
      journal: "Advanced Materials",
      volume: "36",
      pages: "2405378",
      year: "2024",
      if: "26.8"
    },
    {
      title: "Dynamic hyperspectral holography enabled by inverse-designed metasurfaces with oblique helicoidal cholesterics",
      journal: "Advanced Materials",
      volume: "36",
      pages: "2311785",
      year: "2024",
      if: "26.8"
    },
    {
      title: "Multicolor and 3D holography generated by inverse-design single-cell metasurfaces",
      journal: "Advanced Materials",
      volume: "35",
      pages: "2208520",
      year: "2023",
      if: "26.8"
    },
    {
      title: "Metasurfaces-driven hyperspectral imaging via multiplexed plasmonic resonance energy transfer",
      journal: "Advanced Materials",
      volume: "35",
      pages: "2300229",
      year: "2023",
      if: "26.8"
    }
  ],
  services: [
    {
      title: "**Proposal Reviewer**",
      description: "Served as proposal reviewer for Israeli Ministry of Innovation, Science and Technology"
    },
    {
      title: "**Journal Reviewer**",
      description: "Regular reviewer for Nature Communications, Light: Science & Applications, Optica, ACS Photonics, Nanophotonics, Communications Physics, Scientific Reports, Optics Express, Optics Letters, Optics and Laser Technology, Nanomaterials, Displays"
    }
  ]
};

// --- 재사용 가능한 컴포넌트 영역 ---

const ProfileSection = ({profile}) => (
    <header className="mb-16 md:mb-20">
      <div
          className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-center lg:items-start">
        <div
            className="flex-shrink-0 w-64 h-80 shadow-2xl rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
          <img src="/images/JoohoonKim.jpg" alt={profile.name}
               className="w-full h-full object-cover"/>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">{profile.name}</h1>
          <p className="mt-3 text-xl lg:text-xl text-blue-600 dark:text-blue-400 font-semibold">{profile.title}</p>
          <div className="mt-8 space-y-3 text-lg text-gray-900 dark:text-white">
            <p><strong>Email:</strong> <a href={`mailto:${profile.email}`}
                                          className="hover:underline text-blue-600 dark:text-blue-400">{profile.email}</a>
            </p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Office:</strong> {profile.office}</p>
          </div>
          <div className="mt-6 flex gap-x-5 justify-center lg:justify-start">
            {profile.links.map(link => (
                <a key={link.name} href={link.url} target="_blank"
                   rel="noopener noreferrer"
                   className="text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {link.name}
                </a>
            ))}
          </div>
        </div>
      </div>
    </header>
);

const CVSection = ({title, children}) => (
    <section>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
        {title}
      </h2>
      {children}
    </section>
);

// Education 섹션의 각 항목을 렌더링하는 컴포넌트
const EducationItem = ({edu}) => (
    <ul className="space-y-4 list-disc pl-5">

      <li className="mb-4">
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        {edu.degree}
      </span>
        <span className="text-base text-gray-900 dark:text-white mt-1">
        , {edu.university}, {edu.country} ({edu.from} – {edu.to})
      </span>
      </li>
    </ul>
);

// Experience 섹션의 각 항목을 렌더링하는 컴포넌트
const ExperienceItem = ({exp}) => (
    <ul className="space-y-4 list-disc pl-5">

      <li className="mb-5">
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        {exp.role}
      </span>
        <span className="text-base text-gray-900 dark:text-white mt-1">
        , {exp.institution}, {exp.location} ({exp.period})
      </span>
        {exp.description && (
            <p
                className="text-base text-gray-900/80 dark:text-white/80 mt-1 italic">
              {exp.description}
            </p>
        )}
      </li>
    </ul>
);

// Awards 섹션의 각 항목을 렌더링하는 컴포넌트
const AwardItem = ({award}) => (
    <ul className="space-y-4 list-disc pl-5">
      <li className="text-lg text-gray-900 dark:text-white leading-relaxed flex">
        <div>
          <span className="font-semibold">{award.name}</span>
          {award.details && <em className="ml-2">({award.details})</em>}
          <span className="ml-2">, {award.year}</span>
        </div>
      </li>
    </ul>
);

// Professional Services 섹션의 각 항목을 렌더링하는 컴포넌트
const ServiceItem = ({service}) => {
  const renderTitle = (title) => {
    const parts = title.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
      <li className="mb-4">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {renderTitle(service.title)}
        </p>
        <p className="text-base text-gray-900/80 dark:text-white/80 mt-1">
          {service.description}
        </p>
      </li>
  );
};

const PublicationItem = ({pub}) => (
    <ul className="space-y-4 list-disc pl-5">
      <li className="mb-5">
        <p className="text-lg font-medium text-gray-900 dark:text-white"> {pub.title}</p>
        <p className="text-base mt-1 text-gray-900 dark:text-white">
          <span className="font-bold italic text-red-600">{pub.journal}</span>
          {pub.volume && <span
              className="font-bold "> {pub.volume}</span>}
          {pub.pages && `, pp. ${pub.pages}`}
          {pub.year && ` (${pub.year})`}
          {pub.status && ` [${pub.status}]`}
          {pub.if && <span className="font-bold ml-2">[IF: {pub.if}]</span>}
        </p>
      </li>
    </ul>
);

// --- 메인 페이지 컴포넌트 ---
function CVPage() {
  return (
      <div className="bg-white dark:bg-gray-900 min-h-screen font-noto">
        <div
            className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-16 sm:py-20 lg:py-24">
          <ProfileSection profile={cvData.profile}/>
          <main className="space-y-16">
            <CVSection title="Education">
              <ul className="space-y-4">
                {cvData.education.map(
                    (edu, i) => <EducationItem key={i} edu={edu}/>)}
              </ul>
            </CVSection>

            <CVSection title="Professional Experience">
              <ul className="space-y-4">
                {cvData.experience.map(
                    (exp, i) => <ExperienceItem key={i} exp={exp}/>)}
              </ul>
            </CVSection>

            <CVSection title="Honors and Awards">
              <ul className="space-y-3">
                {cvData.awards.map(
                    (award, i) => <AwardItem key={i} award={award}/>)}
              </ul>
            </CVSection>

            <CVSection title="Selected Publications">
              <ul className="space-y-3">
                {cvData.publications.map(
                    (pub, i) => <PublicationItem key={i} pub={pub}/>)}
              </ul>
            </CVSection>

            <CVSection title="Professional Services">
              <ul className="space-y-4">
                {cvData.services.map(
                    (service, i) => <ServiceItem key={i} service={service}/>)}
              </ul>
            </CVSection>
          </main>
        </div>
      </div>
  );
}

export default CVPage;