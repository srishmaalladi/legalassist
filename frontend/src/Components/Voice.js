import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import char from '../Components/images/char.png';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function VoiceAssistant(props) {
  const jsonData = props.data;
  const isDarkMode=props.isDarkMode;
  const [searchText, setSearchText] = useState('');
  const [repeatButton, setRepeatButton] = useState(true);
 //Fetching the data from backend
  const [inputSource, setInputSource] = useState('');
  const { transcript, listening, resetTranscript, isMicrophoneAvailable, browserSupportsSpeechRecognition } = useSpeechRecognition({ onEnd: () => submit() });
  const [mytranscript, newtranscript] = useState(transcript);
  const { speak } = useSpeechSynthesis();
  const handleSearch = () => {
    // console.log('Search Text:', searchText);
    findanswer(searchText);
    setRepeatButton(true);
    setInputSource('text');
  };

  function calculateMatchingWords(str1, str2) {
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    let matchCount = 0;
    for (const word1 of words1) {
      if (words2.includes(word1)) {
        matchCount++;
      }
    }
    return matchCount;
  }

  function findanswer(transcript) {
    if (jsonData && jsonData.length > 0) {
      let maxMatchCount = 0;
      let bestMatchQuestion = null;
      const lowerCaseInput = transcript.toLowerCase();
      for (const question of jsonData) {
        const matchCount = calculateMatchingWords(lowerCaseInput, question.question);
        if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount;
          bestMatchQuestion = question;
        }
      }
      if (bestMatchQuestion) {
        console.log("Answer: ", bestMatchQuestion.answer);
        newtranscript(bestMatchQuestion.answer);
        if (inputSource === 'voice') {
          speak({ text: bestMatchQuestion.answer });
        }

      }
      else {
        console.log("No matching answer found for the given question.");
        newtranscript("No matching answer found for the given question.");
        if (inputSource === 'voice') {
          speak({ text: "No matching answer found for the given question." });
        }
      }
    }
    else {
      console.log("No questions found in the JSON data.");
      newtranscript("No questions found in the JSON data.");
      if (inputSource === 'voice') {
        speak({ text: "No questions found in the JSON data." });
      }
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  if (!isMicrophoneAvailable) {
    // alert('MicroPhone access is denied');
  }
  function check() {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
      // If starting listening for the second time, reset the right div
      if (transcript) {
        newtranscript('');
        resetTranscript();
      }
    }
  }

  function submit() {
    if (!listening) {
      return null;
    } else {
      setRepeatButton(true);
      findanswer(transcript);
      setInputSource('voice');  
    }
  }

  function clicks() {
    check();
    submit();
  }
  function reset() {
    resetTranscript();
    newtranscript('');
  }
  

  return (
    <>
      <div className="container-fluid">
        {/* <div className="row" style={{background: "linear-gradient(90deg, rgba(0,120,183,1) 0%, rgba(7,24,68,1) 100%)"}}> */}
        <div className="row" style={{backgroundColor:isDarkMode?"#45474B":"#D8E9F0"}}>
          <div className="col-sm-5 d-flex flex-column align-items-center justify-content-center" style={{ margin: "0vh" }}>
            <img src={char} alt='our char' />
            <div className="text-center">
              <button className="btn btn-danger" onClick={clicks} style={{ borderRadius: '50%', marginRight: '10px' }}>
                {listening ? <span className="material-symbols-outlined" style={{ fontSize: '4  5px' }}>
                  mic_off
                </span> : <span className="material-symbols-outlined" style={{ fontSize: '45px' }}>
                  mic
                </span>}
              </button>

              <button className="btn btn-danger" onClick={reset} style={{ borderRadius: '50%'}}>
                <span className="material-symbols-outlined" style={{ fontSize: '45px' }}>refresh</span>
              </button>

            </div>
          </div>
          
          <div className="col-sm-4 d-flex flex-column align-items-center justify-content-center" style={{ height: "95vh"  }} >
            {/* <div className="input-group container-fluid" style={{ borderRadius:"40%"}}>
              <input style={{ backgroundColor: 'transparent',lineHeight:"10px",width:"200px" }} 
                type="text" className="form-control"  placeholder="Search..." value={searchText}
                onChange={(e) => setSearchText(e.target.value)}>
              </input>
              <button style={{"borderRadius":"50%" ,"lineHeight":"10em"}}
               type="button" onClick={handleSearch}>
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
             </div> */}
               <div className="d-flex container-fluid" style={{ width:"100%",backgroundColor:"transparent",border:'2px solid black',borderRadius:'30px'}} >
        <input
          style={{
            backgroundColor: 'transparent',
            height: "auto",
           borderColor:'transparent ',boxShadow:'none',
            paddingRight: '40px',width:'80%',
      fontSize:'larger', fontFamily:'cursive',
          }}
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          aria-label="Search Input"
        />
      
        <button
        style={{ position :'relative',top:'0',right:'0',backgroundColor:'transparent',color:'black' }}type="button" onClick={handleSearch}
        aria-label="Search Button"
        >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
            <div className="response conatiner-fluid text-center" id='resu' style={{  backgroundColor: transcript || mytranscript ? "#F1F1F1" : "#f1f1f1", transition: "background-color 0.5s ease", borderRadius: "50px" }} >
              <div className="row-2 text-center my-4 container-fluid" style={{ padding: "2%", margin: "2%", fontSize: "18px", fontWeight: "bold" }} >
                {transcript}
              </div>
              <div className="row-2 text-center position-relative" style={{ fontSize: "18px", padding: "2%", margin: "2%" }} >
                {mytranscript !== "" ? (
                  <>
                    {mytranscript}
                    {repeatButton && <div className="d-grid gap-2 col-2 mx-auto text-center  bottom-0 end-0">
                      <button className="btn btn-primary" onClick={() => speak({ text: mytranscript })} type="button" aria-label="Repeat Button">Repeat</button>
                    </div>}
                  </>
                ) : (<></>)}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}