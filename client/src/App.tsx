import './App.scss'
import { useEffect } from 'react';
import { questions } from '../data/questions';
import Preloader from '../components/Preloader/Preloader';
import QuestionHub from '../components/QuestionHub/QuestionHub';
import {
  fetchInstitutions,
  fetchAcademicLevels,
  fetchPrograms,
  fetchProgramTypes,
} from '../data/data'; 

function App() {
  useEffect(() => {
    // Fetch data when the component mounts
    fetchInstitutions();
    fetchAcademicLevels();
    fetchPrograms();
    fetchProgramTypes();
  }, []);

  return (
    <>
      <Preloader />
      <QuestionHub questions={questions} />
    </>
  );
}

export default App
