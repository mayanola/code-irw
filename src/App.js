import React, { useEffect, useState } from 'react';
import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';
import { useForm } from 'react-hook-form';
import './App.scss'; // Import the CSS file
import { motion, AnimatePresence } from 'framer-motion';

// Call your Cloud Function
const addMessage = httpsCallable(functions, 'addMessage');

const stepVariants = {
  initial: {
    opacity: 0,
    //x: -100,
  },
  enter: {
    opacity: 1,
   // x: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
   // x: 100,
    transition: {
      duration: 0.5,
    },
  },
};

function App() {
  // useState is a hook (like a digital sticky note) which creates two state variables that we can update
  // we use this instead of a typical 'let' variable bc when useState updates the state it informs React to re-render which updates the UI (normal variable don't)
  // const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, reset } = useForm();

  const handleNext = async (data) => {

    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    //data.preventDefault();

      
    // submitting form
    if (currentStep === 9) {
      //setIsSubmitting(true);
      // triyng to submit form
      try {
        // trying to send info to firebase
        try {
            const result = await addMessage({newFormData});
            console.log('Response from Cloud Function:', result.data);
            console.log(newFormData);        
          } catch (error) {
            console.error('Error sending data to Cloud Function:', error);
          }
        // send info to Firebase
        alert('Form submitted successfully');
        reset();
        setCurrentStep(1);
        setFormData({});
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      // submit form
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // // updates the inputValue state whenever the input value changes
  // const handleInputChange = (event) => {
  //   setInputValue(event.target.value);
  // };

  // // logs the current state of input value
  // const handleSubmit = async (event) => {
  //   try {
  //     event.preventDefault(); // Prevent the default form submission behavior of a reload (we don't want to reload the page just update logs/database)
  //     console.log("value before: ", inputValue);
  
  //     const result = await addMessage({ text: inputValue });
  
  //     console.log('Response from Cloud Function:', result.data);
  //     //setInputValue(''); // Clear input field

  //     const displayText = result.data.uppercase;
  //     setInputValue(displayText);


  //   } catch (error) {
  //     console.error('Error sending data to Cloud Function:', error);
  //   }

  // };

  // db.collection('messages').doc(messageId).onSnapshot((doc) => {
  //   if (doc.exists) {
  //     const data = doc.data();
  //     console.log('Document data:', data);
  //     // Handle the updated data
  //   } else {
  //     console.log('No such document!');
  //   }
  // }, (error) => {
  //   console.error('Error fetching document:', error);
  // });

  
  return (
    <div className="App" class="container">
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
                className="step"
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
                className="step"
                style={{ position: 'absolute'}}>
                  <p>What do you want to do?</p>
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
              className="step"
              style={{ position: 'absolute'}}>
                <p>How do you learn best?</p>
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
              className="step"
              style={{ position: 'absolute'}}>
                <p>What is your timeline?</p>
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
              className="step"
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
              className="step"
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
              className="step"
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
              className="step"
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
            className="step"
            style={{ position: 'absolute'}}>
                <p>Do you have any additional information that you would like to submit?</p>
                <input {...register('additional', { required: true })} />
                <br></br>
                <button type="button" onClick={handleBack}>Back</button>
                <button type="submit">Next</button>
              </motion.div>
            )}
          </AnimatePresence>
      </form>

    <div class="drops">
      <div class="drop drop-1"></div>
      <div class="drop drop-2"></div>
      <div class="drop drop-3"></div>
      <div class="drop drop-4"></div>
      <div class="drop drop-5"></div>
    </div>

    </header>
  </div>
  );
}

export default App;
