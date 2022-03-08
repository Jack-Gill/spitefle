import { useState } from "react";

import "./App.css";
import { copy } from "./utils";
import { Attempt } from "./components";

function App() {
  const [hardMode, setHardMode] = useState(false);

  const generate = (hardMode) => {
    let then = new Date("06/19/2021");
    let now = new Date();
    let difference = now.getTime() - then.getTime();
    let days = Math.ceil(difference / (1000 * 3600 * 24)) - 1;

    let random = Math.floor(Math.random() * 100);

    let attempts;
    let corrects = 4;

    if (random < 5) attempts = 1;
    else if (random < 15) attempts = 2;
    else if (random < 35) attempts = 3;
    else if (random < 75) attempts = 4;
    else if (random < 90) attempts = 5;
    else if (random < 97) attempts = 6;
    else attempts = 7;

    function getLetter() {
      let random = Math.floor(Math.random() * 100);
      if (corrects > 0) {
        if (random < 50) return "⬛";
        else if (random < 70) {
          corrects = corrects - 1;
          return "🟩";
        }
        return "🟨";
      }

      if (random < 30) return "⬛";
      return "🟨";
    }

    let attemptsString;
    let attemptsMap = [];

    for (
      let attemptsIndex = 0;
      attemptsIndex < attempts - 1;
      attemptsIndex += 1
    ) {
      const letters = [];
      for (
        let letterIndex = 0;
        letterIndex < 5;
        letterIndex = letterIndex + 1
      ) {
        const previousAttempt = attemptsMap[attemptsIndex - 1];
        console.log(previousAttempt);
        if (
          hardMode &&
          previousAttempt &&
          previousAttempt[letterIndex] === "🟩"
        ) {
          letters.push("🟩");
        } else {
          letters.push(getLetter());
        }
      }
      attemptsMap.push(letters);
      if (!hardMode) corrects = 4;
    }

    if (attempts < 7) {
      attemptsString = attempts.toString();
      attemptsMap.push(["🟩", "🟩", "🟩", "🟩", "🟩"]);
    } else {
      attemptsString = "X";
    }

    console.log(attemptsMap);

    const title = `Wordle ${days} ${attemptsString}/6 ${hardMode ? "*" : ""}`;
    let resultAsString = title + "\n";

    attemptsMap.forEach((attempt) => {
      resultAsString = resultAsString + "\n" + attempt.join("");
    });

    return {
      title,
      resultAsString,
      attemptsMap,
    };
  };

  const [result, setResult] = useState(generate());

  return (
    <div className="App">
      <header className="App-header">
        <p>{result.title}</p>
        {result.attemptsMap.map((attempt, index) => {
          return <Attempt key={`attempt${index}`}>{attempt}</Attempt>;
        })}
        <br />
        <button onClick={() => setResult(generate(hardMode))}>
          Regenerate
        </button>
        <br />
        <label>
          <input
            type="checkbox"
            checked={hardMode}
            onChange={() => {
              setHardMode(!hardMode);
              setResult(generate(!hardMode));
            }}
          />
          Hard Mode
        </label>
        <br />
        <button onClick={() => copy(result.resultAsString)}>
          Copy To Clipboard
        </button>
      </header>
    </div>
  );
}

export default App;
