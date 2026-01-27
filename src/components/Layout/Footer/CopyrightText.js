const CopyrightText = () => {
  const current_year = new Date().getFullYear();
  return (
    <div>
      <div className="my-2 copyright_text ">
        <div className="mb-2 text-center">
          &copy; {current_year} Powered by the Munich Quantum Portal (MQP),
          open-source software developed by the Munich Quantum Software Stack
          (MQSS) Team
        </div>
      </div>
    </div>
  );
};

export default CopyrightText;
