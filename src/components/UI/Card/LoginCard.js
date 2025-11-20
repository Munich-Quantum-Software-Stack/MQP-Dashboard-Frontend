import { useState } from 'react';

const LoginCard = (props) => {
  let window_height = window.innerHeight;
  const [backgroundHeight, setBackgroundHeight] = useState(window_height);

  const customHeightBackground = () => {
    let content_height = 0;
    const content_container = document.getElementsByClassName('LoginForm_container');
    if (content_container.length > 0) {
      content_height = content_container[0].offsetHeight;
      // console.log("content height: " + content_height);
      // console.log("window height: " + window_height);
      setBackgroundHeight(window_height > content_height ? '100vh' : '100%');
    }
  };

  window.addEventListener('load', customHeightBackground);
  window.addEventListener('resize', customHeightBackground);

  return (
    <div className="LoginPage" style={{ height: backgroundHeight }}>
      <div className="LoginPage_bg"></div>
      <div className="LoginForm_container flex-fill">{props.children}</div>
    </div>
  );
};

export default LoginCard;
