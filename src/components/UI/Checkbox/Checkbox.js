import React from 'react';

const Checkbox = ({isChecked, label, id, name, checkHandler, index, value}) => {
    
    return (
        <div>
            <input 
                type='checkbox' 
                name={name} 
                id={id} 
                onChange={checkHandler} 
                value={value} 
                checked={isChecked} 
            />&nbsp;
            <label htmlFor={id} className=''>{label}</label>
        </div>
    );
}

export default Checkbox;