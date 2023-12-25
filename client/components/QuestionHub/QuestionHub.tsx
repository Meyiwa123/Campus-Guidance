import './QuestionHub.scss';
import { useState } from "react";
import Select from 'react-select';
import Alert from '@mui/material/Alert';
import { Snackbar } from '@mui/material';
import emailValidator from 'email-validator';
import UniversityList from "../UniversityList/UniversityList";
import { academicLevels, institutions, program_duration, programNames, programTypes} from '../../data/data';

interface QuestionFormData {
  name: string;
  email: string;
  academicLevel: string[];
  institutionInterest: string[];
  programName: string[];
  programType: 'apprenticeship program' | 'internship' | 'co-op';
  programDuration: number;
}

interface QuestionData {
  title: string;
  questions: {
    [questionText: string]: keyof QuestionFormData;
  }[];
}

const QuestionHub = ({ questions }: { questions: QuestionData[] }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];
  const [redirectToUniversityList, setRedirectToUniversityList] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const [formData, setFormData] = useState<QuestionFormData>({
    name: "",
    email: "",
    academicLevel: [],
    institutionInterest: [],
    programName: [],
    programType: "apprenticeship program",
    programDuration: 0,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const onClickNext = () => {
    console.log(formData);

    // Check if it's the last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Form submission logic
      console.log("Form submitted");
      submitFormData();
    }
  };

  const submitFormData = async () => {
    const backendUrl = 'http://localhost:5000'
    const endpoint = '/api/submit-form-data';
    try {
      // Send the form data to the backend
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Form data submitted successfully');
        const responseData = await response.json();
        setUniversities(responseData);
        setRedirectToUniversityList(true);
      } else {
        console.error('Failed to submit form data');
        setError('Failed to submit form data');
      }
    } catch (error) {
      console.error('Error occurred while submitting form data', error);
      setError('Error occurred while submitting form data');
      setOpen(true);
    }
  };

  // Redirect to UniversityList when redirectToUniversityList is true
  if (redirectToUniversityList) {
    return <UniversityList universities = {universities}/>;
  }

  const onClickPrevious = () => {
    // Check if it's the first question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleEmailChange = (email: string) => {
    const isValid = emailValidator.validate(email);
    setIsEmailValid(isValid);
  };

  const isFormValid = () => {
    return isEmailValid;
  };

  // Convert programName, programDuration, academicLevels and institutions to options format
  const programDurationOptions = Object.entries(program_duration).map(([duration, hourEquivalent]) => ({
    value: hourEquivalent,
    label: duration,
  }));
  const academicLevelOptions = academicLevels.map((level) => ({ value: level, label: level }));
  const programTypeOptions = programTypes.map((programType) => ({ value: programType, label: programType }));
  const institutionOptions = institutions.map((institution) => ({ value: institution, label: institution }));
  const programNameOptions = programNames.map((programName) => ({ value: programName, label: programName }));

  return (
    <div className="question-container">
      <>
        <span className="active-question-number">{currentQuestionIndex + 1}</span>
        <span className="total-question">/{questions.length}</span>
        <h2>{currentQuestion.title}</h2>

        {currentQuestion.questions.map((questionGroup, index) => (
          <div key={index}>
            {Object.entries(questionGroup).map(([questionText, questionKey]) => (
              <div key={questionKey}>
                <label>{questionText}</label>
                <br />
                  { questionKey === 'academicLevel' || questionKey === 'institutionInterest' || questionKey === 'programName' ? (
                    <Select
                      isMulti
                      options={
                        questionKey === 'academicLevel'
                          ? academicLevelOptions
                          : questionKey === 'programName'
                          ? programNameOptions
                          : institutionOptions
                      }
                      value={
                        Array.isArray(formData[questionKey])
                          ? (formData[questionKey] as string[]).map((value) => ({ value, label: value }))
                          : formData[questionKey]
                          ? { value: formData[questionKey] as unknown as string, label: formData[questionKey] as unknown as string }
                          : null
                      }
                      onChange={(selectedOptions) =>
                        handleChange(
                          questionKey,
                          selectedOptions.map((option) => option.value).join(',')
                        )
                      }
                    />
                  ) : questionKey === 'email' ? (
                    <input
                      type="text"
                      className="input-field"
                      value={formData[questionKey] as string}
                      onChange={(e) => {
                        handleChange(questionKey, e.target.value);
                        handleEmailChange(e.target.value);
                      }}
                    />
                  ) : questionKey === 'programType' ? (
                    <select
                      className="input-field"
                      value={formData[questionKey]}
                      onChange={(e) => handleChange(questionKey, e.target.value)}
                    >
                      {programTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                      ))}
                    </select>
                  ): questionKey === 'programDuration' ? (
                    <Select
                      isClearable
                      options={programDurationOptions}
                      value={programDurationOptions.find((option) => option.value === formData[questionKey])}
                      onChange={(selectedOption) =>
                        handleChange(questionKey, selectedOption ? String(selectedOption.value) : '')
                      }
                    />
                  ) : (
                    /* For other types of questions, use a regular input */
                    <input
                      type="text"
                      className="input-field"
                      value={formData[questionKey]}
                      onChange={(e) => handleChange(questionKey, e.target.value)}
                    />
                  )}
              </div>
            ))}
          </div>
        ))}

        <div className="button">
            <button onClick={onClickPrevious} disabled={currentQuestionIndex === 0} className="previous-button">
                Previous
            </button>
            <button disabled={!isFormValid()} onClick={onClickNext} className="next-button">
                {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
        </div>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </>
    </div>
  );
};

export default QuestionHub;