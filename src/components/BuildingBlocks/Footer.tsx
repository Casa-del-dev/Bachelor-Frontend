import "./Footer.css";

type Publication = {
  id: string; // stable key, anything unique
  title: string; // work title
  authors: string[]; // ["First Last", ...]
  year: number; // 2025
  venue?: string; // e.g., "ETH Zürich", "arXiv:2502.19133"
  link?: string; // optional external link
  note?: string; // extra note, e.g., "Bachelor Thesis"
};

const PUBLICATIONS: Publication[] = [
  {
    id: "dbox-plus-2025",
    title: "DBox Plus: An AI-Assisted Code Learning Tutor",
    authors: ["Eren Homburg"],
    year: 2025,
    venue: "ETH Zürich",
    note: "Supervisor: April Yi Wang",
  },
  {
    id: "dbox-learner-llm-2025",
    title:
      "DBox: Scaffolding Algorithmic Programming Learning through Learner-LLM Co-Decomposition",
    authors: [
      "Shuai Ma",
      "Junling Wang",
      "Yuanhao Zhang",
      "Xiaojuan Ma",
      "April Yi Wang",
    ],
    year: 2025,
    venue: "arXiv:2502.19133",
    link: "https://arxiv.org/abs/2502.19133",
  },
];

const FOOTER_RIGHT_LABEL = "Bachelor Thesis";
const CONTACT_EMAIL = "ehomburg@ethz.ch";
const ORG_NAME = "PEACH Lab";

function formatAuthors(authors: string[]) {
  if (authors.length <= 2) return authors.join(" and ");
  return `${authors.slice(0, -1).join(", ")}, and ${
    authors[authors.length - 1]
  }`;
}

function PublicationItem({ pub }: { pub: Publication }) {
  const title = pub.link ? (
    <a
      href={pub.link}
      target="_blank"
      rel="noopener noreferrer"
      className="pub-title-link"
    >
      {pub.title}
    </a>
  ) : (
    <span className="pub-title">{pub.title}</span>
  );

  return (
    <li className="pub-item">
      {title}
      <span className="pub-authors">. {formatAuthors(pub.authors)}.</span>{" "}
      <span className="pub-venue">
        {pub.venue ? `${pub.venue}. ` : ""}
        {pub.year}.
      </span>
      {pub.note ? <span className="pub-note"> {pub.note}.</span> : null}
    </li>
  );
}

const Footer = ({ condition }: { condition: boolean }) => {
  return (
    <footer className={`app-footer ${condition ? "faded" : ""}`}>
      <div className="footer-content">
        <div className="allThesis-container">
          <div className="allthesis-title">Complete Research Record</div>
          <ul className="allThesis-list">
            {PUBLICATIONS.map((p) => (
              <PublicationItem key={p.id} pub={p} />
            ))}
          </ul>
        </div>

        <div className="footer-lineEnd">
          <p>{FOOTER_RIGHT_LABEL}</p>
          <p>{CONTACT_EMAIL}</p>
          <p>
            &copy; {new Date().getFullYear()} {ORG_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
