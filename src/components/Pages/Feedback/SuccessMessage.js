import Button from 'src/components/UI/Button/Button';
const SuccessMessage = () => {
  const clearPageHandler = () => {
    window.location.reload();
  };

  return (
    <div className="">
      <p>Thank you for your feedbacks! We will consider to improve it better.</p>
      <Button type="button" onClick={clearPageHandler}>
        Ok
      </Button>
    </div>
  );
};
export default SuccessMessage;
