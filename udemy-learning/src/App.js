import { useEffect, useState } from "react";
import supabase from "./supabase";

import "./style.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        try {
          let url = "http://localhost:5295/api/Facts";
          if (currentCategory !== "all") {
            url = `http://localhost:5295/api/Facts/${currentCategory}`;
          }
          const response = await fetch(url);
          const facts = await response.json();

          if (response.ok) setFacts(facts);
          else alert("There was a problem getting data");
        } catch (error) {
          alert("There was a problem getting data");
        }
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );


  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Today I Learned";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I Learned Logo" />
        <h1>{appTitle}</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  // Fixed in a video text overlay
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(text, source, category);

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      setIsUploading(true);

      const newFact = { text, source, category };

      try {
        const response = await fetch("http://localhost:5295/api/Facts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newFact)
        });

        if (response.ok) {
          setFacts((facts) => [newFact, ...facts]);
          setText("");
          setSource("");
          setCategory("");
          setShowForm(false);
        } else {
          alert("There was a problem creating the fact");
        }
      } catch (error) {
        console.log(error);
        alert("There was a problem creating the fact");
      } finally {
        setIsUploading(false);
      }
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0)
    return (
      <p className="message">
        No facts for this category yet! Create the first one ✌️
      </p>
    );

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.voteInteresting + fact.voteMindblowing < fact.voteFalse;

  async function handleVote(voteType) {
    setIsUpdating(true);
    const voteUrlMap = {
      "voteInteresting": `http://localhost:5295/api/Facts/${fact.id}/voteInteresting`,
      "voteMindblowing": `http://localhost:5295/api/Facts/${fact.id}/voteMindblowing`,
      "voteFalse": `http://localhost:5295/api/Facts/${fact.id}/voteFalse`
    };

    try {
      const response = await fetch(voteUrlMap[voteType], {
        method: "PUT"
      });

      if (response.ok) {
        setFacts((facts) =>
          facts.map((f) => {
            if (f.id === fact.id) {
              return {
                ...f,
                [voteType]: f[voteType] + 1
              };
            }
            return f;
          })
        );
      } else {
        alert("There was a problem updating the vote");
      }
    } catch (error) {
      console.log(error);
      alert("There was a problem updating the vote");
    } finally {
      setIsUpdating(false);
    }
  }


  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔️ DISPUTED]</span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("voteInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.voteInteresting}
        </button>
        <button
          onClick={() => handleVote("voteMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.voteMindblowing}
        </button>
        <button onClick={() => handleVote("voteFalse")} disabled={isUpdating}>
          ⛔️ {fact.voteFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
