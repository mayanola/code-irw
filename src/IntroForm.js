import React, { useEffect, useState } from 'react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { useForm } from 'react-hook-form';
import styles from './IntroForm.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { FollowTheSigns } from '@mui/icons-material';

// Call your Cloud Function
const followUp = httpsCallable(functions, 'followUp');
const generatePlan = httpsCallable(functions, 'generatePlan');

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

let result={questions:[]};

function IntroForm() {
  // useState is a hook (like a digital sticky note) which creates two state variables that we can update
  // we use this instead of a typical 'let' variable bc when useState updates the state it informs React to re-render which updates the UI (normal variable don't)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, reset, setValue } = useForm();
  const [followUpQs, setFollowUpQs] = useState();
  const [nextQ, setNextQ] = useState();
  const [followupLength, setfollowupLength] = useState();
  const [plan, setPlan] = useState();

  const handleNext = async (data) => {

    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
      
    // submitting form
    if (currentStep === 9) {
      setIsSubmitting(true);
      // triyng to submit form
      try {
        // trying to send info to firebase
        try {
            while (currentStep === 9) {
              try {
                const qData = await followUp({newFormData});
                const result = JSON.parse(qData.data);
                
                setFollowUpQs(result.questions);
                setfollowupLength(result.questions.length);
                setNextQ(result.questions[0].question);
                reset();
                break;
              } catch (error) {
                console.log('API call responded in wrong format, resending call', error);
              }
            }
          } catch (error) {
            console.error('Error sending data to Cloud Function:', error);
          } finally {
            // will update in the next render cycle (ie. when next is clicked)
            setCurrentStep(currentStep + 1);
            setIsSubmitting(false);
          }
      }
       catch (error) {
        console.error('Error submitting form:', error);
      }
      // submit form
    } else if (currentStep === 9+(followupLength)){
        setIsSubmitting(true);
        try {
          console.log(newFormData);
          const plan = await generatePlan({newFormData});
          setPlan(plan.data);
          setCurrentStep(currentStep + 1);
        } catch (error) {
          console.error('Error retrieving plan: ', error);
        } finally {
          reset();
          //setCurrentStep(1);
          setIsSubmitting(false);
        }
      // we want to submit to new fb func to store in cloud
      // loop until info obtained?
      // 1. use this info to generate a plan via API call - DONE
      // 2. retrieve plan + display it to user -> to do next
      // 3. input box + functionality to ask qs ab plan/regenerate/specify things
      // 4. loop until user happy w plan?
      // 5. send to next page -> generate modules
    } 
      else {
        if (currentStep > 9 && currentStep < 10+followupLength) {
          setNextQ(followUpQs[currentStep-9].question);
        }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    //currentStep may be outdated so must calculate prev step first
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    console.log(prevStep);
    setValue(`answer${prevStep}`, formData[`answer${prevStep}`] || '');
  };

  // need to use this because hooks update asynchronously so previous q was not showing up properly
  useEffect(() => {
    if (currentStep >= 10 && currentStep < 10 + followupLength) {
      const question = followUpQs[currentStep - 10]?.question || '';
      setNextQ(question);
    }
  }, [currentStep, followUpQs, followupLength]);
  
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
                  <input placeholder="I am a..." {...register('answer1', { required: true })} />
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
                  <input placeholder="I want to..." {...register('answer2', { required: true })} />
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
                <input placeholder="I learn by..." {...register('answer3', { required: true })} />
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
                <input {...register('answer4', { required: true })} />
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
                <input {...register('answer5', { required: true })} />
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
                <input {...register('answer6', { required: true })} />
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
                <input {...register('answer7', { required: true })} />
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
                <input {...register('answer8', { required: true })} />
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
                <input {...register('answer9', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                {/* <button type="submit">Next</button> */}
                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
              </motion.div>
            )}

          {currentStep >= 10 && currentStep < 10+followupLength && (
            <motion.div
            key={`step${currentStep}`}
            variants={stepVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={styles.step}
            style={{ position: 'absolute'}}>
                <p>{nextQ}</p>
                <input {...register(`answer${currentStep}`, { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
              </motion.div>
            )}
            {currentStep >= 10+followupLength && (
            <motion.div
            key={`step${currentStep}`}
            variants={stepVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={styles.step}
            style={{ position: 'absolute'}}>
                {/* <p>{plan}</p> */}
                {/* in designing plan:  make plan smaller + make it show up as numbered list? or something like that
                need to change css*/}
                <p>plan goes here</p>
                <input {...register(`planFollowUp`, { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Next'}
                </button>
              </motion.div>
            )}
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