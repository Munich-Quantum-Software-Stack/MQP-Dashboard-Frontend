// Importing modules
import React from "react";
import Alert from "react-bootstrap/Alert";


const NotificationCard = (props) => {
  //const [show, setShow] = useState(true);
  
  return (
    <div className="my-3 flashMsg_wrap">      
        <Alert variant={props.variant}>
          {props.children}
        </Alert>
     
    </div>
  );
}

export default NotificationCard;