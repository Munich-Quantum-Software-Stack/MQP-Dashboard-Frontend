const CopyrightText = () => {
  const current_year = new Date().getFullYear();
  return (
    <div>
      <div className="my-2 copyright_text ">
        <div className="mb-2 text-center">
<<<<<<< HEAD
          &copy; {current_year} Powered by the Munich Quantum Portal (MQP),{' '}
          <a href="https://github.com/Munich-Quantum-Software-Stack" target="_blank" rel="noopener noreferrer">open-source software</a>{' '}
          developed by the Munich Quantum Software Stack (MQSS) Team
        </div>
=======
          &copy; {current_year} Powered by the Munich Quantum Portal (MQP),&nbsp;{' '}
          <a href="https://github.com/Munich-Quantum-Software-Stack">open-source software</a>{' '}
          developed by the Munich Quantum Software Stack (MQSS) Team
>>>>>>> ce34594 (feat: update user logos)
        </div>
      </div>
    </div>
  );
};

export default CopyrightText;
