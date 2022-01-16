import { style } from '@mui/system';
import { type } from '@testing-library/user-event/dist/type';
import React, {useState} from 'react';

// class LeftNavbar extends React.Component {
const LeftNavbar = (props) => {
  return (
    <div className="leftNavbar" style={{width: props.width}}>
      <h1>SentiCom</h1>
      <p className='paragraph'>The internet can be a beautiful place, but it can also be a breeding ground for bullying and harassment, particularly towards women, people of color, and other marginalized groups. SentiCom is a webapp which utilizes the power of Google’s Perspective API to perform sentiment analysis on the comments section of any YouTube video. We aim to provide a service through which socioanthropological and psychological researchers (or anyone interested in the power of the language we use) may easily glean useful insights on how online harassment affects content creators of different identities and demographics.</p>
      <p>Learn more about the impact of online harrassment through the following peer-reviewed, scientific articles.</p>
      <a href="https://journals.sagepub.com/doi/full/10.1177/0894439319865518" target="_blank">Silencing Women? Gender and Online Harassment by Marjan Nadim and Audun Fladmoe (2021)</a>
      <p></p>
      <a href="https://journals.sagepub.com/doi/full/10.1177/1461444819887141" target="_blank">Sluts and soyboys: MGTOW and the production of misogynistic online harassment by Callum Jones, Verity Trott, and Scott Wright (2019)</a>
      <p></p>
      <a href="https://www.pewresearch.org/internet/wp-content/uploads/sites/9/2021/01/PI_2021.01.13_Online-Harassment_FINAL.pdf" target="_blank">The State of Online Harassment by Emily A. Vogels (2021)</a>
    </div>
  );
};
export default LeftNavbar;