import React, { useEffect, useState } from 'react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { useForm } from 'react-hook-form';
import styles from './IntroForm.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { queryByPlaceholderText } from '@testing-library/react';

// Call your Cloud Function
const addMessage = httpsCallable(functions, 'addMessage');

const stepVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// const questions = [
//   { text: "next q 1", field: "who" },
//   { text: "next q 2", field: "what" }
//   // Add more existing questions as needed
// ];

let result={questions:[]};

function IntroForm() {
  // useState is a hook (like a digital sticky note) which creates two state variables that we can update
  // we use this instead of a typical 'let' variable bc when useState updates the state it informs React to re-render which updates the UI (normal variable don't)
  // const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, reset } = useForm();
  const [nextQ, setNextQ] = useState("this is the wrong q");

  const handleNext = async (data) => {

    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    reset();

      
    // submitting form
    if (currentStep === 9) {
      //setIsSubmitting(true);
      // triyng to submit form
      try {
        // trying to send info to firebase
        try {
            while (currentStep === 9) {
              try {
                const qData = await addMessage({newFormData});
                result = JSON.parse(qData.data);
                console.log(result);
                console.log(result.questions[currentStep-9].question);
                setNextQ(result.questions[currentStep-9].question);
                break;
              } catch (error) {
                console.log('API call responded in wrong format, resending call');
              }
            }
          } catch (error) {
            console.error('Error sending data to Cloud Function:', error);
          }
        // will update in the next render cycle (ie. when next is clicked)
        setCurrentStep(10);
      }
       catch (error) {
        console.error('Error submitting form:', error);
      }
      // submit form
    } else if (currentStep === 9+(result.questions.length)){
        alert('Form submitted successfully');
        reset();
        setCurrentStep(1);
        setFormData({});
      // we want to submit to new fb func to store in cloud
      // loop until info obtained?
      // 1. use this info to generate a plan via API call
      // 2. retrieve plan + display it to user
      // 3. input box + functionality to ask qs ab plan/regenerate/specify things
      // 4. loop until user happy w plan?
      // 5. send to next page -> generate modules
    }
      else {
        if (currentStep > 9 ) {
          setNextQ(result.questions[currentStep-9].question);
        }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setNextQ(result.questions[currentStep-9].question);
  };

  // const handleAddQuestion = (newQuestionText) => {
  //   const newQuestion = { text: newQuestionText, field: `new_field_${questions.length}` };
  //   setQuestions([...questions, newQuestion]);
  //   setCurrentStep(questions.length); // Go to the new question step
  // };
  
  return (
    <div className={styles.container}>
    <header className="App-header">
      <form onSubmit={handleSubmit(handleNext)} noValidate>
        <AnimatePresence wait>
            {currentStep === 1 && (
                <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.step}
                style={{ position: 'absolute'}}>
                  <p>Who are you?</p>
                  {/*'register' is provided by react hook form to pass input into form handling system*/}              
                  <input placeholder="I am a..." {...register('who', { required: true })} />
                  <br></br>
                  <button type="submit">Next</button>
                </motion.div>
            )}
            {currentStep === 2 && (
                <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={styles.step}
                style={{ position: 'absolute'}}>
                  <p>What do you want to build?</p>
                  <input placeholder="I want to..." {...register('what', { required: true })} />
                  <br></br>
                  <button type="button" onClick={handleBack}>Back</button>
                  <button type="submit">Next</button>
                </motion.div>
            )}
            {currentStep === 3 && (
              <motion.div
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>Do you learn better via text or video?</p>
                <input placeholder="I learn by..." {...register('how_learn', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 4 && (
              <motion.div
              key="step4"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>How many weeks do you want to build your project in?</p>
                <input {...register('timeline', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 5 && (
              <motion.div
              key="step5"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>What relevant skills do you have?</p>
                <input {...register('skills', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 6 && (
              <motion.div
              key="step6"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>What are your project goals?</p>
                <input {...register('goals', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 7 && (
              <motion.div
              key="step7"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>If scoped out, what is your experimental design?</p>
                <input {...register('design', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 8 && (
              <motion.div
              key="step8"
              variants={stepVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.step}
              style={{ position: 'absolute'}}>
                <p>What are the features of your dataset?</p>
                <input {...register('dataset', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {currentStep === 9 && (
            <motion.div
            key="step9"
            variants={stepVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={styles.step}
            style={{ position: 'absolute'}}>
                <p>Do you have any additional information that you would like to submit?</p>
                <input {...register('additional', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}

          {currentStep >= 10 && (
            <motion.div
            key={`step${currentStep}`}
            variants={stepVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={styles.step}
            style={{ position: 'absolute'}}>
                <p>{nextQ}</p>
                <input {...register("additional info", { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
            {/* next need to figure out how to retain info/in input boxes as well */}

            {/* {currentStep >= 10 && (
            //   <motion.div
            //     key={currentStep}
            //     variants={stepVariants}
            //     initial="initial"
            //     animate="enter"
            //     exit="exit"
            //     className="step"
            //     style={{ position: 'absolute' }}
            //   >
            //     { <p>{result.questions[currentStep-9].question}</p> }
              // <p>{nextQ}</p>
            //     <input {...register('', { required: true })} />
            //     <br></br>
            //     <button type="button" onClick={handleBack} disabled={currentStep === 0}>
            //       Back
            //     </button>
            //     <button type="submit">
            //       { {currentStep === result.questions.length - 1 ? 'Submit' : 'Next'} }
            //     </button>
            //   </motion.div>
            // )} */}
          </AnimatePresence> 
      </form>

    <div>
      <div className={`${styles.drop} ${styles['drop-1']}`}></div>
      <div className={`${styles.drop} ${styles['drop-2']}`}></div>
      <div className={`${styles.drop} ${styles['drop-3']}`}></div>
      <div className={`${styles.drop} ${styles['drop-4']}`}></div>
      <div className={`${styles.drop} ${styles['drop-5']}`}></div>
    </div>

    </header>
  </div>
  );
}

export default IntroForm;