import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
} from "semantic-ui-react";

import mindImg from "../../images/mind.svg";
import { getStudentRating } from "../../model/model.mjs";

import {
  CATEGORIES,
  NUM_OF_QUESTIONS,
  DIFFICULTY,
  QUESTIONS_TYPE,
  COUNTDOWN_TIME,
} from "../../constants";
import { shuffle } from "../../utils";

import Offline from "../Offline";

const Main = ({ startQuiz }) => {
  // State variables for quiz configuration
  const [category, setCategory] = useState("0");
  const [numOfQuestions, setNumOfQuestions] = useState(5);
  const [questionsType, setQuestionsType] = useState("0");
  const [difficulty, setDifficulty] = useState("easy");
  const [countdownTime, setCountdownTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [rating, setRating] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  // Fetch student's rating and determine difficulty and countdown time based on rating
  useEffect(() => {
    const studentInfo = {
      grades: "A+ in Mathematics, A++ in English",
      hobbies: "VERY GOOD",
      unique_skills: "VEREY GOOD",
      daily_activity: "VERY GOOD",
      prof_remarks: `VERY VERY GOOD STUDENT`,
      attendance: "VERY VERY GOOD",
      participation: "VERY VERY GOOD",
      assignments: "VERY VERY GOOD",
      teamwork: "VERY GOOD",
      punctuality: "ALWAYS ON TIME",
      focus: "VERY GOOD",
      communication: "VERY GOOD",
      progress: "VERY GOOD",
      problem_solving: "VERY GOOD",
      behavior: "VERY GOOD",
    };

    // Fetch the student's rating and set the difficulty and countdown time based on the rating
    const fetchRatingAndSetQuizParameters = async () => {
      try {
        const result = await getStudentRating(studentInfo);
        const ratingString = result[result.length - 1];
        const numberPattern = /\d+/;
        const matchResult = ratingString.match(numberPattern);
        if (matchResult) {
          const RATING = parseInt(matchResult[0], 10);
          setRating(RATING);
          const { difficulty, timeLimit } = determineDifficultyAndTime(RATING);
          setDifficulty(difficulty);
          setCountdownTime(timeLimit);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        setError({ message: "Error fetching rating." });
      }
    };

    fetchRatingAndSetQuizParameters();
  }, []);

  // Determine quiz difficulty and countdown time based on rating
  const determineDifficultyAndTime = (rating) => {
    let difficulty;
    let timeLimit;

    if (rating >= 8) {
      difficulty = "hard";
      timeLimit = { hours: 0, minutes: 5, seconds: 0 };
    } else if (rating >= 5) {
      difficulty = "medium";
      timeLimit = { hours: 0, minutes: 10, seconds: 0 };
    } else {
      difficulty = "easy";
      timeLimit = { hours: 0, minutes: 20, seconds: 0 };
    }

    return { difficulty, timeLimit };
  };

  // Automatically start the quiz when all fields are set and ready
  useEffect(() => {
    if (
      category &&
      numOfQuestions &&
      questionsType &&
      rating !== null &&
      countdownTime.hours + countdownTime.minutes + countdownTime.seconds > 0 &&
      !processing
    ) {
      fetchData();
    }
  }, [category, numOfQuestions, questionsType, rating, countdownTime, processing]);

  // Fetch quiz data from the API and start the quiz
  const fetchData = () => {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=${questionsType}`;

    fetch(API)
      .then((response) => response.json())
      .then((data) =>
        setTimeout(() => {
          const { response_code, results } = data;

          if (response_code === 1) {
            const message = (
              <p>
                The API doesn't have enough questions for your query. (For example, asking for 50 questions in a category that only has 20.)
                <br />
                <br />
                Please change the <strong>No. of Questions</strong>, <strong>Difficulty Level</strong>, or <strong>Type of Questions</strong>.
              </p>
            );

            setProcessing(false);
            setError({ message });
            return;
          }

          // Shuffle answer options for each question
          results.forEach((element) => {
            element.options = shuffle([
              element.correct_answer,
              ...element.incorrect_answers,
            ]);
          });

          setProcessing(false);
          startQuiz(results, countdownTime.hours * 3600 + countdownTime.minutes * 60 + countdownTime.seconds);
        }, 1000)
      )
      .catch((error) =>
        setTimeout(() => {
          if (!navigator.onLine) {
            setOffline(true);
          } else {
            setProcessing(false);
            setError(error);
          }
        }, 1000)
      );
  };

  if (offline) return <Offline />;

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image src={mindImg} />
            <Item.Content>
              <Item.Header>
                <h1>The Ultimate Trivia Quiz</h1>
              </Item.Header>
              {error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )}
              <Divider />
              <Item.Meta>
                <p>In which category do you want to play the quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="category"
                  placeholder="Select Quiz Category"
                  header="Select Quiz Category"
                  options={CATEGORIES}
                  value={category}
                  onChange={(e, { value }) => setCategory(value)}
                  disabled={processing}
                />
                <br />
                <p>How many questions do you want in your quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="numOfQ"
                  placeholder="Select No. of Questions"
                  header="Select No. of Questions"
                  options={NUM_OF_QUESTIONS}
                  value={numOfQuestions}
                  onChange={(e, { value }) => setNumOfQuestions(value)}
                  disabled={processing}
                />
                <br />
                <p>Which type of questions do you want in your quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="type"
                  placeholder="Select Questions Type"
                  header="Select Questions Type"
                  options={QUESTIONS_TYPE}
                  value={questionsType}
                  onChange={(e, { value }) => setQuestionsType(value)}
                  disabled={processing}
                />
              </Item.Meta>
              <Divider />
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;

